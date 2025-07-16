using System.Text.Json.Serialization;

namespace Messaging.Shared.Events
{
    /// <summary>
    /// Базовый класс для всех событий интеграции между сервисами
    /// </summary>
    public abstract class IntegrationEvent
    {
        /// <summary>
        /// Уникальный идентификатор события
        /// </summary>
        [JsonInclude]
        public Guid Id { get; private set; }

        /// <summary>
        /// Время создания события
        /// </summary>
        [JsonInclude]
        public DateTime CreationDate { get; private set; }

        /// <summary>
        /// Название событийной шины, к которой относится событие
        /// </summary>
        [JsonInclude]
        public string? EventBusName { get; set; }

        /// <summary>
        /// Конструктор события интеграции
        /// </summary>
        public IntegrationEvent()
        {
            Id = Guid.NewGuid();
            CreationDate = DateTime.UtcNow;
        }

        /// <summary>
        /// Конструктор с указанием идентификатора и времени создания
        /// </summary>
        [JsonConstructor]
        public IntegrationEvent(Guid id, DateTime creationDate)
        {
            Id = id;
            CreationDate = creationDate;
        }
    }
}