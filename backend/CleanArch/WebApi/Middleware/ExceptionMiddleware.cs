using System.Net;
using Application.Exceptions;
using Newtonsoft.Json;

namespace WebApi.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ServiceUnavailableException ex)
            {
                _logger.LogError($"Service unavailable error. Service: {ex.ServiceName}, IsTimeout: {ex.IsTimeout}, Message: {ex.Message}");
                await HandleServiceUnavailableAsync(context, ex);
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogError($"Request timeout error. {ex}");
                await HandleTimeoutAsync(context, ex);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"HTTP request error. {ex}");
                await HandleHttpRequestExceptionAsync(context, ex);
            }
            catch (PermissionException ex)
            {
                _logger.LogError($"Permission error. {JsonConvert.SerializeObject(ex.Details)} {ex}");
                await HandleExceptionAsync(context, HttpStatusCode.Forbidden, ex.Message, ex);
            }
            catch (ServiceException ex)
            {
                _logger.LogError($"Service error occurred. {ex}");
                await HandleExceptionAsync(context, HttpStatusCode.BadRequest, ex.Message, ex);
            }
            catch (RepositoryException ex)
            {
                // Проверяем, не является ли внутреннее исключение ServiceUnavailableException
                if (ex.InnerException is ServiceUnavailableException serviceEx)
                {
                    _logger.LogError($"Service unavailable error wrapped in RepositoryException. Service: {serviceEx.ServiceName}");
                    await HandleServiceUnavailableAsync(context, serviceEx);
                }
                else
                {
                    _logger.LogError($"Repository error occurred. {ex}");
                    await HandleExceptionAsync(context, HttpStatusCode.InternalServerError, ex.Message, ex);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"An unexpected error occurred. {ex}");
                await HandleExceptionAsync(context, HttpStatusCode.InternalServerError, "An unexpected error occurred.", ex);
            }
        }

        private static Task HandleServiceUnavailableAsync(HttpContext context, ServiceUnavailableException ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.ServiceUnavailable;

            var response = new
            {
                statusCode = context.Response.StatusCode,
                message = ex.Message,
                errorType = "ServiceUnavailable",
                serviceName = ex.ServiceName,
                isTimeout = ex.IsTimeout,
                timestamp = DateTime.UtcNow
            };

            return context.Response.WriteAsync(JsonConvert.SerializeObject(response));
        }

        private static Task HandleTimeoutAsync(HttpContext context, TaskCanceledException ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.RequestTimeout;

            var response = new
            {
                statusCode = context.Response.StatusCode,
                message = "Превышено время ожидания ответа от сервиса. Пожалуйста, попробуйте позже.",
                errorType = "Timeout",
                timestamp = DateTime.UtcNow
            };

            return context.Response.WriteAsync(JsonConvert.SerializeObject(response));
        }

        private static Task HandleHttpRequestExceptionAsync(HttpContext context, HttpRequestException ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.BadGateway;

            var response = new
            {
                statusCode = context.Response.StatusCode,
                message = "Не удалось подключиться к внешнему сервису. Проверьте подключение к интернету или попробуйте позже.",
                errorType = "HttpRequestError",
                timestamp = DateTime.UtcNow
            };

            return context.Response.WriteAsync(JsonConvert.SerializeObject(response));
        }

        private static Task HandleExceptionAsync(HttpContext context, HttpStatusCode statusCode, string message, Exception ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            // В production не показываем детали исключения
            var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

            var response = new
            {
                StatusCode = context.Response.StatusCode,
                Message = isDevelopment ? JsonConvert.SerializeObject(ex) : message
            };

            return context.Response.WriteAsync(JsonConvert.SerializeObject(response));
        }
    }
}