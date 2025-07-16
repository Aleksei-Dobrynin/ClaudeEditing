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
    public class StructureReportFieldTests : IDisposable
    {
        // Класс для маппинга полей из БД
        public class StructureReportField
        {
            public int id { get; set; }
            public int reportId { get; set; }
            public int? fieldId { get; set; }
            public string? field_name { get; set; }
            public string? report_item { get; set; }
            public int? unitId { get; set; }
            public string unitName { get; set; }
            public int? value { get; set; }
            public DateTime? createdAt { get; set; }
            public DateTime? updatedAt { get; set; }
            public int? createdBy { get; set; }
            public int? updatedBy { get; set; }
        }

        private readonly string _schemaName;
        private readonly HttpClient _client;

        public StructureReportFieldTests()
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

            var unitTypeId1 = CreateUnitType("meters", "m", "length");
            var unitTypeId2 = CreateUnitType("minutes", "min", "time");

            var fieldConfigId1 = CreateStructureReportFieldConfig(configId, "Field 1", "Item 1", new List<int> { unitTypeId1 });
            var fieldConfigId2 = CreateStructureReportFieldConfig(configId, "Field 2", "Item 2", new List<int> { unitTypeId2 });

            var statusId = CreateStructureReportStatus("In Progress", "in_progress", "Status for testing");
            var reportId = CreateStructureReport(statusId, configId, structureId, 5, 2023, 2);

            CreateStructureReportField(reportId, fieldConfigId1, unitTypeId1, 100);
            CreateStructureReportField(reportId, fieldConfigId2, unitTypeId2, 200);

            // Act
            var response = await _client.GetAsync("/StructureReportField/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<StructureReportField>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            // Verify fields have correct values and include unit names and field details
            var field1 = result.FirstOrDefault(f => f.fieldId == fieldConfigId1);
            Assert.NotNull(field1);
            Assert.Equal(reportId, field1.reportId);
            Assert.Equal(unitTypeId1, field1.unitId);
            Assert.Equal(100, field1.value);
            Assert.Equal("meters", field1.unitName);
            Assert.Equal("Field 1", field1.field_name);
            Assert.Equal("Item 1", field1.report_item);

            var field2 = result.FirstOrDefault(f => f.fieldId == fieldConfigId2);
            Assert.NotNull(field2);
            Assert.Equal(reportId, field2.reportId);
            Assert.Equal(unitTypeId2, field2.unitId);
            Assert.Equal(200, field2.value);
            Assert.Equal("minutes", field2.unitName);
            Assert.Equal("Field 2", field2.field_name);
            Assert.Equal("Item 2", field2.report_item);
        }

        [Fact]
        public async Task GetByidReport_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("GetByReport Structure", "1.0", true);
            var configId = CreateStructureReportConfig("GetByReport Config", structureId, true);

            var unitTypeId = CreateUnitType("kilometers", "km", "length");
            var fieldConfigId = CreateStructureReportFieldConfig(configId, "Road Length", "Total Road Length", new List<int> { unitTypeId });

            var statusId = CreateStructureReportStatus("Completed", "completed", "Completed status");

            var reportId1 = CreateStructureReport(statusId, configId, structureId, 1, 2023, 1);
            var reportId2 = CreateStructureReport(statusId, configId, structureId, 2, 2023, 1);

            CreateStructureReportField(reportId1, fieldConfigId, unitTypeId, 150);
            CreateStructureReportField(reportId1, fieldConfigId, unitTypeId, 200);
            CreateStructureReportField(reportId2, fieldConfigId, unitTypeId, 300);

            // Act
            var response = await _client.GetAsync($"/StructureReportField/GetByidReport?idReport={reportId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<StructureReportField>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(reportId1, item.reportId));
        }

        [Fact]
        public async Task GetByidFieldConfig_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("ByField Structure", "1.0", true);
            var configId = CreateStructureReportConfig("ByField Config", structureId, true);

            var unitTypeId = CreateUnitType("square meters", "sq.m", "area");
            var fieldConfigId1 = CreateStructureReportFieldConfig(configId, "Building Area", "Total Area", new List<int> { unitTypeId });
            var fieldConfigId2 = CreateStructureReportFieldConfig(configId, "Land Area", "Land Area", new List<int> { unitTypeId });

            var statusId = CreateStructureReportStatus("Draft", "draft", "Draft status");
            var reportId = CreateStructureReport(statusId, configId, structureId, 3, 2023, 1);

            CreateStructureReportField(reportId, fieldConfigId1, unitTypeId, 1000);
            CreateStructureReportField(reportId, fieldConfigId1, unitTypeId, 1500);
            CreateStructureReportField(reportId, fieldConfigId2, unitTypeId, 2000);

            // Act
            var response = await _client.GetAsync($"/StructureReportField/GetByidFieldConfig?idFieldConfig={fieldConfigId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<StructureReportField>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(fieldConfigId1, item.fieldId));
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("GetOne Structure", "1.0", true);
            var configId = CreateStructureReportConfig("GetOne Config", structureId, true);

            var unitTypeId = CreateUnitType("tons", "t", "weight");
            var fieldConfigId = CreateStructureReportFieldConfig(configId, "Production Amount", "Total Production", new List<int> { unitTypeId });

            var statusId = CreateStructureReportStatus("Published", "published", "Published status");
            var reportId = CreateStructureReport(statusId, configId, structureId, 6, 2023, 2);

            var fieldId = CreateStructureReportField(reportId, fieldConfigId, unitTypeId, 500);

            // Act
            var response = await _client.GetAsync($"/StructureReportField/{fieldId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReportField>(content);

            Assert.NotNull(result);
            Assert.Equal(fieldId, result.id);
            Assert.Equal(reportId, result.reportId);
            Assert.Equal(fieldConfigId, result.fieldId);
            Assert.Equal(unitTypeId, result.unitId);
            Assert.Equal(500, result.value);
            Assert.Equal("tons", result.unitName);
            Assert.Equal("Production Amount", result.field_name);
            Assert.Equal("Total Production", result.report_item);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Create Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Create Config", structureId, true);

            var unitTypeId = CreateUnitType("percent", "%", "percentage");
            var fieldConfigId = CreateStructureReportFieldConfig(configId, "Completion Rate", "Project Completion", new List<int> { unitTypeId });

            var statusId = CreateStructureReportStatus("New", "new", "New status");
            var reportId = CreateStructureReport(statusId, configId, structureId, 7, 2023, 3);

            var request = new CreateStructureReportFieldRequest
            {
                reportId = reportId,
                fieldId = fieldConfigId,
                unitId = unitTypeId,
                value = 75
            };

            // Act
            var response = await _client.PostAsJsonAsync("/StructureReportField/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReportField>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(reportId, result.reportId);
            Assert.Equal(fieldConfigId, result.fieldId);
            Assert.Equal(unitTypeId, result.unitId);
            Assert.Equal(75, result.value);

            // Verify in database - check each field individually to avoid mapping issues
            var reportId_db = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT report_id FROM structure_report_field WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = result.id });

            var fieldId_db = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT field_id FROM structure_report_field WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = result.id });

            var unitId_db = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT unit_id FROM structure_report_field WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = result.id });

            var value_db = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT value FROM structure_report_field WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = result.id });

            var field = new StructureReportField
            {
                reportId = reportId_db,
                fieldId = fieldId_db,
                unitId = unitId_db,
                value = value_db
            };

            Assert.NotNull(field);
            Assert.Equal(reportId, field.reportId);
            Assert.Equal(fieldConfigId, field.fieldId);
            Assert.Equal(unitTypeId, field.unitId);
            Assert.Equal(75, field.value);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Update Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Update Config", structureId, true);

            var unitTypeId = CreateUnitType("units", "u", "generic");
            var fieldConfigId = CreateStructureReportFieldConfig(configId, "Units Built", "Construction Units", new List<int> { unitTypeId });

            var statusId = CreateStructureReportStatus("Active", "active", "Active status");
            var reportId = CreateStructureReport(statusId, configId, structureId, 8, 2023, 3);

            var fieldId = CreateStructureReportField(reportId, fieldConfigId, unitTypeId, 50);

            var request = new UpdateStructureReportFieldRequest
            {
                id = fieldId,
                reportId = reportId,
                fieldId = fieldConfigId,
                unitId = unitTypeId,
                value = 100 // Updated value
            };

            // Act
            var response = await _client.PutAsync($"/StructureReportField/{fieldId}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReportField>(content);

            Assert.NotNull(result);
            Assert.Equal(fieldId, result.id);
            Assert.Equal(reportId, result.reportId);
            Assert.Equal(fieldConfigId, result.fieldId);
            Assert.Equal(unitTypeId, result.unitId);
            Assert.Equal(100, result.value); // Value should be updated

            // Verify in database
            var value = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT value FROM structure_report_field WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = fieldId });

            Assert.Equal(100, value); // Value should be updated
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Delete Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Delete Config", structureId, true);

            var unitTypeId = CreateUnitType("people", "p", "count");
            var fieldConfigId = CreateStructureReportFieldConfig(configId, "Employees", "Employee Count", new List<int> { unitTypeId });

            var statusId = CreateStructureReportStatus("Final", "final", "Final status");
            var reportId = CreateStructureReport(statusId, configId, structureId, 9, 2023, 3);

            var fieldId = CreateStructureReportField(reportId, fieldConfigId, unitTypeId, 25);

            // Act
            var response = await _client.DeleteAsync($"/StructureReportField/{fieldId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(fieldId, result);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM structure_report_field WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = fieldId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Paginated Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Paginated Config", structureId, true);

            var unitTypeId = CreateUnitType("dollars", "$", "currency");
            var fieldConfigId = CreateStructureReportFieldConfig(configId, "Budget", "Project Budget", new List<int> { unitTypeId });

            var statusId = CreateStructureReportStatus("Review", "review", "Review status");
            var reportId = CreateStructureReport(statusId, configId, structureId, 10, 2023, 4);

            // Create 5 fields for testing pagination
            for (int i = 1; i <= 5; i++)
            {
                CreateStructureReportField(reportId, fieldConfigId, unitTypeId, i * 1000);
            }

            // Let's make sure all fields are created before proceeding
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM structure_report_field 
                WHERE report_id = @reportId",
                new Dictionary<string, object> { ["@reportId"] = reportId });

            Assert.Equal(5, count);

            // Act
            var response = await _client.GetAsync("/StructureReportField/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<StructureReportField>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
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

        private int CreateStructureReportStatus(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO structure_report_status (name, code, description, created_at, updated_at) 
                VALUES (@name, @code, @description, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
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

        private int CreateStructureReport(int statusId, int reportConfigId, int structureId, int? month, int? year, int? quarter)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO structure_report (status_id, report_config_id, structure_id, month, year, quarter, created_at, updated_at) 
                VALUES (@status_id, @report_config_id, @structure_id, @month, @year, @quarter, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@status_id"] = statusId,
                    ["@report_config_id"] = reportConfigId,
                    ["@structure_id"] = structureId,
                    ["@month"] = month as object ?? DBNull.Value,
                    ["@year"] = year as object ?? DBNull.Value,
                    ["@quarter"] = quarter as object ?? DBNull.Value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateStructureReportField(int reportId, int? fieldId, int? unitId, int? value)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO structure_report_field (report_id, field_id, unit_id, value, created_at, updated_at) 
                VALUES (@report_id, @field_id, @unit_id, @value, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@report_id"] = reportId,
                    ["@field_id"] = fieldId as object ?? DBNull.Value,
                    ["@unit_id"] = unitId as object ?? DBNull.Value,
                    ["@value"] = value as object ?? DBNull.Value,
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