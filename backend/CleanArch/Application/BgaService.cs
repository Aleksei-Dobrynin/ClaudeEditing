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
    public interface IBgaService
    {
        Task SendRejectRequestAsync(string uuid, string html, string number, int file_id, string ftpFileName, int[] serviceDocIds);
        Task SendApproveRequestAsync(string uuid, string number);
        Task SendCabinetFilesAsync(CabinetMessage message);
        Task SendSmejPortalFilesAsync(SmejPortalMessage message);
        Task SendUpdateAppTotalSumAsync(string uuid, decimal totalSum);
        Task SendReadyDocRequestAsync(string uuid, string number);
        Task SendNotificationToCabinet(string uuid, string title, string text);
    }
    
    public class BgaService : BackgroundService, IBgaService
    {
        private readonly ILogger<BgaService> _logger;
        private readonly IRabbitMQConnection _rabbitMQConnection;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IModel _channel;
        private readonly string _dataQueueName;
        private readonly string _SendQueueName;
        private readonly string _deleteQueueName;
        private readonly string _approveQueueName;
        private readonly string _rejectQueueName;
        private readonly string _cabinetQueueName;
        private readonly string _updateAppTotalSumQueueName;
        private readonly string _readyDocQueueName;
        private readonly string _notificationToCabinetQueueName;
        private readonly string _smejPortalQueueName;
        private readonly IConnection _connection;
        
        private readonly string _ftpHost;
        private readonly int _ftpPort;
        private readonly string _ftpUsername;
        private readonly string _ftpPassword;
        private readonly string _ftpBasePath;

        public BgaService(
            ILogger<BgaService> logger,
            IServiceScopeFactory serviceScopeFactory,
            IRabbitMQConnection rabbitMQConnection,
            IConfiguration configuration)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _rabbitMQConnection = rabbitMQConnection ?? throw new ArgumentNullException(nameof(rabbitMQConnection));
            _serviceScopeFactory = serviceScopeFactory ?? throw new ArgumentNullException(nameof(serviceScopeFactory));
            _dataQueueName = configuration["RabbitMQ:DataQueueName"] ?? throw new ArgumentNullException("DataQueueName");
            _SendQueueName = configuration["RabbitMQ:ResendToBga"] ?? throw new ArgumentNullException("ResendToBga");
            _deleteQueueName = configuration["RabbitMQ:DeleteQueueName"] ?? throw new ArgumentNullException("DeleteQueueName");
            _approveQueueName = configuration["RabbitMQ:ApproveQueueName"] ?? throw new ArgumentNullException("ApproveQueueName");
            _rejectQueueName = configuration["RabbitMQ:RejectQueueName"] ?? throw new ArgumentNullException("RejectQueueName");
            _cabinetQueueName = configuration["RabbitMQ:CabinetQueueName"] ?? throw new ArgumentNullException("CabinetQueueName");
            _updateAppTotalSumQueueName = configuration["RabbitMQ:UpdateAppTotalSumQueueName"] ?? throw new ArgumentNullException("UpdateAppTotalSumQueueName");
            _readyDocQueueName = configuration["RabbitMQ:ReadyDocQueueName"] ?? throw new ArgumentNullException("ReadyDocQueueName");
            _notificationToCabinetQueueName = configuration["RabbitMQ:NotificationToCabinetQueueName"] ?? throw new ArgumentNullException("NotificationToCabinetQueueName");
            _smejPortalQueueName = configuration["RabbitMQ:SmejPortalQueueName"] ?? throw new ArgumentNullException("SmejPortalQueueName");
            _ftpHost = configuration["FTP:Host"];
            _ftpUsername = configuration["FTP:Username"];
            _ftpPassword = configuration["FTP:Password"];
            _ftpPort = int.TryParse(configuration["FTP:Port"], out int port) ? port : 21;
            
            try
            {
                _channel = _rabbitMQConnection.CreateModel();

                _channel.QueueDeclare(
                    queue: _dataQueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);
                
                _channel.QueueDeclare(
                    queue: _SendQueueName,
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
                
                _channel.QueueDeclare(
                    queue: _approveQueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);
                
                _channel.QueueDeclare(
                    queue: _rejectQueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);
                
                _channel.QueueDeclare(
                    queue: _cabinetQueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);
                
                _channel.QueueDeclare(
                    queue: _updateAppTotalSumQueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);
                
                _channel.QueueDeclare(
                    queue: _readyDocQueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);
                
                _channel.QueueDeclare(
                    queue: _notificationToCabinetQueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);
                
                _channel.QueueDeclare(
                    queue: _smejPortalQueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);

                _logger.LogInformation("RabbitMQ queues initialized successfully for BgaService.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize RabbitMQ connection or queues.");
                throw;
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("BgaService is starting.");

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
                            _dataQueueName);
                        _channel.BasicNack(ea.DeliveryTag, false, false);
                        return;
                    }

                    _logger.LogInformation("Received message from queue {QueueName}: {Message}", _dataQueueName, json);

                    await ProcessMessageAsync(message, stoppingToken);

                    _channel.BasicAck(ea.DeliveryTag, false);
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "Failed to deserialize message from queue {QueueName}", _dataQueueName);
                    _channel.BasicNack(ea.DeliveryTag, false, false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process message from queue {QueueName}", _dataQueueName);
                    _channel.BasicNack(ea.DeliveryTag, false, true);
                }
            };

            _channel.BasicConsume(
                queue: _dataQueueName,
                autoAck: false,
                consumer: consumer);

            await Task.Delay(Timeout.Infinite, stoppingToken);

            _logger.LogInformation("BgaService is stopping.");
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

                    var application = new Domain.Entities.Application
                    {
                        id = 0,
                        number = message.Application.Number,
                        registration_date = message.Application.RegistrationDate,
                        work_description = message.Application.WorkDescription,
                        deadline = message.Application.Deadline,
                        app_cabinet_uuid = message.Application.AppCabinetUuid,
                        service_id = message.Application.RServiceId.Value,
                        archObjects = message.Application.ArchObjects.Select(obj => new ArchObject
                        {
                            address = obj.Address,
                            name = obj.Name,
                            identifier = obj.Identifier,
                            description = obj.Description,
                            //district_id = districtRepository.GetAll().Result.FirstOrDefault(d => d.code == "not defined")?.id
                            district_id = obj.DistrictId,
                            tags = obj.Tags,
                            xcoordinate = obj.XCoord,
                            ycoordinate = obj.YCoord,
                            tunduk_district_id = obj.TundukDistrictId,
                            tunduk_address_unit_id = obj.TundukAddressUnitId,
                            tunduk_street_id = obj.TundukStreetId,
                            tunduk_building_num = obj.TundukBuildingNum,
                            tunduk_flat_num = obj.TundukFlatNum,
                            tunduk_uch_num = obj.TundukUchNum,
                            is_manual = obj.IsManual
                        }).ToList(),
                        customer = new Customer
                        {
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
                            customerRepresentatives = message.Application.Representative.Select(rep => new CustomerRepresentative
                            {
                                last_name = rep.LastName,
                                first_name = rep.FirstName,
                                second_name = rep.SecondName,
                                pin = rep.Pin,
                                contact = rep.Phone,
                            }).ToList()
                        },
                        dogovorTemplate = message.Application.DogovorTemplate
                    };
                    
                    if (message.Application.StatusId.HasValue)
                    {
                        application.status_id = message.Application.StatusId.Value;
                    }

                    if (message.Application.CompanyId.HasValue)
                    {
                        application.customer_id = message.Application.CompanyId.Value;
                    }
                    
                    var appId = await bgaDataUseCase.SaveDataFromClient(application);
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

                    
                    var app = await applicationRepository.GetOneByID(appId);
                    
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

                    var uploadedApplicationDocumentDogovor = new uploaded_application_document 
                    {
                        add_sign = true,
                        application_document_id = appId,
                        name = "Заявление",
                        service_document_id = serviceDocumentDogovorId.Value,
                        document = new File
                        {
                            name = "Заявление.pdf",
                            body = GetFileFromFtp(new AppFileData
                            {
                                Path = message.Application.DogovorFile                                
                            })
                        }
                    }; 
                    await uploadedApplicationDocumentUseCases.Create(uploadedApplicationDocumentDogovor);
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
        
        public async Task SendApproveRequestAsync(string uuid, string number)
        {
            try
            {
                var approveMessage = new { Uuid = uuid, Number = number};
                var json = JsonSerializer.Serialize(approveMessage);
                var body = Encoding.UTF8.GetBytes(json);

                var properties = _channel.CreateBasicProperties();
                properties.Persistent = true;

                _channel.BasicPublish(
                    exchange: "",
                    routingKey: _approveQueueName,
                    basicProperties: properties,
                    body: body);

                _logger.LogInformation("Sent approve request for application: {Uuid}", uuid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send approve request for application: {Uuid}", uuid);
                throw;
            }
        }
        
        public async Task SendReadyDocRequestAsync(string uuid, string number)
        {
            try
            {
                var message = new { Uuid = uuid, Number = number };
                var json = JsonSerializer.Serialize(message);
                var body = Encoding.UTF8.GetBytes(json);

                var properties = _channel.CreateBasicProperties();
                properties.Persistent = true;

                _channel.BasicPublish(
                    exchange: "",
                    routingKey: _readyDocQueueName,
                    basicProperties: properties,
                    body: body);

                _logger.LogInformation("Sent approve request for application: {Uuid}", uuid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send approve request for application: {Uuid}", uuid);
                throw;
            }
        }        
        
        public async Task SendNotificationToCabinet(string uuid, string title, string text)
        {
            try
            {
                var message = new { Uuid = uuid, Title = title, Text = text };
                var json = JsonSerializer.Serialize(message);
                var body = Encoding.UTF8.GetBytes(json);

                var properties = _channel.CreateBasicProperties();
                properties.Persistent = true;

                _channel.BasicPublish(
                    exchange: "",
                    routingKey: _notificationToCabinetQueueName,
                    basicProperties: properties,
                    body: body);

                _logger.LogInformation("Sent approve request for application: {Uuid}", uuid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send approve request for application: {Uuid}", uuid);
                throw;
            }
        }
        
        public async Task SendUpdateAppTotalSumAsync(string uuid, decimal totalSum)
        {
            try
            {
                var totalSumMessage = new { Uuid = uuid, TotalSum = totalSum};
                var json = JsonSerializer.Serialize(totalSumMessage);
                var body = Encoding.UTF8.GetBytes(json);

                var properties = _channel.CreateBasicProperties();
                properties.Persistent = true;

                _channel.BasicPublish(
                    exchange: "",
                    routingKey: _updateAppTotalSumQueueName,
                    basicProperties: properties,
                    body: body);

                _logger.LogInformation("Sent approve request for application: {Uuid}", uuid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send approve request for application: {Uuid}", uuid);
                throw;
            }
        }
        
        public async Task SendRejectRequestAsync(string uuid, string html, string number, int file_id, string ftpFileName, int[] serviceDocIds)
        {
            try
            {
                var rejectMessage = new RejectDocumentModel { Uuid = uuid, Html = html, Number = number, FileId = file_id, FileName = ftpFileName, ServiceDocIds = serviceDocIds };
                var json = JsonSerializer.Serialize(rejectMessage);
                var body = Encoding.UTF8.GetBytes(json);

                var properties = _channel.CreateBasicProperties();
                properties.Persistent = true;

                _channel.BasicPublish(
                    exchange: "",
                    routingKey: _rejectQueueName,
                    basicProperties: properties,
                    body: body);

                _logger.LogInformation("Sent reject request for application: {Uuid}", uuid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send reject request for application: {Uuid}", uuid);
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
            public int FileId { get; set; }
            public int[] ServiceDocIds { get; set; }
        }
        
        public async Task SendCabinetFilesAsync(CabinetMessage message)
        {
            try
            {
                var json = JsonSerializer.Serialize(message);
                var body = Encoding.UTF8.GetBytes(json);

                var properties = _channel.CreateBasicProperties();
                properties.Persistent = true;

                _channel.BasicPublish(
                    exchange: "",
                    routingKey: _cabinetQueueName,
                    basicProperties: properties,
                    body: body);

                _logger.LogInformation("Sent files");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send");
                throw;
            }
        }
        
        public async Task SendSmejPortalFilesAsync(SmejPortalMessage message)
        {
            try
            {
                var json = JsonSerializer.Serialize(message);
                var body = Encoding.UTF8.GetBytes(json);

                var properties = _channel.CreateBasicProperties();
                properties.Persistent = true;

                _channel.BasicPublish(
                    exchange: "",
                    routingKey: _smejPortalQueueName,
                    basicProperties: properties,
                    body: body);

                _logger.LogInformation("Sent files");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send");
                throw;
            }
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

    public class BgaMessage
    {
        public ApplicationData Application { get; set; }
        public List<UploadedApplicationDocumentData> Documents { get; set; }
    }

    public class ApplicationData
    {
        public int Id { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? Deadline { get; set; }
        public string Number { get; set; }
        public string Comment { get; set; }
        public string WorkDescription { get; set; }
        public int? StatusId { get; set; }
        public int? CompanyId { get; set; }
        public int? RServiceId { get; set; }
        public string UniqueCode { get; set; }
        public string AppCabinetUuid { get; set; }
        public string DogovorTemplate { get; set; }
        public string DogovorFile { get; set; }
        public CustomerData Customer { get; set; }
        public List<ArchObjectData> ArchObjects { get; set; }
        public List<RepresentativeData> Representative { get; set; }
        public List<CustomerRequisiteData> Requisites { get; set; }
        public List<CustomerContactData> CustomerContacts { get; set; }
    }
    
    public class RepresentativeData
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string SecondName { get; set; }
        public string Pin { get; set; }
        public int CompanyId { get; set; }
        public bool? HasAccess { get; set; }
        public int TypeId { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public bool HasAccount { get; set; }
    }
        
    public class CustomerRequisiteData
    {
        public int Id { get; set; }
        public string PaymentAccount { get; set; }
        public string Bank { get; set; }
        public string Bik { get; set; }
        public int OrganizationId { get; set; }
    }
        
    public class CustomerContactData
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public bool? AllowNotification { get; set; }
        public int? RTypeId { get; set; }
        public int OrganizationId { get; set; }
    }
        
    public class CustomerData
    {
        public string Pin { get; set; }
        public string Okpo { get; set; }
        public string PostalCode { get; set; }
        public string Ugns { get; set; }
        public string RegNumber { get; set; }
        public int? OrganizationTypeId { get; set; }
        public bool? IsPhysical { get; set; }
        public string FirstName { get; set; }
        public string SecondName { get; set; }
        public string LastName { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Director { get; set; }
        public string Nomer { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public string Email { get; set; }
        public string Email_2{ get; set; }
        public string IdentityDocumentTypeCode { get; set; }
        public string PassportSeries { get; set; }
        public DateTime? PassportIssuedDate { get; set; }
        public string PassportWhomIssued { get; set; }
    }
        
    public class ArchObjectData
    {
        public int? DistrictId { get; set; }
        public string Address { get; set; }
        public string Name { get; set; }
        public string Identifier { get; set; }
        public string Description { get; set; }
        public int ApplicationId { get; set; }
        public int[] Tags { get; set; }
        public double? XCoord { get; set; }
        public double? YCoord { get; set; }
        public int? TundukDistrictId { get; set; }
        public int? TundukAddressUnitId { get; set; }
        public int? TundukStreetId { get; set; }
        public string? TundukBuildingNum { get; set; }
        public string? TundukFlatNum { get; set; }
        public string? TundukUchNum { get; set; }
        public bool? IsManual { get; set; }
    }
        
    public class UploadedApplicationDocumentData
    {
        public int Id { get; set; }
        public int? ApplicationId { get; set; }
        public int? StatusId { get; set; }
        public string HashCode { get; set; }
        public int? ServiceDocumentId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public AppFileData? File { get; set; }
    }
        
    public class AppFileData
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public string Hash { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
    
    public class CabinetMessage
    {
        public string ApplicationUUID { get; set; }
        public List<UploadedDocumentData> Files { get; set; }
    }
    
    public class UploadedDocumentData
    {
        public string DocName { get; set; }
        public int? ServiceDocumentId { get; set; }
        public int AppDocId { get; set; }
        public string TypeName { get; set; }
        public int? UploadId { get; set; }
        public string UploadName { get; set; }
        public bool? IsOutcome { get; set; }
        public string? DocumentNumber { get; set; }
        public FileData File { get; set; }
    }
        
    public class FileData
    {
        public string Name { get; set; }
        public string Path { get; set; }
    }
    
    public class SmejPortalMessage
    {
        public string ApplicationNumber { get; set; }
        public List<UploadedDocumentData> Files { get; set; }
    }
}