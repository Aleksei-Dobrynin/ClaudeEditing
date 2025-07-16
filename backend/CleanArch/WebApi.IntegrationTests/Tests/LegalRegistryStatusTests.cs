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
    public class LegalRegistryStatusTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public LegalRegistryStatusTests()
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
            CreateLegalRegistryStatus("Active", "active", "Active status", "Активный статус", "#28A745", "#FFFFFF");
            CreateLegalRegistryStatus("Inactive", "inactive", "Inactive status", "Неактивный статус", "#DC3545", "#FFFFFF");

            // Act
            var response = await _client.GetAsync("/legal_registry_status/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_registry_status>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.name == "Active" && s.code == "active");
            Assert.Contains(result, s => s.name == "Inactive" && s.code == "inactive");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test status
            var id = CreateLegalRegistryStatus("Single Status", "single_status", "Single status description",
                "Описание одиночного статуса", "#FFC107", "#000000");

            // Act
            var response = await _client.GetAsync($"/legal_registry_status/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_registry_status>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Status", result.name);
            Assert.Equal("single_status", result.code);
            Assert.Equal("Single status description", result.description);
            Assert.Equal("Описание одиночного статуса", result.description_kg);
            Assert.Equal("#FFC107", result.text_color);
            Assert.Equal("#000000", result.background_color);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new Createlegal_registry_statusRequest
            {
                name = "Created Status",
                code = "created_status",
                description = "Created status description",
                description_kg = "Созданный статус",
                text_color = "#6edef0",
                background_color = "#ffffff",
                name_kg = "Созданный статус"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/legal_registry_status", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_registry_status>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Status", result.name);
            Assert.Equal("created_status", result.code);
            Assert.Equal("Created status description", result.description);
            Assert.Equal("Созданный статус", result.description_kg);
            Assert.Equal("#6edef0", result.text_color);
            Assert.Equal("#ffffff", result.background_color);
            Assert.Equal("Созданный статус", result.name_kg);

            // Verify in database
            var status = DatabaseHelper.RunQueryList<legal_registry_status>(_schemaName, @"
                SELECT * FROM legal_registry_status WHERE id = @id",
                reader => new legal_registry_status
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    name = reader.IsDBNull(reader.GetOrdinal("name")) ? null : reader.GetString(reader.GetOrdinal("name")),
                    code = reader.IsDBNull(reader.GetOrdinal("code")) ? null : reader.GetString(reader.GetOrdinal("code")),
                    description = reader.IsDBNull(reader.GetOrdinal("description")) ? null : reader.GetString(reader.GetOrdinal("description")),
                    description_kg = reader.IsDBNull(reader.GetOrdinal("description_kg")) ? null : reader.GetString(reader.GetOrdinal("description_kg")),
                    text_color = reader.IsDBNull(reader.GetOrdinal("text_color")) ? null : reader.GetString(reader.GetOrdinal("text_color")),
                    background_color = reader.IsDBNull(reader.GetOrdinal("background_color")) ? null : reader.GetString(reader.GetOrdinal("background_color")),
                    name_kg = reader.IsDBNull(reader.GetOrdinal("name_kg")) ? null : reader.GetString(reader.GetOrdinal("name_kg"))
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(status);
            Assert.Equal(result.id, status.id);
            Assert.Equal("Created Status", status.name);
            Assert.Equal("created_status", status.code);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateLegalRegistryStatus("Original Status", "original_status", "Original description",
                "Оригинальное описание", "#28A745", "#FFFFFF");

            var request = new Updatelegal_registry_statusRequest
            {
                id = id,
                name = "Updated Status",
                code = "updated_status",
                description = "Updated description",
                description_kg = "Обновленное описание",
                text_color = "#DC3545",
                background_color = "#000000",
                name_kg = "Обновленный статус"
            };

            // Act
            var response = await _client.PutAsync($"/legal_registry_status/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_registry_status>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Status", result.name);
            Assert.Equal("updated_status", result.code);
            Assert.Equal("Updated description", result.description);
            Assert.Equal("Обновленное описание", result.description_kg);
            Assert.Equal("#DC3545", result.text_color);
            Assert.Equal("#000000", result.background_color);
            Assert.Equal("Обновленный статус", result.name_kg);

            // Verify in database
            var status = DatabaseHelper.RunQueryList<legal_registry_status>(_schemaName, @"
                SELECT name, code, description, description_kg, text_color, background_color, name_kg 
                FROM legal_registry_status WHERE id = @id",
                reader => new legal_registry_status
                {
                    name = reader.IsDBNull(0) ? null : reader.GetString(0),
                    code = reader.IsDBNull(1) ? null : reader.GetString(1),
                    description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    description_kg = reader.IsDBNull(3) ? null : reader.GetString(3),
                    text_color = reader.IsDBNull(4) ? null : reader.GetString(4),
                    background_color = reader.IsDBNull(5) ? null : reader.GetString(5),
                    name_kg = reader.IsDBNull(6) ? null : reader.GetString(6)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(status);
            Assert.Equal("Updated Status", status.name);
            Assert.Equal("updated_status", status.code);
            Assert.Equal("Updated description", status.description);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateLegalRegistryStatus("Delete Status", "delete_status", "Status to delete",
                "Статус для удаления", "#FFC107", "#000000");

            // Act
            var response = await _client.DeleteAsync($"/legal_registry_status/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM legal_registry_status WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test statuses
            for (int i = 1; i <= 5; i++)
            {
                CreateLegalRegistryStatus($"Status {i}", $"status_{i}", $"Description {i}",
                    $"Описание {i}", "#28A745", "#FFFFFF");
            }

            // Act
            var response = await _client.GetAsync("/legal_registry_status/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<legal_registry_status>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        // Helper method to create test statuses
        private int CreateLegalRegistryStatus(string name, string code, string description, string descriptionKg,
            string textColor, string backgroundColor)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_registry_status (name, code, description, description_kg, text_color, background_color, name_kg, created_at, updated_at) 
                VALUES (@name, @code, @description, @description_kg, @text_color, @background_color, @name_kg, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@description_kg"] = descriptionKg,
                    ["@text_color"] = textColor,
                    ["@background_color"] = backgroundColor,
                    ["@name_kg"] = descriptionKg,
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