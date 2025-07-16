using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using System;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Services;
using Messaging.Shared.RabbitMQ;
using Microsoft.Extensions.Configuration;

public interface IRabbitMQPublisher
{
    Task PublishMessageAsync(SendNotificationService.SendMessageN8n message);
}

public class RabbitMQPublisher : IRabbitMQPublisher, IDisposable
{
    private readonly ILogger<RabbitMQPublisher> _logger;
    private readonly IRabbitMQConnection _rabbitMQConnection;
    private readonly IModel _channel;
    private readonly string _queueName; // Имя очереди
    private bool _disposed = false;

    public RabbitMQPublisher(
        ILogger<RabbitMQPublisher> logger,
        IRabbitMQConnection rabbitMQConnection, IConfiguration configuration) // Используем IRabbitMQConnection вместо IConnectionFactory
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _rabbitMQConnection = rabbitMQConnection ?? throw new ArgumentNullException(nameof(rabbitMQConnection));
        _queueName = configuration["RabbitMQ:NotificationQueue"] ?? throw new ArgumentNullException("NotificationQueue");

        try
        {
            // Создаем канал через IRabbitMQConnection
            _channel = _rabbitMQConnection.CreateModel();

            // Объявляем очередь
            _channel.QueueDeclare(
                queue: _queueName,
                durable: true, // Очередь сохраняется после перезапуска RabbitMQ
                exclusive: false,
                autoDelete: false,
                arguments: null);

            _logger.LogInformation("RabbitMQ queue initialized successfully for publisher.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize RabbitMQ channel or queue.");
            throw;
        }
    }

    public async Task PublishMessageAsync(SendNotificationService.SendMessageN8n message)
    {
        if (message == null || string.IsNullOrEmpty(message.message))
        {
            _logger.LogWarning("Attempted to publish an empty or null message.");
            throw new ArgumentNullException(nameof(message), "Message or its content cannot be null or empty.");
        }

        if (!_rabbitMQConnection.IsConnected)
        {
            _logger.LogWarning("RabbitMQ connection is not available. Attempting to reconnect...");
            _rabbitMQConnection.TryConnect();
        }

        try
        {
            // Сериализуем объект сообщения в JSON
            var json = JsonSerializer.Serialize(message);
            var body = Encoding.UTF8.GetBytes(json);

            // Настраиваем свойства сообщения
            var properties = _channel.CreateBasicProperties();
            properties.Persistent = true; // Сообщение сохраняется на диске

            // Публикуем сообщение
            _channel.BasicPublish(
                exchange: "", // Используем exchange по умолчанию
                routingKey: _queueName,
                basicProperties: properties,
                body: body);

            _logger.LogInformation("Message published to RabbitMQ queue {QueueName}: {Message}", _queueName, json);

            await Task.CompletedTask; // Возвращаем завершенный Task для асинхронности
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to publish message to RabbitMQ queue {QueueName}", _queueName);
            throw;
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;

        if (disposing)
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

            // Подключение управляется IRabbitMQConnection, поэтому здесь его не закрываем
        }

        _disposed = true;
    }
}