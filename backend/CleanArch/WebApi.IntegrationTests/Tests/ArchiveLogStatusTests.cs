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
    public class ArchiveLogStatusTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ArchiveLogStatusTests()
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
            CreateArchiveLogStatus("Available", "available", "Documents available for checkout");
            CreateArchiveLogStatus("Checked Out", "checked_out", "Documents checked out");
            CreateArchiveLogStatus("Late Return", "late_return", "Documents returned late");

            // Act
            var response = await _client.GetAsync("/ArchiveLogStatus/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ArchiveLogStatus>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.Contains(result, s => s.name == "Available" && s.code == "available");
            Assert.Contains(result, s => s.name == "Checked Out" && s.code == "checked_out");
            Assert.Contains(result, s => s.name == "Late Return" && s.code == "late_return");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test status
            var id = CreateArchiveLogStatus("Reserved", "reserved", "Documents reserved for checkout");

            // Act
            var response = await _client.GetAsync($"/ArchiveLogStatus/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveLogStatus>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Reserved", result.name);
            Assert.Equal("reserved", result.code);
            Assert.Equal("Documents reserved for checkout", result.description);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var createRequest = new CreateArchiveLogStatusRequest
            {
                name = "Processing",
                code = "processing",
                description = "Documents in processing stage"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ArchiveLogStatus/Create", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveLogStatus>(content);

            Assert.NotNull(result);
            Assert.True(result.id > 0);
            Assert.Equal("Processing", result.name);
            Assert.Equal("processing", result.code);
            Assert.Equal("Documents in processing stage", result.description);

            // Verify in database
            var status = await GetArchiveLogStatusFromDb(result.id);
            Assert.Equal("Processing", status.name);
            Assert.Equal("processing", status.code);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateArchiveLogStatus("To Update", "to_update", "Status to be updated");

            var updateRequest = new UpdateArchiveLogStatusRequest
            {
                id = id,
                name = "Updated Status",
                code = "updated",
                description = "This status has been updated"
            };

            // Act
            var response = await _client.PutAsync("/ArchiveLogStatus/Update", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveLogStatus>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Status", result.name);
            Assert.Equal("updated", result.code);
            Assert.Equal("This status has been updated", result.description);

            // Verify in database
            var status = await GetArchiveLogStatusFromDb(id);
            Assert.Equal("Updated Status", status.name);
            Assert.Equal("updated", status.code);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateArchiveLogStatus("To Delete", "to_delete", "Status to be deleted");

            // Act
            var response = await _client.DeleteAsync($"/ArchiveLogStatus/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM archive_log_status WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple statuses
            for (int i = 1; i <= 5; i++)
            {
                CreateArchiveLogStatus($"Status {i}", $"status_{i}", $"Description {i}");
            }

            // Act
            var response = await _client.GetAsync("/ArchiveLogStatus/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<ArchiveLogStatus>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task ReferentialIntegrity_CannotDeleteStatusInUse()
        {
            // Arrange - Create status and reference it from an archive log
            var statusId = CreateArchiveLogStatus("In Use", "in_use", "Status in use by an archive log");

            // Create a folder and duty plan object to use in archive log
            var folderId = CreateArchiveFolder("Test Folder");
            var objectId = CreateDutyplanObject("DOC-REFINT", "Reference Address");

            // Create archive log that references the status
            CreateArchiveLog("DOC-REFINT", "Reference Address", statusId, objectId, folderId);

            // Act - This should fail with a foreign key constraint violation
            var response = await _client.DeleteAsync($"/ArchiveLogStatus/Delete?id={statusId}");

            // Assert
            // The exact response might depend on error handling in the API, but it should not be successful
            Assert.False(response.IsSuccessStatusCode);
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);

            // Verify status still exists in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM archive_log_status WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = statusId });

            Assert.Equal(1, count);
        }

        // Helper methods
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

        private int CreateArchiveLog(string docNumber, string address, int statusId, int? dutyplanObjectId, int? folderId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_log (doc_number, address, status_id, archive_object_id, archive_folder_id, date_take, created_at, updated_at) 
                VALUES (@doc_number, @address, @status_id, @archive_object_id, @archive_folder_id, @date_take, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@doc_number"] = docNumber,
                    ["@address"] = address,
                    ["@status_id"] = statusId,
                    ["@archive_object_id"] = dutyplanObjectId as object ?? DBNull.Value,
                    ["@archive_folder_id"] = folderId as object ?? DBNull.Value,
                    ["@date_take"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<ArchiveLogStatus> GetArchiveLogStatusFromDb(int id)
        {
            return DatabaseHelper.RunQueryList<ArchiveLogStatus>(_schemaName, @"
                SELECT id, name, code, description, created_at, updated_at, created_by, updated_by
                FROM archive_log_status 
                WHERE id = @id",
                reader => new ArchiveLogStatus
                {
                    id = reader.GetInt32(0),
                    name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    code = reader.IsDBNull(2) ? null : reader.GetString(2),
                    description = reader.IsDBNull(3) ? null : reader.GetString(3),
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