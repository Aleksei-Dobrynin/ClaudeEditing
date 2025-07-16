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
    public class StructureReportTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public StructureReportTests()
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
            // Arrange - Create prerequisites and test structure reports
            var structureId = CreateOrgStructure("Test Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Test Config", true, structureId);
            var statusId = CreateStructureReportStatus("Test Status", "test_status", "Test Status Description");

            CreateStructureReport(statusId, configId, 1, 2023, 1, structureId);
            CreateStructureReport(statusId, configId, 2, 2023, 1, structureId);

            // Act
            var response = await _client.GetAsync("/StructureReport/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<StructureReport>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.month == 1 && r.year == 2023 && r.statusId == statusId);
            Assert.Contains(result, r => r.month == 2 && r.year == 2023 && r.statusId == statusId);
        }

        [Fact]
        public async Task GetByIdConfig_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites and test structure reports
            var structureId = CreateOrgStructure("Config Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Config Test", true, structureId);
            var statusId = CreateStructureReportStatus("Config Status", "config_status", "Config Status Description");

            // Create reports with the target config
            CreateStructureReport(statusId, configId, 1, 2023, 1, structureId);
            CreateStructureReport(statusId, configId, 2, 2023, 1, structureId);

            // Create a report with a different config
            var otherConfigId = CreateStructureReportConfig("Other Config", true, structureId);
            CreateStructureReport(statusId, otherConfigId, 3, 2023, 1, structureId);

            // Act
            var response = await _client.GetAsync($"/StructureReport/GetbyidConfig?idConfig={configId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<StructureReport>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, r => Assert.Equal(configId, r.reportConfigId));
            Assert.Contains(result, r => r.month == 1);
            Assert.Contains(result, r => r.month == 2);
        }

        [Fact]
        public async Task GetByIdStructure_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites and test structure reports
            var structureId = CreateOrgStructure("Structure for Reports", "1.0", true);
            var configId = CreateStructureReportConfig("Structure Config", true, structureId);
            var statusId = CreateStructureReportStatus("Structure Status", "structure_status", "Structure Status Description");

            // Create reports for the target structure
            CreateStructureReport(statusId, configId, 1, 2023, 1, structureId);
            CreateStructureReport(statusId, configId, 2, 2023, 1, structureId);

            // Create a report for a different structure
            var otherStructureId = CreateOrgStructure("Other Structure", "1.0", true);
            var otherConfigId = CreateStructureReportConfig("Other Config", true, otherStructureId);
            CreateStructureReport(statusId, otherConfigId, 3, 2023, 1, otherStructureId);

            // Act
            var response = await _client.GetAsync($"/StructureReport/GetbyidStructure?idStructure={structureId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<StructureReport>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, r => Assert.Equal(structureId, r.structureId));
            Assert.Contains(result, r => r.month == 1);
            Assert.Contains(result, r => r.month == 2);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites and a test structure report
            var structureId = CreateOrgStructure("Single Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Single Config", true, structureId);
            var statusId = CreateStructureReportStatus("Single Status", "single_status", "Single Status Description");

            var reportId = CreateStructureReport(statusId, configId, 5, 2023, 2, structureId);

            // Act
            var response = await _client.GetAsync($"/StructureReport/{reportId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReport>(content);

            Assert.NotNull(result);
            Assert.Equal(reportId, result.id);
            Assert.Equal(statusId, result.statusId);
            Assert.Equal(configId, result.reportConfigId);
            Assert.Equal(5, result.month);
            Assert.Equal(2023, result.year);
            Assert.Equal(2, result.quarter);
            Assert.Equal(structureId, result.structureId);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites
            var structureId = CreateOrgStructure("Create Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Create Config", true, structureId);
            var statusId = CreateStructureReportStatus("Create Status", "create_status", "Create Status Description");

            var request = new CreateStructureReportRequest
            {
                statusId = statusId,
                reportConfigId = configId,
                month = 6,
                year = 2023,
                quarter = 2,
                structureId = structureId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/StructureReport/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReport>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(statusId, result.statusId);
            Assert.Equal(configId, result.reportConfigId);
            Assert.Equal(6, result.month);
            Assert.Equal(2023, result.year);
            Assert.Equal(2, result.quarter);
            Assert.Equal(structureId, result.structureId);
            Assert.NotNull(result.createdAt);
            Assert.NotNull(result.updatedAt);

            // Verify in database
            var storedReport = DatabaseHelper.RunQueryList<StructureReport>(_schemaName,
                @"SELECT id, status_id, report_config_id, month, year, quarter, structure_id
                  FROM structure_report WHERE id = @id",
                reader => new StructureReport
                {
                    id = reader.GetInt32(0),
                    statusId = reader.GetInt32(1),
                    reportConfigId = reader.GetInt32(2),
                    month = reader.IsDBNull(3) ? null : (int?)reader.GetInt32(3),
                    year = reader.IsDBNull(4) ? null : (int?)reader.GetInt32(4),
                    quarter = reader.IsDBNull(5) ? null : (int?)reader.GetInt32(5),
                    structureId = reader.IsDBNull(6) ? null : (int?)reader.GetInt32(6)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(storedReport);
            Assert.Equal(result.id, storedReport.id);
            Assert.Equal(statusId, storedReport.statusId);
            Assert.Equal(configId, storedReport.reportConfigId);
            Assert.Equal(6, storedReport.month);
            Assert.Equal(2023, storedReport.year);
            Assert.Equal(2, storedReport.quarter);
            Assert.Equal(structureId, storedReport.structureId);
        }

        [Fact]
        public async Task CreateFromConfig_ReturnsOkResponseAndCreatesFields()
        {
            // Arrange - Create prerequisites
            var structureId = CreateOrgStructure("Config Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Fields Config", true, structureId);
            var statusId = CreateStructureReportStatus("Fields Status", "fields_status", "Fields Status Description");

            // Create field configs with unit types
            var unitTypeId1 = CreateUnitType("Square Meters", "sq_m", "square");
            var unitTypeId2 = CreateUnitType("Count", "count", "piece");

            var fieldConfigId1 = CreateStructureReportFieldConfig("Field 1", "Item 1", configId);
            var fieldConfigId2 = CreateStructureReportFieldConfig("Field 2", "Item 2", configId);

            CreateUnitForFieldConfig(fieldConfigId1, unitTypeId1);
            CreateUnitForFieldConfig(fieldConfigId1, unitTypeId2);
            CreateUnitForFieldConfig(fieldConfigId2, unitTypeId1);

            var request = new CreateStructureReportRequest
            {
                statusId = statusId,
                reportConfigId = configId,
                month = 7,
                year = 2023,
                quarter = 3,
                structureId = structureId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/StructureReport/CreateFromConfig", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReport>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);

            // Verify fields were created
            var reportFields = DatabaseHelper.RunQuery<int>(_schemaName,
                @"SELECT COUNT(*) FROM structure_report_field WHERE report_id = @reportId",
                new Dictionary<string, object> { ["@reportId"] = result.id });

            // 3 fields should be created (2 for Field1 with both unit types, 1 for Field2 with one unit type)
            Assert.Equal(3, reportFields);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites and a test structure report
            var structureId = CreateOrgStructure("Update Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Update Config", true, structureId);
            var statusId = CreateStructureReportStatus("Update Status", "update_status", "Update Status Description");

            var reportId = CreateStructureReport(statusId, configId, 8, 2023, 3, structureId);

            // Create a new status and config for update
            var newStatusId = CreateStructureReportStatus("New Status", "new_status", "New Status Description");
            var newConfigId = CreateStructureReportConfig("New Config", true, structureId);

            var request = new UpdateStructureReportRequest
            {
                id = reportId,
                statusId = newStatusId,
                reportConfigId = newConfigId,
                month = 9,
                year = 2024,
                quarter = 1,
                structureId = structureId
            };

            // Act
            var response = await _client.PutAsync($"/StructureReport/{reportId}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<StructureReport>(content);

            Assert.NotNull(result);
            Assert.Equal(reportId, result.id);
            Assert.Equal(newStatusId, result.statusId);
            Assert.Equal(newConfigId, result.reportConfigId);
            Assert.Equal(9, result.month);
            Assert.Equal(2024, result.year);
            Assert.Equal(1, result.quarter);

            // Verify in database
            var storedReport = DatabaseHelper.RunQueryList<StructureReport>(_schemaName,
                @"SELECT status_id, report_config_id, month, year, quarter
                  FROM structure_report WHERE id = @id",
                reader => new StructureReport
                {
                    statusId = reader.GetInt32(0),
                    reportConfigId = reader.GetInt32(1),
                    month = reader.IsDBNull(2) ? null : (int?)reader.GetInt32(2),
                    year = reader.IsDBNull(3) ? null : (int?)reader.GetInt32(3),
                    quarter = reader.IsDBNull(4) ? null : (int?)reader.GetInt32(4)
                },
                new Dictionary<string, object> { ["@id"] = reportId }
            ).FirstOrDefault();

            Assert.NotNull(storedReport);
            Assert.Equal(newStatusId, storedReport.statusId);
            Assert.Equal(newConfigId, storedReport.reportConfigId);
            Assert.Equal(9, storedReport.month);
            Assert.Equal(2024, storedReport.year);
            Assert.Equal(1, storedReport.quarter);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites and a test structure report
            var structureId = CreateOrgStructure("Delete Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Delete Config", true, structureId);
            var statusId = CreateStructureReportStatus("Delete Status", "delete_status", "Delete Status Description");

            var reportId = CreateStructureReport(statusId, configId, 10, 2023, 4, structureId);

            // Act
            var response = await _client.DeleteAsync($"/StructureReport/{reportId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(reportId, deletedId);

            // Verify in database that the report has been deleted
            var reportCount = DatabaseHelper.RunQuery<int>(_schemaName,
                @"SELECT COUNT(*) FROM structure_report WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = reportId });

            Assert.Equal(0, reportCount);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites and multiple structure reports
            var structureId = CreateOrgStructure("Paginated Structure", "1.0", true);
            var configId = CreateStructureReportConfig("Paginated Config", true, structureId);
            var statusId = CreateStructureReportStatus("Paginated Status", "paginated_status", "Paginated Status Description");

            for (int i = 1; i <= 5; i++)
            {
                CreateStructureReport(statusId, configId, i, 2023, (i <= 3) ? 1 : 2, structureId);
            }

            // Act
            var response = await _client.GetAsync("/StructureReport/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<StructureReport>>(content);

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

        private int CreateStructureReport(int statusId, int reportConfigId, int? month, int? year, int? quarter, int? structureId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO structure_report (status_id, report_config_id, month, year, quarter, structure_id, created_at, updated_at)
                VALUES (@statusId, @reportConfigId, @month, @year, @quarter, @structureId, @createdAt, @updatedAt)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@statusId"] = statusId,
                    ["@reportConfigId"] = reportConfigId,
                    ["@month"] = month as object ?? DBNull.Value,
                    ["@year"] = year as object ?? DBNull.Value,
                    ["@quarter"] = quarter as object ?? DBNull.Value,
                    ["@structureId"] = structureId as object ?? DBNull.Value,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateUnitType(string name, string code, string type)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO unit_type (name, code, type, created_at, updated_at)
                VALUES (@name, @code, @type, @createdAt, @updatedAt)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@type"] = type,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateStructureReportFieldConfig(string fieldName, string reportItem, int structureReportId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO structure_report_field_config (field_name, report_item, structure_report_id, created_at, updated_at)
                VALUES (@fieldName, @reportItem, @structureReportId, @createdAt, @updatedAt)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@fieldName"] = fieldName,
                    ["@reportItem"] = reportItem,
                    ["@structureReportId"] = structureReportId,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateUnitForFieldConfig(int fieldId, int unitId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO unit_for_field_config (field_id, unit_id, created_at, updated_at)
                VALUES (@fieldId, @unitId, @createdAt, @updatedAt)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@fieldId"] = fieldId,
                    ["@unitId"] = unitId,
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