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
    public class StructureReportStatusTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public StructureReportStatusTests()
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
            CreateStructureReportStatus("Status 1", "status1", "Description for status 1");
            CreateStructureReportStatus("Status 2", "status2", "Description for status 2");

            // Act
            var response = await _client.GetAsync("/StructureReportStatus/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<StructureReportStatus>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.name == "Status 1" && s.code == "status1");
            Assert.Contains(result, s => s.name == "Status 2" && s.code == "status2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create a test status
            var id = CreateStructureReportStatus("Single Status", "single_status", "Description for single status");

            // Act
            var response = await _client.GetAsync($"/StructureReportStatus/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReportStatus>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Status", result.name);
            Assert.Equal("single_status", result.code);
            Assert.Equal("Description for single status", result.description);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateStructureReportStatusRequest
            {
                name = "Created Status",
                code = "created_status",
                description = "Description for created status"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/StructureReportStatus/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReportStatus>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Status", result.name);
            Assert.Equal("created_status", result.code);
            Assert.Equal("Description for created status", result.description);
            Assert.NotNull(result.createdAt);
            Assert.NotNull(result.updatedAt);

            // Verify in database
            var storedStatus = DatabaseHelper.RunQueryList<StructureReportStatus>(_schemaName,
                @"SELECT id, name, code, description FROM structure_report_status WHERE id = @id",
                reader => new StructureReportStatus
                {
                    id = reader.GetInt32(0),
                    name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    code = reader.IsDBNull(2) ? null : reader.GetString(2),
                    description = reader.IsDBNull(3) ? null : reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(storedStatus);
            Assert.Equal(result.id, storedStatus.id);
            Assert.Equal("Created Status", storedStatus.name);
            Assert.Equal("created_status", storedStatus.code);
            Assert.Equal("Description for created status", storedStatus.description);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateStructureReportStatus("Original Status", "original_status", "Original description");

            var request = new UpdateStructureReportStatusRequest
            {
                id = id,
                name = "Updated Status",
                code = "updated_status",
                description = "Updated description"
            };

            // Act
            var response = await _client.PutAsync($"/StructureReportStatus/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReportStatus>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Status", result.name);
            Assert.Equal("updated_status", result.code);
            Assert.Equal("Updated description", result.description);

            // Verify in database
            var storedStatus = DatabaseHelper.RunQueryList<StructureReportStatus>(_schemaName,
                @"SELECT name, code, description FROM structure_report_status WHERE id = @id",
                reader => new StructureReportStatus
                {
                    name = reader.IsDBNull(0) ? null : reader.GetString(0),
                    code = reader.IsDBNull(1) ? null : reader.GetString(1),
                    description = reader.IsDBNull(2) ? null : reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(storedStatus);
            Assert.Equal("Updated Status", storedStatus.name);
            Assert.Equal("updated_status", storedStatus.code);
            Assert.Equal("Updated description", storedStatus.description);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateStructureReportStatus("Status to Delete", "delete_status", "Description for status to delete");

            // Act
            var response = await _client.DeleteAsync($"/StructureReportStatus/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database that the status has been deleted
            var statusCount = DatabaseHelper.RunQuery<int>(_schemaName,
                @"SELECT COUNT(*) FROM structure_report_status WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, statusCount);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple statuses
            for (int i = 1; i <= 5; i++)
            {
                CreateStructureReportStatus($"Paginated Status {i}", $"paginated_status_{i}", $"Description for paginated status {i}");
            }

            // Act
            var response = await _client.GetAsync("/StructureReportStatus/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<StructureReportStatus>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        // Helper methods to create test data
        private int CreateStructureReportStatus(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO structure_report_status (name, code, description, created_at, updated_at)
                VALUES (@name, @code, @description, @createdAt, @updatedAt)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}