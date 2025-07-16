using System.Net;
using System.Net.Http;
using System.Text.Json;
using Application.Repositories;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using StackExchange.Redis;
using WebApi.IntegrationTests.Helpers;
using WebApi.IntegrationTests.Mocks;

namespace WebApi.IntegrationTests.Fixtures
{
    /// <summary>
    /// Расширенная фабрика для создания тестового веб-приложения
    /// с поддержкой мокирования внешних сервисов и зависимостей
    /// </summary>
    public class TestWebApplicationFactoryExtended<TStartup> : TestWebApplicationFactory<TStartup> where TStartup : class
    {
        private readonly string _schemaName;
        private readonly Action<IServiceCollection> _configureTestServices;
        private readonly Dictionary<string, string> _appSettings;

        /// <summary>
        /// Создает экземпляр фабрики с указанной схемой и настройками
        /// </summary>
        /// <param name="schemaName">Имя тестовой схемы БД</param>
        /// <param name="configureTestServices">Дополнительная настройка сервисов</param>
        /// <param name="appSettings">Дополнительные настройки приложения</param>
        public TestWebApplicationFactoryExtended(
            string schemaName,
            Action<IServiceCollection> configureTestServices = null,
            Dictionary<string, string> appSettings = null)
            : base(schemaName)
        {
            _schemaName = schemaName;
            _configureTestServices = configureTestServices;
            _appSettings = appSettings ?? new Dictionary<string, string>();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            base.ConfigureWebHost(builder);

            // Добавляем расширенные возможности настройки
            builder.ConfigureAppConfiguration((context, config) =>
            {
                // Добавляем дополнительные настройки приложения
                config.AddInMemoryCollection(_appSettings);
            });

            builder.ConfigureTestServices(services =>
            {
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IConnectionMultiplexer));
                if (descriptor != null)
                    services.Remove(descriptor);
                
                var mockDb = new Mock<IDatabase>();
                var mockMultiplexer = new Mock<IConnectionMultiplexer>();

                mockDb.SetupGet(x => x.Multiplexer).Returns(mockMultiplexer.Object);
                mockMultiplexer.Setup(x => x.GetDatabase(It.IsAny<int>(), It.IsAny<object>())).Returns(mockDb.Object);
                mockMultiplexer.Setup(x => x.GetEndPoints(It.IsAny<bool>())).Returns(new[] { new DnsEndPoint("localhost", 6379) });
                mockMultiplexer.Setup(x => x.GetServer(It.IsAny<EndPoint>(), It.IsAny<object>())).Returns(Mock.Of<IServer>());

                services.AddSingleton<IConnectionMultiplexer>(mockMultiplexer.Object);
                
                
                // Регистрируем мок внешних сервисов
                services.AddExternalServiceMock();

                // Дополнительная настройка сервисов из конструктора
                _configureTestServices?.Invoke(services);
            });
        }

        /// <summary>
        /// Создает клиент с предварительно настроенными моками сервисов
        /// </summary>
        /// <param name="externalServiceMocks">Конфигурация моков внешних сервисов</param>
        /// <returns>HTTP клиент для тестирования</returns>
        public HttpClient CreateClientWithMocks(Action<ExternalServiceMock> externalServiceMocks = null)
        {
            var client = CreateClient();

            // Настраиваем моки внешних сервисов, если указаны
            if (externalServiceMocks != null)
            {
                using var scope = Server.Services.CreateScope();
                var serviceMock = scope.ServiceProvider.GetRequiredService<ExternalServiceMock>();
                externalServiceMocks(serviceMock);
            }

            return client;
        }
    }
}