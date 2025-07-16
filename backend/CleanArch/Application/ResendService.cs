using System.Net;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using Application.Repositories;
using Application.UseCases;
using Domain.Entities;
using Messaging.Shared.RabbitMQ;
using Microsoft.Extensions.Configuration;
using File = Domain.Entities.File;

namespace Messaging.Services
{
    
    public class ResendService : BackgroundService
    {
        private readonly ILogger<ResendService> _logger;
        private readonly IRabbitMQConnection _rabbitMQConnection;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IModel _channel;
        private readonly string _ReSendQueueName;
        private readonly string _deleteQueueName;
        private readonly IConnection _connection;
        
        private readonly string _ftpHost;
        private readonly int _ftpPort;
        private readonly string _ftpUsername;
        private readonly string _ftpPassword;
        private readonly string _ftpBasePath;

        public ResendService(
            ILogger<ResendService> logger,
            IServiceScopeFactory serviceScopeFactory,
            IRabbitMQConnection rabbitMQConnection,
            IConfiguration configuration)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _rabbitMQConnection = rabbitMQConnection ?? throw new ArgumentNullException(nameof(rabbitMQConnection));
            _serviceScopeFactory = serviceScopeFactory ?? throw new ArgumentNullException(nameof(serviceScopeFactory));
            _ReSendQueueName = configuration["RabbitMQ:ResendToBga"] ?? throw new ArgumentNullException("ResendToBga");
            _deleteQueueName = configuration["RabbitMQ:DeleteQueueName"] ?? throw new ArgumentNullException("DeleteQueueName");
            _ftpHost = configuration["FTP:Host"];
            _ftpUsername = configuration["FTP:Username"];
            _ftpPassword = configuration["FTP:Password"];
            _ftpPort = int.TryParse(configuration["FTP:Port"], out int port) ? port : 21;
            
            try
            {
                _channel = _rabbitMQConnection.CreateModel();

                _channel.QueueDeclare(
                    queue: _ReSendQueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);

                _channel.QueueDeclare(
                    queue: _deleteQueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);


                _logger.LogInformation("RabbitMQ queues initialized successfully for ResendService.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize RabbitMQ connection or queues.");
                throw;
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("ResendService is starting.");

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.Received += async (model, ea) =>
            {
                try
                {
                    var body = ea.Body.ToArray();
                    var json = Encoding.UTF8.GetString(body);
                    var message = JsonSerializer.Deserialize<BgaMessage>(json);

                    if (message == null || message.Application == null)
                    {
                        _logger.LogWarning("Received an invalid or empty message from queue: {QueueName}",
                            _ReSendQueueName);
                        _channel.BasicNack(ea.DeliveryTag, false, false);
                        return;
                    }

                    _logger.LogInformation("Received message from queue {QueueName}: {Message}", _ReSendQueueName, json);

                    await ProcessMessageAsync(message, stoppingToken);

                    _channel.BasicAck(ea.DeliveryTag, false);
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "Failed to deserialize message from queue {QueueName}", _ReSendQueueName);
                    _channel.BasicNack(ea.DeliveryTag, false, false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process message from queue {QueueName}", _ReSendQueueName);
                    _channel.BasicNack(ea.DeliveryTag, false, true);
                }
            };

            _channel.BasicConsume(
                queue: _ReSendQueueName,
                autoAck: false,
                consumer: consumer);

            await Task.Delay(Timeout.Infinite, stoppingToken);

            _logger.LogInformation("ResendService is stopping.");
        }

        private async Task ProcessMessageAsync(BgaMessage message, CancellationToken cancellationToken)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var bgaDataUseCase = scope.ServiceProvider.GetRequiredService<IApplicationUseCases>();
                var uploadedApplicationDocumentUseCases = scope.ServiceProvider.GetRequiredService<Iuploaded_application_documentUseCases>();
                var districtRepository = scope.ServiceProvider.GetRequiredService<IDistrictRepository>();
                var customerContactRepository = scope.ServiceProvider.GetRequiredService<Icustomer_contactRepository>();
                var serviceDocumentRepository = scope.ServiceProvider.GetRequiredService<IServiceDocumentRepository>();
                var applicationDocumentRepository = scope.ServiceProvider.GetRequiredService<IApplicationDocumentRepository>();
                var applicationRepository = scope.ServiceProvider.GetRequiredService<IApplicationRepository>();
                var contactTypeRepository = scope.ServiceProvider.GetRequiredService<Icontact_typeRepository>();
                var identityDocumentTypeRepository = scope.ServiceProvider.GetRequiredService<Iidentity_document_typeRepository>();

                var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

                var requisite = message.Application.Requisites.FirstOrDefault();

                var appGuid = await applicationRepository.GetOneByGuid(message.Application.AppCabinetUuid);
                
                try
                {
                    var smsContactType = await contactTypeRepository.GetOneByCode("sms");
                    var emailContactType = await contactTypeRepository.GetOneByCode("email");
                    var passportTypes = await identityDocumentTypeRepository.GetAll();


                    var smsContacts = message.Application.CustomerContacts.Where(x => x.RTypeId == smsContactType.id).ToList();
                    var sms1 = smsContacts.Count > 0 ? smsContacts[0].Value : "";
                    var sms2 = smsContacts.Count > 1 ? smsContacts[1].Value : "";

                    var emailContacts = message.Application.CustomerContacts.Where(x => x.RTypeId == emailContactType.id).ToList();
                    var email1 = emailContacts.Count > 0 ? emailContacts[0].Value : "";
                    var app = await applicationRepository.GetOneByID(appGuid.id);

                    var application = new Domain.Entities.Application
                    {
                        //old data
                        id = app.id,
                        registration_date = app.registration_date,
                        status_id = app.status_id,
                        deadline = app.deadline,
                        service_id = app.service_id,
                        created_at = app.created_at,
                        created_by = app.created_by,
                        updated_at = app.updated_at,
                        updated_by = app.updated_by,
                        customer_id = app.customer_id,
                        workflow_id = app.workflow_id,
                        arch_object_id = app.arch_object_id,
                        number = app.number,
                        is_paid = app.is_paid,
                        customer_pin = app.customer_pin,
                        customer_is_organization = app.customer_is_organization,
                        maria_db_statement_id = app.maria_db_statement_id,
                        assigned_employees_names = app.assigned_employees_names,
                        assignee_employees = app.assignee_employees,
                        cabinet_html = app.cabinet_html,
                        is_electronic_only = app.is_electronic_only,


                        //new data
                        work_description = message.Application.WorkDescription,
                        app_cabinet_uuid = message.Application.AppCabinetUuid,
                        archObjects = message.Application.ArchObjects.Select((obj, i) => new ArchObject
                        {
                            id = (i + 1) * -1,
                            address = obj.Address,
                            name = obj.Name,
                            identifier = obj.Identifier,
                            tags = obj.Tags,
                            description = obj.Description,
                            //district_id = districtRepository.GetAll().Result.FirstOrDefault(d => d.code == "not defined")?.id
                            district_id = obj.DistrictId
                        }).ToList(),
                        customer = new Customer
                        {
                            id = app.customer_id,
                            pin = message.Application.Customer.Pin,
                            full_name = message.Application.Customer.Name,
                            address = message.Application.Customer.Address,
                            director = message.Application.Customer.Director,
                            identity_document_type_id = passportTypes.FirstOrDefault(t => t.code == message.Application.Customer.IdentityDocumentTypeCode)?.id ?? 
                                                        passportTypes.FirstOrDefault(t => t.code == "passport")?.id,
                            document_serie = message.Application.Customer.PassportSeries,
                            document_date_issue = message.Application.Customer.PassportIssuedDate,
                            document_whom_issued = message.Application.Customer.PassportWhomIssued,
                            okpo = message.Application.Customer.Okpo,
                            organization_type_id = message.Application.Customer.OrganizationTypeId,
                            is_organization = !message.Application.Customer.IsPhysical ?? true,
                            individual_name = message.Application.Customer.FirstName,
                            individual_secondname = message.Application.Customer.SecondName,
                            individual_surname = message.Application.Customer.LastName,
                            postal_code = message.Application.Customer.PostalCode,
                            ugns = message.Application.Customer.Ugns,
                            bank = requisite?.Bank ?? string.Empty,
                            bik = requisite?.Bik ?? string.Empty,
                            payment_account = requisite?.PaymentAccount ?? string.Empty,
                            registration_number = message.Application.Customer.RegNumber,
                            sms_1 = sms1,
                            sms_2 = sms2,
                            email_1 = email1,
                            customerRepresentatives = message.Application.Representative.Select((rep, i) => new CustomerRepresentative
                            {
                                id = (i + 1) * -1,
                                last_name = rep.LastName,
                                first_name = rep.FirstName,
                                second_name = rep.SecondName,
                                pin = rep.Pin,
                                contact = rep.Phone,
                            }).ToList()
                        },
                        //dogovorTemplate = message.Application.DogovorTemplate
                    };
                    
                    
                    var appId = await bgaDataUseCase.SaveResendDataFromClient(application);
                    foreach (var document in message.Documents)
                    {
                        var uploadedApplicationDocument = new uploaded_application_document
                        {
                            application_document_id = appId,
                            service_document_id = document.ServiceDocumentId,
                            document = new File
                            {
                                name = document.File.Name,
                                body = GetFileFromFtp(document.File)
                            }
                        };
                        await uploadedApplicationDocumentUseCases.Create(uploadedApplicationDocument);
                    }

                    
                    app = await applicationRepository.GetOneByID(appId);
                    
                    var serviceDocuments = await serviceDocumentRepository.GetByidService(app.service_id);

                    var appDocument = await applicationDocumentRepository.GetOneByNameAndType("Заявление", "cabinet");

                    var serviceDocumentDogovorId = serviceDocuments.FirstOrDefault(d => d.application_document_id == appDocument.id)?.id;
                    if (serviceDocumentDogovorId == null)
                    {
                        serviceDocumentDogovorId = await serviceDocumentRepository.Add(new ServiceDocument
                        {
                            service_id = app.service_id,
                            application_document_id = appDocument.id
                        });
                    }

                    //var uploadedApplicationDocumentDogovor = new uploaded_application_document 
                    //{
                    //    add_sign = true,
                    //    application_document_id = appId,
                    //    name = "Заявление",
                    //    service_document_id = serviceDocumentDogovorId.Value,
                    //    document = new File
                    //    {
                    //        name = "Заявление.pdf",
                    //        body = GetFileFromFtp(new AppFileData
                    //        {
                    //            Path = message.Application.DogovorFile                                
                    //        })
                    //    }
                    //}; 
                    //await uploadedApplicationDocumentUseCases.Create(uploadedApplicationDocumentDogovor);
                    unitOfWork.Commit();

                    //foreach (var document in message.Documents)
                    //{
                    //    if (document.File != null)
                    //    {
                    //        await SendDeleteFileRequestAsync(message.Application.Id, document.File.Path);
                    //    }
                    //}

                    _logger.LogInformation("Processed data for application: {ApplicationId}", message.Application.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing data for application: {ApplicationId}",
                        message.Application.Id);
                    //throw;
                }
            }
        }
        
        public byte[] GetFileFromFtp(AppFileData file)
        {
            if (string.IsNullOrEmpty(file.Path))
            {
                throw new ArgumentException("File path is not specified.", nameof(file));
            }

            try
            {
                var ftpRequest = (FtpWebRequest)WebRequest.Create($"ftp://{_ftpHost}:{_ftpPort}/{file.Path}");
                ftpRequest.Method = WebRequestMethods.Ftp.DownloadFile;
                ftpRequest.Credentials = new NetworkCredential(_ftpUsername, _ftpPassword);

                using (var response = (FtpWebResponse)ftpRequest.GetResponse())
                using (var stream = response.GetResponseStream())
                using (var memoryStream = new MemoryStream())
                {
                    if (stream == null)
                    {
                        throw new InvalidOperationException("Failed to get response stream from FTP.");
                    }

                    stream.CopyTo(memoryStream);
                    byte[] fileContent = memoryStream.ToArray();
                    
                    Console.WriteLine($"File downloaded from FTP: {file.Path}");

                    return fileContent;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to download file from FTP: {file.Path}");
                throw;
            }
        }

        private async Task SendDeleteFileRequestAsync(int applicationId, string filePath)
        {
            try
            {
                var deleteMessage = new { ApplicationId = applicationId, FilePath = filePath };
                var json = JsonSerializer.Serialize(deleteMessage);
                var body = Encoding.UTF8.GetBytes(json);

                var properties = _channel.CreateBasicProperties();
                properties.Persistent = true;

                _channel.BasicPublish(
                    exchange: "",
                    routingKey: _deleteQueueName,
                    basicProperties: properties,
                    body: body);

                _logger.LogInformation("Sent delete request for application: {ApplicationId}, file: {FilePath}", applicationId, filePath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send delete request for application: {ApplicationId}", applicationId);
                throw;
            }
        }
        
        public class RejectDocumentModel
        {
            public string Uuid { get; set; }
            public string Html { get; set; }
            public string FileName { get; set; }
            public string Number { get; set; }
            public string FtpFileName { get; set; }
            public int[] ServiceDocIds { get; set; }
        }
        

        public override void Dispose()
        {
            try
            {
                _channel?.Close();
                _connection?.Close();
                _logger.LogInformation("RabbitMQ channel and connection closed.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while closing RabbitMQ channel or connection.");
            }

            base.Dispose();
        }
    }

}