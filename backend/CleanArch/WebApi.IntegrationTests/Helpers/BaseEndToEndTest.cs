using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using WebApi.IntegrationTests.Fixtures;
using WebApi.IntegrationTests.Helpers;
using Xunit;

namespace WebApi.IntegrationTests.E2E
{
    public abstract class BaseE2ETest : IDisposable
    {
        protected readonly string _schemaName;
        protected readonly HttpClient _client;
        protected readonly TestWebApplicationFactory<Program> _factory;
        protected readonly TestDataHelper _testDataHelper;
        protected bool _isInitialized = false;

        protected BaseE2ETest()
        {
            try
            {
                // Создаем схему для теста
                _schemaName = DatabaseHelper.CreateTestSchema();

                // Создаем клиент с нужной схемой
                _factory = new TestWebApplicationFactory<Program>(_schemaName);
                _client = _factory.CreateClient(new WebApplicationFactoryClientOptions
                {
                    AllowAutoRedirect = false
                });

                // Создаем помощник для работы с тестовыми данными
                _testDataHelper = new TestDataHelper(_schemaName);

                // НЕ вызываем SeedTestDataAsync() в конструкторе
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при инициализации теста: {ex}");
                throw;
            }
        }

        /// <summary>
        /// Инициализирует тестовые данные. Должен вызываться после полной инициализации производного класса.
        /// </summary>
        protected async Task InitializeTestAsync()
        {
            if (!_isInitialized)
            {
                await SeedTestDataAsync();
                _isInitialized = true;
            }
        }

        /// <summary>
        /// Подготовка начальных данных для конкретного теста
        /// </summary>
        protected virtual async Task SeedTestDataAsync()
        {
            // По умолчанию ничего не делаем, переопределяется в конкретных классах тестов
            await Task.CompletedTask;
        }

        public void Dispose()
        {
            try
            {
                // Очищаем данные после теста
                DatabaseHelper.DropTestSchema(_schemaName);
                _client.Dispose();
                _factory.Dispose();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при очистке ресурсов теста: {ex}");
            }
        }
    }
}