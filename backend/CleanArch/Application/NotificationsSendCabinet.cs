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
    public class NotificationsSendCabinet : BackgroundService
    {
        private readonly ILogger<NotificationsSendCabinet> _logger;
        private readonly IRabbitMQConnection _rabbitMQConnection;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IModel _channel;
        private readonly string _queueName;

        public NotificationsSendCabinet(
            ILogger<NotificationsSendCabinet> logger,
            IRabbitMQConnection rabbitMQConnection,
            IServiceScopeFactory serviceScopeFactory,
            IConfiguration configuration)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _rabbitMQConnection = rabbitMQConnection ?? throw new ArgumentNullException(nameof(rabbitMQConnection));
            _serviceScopeFactory = serviceScopeFactory ?? throw new ArgumentNullException(nameof(serviceScopeFactory));

            // Получаем имя очереди из конфигурации
            _queueName = configuration["RabbitMQ:SendNoitifications"];

            try
            {
                _channel = _rabbitMQConnection.CreateModel();
                _channel.QueueDeclare(
                    queue: _queueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);

                _logger.LogInformation("RabbitMQ queue '{QueueName}' initialized successfully for consumer.", _queueName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize RabbitMQ channel or queue '{QueueName}'.", _queueName);
                throw;
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("NotificationsSendCabinet Background Service is starting with queue: {QueueName}.", _queueName);

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.Received += async (model, ea) =>
            {
                try
                {
                    var body = ea.Body.ToArray();
                    var json = Encoding.UTF8.GetString(body);
                    var message = JsonSerializer.Deserialize<List<SendMessageN8n>>(json);

                    if (message == null)
                    {
                        _logger.LogWarning("Received an invalid or empty message from queue: {QueueName}", _queueName);
                        _channel.BasicNack(ea.DeliveryTag, false, false);
                        return;
                    }

                    _logger.LogInformation("Received message from queue {QueueName}: {Message}", _queueName, json);

                    await ProcessNotificationAsync(message, stoppingToken);

                    _channel.BasicAck(ea.DeliveryTag, false);
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "Failed to deserialize message from queue {QueueName}", _queueName);
                    _channel.BasicNack(ea.DeliveryTag, false, false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process message from queue {QueueName}", _queueName);
                    _channel.BasicNack(ea.DeliveryTag, false, true);
                }
            };

            _channel.BasicConsume(
                queue: _queueName,
                autoAck: false,
                consumer: consumer);

            await Task.Delay(Timeout.Infinite, stoppingToken);

            _logger.LogInformation("NotificationsSendCabinet Background Service is stopping.");
        }

        private async Task ProcessNotificationAsync(List<SendMessageN8n> message, CancellationToken cancellationToken)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var sendNotification = scope.ServiceProvider.GetRequiredService<ISendNotification>();
                var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

                try
                {
                    var data = message.Select(x => new SendNotificationService.SendMessageN8n
                    {
                        type_con = x.type_con,
                        message = x.message,
                        subject = x.subject,
                        value = x.value,
                        employee_id = x.employee_id,
                        user_id = x.user_id,
                        application_id = x.application_id,
                        application_uuid = x.application_uuid,
                        customer_id = x.customer_id,

                    }).ToList();
                    await sendNotification.JustSendNn8nNotifications(data);

                    _logger.LogInformation("Processed {Count} notification(s) successfully.", data.Count);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing notification batch with {Count} message(s).", message?.Count ?? 0);
                    throw;
                }
            }
        }

        public override void Dispose()
        {
            try
            {
                _channel?.Close();
                _logger.LogInformation("RabbitMQ channel closed for queue: {QueueName}.", _queueName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while closing RabbitMQ channel for queue: {QueueName}.", _queueName);
            }
            base.Dispose();
        }

        public class SendMessageN8n
        {
            public string type_con { get; set; }
            public string message { get; set; }
            public string subject { get; set; }
            public string value { get; set; }
            public int employee_id { get; set; }
            public int? user_id { get; set; }
            public int? application_id { get; set; }
            public string? application_uuid { get; set; }
            public int? customer_id { get; set; }
        }
    }
}