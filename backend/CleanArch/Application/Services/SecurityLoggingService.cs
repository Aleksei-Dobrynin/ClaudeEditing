using System;
using System.Threading.Tasks;
using Application.Repositories;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public interface ISecurityLoggingService
    {
        Task LogSecurityEvent(string eventType, string description, string userId, int severityLevel = 3);
        Task LogLoginAttempt(string userId, bool success, string ipAddress, string userAgent);
        Task LogAccessDenied(string userId, string resource, string ipAddress);
        Task LogDataAccess(string userId, string dataType, string operation, string details);
        Task LogUserManagement(string eventType, string adminId, string affectedUserId, string details);
        Task LogPasswordChange(string userId, bool isSuccess, string ipAddress, string userAgent);
        Task LogPasswordReset(string userId, bool isSuccess, string ipAddress, string userAgent);
        Task LogUnauthorizedAccess(string userId, string resource, string ipAddress, string userAgent);
        Task LogValidationError(string userId, string resource, string errorDetails, string ipAddress, string userAgent);
    }

    public class SecurityLoggingService : ISecurityLoggingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<SecurityLoggingService> _logger;

        public SecurityLoggingService(
            IUnitOfWork unitOfWork,
            IHttpContextAccessor httpContextAccessor,
            ILogger<SecurityLoggingService> logger)
        {
            _unitOfWork = unitOfWork;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        public async Task LogSecurityEvent(string eventType, string description, string userId, int severityLevel = 3)
        {
            var context = _httpContextAccessor.HttpContext;
            string ipAddress = context?.Connection?.RemoteIpAddress?.ToString() ?? "неизвестно";
            string userAgent = context?.Request?.Headers["User-Agent"].ToString() ?? "неизвестно";

            var securityEvent = new SecurityEvent
            {
                event_type = eventType,
                event_description = description,
                user_id = userId,
                ip_address = ipAddress,
                user_agent = userAgent,
                event_time = DateTime.UtcNow,
                severity_level = severityLevel,
                is_resolved = false
            };

            try
            {
                await _unitOfWork.SecurityEventRepository.Add(securityEvent);
                _unitOfWork.Commit();

                // Также логируем в журнал приложения для критических событий
                if (severityLevel <= 2)
                {
                    _logger.LogWarning($"Событие безопасности: {eventType} - {description} - Пользователь: {userId} - IP: {ipAddress}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Не удалось записать событие безопасности: {eventType} - {description}");
                throw;
            }
        }

        public async Task LogLoginAttempt(string userId, bool success, string ipAddress, string userAgent)
        {
            string eventType = success ? SecurityEventType.LOGIN_SUCCESS : SecurityEventType.LOGIN_FAILURE;
            string description = success
                ? $"Успешный вход пользователя {userId}"
                : $"Неудачная попытка входа пользователя {userId}";

            int severityLevel = success ? 4 : 2; // Неудачные попытки входа имеют более высокий уровень серьезности

            var securityEvent = new SecurityEvent
            {
                event_type = eventType,
                event_description = description,
                user_id = userId,
                ip_address = ipAddress,
                user_agent = userAgent,
                event_time = DateTime.UtcNow,
                severity_level = severityLevel,
                is_resolved = success // Успешные входы автоматически помечаются как разрешенные
            };

            await _unitOfWork.SecurityEventRepository.Add(securityEvent);
            _unitOfWork.Commit();

            // Логируем неудачные попытки входа в журнал приложения
            if (!success)
            {
                _logger.LogWarning($"Неудачная попытка входа: Пользователь: {userId} - IP: {ipAddress}");
            }
        }

        public async Task LogAccessDenied(string userId, string resource, string ipAddress)
        {
            string description = $"Отказано в доступе к ресурсу {resource} для пользователя {userId}";

            var securityEvent = new SecurityEvent
            {
                event_type = SecurityEventType.ACCESS_DENIED,
                event_description = description,
                user_id = userId,
                ip_address = ipAddress,
                user_agent = _httpContextAccessor.HttpContext?.Request?.Headers["User-Agent"].ToString() ?? "неизвестно",
                event_time = DateTime.UtcNow,
                severity_level = 2, // Высокий уровень серьезности
                is_resolved = false
            };

            await _unitOfWork.SecurityEventRepository.Add(securityEvent);
            _unitOfWork.Commit();

            _logger.LogWarning($"Отказ в доступе: {description} - IP: {ipAddress}");
        }

        public async Task LogDataAccess(string userId, string dataType, string operation, string details)
        {
            string description = $"Операция {operation} с данными типа {dataType}: {details}";

            var securityEvent = new SecurityEvent
            {
                event_type = SecurityEventType.SENSITIVE_DATA_ACCESS,
                event_description = description,
                user_id = userId,
                ip_address = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "неизвестно",
                user_agent = _httpContextAccessor.HttpContext?.Request?.Headers["User-Agent"].ToString() ?? "неизвестно",
                event_time = DateTime.UtcNow,
                severity_level = 3, // Средний уровень серьезности
                is_resolved = true // События доступа к данным обычно автоматически разрешаются
            };

            await _unitOfWork.SecurityEventRepository.Add(securityEvent);
            _unitOfWork.Commit();
        }

        public async Task LogUserManagement(string eventType, string adminId, string affectedUserId, string details)
        {
            string description = $"Операция управления пользователем {affectedUserId}: {details}";

            var securityEvent = new SecurityEvent
            {
                event_type = eventType,
                event_description = description,
                user_id = adminId,
                ip_address = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "неизвестно",
                user_agent = _httpContextAccessor.HttpContext?.Request?.Headers["User-Agent"].ToString() ?? "неизвестно",
                event_time = DateTime.UtcNow,
                severity_level = 2, // Высокий уровень серьезности
                is_resolved = true // События управления пользователями обычно автоматически разрешаются
            };

            await _unitOfWork.SecurityEventRepository.Add(securityEvent);
            _unitOfWork.Commit();

            _logger.LogInformation($"Управление пользователем: {description} администратором {adminId}");
        }

        public async Task LogPasswordChange(string userId, bool isSuccess, string ipAddress, string userAgent)
        {
            string description = isSuccess
                ? $"Пароль успешно изменен для пользователя {userId}"
                : $"Неудачная попытка изменения пароля для пользователя {userId}";

            int severityLevel = isSuccess ? 3 : 2; // Неудачные изменения пароля имеют более высокий уровень серьезности

            var securityEvent = new SecurityEvent
            {
                event_type = SecurityEventType.PASSWORD_CHANGE,
                event_description = description,
                user_id = userId,
                ip_address = ipAddress,
                user_agent = userAgent,
                event_time = DateTime.UtcNow,
                severity_level = severityLevel,
                is_resolved = isSuccess // Успешные изменения автоматически разрешаются
            };

            await _unitOfWork.SecurityEventRepository.Add(securityEvent);
            _unitOfWork.Commit();

            // Запись в журнал для мониторинга
            if (!isSuccess)
            {
                _logger.LogWarning($"Неудачное изменение пароля: Пользователь: {userId} - IP: {ipAddress}");
            }
            else
            {
                _logger.LogInformation($"Пароль изменен: Пользователь: {userId}");
            }
        }

        public async Task LogPasswordReset(string userId, bool isSuccess, string ipAddress, string userAgent)
        {
            string description = isSuccess
                ? $"Сброс пароля успешно выполнен для пользователя {userId}"
                : $"Неудачная попытка сброса пароля для пользователя {userId}";

            int severityLevel = isSuccess ? 3 : 2; // Неудачные сбросы пароля имеют более высокий уровень серьезности

            var securityEvent = new SecurityEvent
            {
                event_type = SecurityEventType.PASSWORD_RESET,
                event_description = description,
                user_id = userId,
                ip_address = ipAddress,
                user_agent = userAgent,
                event_time = DateTime.UtcNow,
                severity_level = severityLevel,
                is_resolved = isSuccess // Успешные сбросы автоматически разрешаются
            };

            await _unitOfWork.SecurityEventRepository.Add(securityEvent);
            _unitOfWork.Commit();

            // Всегда логируем сбросы пароля
            _logger.LogWarning($"Сброс пароля: {description} - IP: {ipAddress}");
        }

        public async Task LogUnauthorizedAccess(string userId, string resource, string ipAddress, string userAgent)
        {
            string description = $"Попытка несанкционированного доступа к ресурсу {resource} пользователем {userId}";

            var securityEvent = new SecurityEvent
            {
                event_type = SecurityEventType.UNAUTHORIZED_ACCESS,
                event_description = description,
                user_id = userId,
                ip_address = ipAddress,
                user_agent = userAgent,
                event_time = DateTime.UtcNow,
                severity_level = 2, // Высокий уровень серьезности
                is_resolved = false
            };

            await _unitOfWork.SecurityEventRepository.Add(securityEvent);
            _unitOfWork.Commit();

            _logger.LogWarning($"Несанкционированный доступ (401): {description} - IP: {ipAddress}");
        }

        public async Task LogValidationError(string userId, string resource, string errorDetails, string ipAddress, string userAgent)
        {
            string description = $"Ошибка валидации на ресурсе {resource}: {errorDetails}";

            var securityEvent = new SecurityEvent
            {
                event_type = SecurityEventType.VALIDATION_ERROR,
                event_description = description,
                user_id = userId,
                ip_address = ipAddress,
                user_agent = userAgent,
                event_time = DateTime.UtcNow,
                severity_level = 3, // Средний уровень серьезности
                is_resolved = true // Автоматически разрешается, так как это проблема валидации ввода
            };

            await _unitOfWork.SecurityEventRepository.Add(securityEvent);
            _unitOfWork.Commit();

            _logger.LogInformation($"Ошибка валидации (422): {description} - IP: {ipAddress}");
        }
    }
}