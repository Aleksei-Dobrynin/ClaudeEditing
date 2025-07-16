using System.Text.Json;
using System.Text.Json.Serialization;
using Messaging.Shared.Events;

namespace Messaging.Shared.Events
{
    /// <summary>
    /// Событие создания сервиса
    /// </summary>
    public class ServiceCreatedEvent : IntegrationEvent
    {
        /// <summary>
        /// Идентификатор сервиса
        /// </summary>
        public int ServiceId { get; }
        
        /// <summary>
        /// Название сервиса
        /// </summary>
        public string Name { get; }
        
        /// <summary>
        /// Короткое название сервиса
        /// </summary>
        public string ShortName { get; }
        
        /// <summary>
        /// Код сервиса
        /// </summary>
        public string Code { get; }
        
        /// <summary>
        /// Описание сервиса
        /// </summary>
        public string Description { get; }
        
        /// <summary>
        /// Количество дней на обработку
        /// </summary>
        public int? DayCount { get; }
        
        /// <summary>
        /// Идентификатор рабочего процесса
        /// </summary>
        public int? WorkflowId { get; }
        
        /// <summary>
        /// Цена сервиса
        /// </summary>
        public decimal? Price { get; }
        
        /// <summary>
        /// Флаг активности сервиса
        /// </summary>
        public bool? IsActive { get; }
        
        public Guid CorrelationId { get; }

        /// <summary>
        /// Конструктор события создания сервиса
        /// </summary>
        public ServiceCreatedEvent(
            int serviceId, 
            string name, 
            string shortName, 
            string code, 
            string description, 
            int? dayCount, 
            int? workflowId, 
            decimal? price,
            bool? isActive,
            Guid correlationId) : base()
        {
            ServiceId = serviceId;
            Name = name;
            ShortName = shortName;
            Code = code;
            Description = description;
            DayCount = dayCount;
            WorkflowId = workflowId;
            Price = price;
            IsActive = isActive;
            CorrelationId = correlationId;
        }
    }

    /// <summary>
    /// Событие обновления сервиса
    /// </summary>
    public class ServiceUpdatedEvent : IntegrationEvent
    {
        /// <summary>
        /// Идентификатор сервиса
        /// </summary>
        public int ServiceId { get; }
        
        /// <summary>
        /// Название сервиса
        /// </summary>
        public string Name { get; }
        
        /// <summary>
        /// Короткое название сервиса
        /// </summary>
        public string ShortName { get; }
        
        /// <summary>
        /// Код сервиса
        /// </summary>
        public string Code { get; }
        
        /// <summary>
        /// Описание сервиса
        /// </summary>
        public string Description { get; }
        
        /// <summary>
        /// Количество дней на обработку
        /// </summary>
        public int? DayCount { get; }
        
        /// <summary>
        /// Идентификатор рабочего процесса
        /// </summary>
        public int? WorkflowId { get; }
        
        /// <summary>
        /// Цена сервиса
        /// </summary>
        public decimal? Price { get; }
        
        /// <summary>
        /// Флаг активности сервиса
        /// </summary>
        public bool? IsActive { get; }

        public Guid CorrelationId { get; }

        /// <summary>
        /// Конструктор события обновления сервиса
        /// </summary>
        public ServiceUpdatedEvent(
            int serviceId, 
            string name,
            string shortName,
            string code,
            string description,
            int? dayCount,
            int? workflowId,
            decimal? price,
            bool? isActive,
            Guid correlationId)
        {
            ServiceId = serviceId;
            Name = name;
            ShortName = shortName;
            Code = code;
            Description = description;
            DayCount = dayCount;
            WorkflowId = workflowId;
            Price = price;
            IsActive = isActive;
            CorrelationId = correlationId;
        }
    }

    /// <summary>
    /// Событие удаления сервиса
    /// </summary>
    public class ServiceDeletedEvent : IntegrationEvent
    {
        /// <summary>
        /// Идентификатор удаленного сервиса
        /// </summary>
        public int ServiceId { get; }

        /// <summary>
        /// Конструктор события удаления сервиса
        /// </summary>
        public ServiceDeletedEvent(int serviceId)
        {
            ServiceId = serviceId;
        }
    }

    /// <summary>
    /// Событие запроса данных о сервисе
    /// </summary>
    public class ServiceRequestedEvent : IntegrationEvent
    {
        /// <summary>
        /// Идентификатор запрашиваемого сервиса (если указан)
        /// </summary>
        public int? ServiceId { get; }
        
        /// <summary>
        /// Идентификатор коррелятора для сопоставления ответа
        /// </summary>
        public Guid CorrelationId { get; }

        /// <summary>
        /// Конструктор события запроса данных о сервисе
        /// </summary>
        public ServiceRequestedEvent(int? serviceId, Guid correlationId)
        {
            ServiceId = serviceId;
            CorrelationId = correlationId;
        }
    }

    /// <summary>
    /// Событие ответа с данными о сервисе
    /// </summary>
    public class ServiceResponseEvent : IntegrationEvent
    {
        public ServiceResponseEvent()
        {
        }
        
        /// <summary>
        /// Идентификатор коррелятора для сопоставления ответа с запросом
        /// </summary>
        public Guid CorrelationId { get; }
        
        /// <summary>
        /// Сервисы, если запрос был для списка
        /// </summary>
        public List<ServiceDto> Services { get; }
        
        /// <summary>
        /// Сервис, если запрос был для одного элемента
        /// </summary>
        public ServiceDto Service { get; }
        
        /// <summary>
        /// Флаг успешности запроса
        /// </summary>
        public bool Success { get; }
        
        /// <summary>
        /// Сообщение об ошибке (если есть)
        /// </summary>
        public string ErrorMessage { get; }
        
        [JsonConstructor]
        public ServiceResponseEvent(Guid correlationId, List<ServiceDto>? services = null, ServiceDto? service = null, bool success = true, string? errorMessage = null)
        {
            CorrelationId = correlationId;
            Services = services;
            Service = service;
            Success = success;
            ErrorMessage = errorMessage;
        }

        /// <summary>
        /// Конструктор для успешного ответа со списком сервисов
        /// </summary>
        public ServiceResponseEvent(Guid correlationId, List<ServiceDto> services)
        {
            CorrelationId = correlationId;
            Services = services;
            Service = null;
            Success = true;
            ErrorMessage = null;
        }

        /// <summary>
        /// Конструктор для успешного ответа с одним сервисом
        /// </summary>
        public ServiceResponseEvent(Guid correlationId, ServiceDto service)
        {
            CorrelationId = correlationId;
            Services = null;
            Service = service;
            Success = true;
            ErrorMessage = null;
        }

        /// <summary>
        /// Конструктор для ответа с ошибкой
        /// </summary>
        public ServiceResponseEvent(Guid correlationId, string errorMessage)
        {
            CorrelationId = correlationId;
            Services = null;
            Service = null;
            Success = false;
            ErrorMessage = errorMessage;
        }
    }

    /// <summary>
    /// DTO для передачи данных о сервисе
    /// </summary>
    public class ServiceDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public int? DayCount { get; set; }
        public int? WorkflowId { get; set; }
        public decimal? Price { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
    }
}