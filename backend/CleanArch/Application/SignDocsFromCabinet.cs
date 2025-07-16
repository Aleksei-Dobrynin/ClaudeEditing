using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Application.Repositories;
using Application.UseCases;
using Domain.Entities;
using Messaging.Shared.RabbitMQ;
using Application.Services;
using Microsoft.Extensions.Configuration;

namespace Messaging.Services
{
    public class SignDocsFromCabinet : BackgroundService
    {
        private readonly ILogger<SignDocsFromCabinet> _logger;
        private readonly IRabbitMQConnection _rabbitMQConnection;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IModel _channel;
        private readonly string _signDocsFromCabinet;

        public SignDocsFromCabinet(
            ILogger<SignDocsFromCabinet> logger,
            IRabbitMQConnection rabbitMQConnection,
            IServiceScopeFactory serviceScopeFactory,
            IConfiguration configuration)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _rabbitMQConnection = rabbitMQConnection ?? throw new ArgumentNullException(nameof(rabbitMQConnection));
            _serviceScopeFactory = serviceScopeFactory ?? throw new ArgumentNullException(nameof(serviceScopeFactory));
            _signDocsFromCabinet = configuration["RabbitMQ:SignDocsFromCabinet"] ?? throw new ArgumentNullException("SignDocsFromCabinet");

            try
            {
                _channel = _rabbitMQConnection.CreateModel();
                _channel.QueueDeclare(
                    queue: _signDocsFromCabinet,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);

                _logger.LogInformation("RabbitMQ queue initialized successfully for consumer.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize RabbitMQ channel or queue.");
                throw;
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Notification Background Service is starting.");

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.Received += async (model, ea) =>
            {
                try
                {
                    var body = ea.Body.ToArray();
                    var json = Encoding.UTF8.GetString(body);
                    var message = JsonSerializer.Deserialize<SendSignsToBga>(json);

                    if (message == null)
                    {
                        _logger.LogWarning("Received an invalid or empty message from queue: {QueueName}", _signDocsFromCabinet);
                        _channel.BasicNack(ea.DeliveryTag, false, false);
                        return;
                    }

                    _logger.LogInformation("Received message from queue {QueueName}: {Message}", _signDocsFromCabinet, json);

                    await ProcessAsync(message, stoppingToken);

                    _channel.BasicAck(ea.DeliveryTag, false);
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "Failed to deserialize message from queue {QueueName}", _signDocsFromCabinet);
                    _channel.BasicNack(ea.DeliveryTag, false, false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process message from queue {QueueName}", _signDocsFromCabinet);
                    _channel.BasicNack(ea.DeliveryTag, false, true);
                }
            };

            _channel.BasicConsume(
                queue: _signDocsFromCabinet,
                autoAck: false,
                consumer: consumer);

            await Task.Delay(Timeout.Infinite, stoppingToken);

            _logger.LogInformation("Notification Background Service is stopping.");
        }

        private async Task ProcessAsync(SendSignsToBga message, CancellationToken cancellationToken)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

                try
                {
                    var application = await unitOfWork.ApplicationRepository.GetOneByGuid(message.ApplicationUuid);
                    var upls = await unitOfWork.uploaded_application_documentRepository.GetByapplication_document_id(application.id);


                    foreach (var cabinetDoc in message.BgaUploadIds)
                    {
                        var upl = upls.FirstOrDefault(x => x.id == cabinetDoc.BgaUploadId);
                        if(upl.file_id != null)
                        {
                            await unitOfWork.FileRepository.AddSign(new FileSign
                            {
                                employee_fullname = message.UserFullName,
                                pin_user = message.UserPin,
                                file_id = upl.file_id ?? 0,
                                user_full_name = message.UserFullName,
                                timestamp = DateTime.UtcNow.AddHours(6), //TODO
                                cabinet_file_id = cabinetDoc.CabinetFileId,
                            });
                        }
                        //var fileSigns = await unitOfWork.FileRepository.GetSignByFileIds(new int[] { upl.file_id ?? 0 });

                    }
                    unitOfWork.Commit();

                    _logger.LogInformation("Processed notification: {Message}");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing notification: {Message}");
                    throw;
                }
            }
        }

        public override void Dispose()
        {
            try
            {
                _channel?.Close();
                _logger.LogInformation("RabbitMQ channel closed.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while closing RabbitMQ channel.");
            }
            base.Dispose();
        }

        public class SendSignsToBga
        {
            public string UserFullName { get; set; }
            public string UserPin { get; set; }
            public string ApplicationUuid { get; set; }
            public List<SendFileSignBga> BgaUploadIds { get; set; }
        }
        public class SendFileSignBga
        {
            public int? BgaUploadId { get; set; }
            public int? CabinetFileId { get; set; }
        }
    }
}