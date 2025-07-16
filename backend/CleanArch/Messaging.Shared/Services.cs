using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Messaging.Shared.Events;
using System.Reflection;

namespace Messaging.Shared.Services
{
    /// <summary>
    /// Сервис для автоматической регистрации подписок на события
    /// </summary>
    public class EventBusSubscriptionService : IHostedService
    {
        private readonly IEventBus _eventBus;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<EventBusSubscriptionService> _logger;

        public EventBusSubscriptionService(
            IEventBus eventBus,
            IServiceProvider serviceProvider,
            ILogger<EventBusSubscriptionService> logger)
        {
            _eventBus = eventBus ?? throw new ArgumentNullException(nameof(eventBus));
            _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Запускает сервис и регистрирует подписки
        /// </summary>
        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting EventBusSubscriptionService");
            RegisterEventHandlers();
            return Task.CompletedTask;
        }

        /// <summary>
        /// Останавливает сервис
        /// </summary>
        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Находит и регистрирует все обработчики событий
        /// </summary>
        private void RegisterEventHandlers()
        {
            var assemblies = AppDomain.CurrentDomain.GetAssemblies();
            
            // Находим все типы обработчиков
            var handlerTypes = assemblies
                .SelectMany(assembly => assembly.GetTypes())
                .Where(type => 
                    type.GetInterfaces()
                        .Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IIntegrationEventHandler<>)))
                .ToList();
            
            _logger.LogInformation("Found {HandlerCount} event handlers", handlerTypes.Count);
            
            foreach (var handlerType in handlerTypes)
            {
                // Находим интерфейсы IIntegrationEventHandler<T>
                var interfaces = handlerType.GetInterfaces()
                    .Where(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IIntegrationEventHandler<>));
                
                foreach (var handlerInterface in interfaces)
                {
                    // Получаем тип события, который обрабатывает этот обработчик
                    var eventType = handlerInterface.GetGenericArguments()[0];
                    
                    // Регистрируем обработчик в DI контейнере, если его еще нет
                    RegisterHandler(handlerType);
                    
                    // Регистрируем подписку в шине событий
                    RegisterSubscription(eventType, handlerType);
                    
                    _logger.LogInformation("Registered handler {HandlerType} for event {EventType}",
                        handlerType.Name, eventType.Name);
                }
            }
        }

        /// <summary>
        /// Регистрирует обработчик в DI контейнере, если его еще нет
        /// </summary>
        private void RegisterHandler(Type handlerType)
        {
            // Этот метод может использоваться для регистрации обработчиков "на лету",
            // но в нашем случае мы предполагаем, что они уже зарегистрированы в DI контейнере
            // при запуске приложения
        }

        /// <summary>
        /// Регистрирует подписку на событие в шине событий
        /// </summary>
        private void RegisterSubscription(Type eventType, Type handlerType)
        {
            // Динамически создаем и вызываем метод Subscribe<TEvent, THandler>
            var subscribeMethod = typeof(IEventBus)
                .GetMethod("Subscribe", BindingFlags.Public | BindingFlags.Instance)
                ?.MakeGenericMethod(eventType, handlerType);
            
            subscribeMethod?.Invoke(_eventBus, null);
        }
    }
}