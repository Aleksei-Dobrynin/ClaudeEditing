using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using WebApi.IntegrationTests.Fixtures;
using WebApi.IntegrationTests.Helpers;
using Domain.Entities;
using Xunit;
using System.Collections.Generic;
using System.Net.Http.Json;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class CountryControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public CountryControllerTests()
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
            // Arrange - Create test countries
            CreateCountry("Kyrgyzstan", "KG", "KGZ", true);
            CreateCountry("United States", "US", "USA", false);
            CreateCountry("Germany", "DE", "DEU", false);

            // Act
            var response = await _client.GetAsync("/Country/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<Country>>(content);

            Assert.NotNull(result);
            // Check that expected items are in the result
            Assert.Contains(result, c => c.name == "Kyrgyzstan" && c.code == "KG" && c.iso_code == "KGZ" && c.is_default == true);
            Assert.Contains(result, c => c.name == "United States" && c.code == "US" && c.iso_code == "USA");
            Assert.Contains(result, c => c.name == "Germany" && c.code == "DE" && c.iso_code == "DEU");
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test country
            var id = CreateCountry("France", "FR", "FRA", false);

            // Act
            var response = await _client.GetAsync($"/Country/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Country>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("France", result.name);
            Assert.Equal("FR", result.code);
            Assert.Equal("FRA", result.iso_code);
            Assert.False(result.is_default);
        }

        [Fact]
        public async Task GetOne_WithInvalidId_ReturnsNullOrEmptyContent()
        {
            // Arrange - Use non-existent ID
            var nonExistentId = 9999;

            // Act
            var response = await _client.GetAsync($"/Country/{nonExistentId}");

            // Assert
            response.EnsureSuccessStatusCode(); // Still returns 200 OK
            var content = await response.Content.ReadAsStringAsync();

            // The content could be null, empty, or a JSON null representation
            Assert.True(string.IsNullOrEmpty(content) || content == "null");
        }

        // Helper methods to create test data
        private int CreateCountry(string name, string code, string isoCode, bool isDefault)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO country (name, code, is_default, iso_code, created_at, updated_at) 
                VALUES (@name, @code, @is_default, @iso_code, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@is_default"] = isDefault,
                    ["@iso_code"] = isoCode,
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