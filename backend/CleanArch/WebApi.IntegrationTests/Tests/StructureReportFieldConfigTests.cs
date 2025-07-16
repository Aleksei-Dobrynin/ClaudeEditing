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
    public class StructureReportFieldConfigTests : IDisposable
    {
        // Класс для маппинга полей из БД
        public class StructureReportFieldConfig
        {
            public int id { get; set; }
            public int structureReportId { get; set; }
            public string? fieldName { get; set; }
            public string? reportItem { get; set; }
            public DateTime? createdAt { get; set; }
            public DateTime? updatedAt { get; set; }
            public int? createdBy { get; set; }
            public int? updatedBy { get; set; }
            public List<int> unitTypes { get; set; } = new List<int>();
        }
    
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public StructureReportFieldConfigTests()
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
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Test Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Test Config", structureId, true);
            var unitTypeId1 = CreateUnitType("sq.m", "sqm", "square");
            var unitTypeId2 = CreateUnitType("pieces", "pcs", "piece");

            var fieldConfigId1 = CreateStructureReportFieldConfig(configId, "Field 1", "Item 1", new List<int> { unitTypeId1 });
            var fieldConfigId2 = CreateStructureReportFieldConfig(configId, "Field 2", "Item 2", new List<int> { unitTypeId1, unitTypeId2 });

            // Act
            var response = await _client.GetAsync("/StructureReportFieldConfig/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<StructureReportFieldConfig>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            // Verify that unit types are populated
            var fieldConfig1 = result.FirstOrDefault(f => f.id == fieldConfigId1);
            Assert.NotNull(fieldConfig1);
            Assert.NotNull(fieldConfig1.unitTypes);
            Assert.Single(fieldConfig1.unitTypes);
            Assert.Contains(unitTypeId1, fieldConfig1.unitTypes);

            var fieldConfig2 = result.FirstOrDefault(f => f.id == fieldConfigId2);
            Assert.NotNull(fieldConfig2);
            Assert.NotNull(fieldConfig2.unitTypes);
            Assert.Equal(2, fieldConfig2.unitTypes.Count);
            Assert.Contains(unitTypeId1, fieldConfig2.unitTypes);
            Assert.Contains(unitTypeId2, fieldConfig2.unitTypes);
        }

        [Fact]
        public async Task GetByidReportConfig_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Test Structure", "1.0", true);
            var configId1 = CreateStructureReportConfig("Test Config 1", structureId, true);
            var configId2 = CreateStructureReportConfig("Test Config 2", structureId, true);

            var unitTypeId = CreateUnitType("sq.m", "sqm", "square");

            var fieldConfigId1 = CreateStructureReportFieldConfig(configId1, "Field 1", "Item 1", new List<int> { unitTypeId });
            var fieldConfigId2 = CreateStructureReportFieldConfig(configId1, "Field 2", "Item 2", new List<int> { unitTypeId });
            var fieldConfigId3 = CreateStructureReportFieldConfig(configId2, "Field 3", "Item 3", new List<int> { unitTypeId });

            // Act
            var response = await _client.GetAsync($"/StructureReportFieldConfig/GetByidReportConfig?idReportConfig={configId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<StructureReportFieldConfig>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(configId1, item.structureReportId));
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Test Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Test Config", structureId, true);
            var unitTypeId1 = CreateUnitType("sq.m", "sqm", "square");
            var unitTypeId2 = CreateUnitType("pieces", "pcs", "piece");

            var fieldConfigId = CreateStructureReportFieldConfig(configId, "Test Field", "Test Item", new List<int> { unitTypeId1, unitTypeId2 });

            // Act
            var response = await _client.GetAsync($"/StructureReportFieldConfig/{fieldConfigId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReportFieldConfig>(content);

            Assert.NotNull(result);
            Assert.Equal(fieldConfigId, result.id);
            Assert.Equal(configId, result.structureReportId);
            Assert.Equal("Test Field", result.fieldName);
            Assert.Equal("Test Item", result.reportItem);
            Assert.NotNull(result.unitTypes);
            Assert.Equal(2, result.unitTypes.Count);
            Assert.Contains(unitTypeId1, result.unitTypes);
            Assert.Contains(unitTypeId2, result.unitTypes);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Create Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Create Config", structureId, true);
            var unitTypeId1 = CreateUnitType("liters", "l", "volume");
            var unitTypeId2 = CreateUnitType("kilograms", "kg", "weight");

            var request = new CreateStructureReportFieldConfigRequest
            {
                structureReportId = configId,
                fieldName = "Created Field",
                reportItem = "Created Item",
                unitTypes = new List<int> { unitTypeId1, unitTypeId2 }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/StructureReportFieldConfig/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReportFieldConfig>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(configId, result.structureReportId);
            Assert.Equal("Created Field", result.fieldName);
            Assert.Equal("Created Item", result.reportItem);
            Assert.NotNull(result.unitTypes);
            Assert.Equal(2, result.unitTypes.Count);
            Assert.Contains(unitTypeId1, result.unitTypes);
            Assert.Contains(unitTypeId2, result.unitTypes);

            // Verify in database
            var fieldConfig = GetStructureReportFieldConfigWithUnitTypes(result.id);
            Assert.NotNull(fieldConfig);
            Assert.Equal("Created Field", fieldConfig.fieldName);
            Assert.Equal(2, fieldConfig.unitTypes.Count);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Update Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Update Config", structureId, true);

            var originalUnitTypeId1 = CreateUnitType("meters", "m", "length");
            var originalUnitTypeId2 = CreateUnitType("tons", "t", "weight");
            var newUnitTypeId = CreateUnitType("percent", "%", "percent");

            var fieldConfigId = CreateStructureReportFieldConfig(configId, "Original Field", "Original Item",
                new List<int> { originalUnitTypeId1, originalUnitTypeId2 });

            var request = new UpdateStructureReportFieldConfigRequest
            {
                id = fieldConfigId,
                structureReportId = configId,
                fieldName = "Updated Field",
                reportItem = "Updated Item",
                unitTypes = new List<int> { originalUnitTypeId1, newUnitTypeId } // remove originalUnitTypeId2, add newUnitTypeId
            };

            // Act
            var response = await _client.PutAsync($"/StructureReportFieldConfig/{fieldConfigId}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReportFieldConfig>(content);

            Assert.NotNull(result);
            Assert.Equal(fieldConfigId, result.id);
            Assert.Equal("Updated Field", result.fieldName);
            Assert.Equal("Updated Item", result.reportItem);
            Assert.NotNull(result.unitTypes);
            Assert.Equal(2, result.unitTypes.Count);
            Assert.Contains(originalUnitTypeId1, result.unitTypes);
            Assert.Contains(newUnitTypeId, result.unitTypes);
            Assert.DoesNotContain(originalUnitTypeId2, result.unitTypes);

            // Verify in database
            var updatedFieldConfig = GetStructureReportFieldConfigWithUnitTypes(fieldConfigId);
            Assert.NotNull(updatedFieldConfig);
            Assert.Equal("Updated Field", updatedFieldConfig.fieldName);
            Assert.Equal(2, updatedFieldConfig.unitTypes.Count);
            Assert.Contains(originalUnitTypeId1, updatedFieldConfig.unitTypes);
            Assert.Contains(newUnitTypeId, updatedFieldConfig.unitTypes);
            Assert.DoesNotContain(originalUnitTypeId2, updatedFieldConfig.unitTypes);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM structure_report_field_config WHERE id > 0;");
            var structureId = CreateOrgStructure("Delete Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Delete Config", structureId, true);
            var unitTypeId = CreateUnitType("hours", "h", "time");

            var fieldConfigId = CreateStructureReportFieldConfig(configId, "Field to Delete", "Item to Delete", new List<int> { unitTypeId });

            // Act
            var response = await _client.DeleteAsync($"/StructureReportFieldConfig/{fieldConfigId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(fieldConfigId, result);

            // Verify field config was deleted
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM structure_report_field_config WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = fieldConfigId });
            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Paginated Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Paginated Config", structureId, true);
            var unitTypeId = CreateUnitType("days", "d", "time");

            for (int i = 1; i <= 5; i++)
            {
                CreateStructureReportFieldConfig(configId, $"Field {i}", $"Item {i}", new List<int> { unitTypeId });
            }

            // Act
            var response = await _client.GetAsync("/StructureReportFieldConfig/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<StructureReportFieldConfig>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        // Helper methods to create test data
        private int CreateOrgStructure(string name, string version, bool isActive)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, version, is_active, date_start, created_at, updated_at) 
                VALUES (@name, @version, @is_active, @date_start, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@version"] = version,
                    ["@is_active"] = isActive,
                    ["@date_start"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateStructureReportConfig(string name, int structureId, bool isActive)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO structure_report_config (name, structure_id, is_active, created_at, updated_at) 
                VALUES (@name, @structure_id, @is_active, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@structure_id"] = structureId,
                    ["@is_active"] = isActive,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
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

        private int CreateStructureReportFieldConfig(int structureReportId, string fieldName, string reportItem, List<int> unitTypeIds)
        {
            // First create the field config
            var fieldConfigId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO structure_report_field_config (structure_report_id, field_name, report_item, created_at, updated_at) 
                VALUES (@structure_report_id, @field_name, @report_item, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@structure_report_id"] = structureReportId,
                    ["@field_name"] = fieldName,
                    ["@report_item"] = reportItem,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });

            // Then link it to unit types
            foreach (var unitTypeId in unitTypeIds)
            {
                DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO unit_for_field_config (field_id, unit_id, created_at, updated_at) 
                    VALUES (@field_id, @unit_id, @created_at, @updated_at);",
                    new Dictionary<string, object>
                    {
                        ["@field_id"] = fieldConfigId,
                        ["@unit_id"] = unitTypeId,
                        ["@created_at"] = DateTime.Now,
                        ["@updated_at"] = DateTime.Now
                    });
            }

            return fieldConfigId;
        }

        private StructureReportFieldConfig GetStructureReportFieldConfigWithUnitTypes(int id)
        {
            // First get the basic field config information
            var fieldConfig = DatabaseHelper.RunQueryList<StructureReportFieldConfig>(_schemaName, @"
                SELECT id, structure_report_id, field_name, report_item,
                       created_at, updated_at, created_by, updated_by
                FROM structure_report_field_config
                WHERE id = @id",
                reader => new StructureReportFieldConfig
                {
                    id = reader.GetInt32(0),
                    structureReportId = reader.GetInt32(1),
                    fieldName = reader.IsDBNull(2) ? null : reader.GetString(2),
                    reportItem = reader.IsDBNull(3) ? null : reader.GetString(3),
                    createdAt = reader.IsDBNull(4) ? null : (DateTime?)reader.GetDateTime(4),
                    updatedAt = reader.IsDBNull(5) ? null : (DateTime?)reader.GetDateTime(5),
                    createdBy = reader.IsDBNull(6) ? null : (int?)reader.GetInt32(6),
                    updatedBy = reader.IsDBNull(7) ? null : (int?)reader.GetInt32(7),
                    unitTypes = new List<int>() // Will be populated below
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            if (fieldConfig != null)
            {
                // Get unit types for this field config
                var unitTypes = DatabaseHelper.RunQueryList<int>(_schemaName, @"
                    SELECT unit_id FROM unit_for_field_config WHERE field_id = @fieldId",
                    reader => reader.GetInt32(0),
                    new Dictionary<string, object> { ["@fieldId"] = id });

                fieldConfig.unitTypes = unitTypes;
            }

            return fieldConfig;
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}