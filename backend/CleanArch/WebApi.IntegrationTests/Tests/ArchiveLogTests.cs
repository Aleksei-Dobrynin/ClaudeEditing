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
    public class ArchiveLogTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ArchiveLogTests()
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
            // Arrange - Create test archive logs
            var statusId = CreateArchiveLogStatus("Available", "available", "Documents available for checkout");
            var folderId = CreateArchiveFolder("Test Folder 1");
            var dutyplanObjectId = CreateDutyplanObject("DOC-001", "Test Address 1");

            CreateArchiveLog("DOC-001", "Test Address 1", statusId, dutyplanObjectId, folderId);
            CreateArchiveLog("DOC-002", "Test Address 2", statusId, null, folderId);

            // Act
            var response = await _client.GetAsync("/ArchiveLog/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ArchiveLog>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, al => al.doc_number == "DOC-001");
            Assert.Contains(result, al => al.doc_number == "DOC-002");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test archive log
            var statusId = CreateArchiveLogStatus("Checked Out", "checked_out", "Documents checked out");
            var folderId = CreateArchiveFolder("Test Folder 2");
            var dutyplanObjectId = CreateDutyplanObject("DOC-003", "Test Address 3");

            var id = CreateArchiveLog("DOC-003", "Test Address 3", statusId, dutyplanObjectId, folderId);

            // Act
            var response = await _client.GetAsync($"/ArchiveLog/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveLog>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("DOC-003", result.doc_number);
            Assert.Equal("Test Address 3", result.address);
            Assert.Equal(statusId, result.status_id);
            Assert.Equal(folderId, result.archive_folder_id);
        }

        [Fact]
        public async Task GetGroupByParentID_ReturnsOkResponse()
        {
            // Arrange - Create parent archive log and child logs
            var statusId = CreateArchiveLogStatus("Available", "available", "Documents available for checkout");
            var folderId = CreateArchiveFolder("Test Folder 3");
            var dutyplanObjectId1 = CreateDutyplanObject("DOC-004", "Test Address 4");
            var dutyplanObjectId2 = CreateDutyplanObject("DOC-005", "Test Address 5");

            var parentId = CreateArchiveLog("DOC-004", "Test Address 4", statusId, dutyplanObjectId1, folderId,
                isGroup: true, parentId: null);
            CreateArchiveLog("DOC-005", "Test Address 5", statusId, dutyplanObjectId2, folderId,
                isGroup: true, parentId: parentId);

            // Act
            var response = await _client.GetAsync($"/ArchiveLog/GetGroupByParentID?id={parentId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveLog>(content);

            Assert.NotNull(result);
            Assert.Equal(parentId, result.id);
            // The parent should have a collection of archive objects
            Assert.NotNull(result.archiveObjects);
            Assert.True(result.archiveObjects.Count > 0);
        }

        [Fact]
        public async Task GetByFilter_ReturnsOkResponse()
        {
            // Arrange - Create test archive logs
            var statusId = CreateArchiveLogStatus("Available", "available", "Documents available for checkout");
            var folderId = CreateArchiveFolder("Test Folder 4");
            var dutyplanObjectId1 = CreateDutyplanObject("SEARCH-001", "Filter Address 1");
            var dutyplanObjectId2 = CreateDutyplanObject("OTHER-001", "Filter Address 2");

            CreateArchiveLog("SEARCH-001", "Filter Address 1", statusId, dutyplanObjectId1, folderId);
            CreateArchiveLog("OTHER-001", "Filter Address 2", statusId, dutyplanObjectId2, folderId);

            var filter = new ArchiveLogFilter
            {
                doc_number = "SEARCH"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ArchiveLog/GetByFilter", filter);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ArchiveLog>>(content);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("SEARCH-001", result[0].doc_number);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateArchiveLogStatus("Available", "available", "Documents available for checkout");
            var folderId = CreateArchiveFolder("Test Folder 5");
            var structureId = CreateOrgStructure("Test Structure");
            var employeeId = CreateEmployee("John", "Doe");

            var requestDto = new CreateArchiveLogRequest
            {
                doc_number = "CREATE-001",
                address = "Create Address 1",
                status_id = statusId,
                archive_folder_id = folderId,
                date_return = DateTime.Now.AddDays(7),
                take_structure_id = structureId,
                take_employee_id = employeeId,
                return_structure_id = structureId,
                return_employee_id = employeeId,
                date_take = DateTime.Now,
                name_take = "John Doe",
                deadline = DateTime.Now.AddDays(14)
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ArchiveLog/Create", requestDto);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveLog>(content);

            Assert.NotNull(result);
            Assert.True(result.id > 0);
            Assert.Equal("CREATE-001", result.doc_number);
            Assert.Equal("Create Address 1", result.address);
            Assert.Equal(statusId, result.status_id);

            // Verify in database
            var archiveLog = await GetArchiveLogFromDb(result.id);
            Assert.NotNull(archiveLog);
            Assert.Equal("CREATE-001", archiveLog.doc_number);
        }

        [Fact]
        public async Task ChangeStatus_ReturnsOkResponse()
        {
            // Arrange
            var statusId1 = CreateArchiveLogStatus("Available", "available", "Documents available for checkout");
            var statusId2 = CreateArchiveLogStatus("Checked Out", "checked_out", "Documents checked out");
            var folderId = CreateArchiveFolder("Test Folder 6");
            var dutyplanObjectId = CreateDutyplanObject("STATUS-001", "Status Address 1");

            var logId = CreateArchiveLog("STATUS-001", "Status Address 1", statusId1, dutyplanObjectId, folderId);

            var changeStatusRequest = new ChangeArchiveLogStatusRequest
            {
                archive_log_id = logId,
                status_id = statusId2
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ArchiveLog/ChangeStatus", changeStatusRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(logId, result);

            // Verify in database
            var archiveLog = await GetArchiveLogFromDb(logId);
            Assert.Equal(statusId2, archiveLog.status_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateArchiveLogStatus("Available", "available", "Documents available for checkout");
            var folderId = CreateArchiveFolder("Test Folder 7");
            var dutyplanObjectId = CreateDutyplanObject("UPDATE-001", "Update Address 1");
            var structureId = CreateOrgStructure("Update Structure");
            var employeeId = CreateEmployee("Jane", "Doe");

            var logId = CreateArchiveLog("UPDATE-001", "Update Address 1", statusId, dutyplanObjectId, folderId);

            var updateRequest = new UpdateArchiveLogRequest
            {
                id = logId,
                doc_number = "UPDATED-001",
                address = "Updated Address 1",
                status_id = statusId,
                archive_folder_id = folderId,
                date_return = DateTime.Now.AddDays(10),
                take_structure_id = structureId,
                take_employee_id = employeeId,
                return_structure_id = structureId,
                return_employee_id = employeeId,
                date_take = DateTime.Now,
                name_take = "Jane Doe",
                deadline = DateTime.Now.AddDays(20)
            };

            // Act
            var response = await _client.PutAsync("/ArchiveLog/Update", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveLog>(content);

            Assert.NotNull(result);
            Assert.Equal(logId, result.id);
            Assert.Equal("UPDATED-001", result.doc_number);
            Assert.Equal("Updated Address 1", result.address);

            // Verify in database
            var archiveLog = await GetArchiveLogFromDb(logId);
            Assert.Equal("UPDATED-001", archiveLog.doc_number);
            Assert.Equal("Updated Address 1", archiveLog.address);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateArchiveLogStatus("Available", "available", "Documents available for checkout");
            var folderId = CreateArchiveFolder("Test Folder 8");
            var dutyplanObjectId = CreateDutyplanObject("DELETE-001", "Delete Address 1");

            var logId = CreateArchiveLog("DELETE-001", "Delete Address 1", statusId, dutyplanObjectId, folderId);

            // Act
            var response = await _client.DeleteAsync($"/ArchiveLog/Delete?id={logId}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM archive_log WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = logId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple archive logs
            var statusId = CreateArchiveLogStatus("Available", "available", "Documents available for checkout");
            var folderId = CreateArchiveFolder("Test Folder 9");

            for (int i = 1; i <= 5; i++)
            {
                var dutyplanObjectId = CreateDutyplanObject($"PAGE-00{i}", $"Page Address {i}");
                CreateArchiveLog($"PAGE-00{i}", $"Page Address {i}", statusId, dutyplanObjectId, folderId);
            }

            // Act
            var response = await _client.GetAsync("/ArchiveLog/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<ArchiveLog>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(3, result.pageSize);
            // Total pages should be 2 (5 items with 3 per page)
            Assert.Equal(2, result.totalPages);
        }

        [Fact]
        public async Task GetForPivotDashboard_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var statusId = CreateArchiveLogStatus("Available", "available", "Documents available for checkout");
            var folderId = CreateArchiveFolder("Test Folder 10");
            var dutyplanObjectId = CreateDutyplanObject("PIVOT-001", "Pivot Address 1");
            var structureId = CreateOrgStructure("Pivot Structure");
            var employeeId = CreateEmployee("Pivot", "User");

            CreateArchiveLog("PIVOT-001", "Pivot Address 1", statusId, dutyplanObjectId, folderId,
                take_employee_id: employeeId, take_structure_id: structureId);

            var startDate = DateTime.Now.AddDays(-30);
            var endDate = DateTime.Now.AddDays(30);

            // Act
            var response = await _client.GetAsync($"/ArchiveLog/GetForPivotDashboard?date_start={startDate:yyyy-MM-dd}&date_end={endDate:yyyy-MM-dd}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ArchiveLogPivot>>(content);

            Assert.NotNull(result);
            // The actual content can vary, but it should be a valid response
        }

        // Helper methods to create test data
        private int CreateArchiveLogStatus(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_log_status (name, code, description, created_at, updated_at) 
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

        private int CreateArchiveFolder(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_folder (archive_folder_name, created_at, updated_at) 
                VALUES (@name, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDutyplanObject(string docNumber, string address)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO dutyplan_object (doc_number, address, created_at, updated_at) 
                VALUES (@doc_number, @address, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@doc_number"] = docNumber,
                    ["@address"] = address,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateOrgStructure(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, is_active, created_at, updated_at) 
                VALUES (@name, @is_active, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@is_active"] = true,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateEmployee(string firstName, string lastName)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (first_name, last_name, created_at, updated_at) 
                VALUES (@first_name, @last_name, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@first_name"] = firstName,
                    ["@last_name"] = lastName,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateArchiveLog(string docNumber, string address, int statusId, int? dutyplanObjectId,
            int? folderId, bool isGroup = false, int? parentId = null, int? take_employee_id = null,
            int? take_structure_id = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_log (doc_number, address, status_id, archive_object_id, archive_folder_id, 
                    is_group, parent_id, take_employee_id, take_structure_id, date_take, created_at, updated_at) 
                VALUES (@doc_number, @address, @status_id, @archive_object_id, @archive_folder_id, 
                    @is_group, @parent_id, @take_employee_id, @take_structure_id, @date_take, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@doc_number"] = docNumber,
                    ["@address"] = address,
                    ["@status_id"] = statusId,
                    ["@archive_object_id"] = dutyplanObjectId as object ?? DBNull.Value,
                    ["@archive_folder_id"] = folderId as object ?? DBNull.Value,
                    ["@is_group"] = isGroup,
                    ["@parent_id"] = parentId as object ?? DBNull.Value,
                    ["@take_employee_id"] = take_employee_id as object ?? DBNull.Value,
                    ["@take_structure_id"] = take_structure_id as object ?? DBNull.Value,
                    ["@date_take"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<ArchiveLog> GetArchiveLogFromDb(int id)
        {
            return DatabaseHelper.RunQueryList<ArchiveLog>(_schemaName, @"
                SELECT id, doc_number, address, status_id, archive_object_id, archive_folder_id, 
                       is_group, parent_id, take_employee_id, take_structure_id, return_employee_id, 
                       return_structure_id, date_take, date_return, deadline, name_take, created_at, updated_at
                FROM archive_log 
                WHERE id = @id",
                reader => new ArchiveLog
                {
                    id = reader.GetInt32(0),
                    doc_number = reader.IsDBNull(1) ? null : reader.GetString(1),
                    address = reader.IsDBNull(2) ? null : reader.GetString(2),
                    status_id = reader.IsDBNull(3) ? null : reader.GetInt32(3),
                    archive_object_id = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                    archive_folder_id = reader.IsDBNull(5) ? null : reader.GetInt32(5),
                    is_group = reader.IsDBNull(6) ? null : reader.GetBoolean(6),
                    parent_id = reader.IsDBNull(7) ? null : reader.GetInt32(7),
                    take_employee_id = reader.IsDBNull(8) ? null : reader.GetInt32(8),
                    take_structure_id = reader.IsDBNull(9) ? null : reader.GetInt32(9),
                    return_employee_id = reader.IsDBNull(10) ? null : reader.GetInt32(10),
                    return_structure_id = reader.IsDBNull(11) ? null : reader.GetInt32(11),
                    date_take = reader.IsDBNull(12) ? null : reader.GetDateTime(12),
                    date_return = reader.IsDBNull(13) ? null : reader.GetDateTime(13),
                    deadline = reader.IsDBNull(14) ? null : reader.GetDateTime(14),
                    name_take = reader.IsDBNull(15) ? null : reader.GetString(15),
                    created_at = reader.IsDBNull(16) ? null : reader.GetDateTime(16),
                    updated_at = reader.IsDBNull(17) ? null : reader.GetDateTime(17)
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