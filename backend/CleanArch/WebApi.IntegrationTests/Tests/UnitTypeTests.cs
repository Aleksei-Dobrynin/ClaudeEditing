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
    public class UnitTypeTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public UnitTypeTests()
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
            // Arrange - Create test unit types
            int unitTypeId1 = CreateUnitType("Квадратные метры", "kv_m", "square");
            int unitTypeId2 = CreateUnitType("Гектары", "ga", "square");

            // Act
            var response = await _client.GetAsync("/UnitType/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<UnitType>>(content);

            Assert.NotNull(result);
            Assert.Contains(result, u => u.id == unitTypeId1 && u.name == "Квадратные метры" && u.code == "kv_m");
            Assert.Contains(result, u => u.id == unitTypeId2 && u.name == "Гектары" && u.code == "ga");
        }

        [Fact]
        public async Task GetAllSquare_ReturnsOnlySquareTypes()
        {
            // Arrange - Create test unit types of different types
            int squareUnitTypeId1 = CreateUnitType("Квадратные метры", "kv_m", "square");
            int squareUnitTypeId2 = CreateUnitType("Гектары", "ga", "square");
            int personUnitTypeId = CreateUnitType("Человек", "person", "person");
            int valuteUnitTypeId = CreateUnitType("Тысяч сомов", "tys_som", "valuta");

            // Act
            var response = await _client.GetAsync("/UnitType/GetAllSquare");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<UnitType>>(content);

            Assert.NotNull(result);
            Assert.Contains(result, u => u.id == squareUnitTypeId1);
            Assert.Contains(result, u => u.id == squareUnitTypeId2);
            Assert.DoesNotContain(result, u => u.id == personUnitTypeId);
            Assert.DoesNotContain(result, u => u.id == valuteUnitTypeId);
            Assert.All(result, u => Assert.Equal("square", u.type));
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test unit type
            int unitTypeId = CreateUnitType("Штуки", "sht", "piece");

            // Act
            var response = await _client.GetAsync($"/UnitType/{unitTypeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UnitType>(content);

            Assert.NotNull(result);
            Assert.Equal(unitTypeId, result.id);
            Assert.Equal("Штуки", result.name);
            Assert.Equal("sht", result.code);
            Assert.Equal("piece", result.type);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var createRequest = new CreateUnitTypeRequest
            {
                name = "Километры",
                code = "km",
                description = "Единица измерения длины",
                type = "distance"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/UnitType/Create", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UnitType>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(createRequest.name, result.name);
            Assert.Equal(createRequest.code, result.code);
            Assert.Equal(createRequest.description, result.description);
            Assert.Equal(createRequest.type, result.type);
            Assert.NotNull(result.createdAt);
            Assert.NotNull(result.updatedAt);

            // Verify in database
            var unitType = await GetUnitTypeFromDb(result.id);
            Assert.NotNull(unitType);
            Assert.Equal(createRequest.name, unitType.name);
            Assert.Equal(createRequest.code, unitType.code);
            Assert.Equal(createRequest.type, unitType.type);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test unit type
            int unitTypeId = CreateUnitType("Литры", "l", "volume");

            var updateRequest = new UpdateUnitTypeRequest
            {
                id = unitTypeId,
                name = "Кубические метры",
                code = "m3",
                description = "Обновленное описание",
                type = "volume"
            };

            // Act
            var response = await _client.PutAsync($"/UnitType/{unitTypeId}", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UnitType>(content);

            Assert.NotNull(result);
            Assert.Equal(unitTypeId, result.id);
            Assert.Equal(updateRequest.name, result.name);
            Assert.Equal(updateRequest.code, result.code);
            Assert.Equal(updateRequest.description, result.description);
            Assert.Equal(updateRequest.type, result.type);

            // Verify in database
            var unitType = await GetUnitTypeFromDb(unitTypeId);
            Assert.NotNull(unitType);
            Assert.Equal(updateRequest.name, unitType.name);
            Assert.Equal(updateRequest.code, unitType.code);
            Assert.Equal(updateRequest.description, unitType.description);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test unit type
            int unitTypeId = CreateUnitType("Тип для удаления", "delete_type", "test");

            // Act
            var response = await _client.DeleteAsync($"/UnitType/{unitTypeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(unitTypeId, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM unit_type WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = unitTypeId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple test unit types
            for (int i = 0; i < 5; i++)
            {
                CreateUnitType($"Тип {i}", $"type_{i}", "test");
            }

            // Act
            var response = await _client.GetAsync("/UnitType/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<UnitType>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(3, result.pageSize);
        }

        [Fact]
        public async Task UnitType_UsedByUnitForFieldConfig_CanBeRetrieved()
        {
            // Arrange - Create a unit type and link it to a field via unit_for_field_config
            int unitTypeId = CreateUnitType("Метры", "m", "length");
            int fieldId = 1; // Assuming a field with this ID exists or is created
            int unitForFieldConfigId = CreateUnitForFieldConfig(unitTypeId, fieldId);

            // Act - Get the unit type
            var response = await _client.GetAsync($"/UnitType/{unitTypeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UnitType>(content);

            Assert.NotNull(result);
            Assert.Equal(unitTypeId, result.id);

            // Verify relationship exists in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM unit_for_field_config WHERE unit_id = @unit_id",
                new Dictionary<string, object> { ["@unit_id"] = unitTypeId });

            Assert.Equal(1, count);
        }

        #region Helper Methods

        private int CreateUnitType(string name, string code, string type, string description = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO unit_type (name, code, type, description, created_at, updated_at) 
                VALUES (@name, @code, @type, @description, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@type"] = type,
                    ["@description"] = description,
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

        private async Task<UnitType> GetUnitTypeFromDb(int id)
        {
            return DatabaseHelper.RunQueryList<UnitType>(_schemaName, @"
                SELECT id, name, code, description, type, created_at, updated_at, created_by, updated_by
                FROM unit_type
                WHERE id = @id",
                reader => new UnitType
                {
                    id = reader.GetInt32(0),
                    name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    code = reader.IsDBNull(2) ? null : reader.GetString(2),
                    description = reader.IsDBNull(3) ? null : reader.GetString(3),
                    type = reader.IsDBNull(4) ? null : reader.GetString(4),
                    createdAt = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    updatedAt = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                    createdBy = reader.IsDBNull(7) ? null : reader.GetInt32(7),
                    updatedBy = reader.IsDBNull(8) ? null : reader.GetInt32(8)
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