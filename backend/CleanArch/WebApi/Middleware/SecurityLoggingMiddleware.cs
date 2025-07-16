using System;
using System.Threading.Tasks;
using Application.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace WebApi.Middleware
{
    public class SecurityLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<SecurityLoggingMiddleware> _logger;

        public SecurityLoggingMiddleware(RequestDelegate next, ILogger<SecurityLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, ISecurityLoggingService securityLoggingService)
        {
            // Check if this is an authentication endpoint
            bool isAuthEndpoint = context.Request.Path.Value?.ToLower().Contains("/auth/") ?? false;
            bool isPasswordChangeEndpoint = context.Request.Path.Value?.ToLower().Contains("/user/changepassword") ?? false;
            bool isPasswordResetEndpoint = context.Request.Path.Value?.ToLower().Contains("/user/resetpassword") ?? false;

            try
            {
                // Continue with the request
                await _next(context);

                // Log authentication success/failure
                if (isAuthEndpoint && context.Request.Method == "POST")
                {
                    string userId = context.User?.Identity?.Name ?? "unknown";
                    bool isSuccess = context.Response.StatusCode == 200;
                    string ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    string userAgent = context.Request.Headers["User-Agent"].ToString();

                    await securityLoggingService.LogLoginAttempt(userId, isSuccess, ipAddress, userAgent);
                }

                // Log password change
                if (isPasswordChangeEndpoint && context.Request.Method == "POST")
                {
                    string userId = context.User?.Identity?.Name ?? "unknown";
                    bool isSuccess = context.Response.StatusCode == 200;
                    string ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    string userAgent = context.Request.Headers["User-Agent"].ToString();

                    await securityLoggingService.LogPasswordChange(userId, isSuccess, ipAddress, userAgent);
                }

                // Log password reset
                if (isPasswordResetEndpoint && context.Request.Method == "POST")
                {
                    string userId = context.User?.Identity?.Name ?? "unknown";
                    bool isSuccess = context.Response.StatusCode == 200;
                    string ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    string userAgent = context.Request.Headers["User-Agent"].ToString();

                    await securityLoggingService.LogPasswordReset(userId, isSuccess, ipAddress, userAgent);
                }

                // Log access denied events (403)
                if (context.Response.StatusCode == 403)
                {
                    string userId = context.User?.Identity?.Name ?? "unknown";
                    string resource = context.Request.Path;
                    string ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                    await securityLoggingService.LogAccessDenied(userId, resource, ipAddress);
                }

                // Log unauthorized events (401)
                if (context.Response.StatusCode == 401)
                {
                    string userId = context.User?.Identity?.Name ?? "unknown";
                    string resource = context.Request.Path;
                    string ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    string userAgent = context.Request.Headers["User-Agent"].ToString();

                    await securityLoggingService.LogUnauthorizedAccess(userId, resource, ipAddress, userAgent);
                }

                // Log validation errors (422)
                if (context.Response.StatusCode == 422)
                {
                    string userId = context.User?.Identity?.Name ?? "unknown";
                    string resource = context.Request.Path;
                    string ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    string userAgent = context.Request.Headers["User-Agent"].ToString();

                    // We don't have error details here, so we'll log a generic message
                    string errorDetails = "Unprocessable Entity - validation error";

                    await securityLoggingService.LogValidationError(userId, resource, errorDetails, ipAddress, userAgent);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SecurityLoggingMiddleware");
                throw;
            }
        }
    }

    public static class SecurityLoggingMiddlewareExtensions
    {
        public static IApplicationBuilder UseSecurityLogging(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<SecurityLoggingMiddleware>();
        }
    }
}