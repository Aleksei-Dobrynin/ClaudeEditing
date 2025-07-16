using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.Exceptions;
using System.Net.Sockets;
using Polly;

namespace Messaging.Shared.RabbitMQ
{
    /// <summary>
    /// Интерфейс подключения к RabbitMQ
    /// </summary>
    public interface IRabbitMQConnection : IDisposable
    {
        /// <summary>
        /// Проверяет, открыто ли соединение
        /// </summary>
        bool IsConnected { get; }

        /// <summary>
        /// Создает модель (канал) для работы с RabbitMQ
        /// </summary>
        /// <returns>Канал RabbitMQ</returns>
        IModel CreateModel();

        /// <summary>
        /// Подключается к RabbitMQ
        /// </summary>
        /// <returns>true если подключение успешно, иначе false</returns>
        bool TryConnect();
    }

    /// <summary>
    /// Опции для подключения к RabbitMQ
    /// </summary>
    public class RabbitMQOptions
    {
        /// <summary>
        /// Хост RabbitMQ
        /// </summary>
        public string Host { get; set; } = "localhost";

        /// <summary>
        /// Порт RabbitMQ
        /// </summary>
        public int Port { get; set; } = 5672;

        /// <summary>
        /// Имя пользователя для RabbitMQ
        /// </summary>
        public string Username { get; set; } = "guest";

        /// <summary>
        /// Пароль для RabbitMQ
        /// </summary>
        public string Password { get; set; } = "guest";

        /// <summary>
        /// Виртуальный хост RabbitMQ
        /// </summary>
        public string VirtualHost { get; set; } = "/";

        /// <summary>
        /// Количество попыток переподключения при сбое
        /// </summary>
        public int RetryCount { get; set; } = 5;
    }

    /// <summary>
    /// Реализация подключения к RabbitMQ
    /// </summary>
    public class RabbitMQConnection : IRabbitMQConnection
    {
        private readonly IConnectionFactory _connectionFactory;
        private readonly ILogger<RabbitMQConnection> _logger;
        private readonly int _retryCount;
        private IConnection _connection;
        private bool _disposed;
        private readonly object _syncRoot = new();

        /// <summary>
        /// Конструктор для RabbitMQConnection
        /// </summary>
        public RabbitMQConnection(IOptions<RabbitMQOptions> options, ILogger<RabbitMQConnection> logger)
        {
            var rabbitOptions = options.Value;
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _retryCount = rabbitOptions.RetryCount;

            _connectionFactory = new ConnectionFactory()
            {
                HostName = rabbitOptions.Host,
                Port = rabbitOptions.Port,
                UserName = rabbitOptions.Username,
                Password = rabbitOptions.Password,
                VirtualHost = rabbitOptions.VirtualHost,
                DispatchConsumersAsync = true
            };

            TryConnect();
        }

        /// <summary>
        /// Проверяет, открыто ли соединение
        /// </summary>
        public bool IsConnected => _connection != null && _connection.IsOpen && !_disposed;

        /// <summary>
        /// Создает модель (канал) для работы с RabbitMQ
        /// </summary>
        public IModel CreateModel()
        {
            if (!IsConnected)
            {
                throw new InvalidOperationException("No RabbitMQ connections are available to perform this action");
            }

            return _connection.CreateModel();
        }

        /// <summary>
        /// Подключается к RabbitMQ с повторными попытками
        /// </summary>
        public bool TryConnect()
        {
            _logger.LogInformation("RabbitMQ Client is trying to connect");

            lock (_syncRoot)
            {
                var policy = Polly.Retry.RetryPolicy
                    .Handle<SocketException>()
                    .Or<BrokerUnreachableException>()
                    .WaitAndRetry(_retryCount, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                        (ex, time) =>
                        {
                            _logger.LogWarning(ex, "RabbitMQ Client could not connect after {TimeOut}s ({ExceptionMessage})",
                                $"{time.TotalSeconds:n1}", ex.Message);
                        }
                    );

                policy.Execute(() =>
                {
                    _connection = _connectionFactory.CreateConnection();
                });

                if (IsConnected)
                {
                    _connection.ConnectionShutdown += OnConnectionShutdown;
                    _connection.CallbackException += OnCallbackException;
                    _connection.ConnectionBlocked += OnConnectionBlocked;

                    _logger.LogInformation("RabbitMQ Client acquired a persistent connection to '{HostName}'",
                        _connection.Endpoint.HostName);

                    return true;
                }
                else
                {
                    _logger.LogCritical("FATAL ERROR: RabbitMQ connections could not be created and opened");
                    return false;
                }
            }
        }

        /// <summary>
        /// Обработчик события закрытия соединения
        /// </summary>
        private void OnConnectionShutdown(object sender, ShutdownEventArgs reason)
        {
            if (_disposed) return;

            _logger.LogWarning("A RabbitMQ connection is shutdown. Trying to re-connect...");

            TryConnect();
        }

        /// <summary>
        /// Обработчик события исключения в обратном вызове
        /// </summary>
        private void OnCallbackException(object sender, CallbackExceptionEventArgs e)
        {
            if (_disposed) return;

            _logger.LogWarning("A RabbitMQ connection threw exception. Trying to re-connect...");

            TryConnect();
        }

        /// <summary>
        /// Обработчик события блокировки соединения
        /// </summary>
        private void OnConnectionBlocked(object sender, ConnectionBlockedEventArgs e)
        {
            if (_disposed) return;

            _logger.LogWarning("A RabbitMQ connection is blocked. Trying to re-connect...");

            TryConnect();
        }

        /// <summary>
        /// Освобождает ресурсы
        /// </summary>
        public void Dispose()
        {
            if (_disposed) return;

            _disposed = true;

            try
            {
                _connection.Dispose();
            }
            catch (IOException ex)
            {
                _logger.LogCritical(ex.ToString());
            }
        }
    }
}