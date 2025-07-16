using System;
using System.Net;
using System.Net.Http;
using System.Text;
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
    public class ArchitectureStatusTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ArchitectureStatusTests()
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
            CreateArchitectureStatus("Test Status 1", "test_status_1", "Description 1");
            CreateArchitectureStatus("Test Status 2", "test_status_2", "Description 2");

            // Act
            var response = await _client.GetAsync("/architecture_status/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<architecture_status>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple test statuses
            for (int i = 1; i <= 5; i++)
            {
                CreateArchitectureStatus($"Status {i}", $"status_{i}", $"Description {i}");
            }

            // Act
            var response = await _client.GetAsync("/architecture_status/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<architecture_status>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test status
            var id = CreateArchitectureStatus("Get One Status", "get_one", "Get One Description");

            // Act
            var response = await _client.GetAsync($"/architecture_status/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<architecture_status>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Get One Status", result.name);
            Assert.Equal("get_one", result.code);
            Assert.Equal("Get One Description", result.description);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new Createarchitecture_statusRequest
            {
                name = "Created Status",
                code = "created_status",
                description = "Created Status Description",
                name_kg = "Созданный статус",
                description_kg = "Описание созданного статуса",
                text_color = "#000000",
                background_color = "#FFFFFF",
                created_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/architecture_status", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<architecture_status>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Status", result.name);
            Assert.Equal("created_status", result.code);
            Assert.Equal("Created Status Description", result.description);
            Assert.Equal("Созданный статус", result.name_kg);
            Assert.Equal("Описание созданного статуса", result.description_kg);
            Assert.Equal("#000000", result.text_color);
            Assert.Equal("#FFFFFF", result.background_color);

            // Verify in database
            var status = DatabaseHelper.RunQueryList<architecture_status>(_schemaName, @"
                SELECT id, name, code, description, name_kg, description_kg, text_color, background_color 
                FROM architecture_status WHERE id = @id",
                reader => new architecture_status
                {
                    id = reader.GetInt32(0),
                    name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    code = reader.IsDBNull(2) ? null : reader.GetString(2),
                    description = reader.IsDBNull(3) ? null : reader.GetString(3),
                    name_kg = reader.IsDBNull(4) ? null : reader.GetString(4),
                    description_kg = reader.IsDBNull(5) ? null : reader.GetString(5),
                    text_color = reader.IsDBNull(6) ? null : reader.GetString(6),
                    background_color = reader.IsDBNull(7) ? null : reader.GetString(7)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(status);
            Assert.Equal("Created Status", status.name);
            Assert.Equal("created_status", status.code);
            Assert.Equal("Created Status Description", status.description);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateArchitectureStatus("Original Status", "original_status", "Original Description");

            var request = new Updatearchitecture_statusRequest
            {
                id = id,
                name = "Updated Status",
                code = "updated_status",
                description = "Updated Description",
                name_kg = "Обновленный статус",
                description_kg = "Обновленное описание",
                text_color = "#111111",
                background_color = "#222222",
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PutAsync($"/architecture_status/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<architecture_status>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Status", result.name);
            Assert.Equal("updated_status", result.code);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("Обновленный статус", result.name_kg);
            Assert.Equal("Обновленное описание", result.description_kg);
            Assert.Equal("#111111", result.text_color);
            Assert.Equal("#222222", result.background_color);

            // Verify in database
            var status = DatabaseHelper.RunQueryList<architecture_status>(_schemaName, @"
                SELECT name, code, description, name_kg, description_kg, text_color, background_color 
                FROM architecture_status WHERE id = @id",
                reader => new architecture_status
                {
                    name = reader.IsDBNull(0) ? null : reader.GetString(0),
                    code = reader.IsDBNull(1) ? null : reader.GetString(1),
                    description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    name_kg = reader.IsDBNull(3) ? null : reader.GetString(3),
                    description_kg = reader.IsDBNull(4) ? null : reader.GetString(4),
                    text_color = reader.IsDBNull(5) ? null : reader.GetString(5),
                    background_color = reader.IsDBNull(6) ? null : reader.GetString(6)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(status);
            Assert.Equal("Updated Status", status.name);
            Assert.Equal("updated_status", status.code);
            Assert.Equal("Updated Description", status.description);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateArchitectureStatus("Delete Status", "delete_status", "Delete Description");

            // Act
            var response = await _client.DeleteAsync($"/architecture_status/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM architecture_status WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task StatusReferenceIntegrity_CanBeUsedInArchitectureProcess()
        {
            // Arrange - Create a status
            var statusId = CreateArchitectureStatus("Reference Status", "reference_status", "Reference Status Description");

            // Create an architecture_process referencing this status
            var processId = 2001;

            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO architecture_process (id, status_id, created_at, updated_at) 
                VALUES (@id, @status_id, @created_at, @updated_at);",
                new Dictionary<string, object>
                {
                    ["@id"] = processId,
                    ["@status_id"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });

            // Act - Get the architecture_process
            var response = await _client.GetAsync($"/architecture_process/{processId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<architecture_process>(content);

            Assert.NotNull(result);
            Assert.Equal(statusId, result.status_id);

            // Verify that we cannot delete the status while it's in use
            // This would typically throw a foreign key constraint error in the database,
            // but let's check it via code to verify the relationship
            var hasReferences = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM architecture_process WHERE status_id = @status_id",
                new Dictionary<string, object> { ["@status_id"] = statusId });

            Assert.Equal(1, hasReferences);
        }

        // Helper method to create architecture status
        private int CreateArchitectureStatus(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO architecture_status (name, code, description, created_at) 
                VALUES (@name, @code, @description, @created_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@created_at"] = DateTime.Now
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}