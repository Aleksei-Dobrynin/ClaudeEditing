using FluentResults;
using Messaging.Shared;
using Microsoft.Extensions.Logging;
using Domain.Entities;
using Application.Repositories;
using Application.UseCases;
using Messaging.Shared.Events;

namespace Services.Microservice.EventHandlers
{
    /// <summary>
    /// Обработчик события запроса данных о сервисе
    /// </summary>
    public class ServiceRequestedEventHandler : IIntegrationEventHandler<ServiceRequestedEvent>
    {
        private readonly ServiceUseCases _serviceUseCases;
        private readonly IEventBus _eventBus;
        private readonly ILogger<ServiceRequestedEventHandler> _logger;

        public ServiceRequestedEventHandler(
            ServiceUseCases serviceUseCases,
            IEventBus eventBus,
            ILogger<ServiceRequestedEventHandler> logger)
        {
            _serviceUseCases = serviceUseCases ?? throw new ArgumentNullException(nameof(serviceUseCases));
            _eventBus = eventBus ?? throw new ArgumentNullException(nameof(eventBus));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Обрабатывает запрос данных о сервисе и отправляет ответ
        /// </summary>
        public async Task<Result> HandleAsync(ServiceRequestedEvent @event)
        {
            _logger.LogInformation("Handling ServiceRequestedEvent with correlationId: {@CorrelationId}", @event.CorrelationId);
            
            try
            {
                if (@event.ServiceId.HasValue)
                {
                    var serviceResult = await _serviceUseCases.GetOneByID(@event.ServiceId.Value);

                    var service = serviceResult;
                    var serviceDto = MapToServiceDto(service);
                    
                    await _eventBus.PublishAsync(new ServiceResponseEvent(@event.CorrelationId, serviceDto));
                }
                else
                {
                    var servicesResult = await _serviceUseCases.GetAll();
                
                    var services = servicesResult;
                    var serviceDtos = services.Select(MapToServiceDto).ToList();
                    
                    await _eventBus.PublishAsync(new ServiceResponseEvent(@event.CorrelationId, serviceDtos));
                }
                
                return Result.Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing ServiceRequestedEvent");
                
                await _eventBus.PublishAsync(new ServiceResponseEvent(@event.CorrelationId, 
                    $"Error processing request: {ex.Message}"));
                
                return Result.Fail(new Error("Error processing request")
                    .WithMetadata("ErrorMessage", ex.Message));
            }
        }

        /// <summary>
        /// Преобразует сущность Service в DTO для передачи через шину событий
        /// </summary>
        private ServiceDto MapToServiceDto(Service service)
        {
            return new ServiceDto
            {
                Id = service.id,
                Name = service.name,
                ShortName = service.short_name,
                Code = service.code,
                Description = service.description,
                DayCount = service.day_count,
                WorkflowId = service.workflow_id,
                Price = service.price,
                IsActive = service.is_active,
            };
        }
    }
}