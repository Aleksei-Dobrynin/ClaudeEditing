using System;
using System.Linq;
using Application.Repositories;
using Application.Services;
using Application.Tests.Mocks;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WebApi.IntegrationTests.Helpers;
using WebApi.IntegrationTests.Mocks;

namespace WebApi.IntegrationTests.Fixtures
{
    public class TestWebApplicationFactory<TStartup> : WebApplicationFactory<TStartup> where TStartup : class
    {
        private readonly string _schemaName;
        
        public TestWebApplicationFactory(string schemaName)
        {
            _schemaName = schemaName;
        }
        
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((context, config) =>
            {
                // Add test-specific configuration
                config.AddInMemoryCollection(new Dictionary<string, string>
                {
                    ["ConnectionStrings:DefaultConnection"] = DatabaseHelper.GetConnectionStringWithSchema(_schemaName)
                });
            });
            
            builder.ConfigureServices(services =>
            {
                // Remove the app's DbContext registration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DapperDbContext));
                    
                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }
                
                // Add DbContext using an in-memory database for testing
                services.AddScoped<DapperDbContext>(provider =>
                {
                    var config = provider.GetRequiredService<IConfiguration>();
                    return new DapperDbContext(config);
                });
                
                // Настраиваем тестовую аутентификацию
                
                // 1. Удаляем существующие сервисы аутентификации
                // services.PostConfigure<AuthenticationOptions>(options =>
                // {
                //     // Очищаем существующие схемы аутентификации
                //     var schemes = options.Schemes.ToList();
                //     foreach (var scheme in schemes)
                //     {
                //         options.RemoveScheme(scheme.Name);
                //     }
                // });
                
                services.AddScoped<IAuthRepository, TestAuthRepository>();
                services.AddScoped<IN8nService, MockN8nService>();
                services.AddScoped<ISendNotification, MockSendNotification>();
                
                // 2. Добавляем тестовую схему аутентификации
                services.AddAuthentication(defaultScheme: "TestScheme")
                    .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                        "TestScheme", options => { });
                
                // 3. Настраиваем используемые схемы аутентификации
                services.PostConfigure<AuthenticationOptions>(options =>
                {
                    options.DefaultAuthenticateScheme = "TestScheme";
                    options.DefaultChallengeScheme = "TestScheme";
                    options.DefaultSignInScheme = "TestScheme";
                });
            });
        }
    }
}