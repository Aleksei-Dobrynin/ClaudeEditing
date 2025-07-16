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
using WebApi.Dtos;
using Newtonsoft.Json.Linq;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class LegalActRegistryStatusTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public LegalActRegistryStatusTests()
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
            CreateLegalActRegistryStatus("Active Status", "active", "Active legal act status", "#28A745", "#FFFFFF");
            CreateLegalActRegistryStatus("Inactive Status", "inactive", "Inactive legal act status", "#DC3545", "#FFFFFF");

            // Act
            var response = await _client.GetAsync("/legal_act_registry_status/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_act_registry_status>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.name == "Active Status" && s.code == "active");
            Assert.Contains(result, s => s.name == "Inactive Status" && s.code == "inactive");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test status
            var id = CreateLegalActRegistryStatus("Single Status", "single", "Single legal act status", "#17A2B8", "#FFFFFF");

            // Act
            var response = await _client.GetAsync($"/legal_act_registry_status/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_act_registry_status>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Status", result.name);
            Assert.Equal("single", result.code);
            Assert.Equal("Single legal act status", result.description);
            Assert.Equal("#17A2B8", result.text_color);
            Assert.Equal("#FFFFFF", result.background_color);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new Createlegal_act_registry_statusRequest
            {
                name = "Created Status",
                name_kg = "Created Status KG",
                code = "created",
                description = "Created legal act status",
                description_kg = "Created legal act status KG",
                text_color = "#FFC107",
                background_color = "#000000"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/legal_act_registry_status", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_act_registry_status>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Status", result.name);
            Assert.Equal("Created Status KG", result.name_kg);
            Assert.Equal("created", result.code);
            Assert.Equal("Created legal act status", result.description);
            Assert.Equal("Created legal act status KG", result.description_kg);
            Assert.Equal("#FFC107", result.text_color);
            Assert.Equal("#000000", result.background_color);

            // Verify in database
            var status = DatabaseHelper.RunQueryList<legal_act_registry_status>(_schemaName, @"
                SELECT id, name, name_kg, code, description, description_kg, text_color, background_color
                FROM legal_act_registry_status WHERE id = @id",
                reader => new legal_act_registry_status
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    name_kg = reader.GetString(2),
                    code = reader.GetString(3),
                    description = reader.GetString(4),
                    description_kg = reader.GetString(5),
                    text_color = reader.GetString(6),
                    background_color = reader.GetString(7)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(status);
            Assert.Equal(result.id, status.id);
            Assert.Equal("Created Status", status.name);
            Assert.Equal("created", status.code);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateLegalActRegistryStatus("Original Status", "original", "Original description", "#6C757D", "#FFFFFF");

            var request = new Updatelegal_act_registry_statusRequest
            {
                id = id,
                name = "Updated Status",
                name_kg = "Updated Status KG",
                code = "updated",
                description = "Updated description",
                description_kg = "Updated description KG",
                text_color = "#007BFF",
                background_color = "#F8F9FA"
            };

            // Act
            var response = await _client.PutAsync($"/legal_act_registry_status/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_act_registry_status>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Status", result.name);
            Assert.Equal("Updated Status KG", result.name_kg);
            Assert.Equal("updated", result.code);
            Assert.Equal("Updated description", result.description);
            Assert.Equal("Updated description KG", result.description_kg);
            Assert.Equal("#007BFF", result.text_color);
            Assert.Equal("#F8F9FA", result.background_color);

            // Verify in database
            var status = DatabaseHelper.RunQueryList<legal_act_registry_status>(_schemaName, @"
                SELECT name, code, description, text_color, background_color 
                FROM legal_act_registry_status WHERE id = @id",
                reader => new legal_act_registry_status
                {
                    name = reader.GetString(0),
                    code = reader.GetString(1),
                    description = reader.GetString(2),
                    text_color = reader.GetString(3),
                    background_color = reader.GetString(4)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(status);
            Assert.Equal("Updated Status", status.name);
            Assert.Equal("updated", status.code);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateLegalActRegistryStatus("Status to Delete", "to_delete", "Status to be deleted", "#DC3545", "#FFFFFF");

            // Act
            var response = await _client.DeleteAsync($"/legal_act_registry_status/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM legal_act_registry_status WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test statuses
            for (int i = 1; i <= 5; i++)
            {
                CreateLegalActRegistryStatus($"Paginated Status {i}", $"paginated_{i}", $"Paginated description {i}", "#17A2B8", "#FFFFFF");
            }

            // Act
            var response = await _client.GetAsync("/legal_act_registry_status/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<legal_act_registry_status>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            // The total count might vary depending on what's already in the database
        }

        // Helper method to create test status
        private int CreateLegalActRegistryStatus(string name, string code, string description, string textColor, string backgroundColor)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_act_registry_status (name, code, description, text_color, background_color, created_at, updated_at) 
                VALUES (@name, @code, @description, @textColor, @backgroundColor, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@textColor"] = textColor,
                    ["@backgroundColor"] = backgroundColor,
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