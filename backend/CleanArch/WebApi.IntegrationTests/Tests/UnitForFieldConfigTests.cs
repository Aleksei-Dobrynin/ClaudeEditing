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

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class UnitForFieldConfigTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public UnitForFieldConfigTests()
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
            // Arrange - Create prerequisites
            var (unitId1, fieldId1) = CreatePrerequisites();
            var (unitId2, fieldId2) = CreatePrerequisites();

            // Create unit_for_field_config entries
            int configId1 = CreateUnitForFieldConfig(unitId1, fieldId1);
            int configId2 = CreateUnitForFieldConfig(unitId2, fieldId2);

            // Act
            var response = await _client.GetAsync("/UnitForFieldConfig/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<UnitForFieldConfig>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, c => c.id == configId1 && c.unitId == unitId1 && c.fieldId == fieldId1);
            Assert.Contains(result, c => c.id == configId2 && c.unitId == unitId2 && c.fieldId == fieldId2);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites
            var (unitId, fieldId) = CreatePrerequisites();

            // Create unit_for_field_config entry
            int configId = CreateUnitForFieldConfig(unitId, fieldId);

            // Act
            var response = await _client.GetAsync($"/UnitForFieldConfig/{configId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UnitForFieldConfig>(content);

            Assert.NotNull(result);
            Assert.Equal(configId, result.id);
            Assert.Equal(unitId, result.unitId);
            Assert.Equal(fieldId, result.fieldId);
            Assert.NotNull(result.createdAt);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites
            var (unitId, fieldId) = CreatePrerequisites();

            var createRequest = new CreateUnitForFieldConfigRequest
            {
                unitId = unitId,
                fieldId = fieldId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/UnitForFieldConfig/Create", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UnitForFieldConfig>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(unitId, result.unitId);
            Assert.Equal(fieldId, result.fieldId);
            Assert.NotNull(result.createdAt);
            Assert.NotNull(result.updatedAt);

            // Verify in database
            var config = await GetUnitForFieldConfigFromDb(result.id);
            Assert.NotNull(config);
            Assert.Equal(unitId, config.unitId);
            Assert.Equal(fieldId, config.fieldId);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create original prerequisites and config
            var (originalUnitId, originalFieldId) = CreatePrerequisites();
            int configId = CreateUnitForFieldConfig(originalUnitId, originalFieldId);

            // Create new prerequisites for update
            var (newUnitId, newFieldId) = CreatePrerequisites();

            var updateRequest = new UpdateUnitForFieldConfigRequest
            {
                id = configId,
                unitId = newUnitId,
                fieldId = newFieldId
            };

            // Act
            var response = await _client.PutAsync($"/UnitForFieldConfig/{configId}", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UnitForFieldConfig>(content);

            Assert.NotNull(result);
            Assert.Equal(configId, result.id);
            Assert.Equal(newUnitId, result.unitId);
            Assert.Equal(newFieldId, result.fieldId);

            // Verify in database
            var config = await GetUnitForFieldConfigFromDb(configId);
            Assert.NotNull(config);
            Assert.Equal(newUnitId, config.unitId);
            Assert.Equal(newFieldId, config.fieldId);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites
            var (unitId, fieldId) = CreatePrerequisites();

            // Create unit_for_field_config entry
            int configId = CreateUnitForFieldConfig(unitId, fieldId);

            // Act
            var response = await _client.DeleteAsync($"/UnitForFieldConfig/{configId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(configId, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM unit_for_field_config WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = configId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites and multiple configs
            for (int i = 0; i < 5; i++)
            {
                var (unitId, fieldId) = CreatePrerequisites();
                CreateUnitForFieldConfig(unitId, fieldId);
            }

            // Act
            var response = await _client.GetAsync("/UnitForFieldConfig/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<UnitForFieldConfig>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(3, result.pageSize);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(2, result.totalPages);
        }

        [Fact]
        public async Task GetByidFieldConfig_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites
            var (unitId1, fieldId) = CreatePrerequisites();
            var (unitId2, _) = CreatePrerequisites();
            var (unitId3, _) = CreatePrerequisites();

            // Create multiple unit_for_field_config entries for the same field
            int configId1 = CreateUnitForFieldConfig(unitId1, fieldId);
            int configId2 = CreateUnitForFieldConfig(unitId2, fieldId);

            // Create a config for a different field
            var (_, differentFieldId) = CreatePrerequisites();
            int configId3 = CreateUnitForFieldConfig(unitId3, differentFieldId);

            // Act
            var response = await _client.GetAsync($"/UnitForFieldConfig/GetByidFieldConfig?idFieldConfig={fieldId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<UnitForFieldConfig>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, c => c.id == configId1);
            Assert.Contains(result, c => c.id == configId2);
            Assert.DoesNotContain(result, c => c.id == configId3);
            Assert.All(result, c => Assert.Equal(fieldId, c.fieldId));
        }

        #region Helper Methods

        private (int unitId, int fieldId) CreatePrerequisites()
        {
            // Create a unit type
            int unitId = CreateUnitType($"Unit {Guid.NewGuid().ToString().Substring(0, 8)}",
                $"unit_{Guid.NewGuid().ToString().Substring(0, 8)}",
                "test");

            // For simplicity, we'll just use an incrementing number for field IDs
            // In a real scenario, this might be a reference to an actual field table
            int fieldId = new Random().Next(1, 1000);

            return (unitId, fieldId);
        }

        private int CreateUnitType(string name, string code, string type)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO unit_type (name, code, type, created_at, updated_at) 
                VALUES (@name, @code, @type, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@type"] = type,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateUnitForFieldConfig(int unitId, int fieldId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO unit_for_field_config (unit_id, field_id, created_at, updated_at) 
                VALUES (@unit_id, @field_id, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@unit_id"] = unitId,
                    ["@field_id"] = fieldId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<UnitForFieldConfig> GetUnitForFieldConfigFromDb(int id)
        {
            return DatabaseHelper.RunQueryList<UnitForFieldConfig>(_schemaName, @"
                SELECT id, unit_id, field_id, created_at, updated_at, created_by, updated_by
                FROM unit_for_field_config
                WHERE id = @id",
                reader => new UnitForFieldConfig
                {
                    id = reader.GetInt32(0),
                    unitId = reader.GetInt32(1),
                    fieldId = reader.GetInt32(2),
                    createdAt = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    updatedAt = reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                    createdBy = reader.IsDBNull(5) ? null : reader.GetInt32(5),
                    updatedBy = reader.IsDBNull(6) ? null : reader.GetInt32(6)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        #endregion

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}