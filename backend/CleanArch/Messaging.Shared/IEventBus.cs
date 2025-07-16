using Messaging.Shared.Events;
using FluentResults;

namespace Messaging.Shared
{
    /// <summary>
    /// Интерфейс шины событий для публикации и подписки на события
    /// </summary>
    public interface IEventBus
    {
        /// <summary>
        /// Публикует событие в шину
        /// </summary>
        /// <typeparam name="TEvent">Тип события</typeparam>
        /// <param name="event">Событие для публикации</param>
        /// <returns>Результат публикации</returns>
        Task<Result> PublishAsync<TEvent>(TEvent @event) where TEvent : IntegrationEvent;

        /// <summary>
        /// Подписывается на событие определенного типа
        /// </summary>
        /// <typeparam name="TEvent">Тип события</typeparam>
        /// <typeparam name="THandler">Тип обработчика события</typeparam>
        void Subscribe<TEvent, THandler>()
            where TEvent : IntegrationEvent
            where THandler : IIntegrationEventHandler<TEvent>;

        /// <summary>
        /// Отписывается от события определенного типа
        /// </summary>
        /// <typeparam name="TEvent">Тип события</typeparam>
        /// <typeparam name="THandler">Тип обработчика события</typeparam>
        void Unsubscribe<TEvent, THandler>()
            where TEvent : IntegrationEvent
            where THandler : IIntegrationEventHandler<TEvent>;
    }
}