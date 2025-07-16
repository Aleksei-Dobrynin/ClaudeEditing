using Messaging.Shared.Events;
using FluentResults;

namespace Messaging.Shared
{
    /// <summary>
    /// Базовый интерфейс обработчика событий
    /// </summary>
    public interface IIntegrationEventHandler
    {
    }

    /// <summary>
    /// Интерфейс обработчика событий определенного типа
    /// </summary>
    /// <typeparam name="TIntegrationEvent">Тип обрабатываемого события</typeparam>
    public interface IIntegrationEventHandler<in TIntegrationEvent> : IIntegrationEventHandler
        where TIntegrationEvent : IntegrationEvent
    {
        /// <summary>
        /// Обрабатывает событие
        /// </summary>
        /// <param name="event">Событие для обработки</param>
        /// <returns>Результат обработки</returns>
        Task<Result> HandleAsync(TIntegrationEvent @event);
    }
}