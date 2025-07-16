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
    public class StructureReportConfigTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public StructureReportConfigTests()
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
            // Arrange - Create test structures and configs
            var structureId1 = CreateOrgStructure("Test Structure 1", "1.0", true);
            var structureId2 = CreateOrgStructure("Test Structure 2", "1.0", true);

            CreateStructureReportConfig("Test Config 1", true, structureId1);
            CreateStructureReportConfig("Test Config 2", true, structureId2);

            // Act
            var response = await _client.GetAsync("/StructureReportConfig/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<StructureReportConfig>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, c => c.name == "Test Config 1" && c.structureId == structureId1);
            Assert.Contains(result, c => c.name == "Test Config 2" && c.structureId == structureId2);
        }

        [Fact]
        public async Task GetByIdStructure_ReturnsOkResponse()
        {
            // Arrange - Create test structure and multiple configs for it
            var structureId = CreateOrgStructure("Test Structure", "1.0", true);

            CreateStructureReportConfig("Test Config 1", true, structureId);
            CreateStructureReportConfig("Test Config 2", true, structureId);

            // Create another structure with config to verify filtering
            var otherStructureId = CreateOrgStructure("Other Structure", "1.0", true);
            CreateStructureReportConfig("Other Config", true, otherStructureId);

            // Act
            var response = await _client.GetAsync($"/StructureReportConfig/GetbyidStructure?idStructure={structureId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<StructureReportConfig>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, c => Assert.Equal(structureId, c.structureId));
            Assert.Contains(result, c => c.name == "Test Config 1");
            Assert.Contains(result, c => c.name == "Test Config 2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test structure and config
            var structureId = CreateOrgStructure("Single Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Single Config", true, structureId);

            // Act
            var response = await _client.GetAsync($"/StructureReportConfig/{configId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReportConfig>(content);

            Assert.NotNull(result);
            Assert.Equal(configId, result.id);
            Assert.Equal("Single Config", result.name);
            Assert.Equal(structureId, result.structureId);
            Assert.True(result.isActive);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Create Structure", "1.0", true);

            var request = new CreateStructureReportConfigRequest
            {
                name = "Created Config",
                isActive = true,
                structureId = structureId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/StructureReportConfig/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReportConfig>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Config", result.name);
            Assert.Equal(structureId, result.structureId);
            Assert.True(result.isActive);
            Assert.NotNull(result.createdAt);
            Assert.NotNull(result.updatedAt);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Update Original Structure", "1.0", true);
            var newStructureId = CreateOrgStructure("Update New Structure", "1.0", true);

            var configId = CreateStructureReportConfig("Original Config", true, structureId);

            var request = new UpdateStructureReportConfigRequest
            {
                id = configId,
                name = "Updated Config",
                isActive = false,
                structureId = newStructureId
            };

            // Act
            var response = await _client.PutAsync($"/StructureReportConfig/{configId}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReportConfig>(content);

            Assert.NotNull(result);
            Assert.Equal(configId, result.id);
            Assert.Equal("Updated Config", result.name);
            Assert.Equal(newStructureId, result.structureId);
            Assert.False(result.isActive);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Delete Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Config to Delete", true, structureId);

            // Act
            var response = await _client.DeleteAsync($"/StructureReportConfig/{configId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(configId, deletedId);

            // Verify in database that the config has been deleted
            var configCount = DatabaseHelper.RunQuery<int>(_schemaName,
                @"SELECT COUNT(*) FROM structure_report_config WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = configId });

            Assert.Equal(0, configCount);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple configs
            var structureId = CreateOrgStructure("Paginated Structure", "1.0", true);

            for (int i = 1; i <= 5; i++)
            {
                CreateStructureReportConfig($"Paginated Config {i}", true, structureId);
            }

            // Act
            var response = await _client.GetAsync("/StructureReportConfig/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<StructureReportConfig>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        // Helper methods to create test data
        private int CreateOrgStructure(string name, string version, bool isActive)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, version, is_active, date_start, created_at, updated_at)
                VALUES (@name, @version, @isActive, @dateStart, @createdAt, @updatedAt)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@version"] = version,
                    ["@isActive"] = isActive,
                    ["@dateStart"] = DateTime.Now,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateStructureReportConfig(string name, bool? isActive, int structureId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO structure_report_config (name, is_active, structure_id, created_at, updated_at)
                VALUES (@name, @isActive, @structureId, @createdAt, @updatedAt)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@isActive"] = isActive as object ?? DBNull.Value,
                    ["@structureId"] = structureId,
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