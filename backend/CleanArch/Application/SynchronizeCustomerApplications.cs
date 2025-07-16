﻿using Microsoft.Extensions.Hosting;
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
    public class SynchronizeCustomerApplications : BackgroundService
    {
        private readonly ILogger<SynchronizeCustomerApplications> _logger;
        private readonly IRabbitMQConnection _rabbitMQConnection;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IModel _channel;
        private readonly string _queueName = "synchr_customer_apps";
        private readonly IConfiguration _configuration;

        public SynchronizeCustomerApplications(
            ILogger<SynchronizeCustomerApplications> logger,
            IRabbitMQConnection rabbitMQConnection,
            IConfiguration configuration,
            IServiceScopeFactory serviceScopeFactory)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _rabbitMQConnection = rabbitMQConnection ?? throw new ArgumentNullException(nameof(rabbitMQConnection));
            _serviceScopeFactory = serviceScopeFactory ?? throw new ArgumentNullException(nameof(serviceScopeFactory));
            _configuration = configuration;

            try
            {
                _channel = _rabbitMQConnection.CreateModel();
                _channel.QueueDeclare(
                    queue: _queueName,
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
                    var message = JsonSerializer.Deserialize<SynchronizeCustomerApplicationsDto>(json);

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

            _logger.LogInformation("Notification Background Service is stopping.");
        }

        private async Task ProcessNotificationAsync(SynchronizeCustomerApplicationsDto data, CancellationToken cancellationToken)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var sendNotification = scope.ServiceProvider.GetRequiredService<ISendNotification>();
                var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

                try
                {
                    var apps = await unitOfWork.ApplicationRepository.GetMyArchiveApplications(data.Pin);

                    foreach (var app in apps)
                    {
                        app.archObjects = await unitOfWork.ArchObjectRepository.GetByAppIdApplication(app.id);

                        // меняем заказчика из кабинета !!!!!
                        app.customer_id = data.CustomerId;

                        if(app.app_cabinet_uuid == null)
                        {
                            var guid = Guid.NewGuid().ToString();
                            app.app_cabinet_uuid = guid;
                            await unitOfWork.ApplicationRepository.SetAppCabinetGuid(app.id, guid);
                            unitOfWork.Commit();
                        }
                    }

                    var hostName = _configuration["RabbitMQ:Host"];
                    var queueName = _configuration["RabbitMQ:SyncAppsToCabinet"];

                    string jsonMessage = JsonSerializer.Serialize(apps);

                    var factory = new ConnectionFactory()
                    {
                        HostName = hostName,
                        Password = _configuration["RabbitMQ:Username"],
                        UserName = _configuration["RabbitMQ:Password"]
                    };
                    using var connection = factory.CreateConnection();
                    using var channel = connection.CreateModel();

                    channel.QueueDeclare(queue: queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);

                    var body = Encoding.UTF8.GetBytes(jsonMessage);
                    var properties = channel.CreateBasicProperties();
                    properties.Persistent = true;

                    channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: properties, body: body);
                    Console.WriteLine($"Sent to synchronize customer apps");

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

        public class SynchronizeCustomerApplicationsDto
        {
            public int CustomerId { get; set; }
            public string Pin { get; set; }
        }
    }
}