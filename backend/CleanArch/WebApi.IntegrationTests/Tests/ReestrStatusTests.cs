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
    public class ReestrStatusTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ReestrStatusTests()
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
            CreateReestrStatus("Test Status 1", "Status description 1", "test_code_1");
            CreateReestrStatus("Test Status 2", "Status description 2", "test_code_2");

            // Act
            var response = await _client.GetAsync("/reestr_status/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<reestr_status>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.name == "Test Status 1" && s.code == "test_code_1");
            Assert.Contains(result, s => s.name == "Test Status 2" && s.code == "test_code_2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test status
            var id = CreateReestrStatus("Single Status", "Single description", "single_code");

            // Act
            var response = await _client.GetAsync($"/reestr_status/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<reestr_status>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Status", result.name);
            Assert.Equal("Single description", result.description);
            Assert.Equal("single_code", result.code);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new Createreestr_statusRequest
            {
                name = "Created Status",
                description = "Created description",
                code = "created_code"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/reestr_status", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<reestr_status>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Status", result.name);
            Assert.Equal("Created description", result.description);
            Assert.Equal("created_code", result.code);
            Assert.NotNull(result.created_at);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateReestrStatus("Original Status", "Original description", "original_code");

            var request = new Updatereestr_statusRequest
            {
                id = id,
                name = "Updated Status",
                description = "Updated description",
                code = "updated_code"
            };

            // Act
            var response = await _client.PutAsync($"/reestr_status/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<reestr_status>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Status", result.name);
            Assert.Equal("Updated description", result.description);
            Assert.Equal("updated_code", result.code);
            Assert.NotNull(result.updated_at);

            // Verify database update
            var updatedStatus = await GetReestrStatusFromDb(id);
            Assert.Equal("Updated Status", updatedStatus.name);
            Assert.Equal("updated_code", updatedStatus.code);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateReestrStatus("Delete Status", "Delete description", "delete_code");

            // Act
            var response = await _client.DeleteAsync($"/reestr_status/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM reestr_status WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple statuses
            for (int i = 1; i <= 5; i++)
            {
                CreateReestrStatus($"Status {i}", $"Description {i}", $"code_{i}");
            }

            // Act
            var response = await _client.GetAsync("/reestr_status/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<reestr_status>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        // Helper methods
        private int CreateReestrStatus(string name, string description, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO reestr_status (name, description, code, created_at, updated_at) 
                VALUES (@name, @description, @code, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@code"] = code,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<reestr_status> GetReestrStatusFromDb(int id)
        {
            return DatabaseHelper.RunQueryList<reestr_status>(_schemaName, @"
                SELECT id, name, description, code, created_at, updated_at, created_by, updated_by
                FROM reestr_status 
                WHERE id = @id",
                reader => new reestr_status
                {
                    id = reader.GetInt32(0),
                    name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    code = reader.IsDBNull(3) ? null : reader.GetString(3),
                    created_at = reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                    updated_at = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    created_by = reader.IsDBNull(6) ? null : reader.GetInt32(6),
                    updated_by = reader.IsDBNull(7) ? null : reader.GetInt32(7)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}