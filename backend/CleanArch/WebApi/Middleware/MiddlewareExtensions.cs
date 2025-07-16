namespace WebApi.Middleware
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseMiddlewareExtensions(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionMiddleware>()
                .UseSecurityLogging();
        }
    }
}
