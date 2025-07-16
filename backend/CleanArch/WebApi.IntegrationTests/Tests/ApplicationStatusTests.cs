using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using WebApi.IntegrationTests.Fixtures;
using WebApi.IntegrationTests.Helpers;
using Domain.Entities;
using Application.Models;
using Xunit;
using System.Collections.Generic;
using System.Net.Http.Json;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ApplicationStatusTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationStatusTests()
        {
            // Create a schema for this test
            _schemaName = DatabaseHelper.CreateTestSchema();

            // Create a client with the schema configured
            var factory = new TestWebApplicationFactory<Program>(_schemaName);
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetAll_ReturnsOkResponse()
        {
            // Arrange - Create test statuses
            CreateApplicationStatus("Test Status 1", "test_status_1", "#FF0000");
            CreateApplicationStatus("Test Status 2", "test_status_2", "#00FF00");
            CreateApplicationStatus("Test Status 3", "test_status_3", "#0000FF");

            // Act
            var response = await _client.GetAsync("/ApplicationStatus/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ApplicationStatus>>(content);

            Assert.NotNull(result);
            Assert.Contains(result, s => s.name == "Test Status 1" && s.code == "test_status_1" && s.status_color == "#FF0000");
            Assert.Contains(result, s => s.name == "Test Status 2" && s.code == "test_status_2" && s.status_color == "#00FF00");
            Assert.Contains(result, s => s.name == "Test Status 3" && s.code == "test_status_3" && s.status_color == "#0000FF");
        }

        // Helper methods to set up test data
        private int CreateApplicationStatus(string name, string code, string statusColor)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_status (name, code, description, status_color, created_at, updated_at) 
                VALUES (@name, @code, @description, @statusColor, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = $"Description for {name}",
                    ["@statusColor"] = statusColor,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}