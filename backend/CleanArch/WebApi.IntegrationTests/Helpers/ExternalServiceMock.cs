using System.Net;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using Mysqlx.Expr;

namespace WebApi.IntegrationTests.Mocks
{
    /// <summary>
    /// Класс для мокирования внешних HTTP сервисов
    /// </summary>
    public class ExternalServiceMock
    {
        private readonly Mock<HttpMessageHandler> _mockHttpHandler;
        private readonly ILogger<ExternalServiceMock> _logger;

        public ExternalServiceMock(IServiceProvider serviceProvider)
        {
            _mockHttpHandler = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            _logger = serviceProvider.GetRequiredService<ILogger<ExternalServiceMock>>();
        }

        public HttpClient SetupResponse(string url, object responseObject, HttpStatusCode statusCode = HttpStatusCode.OK, HttpMethod method = null)
        {
            method ??= HttpMethod.Get;
            var responseJson = JsonSerializer.Serialize(responseObject);

            _logger.LogInformation("Setting up mock response for {Method} {Url}. Response: {ResponseJson}", method, url, responseJson);

            _mockHttpHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req =>
                        req.Method == method &&
                        req.RequestUri.ToString().Contains(url)),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = statusCode,
                    Content = new StringContent(responseJson, Encoding.UTF8, "application/json")
                });

            return new HttpClient(_mockHttpHandler.Object);
        }

        public HttpClient SetupResponseForAnyRequest(string baseUrl, object responseObject, HttpStatusCode statusCode = HttpStatusCode.OK, HttpMethod method = null)
        {
            method ??= HttpMethod.Get;
            var responseJson = JsonSerializer.Serialize(responseObject);

            _logger.LogInformation("Setting up mock response for ANY {Method} request to {BaseUrl}. Response: {ResponseJson}", method, baseUrl, responseJson);

            _mockHttpHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req =>
                        req.Method == method &&
                        req.RequestUri.ToString().StartsWith(baseUrl)),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = statusCode,
                    Content = new StringContent(responseJson, Encoding.UTF8, "application/json")
                });

            return new HttpClient(_mockHttpHandler.Object);
        }

        public void VerifyRequest(string url, HttpMethod method = null, Times? times = null)
        {
            method ??= HttpMethod.Get;
            times ??= Times.Once();

            _mockHttpHandler
                .Protected()
                .Verify(
                    "SendAsync",
                    times.Value,
                    ItExpr.Is<HttpRequestMessage>(req =>
                        req.Method == method &&
                        req.RequestUri.ToString().Contains(url)),
                    ItExpr.IsAny<CancellationToken>()
                );

            _logger.LogInformation("Verified {Method} request to {Url} was called {CallCount} times", method, url, times.Value.ToString());
        }
    }

    /// <summary>
    /// Расширения для работы с моками внешних сервисов
    /// </summary>
    public static class ExternalServiceMockExtensions
    {
        public static IServiceCollection AddExternalServiceMock(this IServiceCollection services)
        {
            services.AddSingleton<ExternalServiceMock>();
            return services;
        }
    }
}