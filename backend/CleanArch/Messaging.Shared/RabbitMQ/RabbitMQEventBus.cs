using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using FluentResults;
using Messaging.Shared.Events;
using Messaging.Shared.RabbitMQ;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Polly;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.Exceptions;

namespace Messaging.Shared.RabbitMQ
{
    /// <summary>
    /// Реализация шины событий на основе RabbitMQ
    /// </summary>
    public class RabbitMQEventBus : IEventBus, IDisposable
    {
        private const string EXCHANGE_NAME = "bga_event_bus";
        private const string AUTOFAC_SCOPE_NAME = "bga_event_bus";

        private readonly IRabbitMQConnection _persistentConnection;
        private readonly ILogger<RabbitMQEventBus> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly int _retryCount;

        private IModel _consumerChannel;
        private string _queueName;
        private readonly Dictionary<string, List<Type>> _eventHandlerTypes;
        private readonly List<Type> _eventTypes;

        /// <summary>
        /// Конструктор для RabbitMQEventBus
        /// </summary>
        public RabbitMQEventBus(
            IRabbitMQConnection persistentConnection,
            ILogger<RabbitMQEventBus> logger,
            IServiceProvider serviceProvider,
            string queueName,
            int retryCount = 5)
        {
            _persistentConnection = persistentConnection ?? throw new ArgumentNullException(nameof(persistentConnection));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
            _queueName = queueName;
            _retryCount = retryCount;
            _eventHandlerTypes = new Dictionary<string, List<Type>>();
            _eventTypes = new List<Type>();

            _consumerChannel = CreateConsumerChannel();
        }

        /// <summary>
        /// Публикует событие в шину
        /// </summary>
        public async Task<Result> PublishAsync<TEvent>(TEvent @event) where TEvent : IntegrationEvent
        {
            if (!_persistentConnection.IsConnected)
            {
                _persistentConnection.TryConnect();
            }

            var policy = Policy.Handle<BrokerUnreachableException>()
                .Or<SocketException>()
                .WaitAndRetryAsync(_retryCount, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                    (ex, time) =>
                    {
                        _logger.LogWarning(ex, "Could not publish event: {EventId} after {Timeout}s ({ExceptionMessage})",
                            @event.Id, $"{time.TotalSeconds:n1}", ex.Message);
                    });

            var eventName = @event.GetType().Name;
            @event.EventBusName = eventName;

            _logger.LogTrace("Creating RabbitMQ channel to publish event: {EventId} ({EventName})", @event.Id, eventName);

            using (var channel = _persistentConnection.CreateModel())
            {
                _logger.LogTrace("Declaring RabbitMQ exchange to publish event: {EventId}", @event.Id);

                channel.ExchangeDeclare(exchange: EXCHANGE_NAME, type: ExchangeType.Direct);

                var body = JsonSerializer.SerializeToUtf8Bytes(@event, @event.GetType());

                return await policy.ExecuteAsync(async () =>
                {
                    var properties = channel.CreateBasicProperties();
                    properties.DeliveryMode = 2; // persistent

                    _logger.LogTrace("Publishing event to RabbitMQ: {EventId}", @event.Id);

                    channel.BasicPublish(
                        exchange: EXCHANGE_NAME,
                        routingKey: eventName,
                        mandatory: true,
                        basicProperties: properties,
                        body: body);

                    return Result.Ok();
                });
            }
        }

        /// <summary>
        /// Подписывается на событие определенного типа
        /// </summary>
        public void Subscribe<TEvent, THandler>()
            where TEvent : IntegrationEvent
            where THandler : IIntegrationEventHandler<TEvent>
        {
            var eventName = typeof(TEvent).Name;
            var handlerType = typeof(THandler);

            if (!_eventTypes.Contains(typeof(TEvent)))
            {
                _eventTypes.Add(typeof(TEvent));
            }

            if (!_eventHandlerTypes.ContainsKey(eventName))
            {
                _eventHandlerTypes.Add(eventName, new List<Type>());
            }

            if (_eventHandlerTypes[eventName].Any(s => s == handlerType))
            {
                throw new ArgumentException(
                    $"Handler Type {handlerType.Name} already registered for '{eventName}'", nameof(handlerType));
            }

            _eventHandlerTypes[eventName].Add(handlerType);

            StartBasicConsume();
        }

        /// <summary>
        /// Отписывается от события определенного типа
        /// </summary>
        public void Unsubscribe<TEvent, THandler>()
            where TEvent : IntegrationEvent
            where THandler : IIntegrationEventHandler<TEvent>
        {
            var eventName = typeof(TEvent).Name;
            var handlerType = typeof(THandler);

            if (!_eventHandlerTypes.ContainsKey(eventName))
                return;

            _eventHandlerTypes[eventName].Remove(handlerType);

            if (!_eventHandlerTypes[eventName].Any())
            {
                _eventHandlerTypes.Remove(eventName);
                var eventType = _eventTypes.SingleOrDefault(e => e.Name == eventName);
                if (eventType != null)
                {
                    _eventTypes.Remove(eventType);
                }
                UpdateConsumerSubscriptions();
            }
        }

        /// <summary>
        /// Создает канал для потребителя сообщений
        /// </summary>
        private IModel CreateConsumerChannel()
        {
            if (!_persistentConnection.IsConnected)
            {
                _persistentConnection.TryConnect();
            }

            _logger.LogTrace("Creating RabbitMQ consumer channel");

            var channel = _persistentConnection.CreateModel();

            channel.ExchangeDeclare(exchange: EXCHANGE_NAME,
                                    type: ExchangeType.Direct);

            channel.QueueDeclare(queue: _queueName,
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

            channel.CallbackException += (sender, ea) =>
            {
                _logger.LogWarning(ea.Exception, "Recreating RabbitMQ consumer channel");

                _consumerChannel.Dispose();
                _consumerChannel = CreateConsumerChannel();
                StartBasicConsume();
            };

            return channel;
        }

        /// <summary>
        /// Запускает базовое потребление сообщений
        /// </summary>
        private void StartBasicConsume()
        {
            _logger.LogTrace("Starting RabbitMQ basic consume");

            if (_consumerChannel != null)
            {
                var consumer = new AsyncEventingBasicConsumer(_consumerChannel);

                consumer.Received += Consumer_Received;

                foreach (var eventName in _eventHandlerTypes.Keys)
                {
                    _consumerChannel.QueueBind(queue: _queueName,
                                          exchange: EXCHANGE_NAME,
                                          routingKey: eventName);
                }

                _consumerChannel.BasicConsume(
                    queue: _queueName,
                    autoAck: false,
                    consumer: consumer);
            }
            else
            {
                _logger.LogError("StartBasicConsume can't call on _consumerChannel == null");
            }
        }

        /// <summary>
        /// Обновляет подписки потребителя
        /// </summary>
        private void UpdateConsumerSubscriptions()
        {
            // Recreate the consumer channel to update subscriptions
            _consumerChannel.Close();
            _consumerChannel = CreateConsumerChannel();
            StartBasicConsume();
        }

        /// <summary>
        /// Обработчик получения сообщения
        /// </summary>
        private async Task Consumer_Received(object sender, BasicDeliverEventArgs eventArgs)
        {
            var eventName = eventArgs.RoutingKey;
            var message = Encoding.UTF8.GetString(eventArgs.Body.Span);

            try
            {
                await ProcessEvent(eventName, message);
                _consumerChannel.BasicAck(eventArgs.DeliveryTag, multiple: false);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error processing message: {Message}", message);
                _consumerChannel.BasicNack(eventArgs.DeliveryTag, multiple: false, requeue: true);
            }
        }

        /// <summary>
        /// Обрабатывает событие
        /// </summary>
        private async Task ProcessEvent(string eventName, string message)
        {
            _logger.LogTrace("Processing RabbitMQ event: {EventName}", eventName);

            if (_eventHandlerTypes.TryGetValue(eventName, out var subscriptions))
            {
                var eventType = _eventTypes.SingleOrDefault(t => t.Name == eventName);
                if (eventType == null)
                {
                    _logger.LogWarning("No event type found for event name: {EventName}", eventName);
                    return;
                }

                var integrationEvent = JsonSerializer.Deserialize(message, eventType);
                
                using (var scope = _serviceProvider.CreateScope())
                {
                    foreach (var subscription in subscriptions)
                    {
                        var handler = scope.ServiceProvider.GetService(subscription);
                        if (handler == null) continue;

                        var concreteType = typeof(IIntegrationEventHandler<>).MakeGenericType(eventType);
                        var handleMethod = concreteType.GetMethod("HandleAsync");

                        if (handleMethod != null)
                        {
                            await (Task<Result>)handleMethod.Invoke(handler, new object[] { integrationEvent });
                        }
                        else
                        {
                            _logger.LogWarning("HandleAsync method not found on handler: {HandlerType}", subscription.Name);
                        }
                    }
                }
            }
            else
            {
                _logger.LogWarning("No subscription for RabbitMQ event: {EventName}", eventName);
            }
        }

        /// <summary>
        /// Освобождает ресурсы
        /// </summary>
        public void Dispose()
        {
            _consumerChannel?.Dispose();
        }
    }
}