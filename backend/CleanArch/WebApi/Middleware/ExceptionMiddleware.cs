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
            catch (PermissionException ex)
            {
                _logger.LogError($"Permission error. {JsonConvert.SerializeObject(ex.Details)} {ex}");
                await HandleExceptionAsync(context, HttpStatusCode.Forbidden, ex.Message, ex);
            } 
            catch (ServiceException ex)
            {
                _logger.LogError($"An unexpected error occurred. {ex}");
                await HandleExceptionAsync(context, HttpStatusCode.BadRequest, ex.Message, ex);
            }
            catch (RepositoryException ex)
            {
                _logger.LogError($"An unexpected error occurred. {ex}");
                await HandleExceptionAsync(context, HttpStatusCode.InternalServerError, ex.Message, ex);
            }
            catch (Exception ex)
            {
                _logger.LogError($"An unexpected error occurred. {ex}");
                await HandleExceptionAsync(context, HttpStatusCode.InternalServerError, "An unexpected error occurred.", ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, HttpStatusCode statusCode, string message, Exception ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;
            return context.Response.WriteAsync(new
            {
                StatusCode = context.Response.StatusCode,
                Message = JsonConvert.SerializeObject(ex)
            }.ToString());
        }
    }
}
