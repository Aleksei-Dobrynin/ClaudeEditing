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
using WebApi.Controllers;
using static WebApi.Controllers.ApplicationController;
using static WebApi.Controllers.architecture_processController;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ArchitectureProcessTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ArchitectureProcessTests()
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
            // Arrange - Create test process with status
            var statusId = CreateArchitectureStatus("Active Status", "active");
            CreateArchitectureProcess(1001, statusId);
            CreateArchitectureProcess(1002, statusId);

            // Act
            var response = await _client.GetAsync("/architecture_process/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<architecture_process>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetAllToArchive_ReturnsOkResponse()
        {
            // Arrange - Create test process with status
            var archivedStatusId = CreateArchitectureStatus("Archived Status", "archived");
            var toArchiveStatusId = CreateArchitectureStatus("To Archive Status", "to_archive");
            var activeStatusId = CreateArchitectureStatus("Active Status", "active");

            CreateArchitectureProcess(1003, archivedStatusId);
            CreateArchitectureProcess(1004, toArchiveStatusId);
            CreateArchitectureProcess(1005, activeStatusId);

            // Act
            var response = await _client.GetAsync("/architecture_process/GetAllToArchive");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<architecture_process>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count); // Should only return archived and to_archive statuses
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test processes
            var statusId = CreateArchitectureStatus("Status", "status");

            for (int i = 1006; i <= 1010; i++)
            {
                CreateArchitectureProcess(i, statusId);
            }

            // Act
            var response = await _client.GetAsync("/architecture_process/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<architecture_process>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateArchitectureStatus("Status One", "status_one");
            var id = 1011;
            CreateArchitectureProcess(id, statusId);

            // Act
            var response = await _client.GetAsync($"/architecture_process/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<architecture_process>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(statusId, result.status_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateArchitectureStatus("Create Status", "create_status");

            var request = new Createarchitecture_processRequest
            {
                status_id = statusId,
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/architecture_process", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<architecture_process>(content);

            Assert.NotNull(result);
            Assert.Equal(1, result.id);
            Assert.Equal(statusId, result.status_id);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM architecture_process WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = 1 });

            Assert.Equal(1, count);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalStatusId = CreateArchitectureStatus("Original Status", "original_status");
            var newStatusId = CreateArchitectureStatus("New Status", "new_status");
            var processId = 1013;

            CreateArchitectureProcess(processId, originalStatusId);

            var request = new Updatearchitecture_processRequest
            {
                id = processId,
                status_id = newStatusId,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PutAsync($"/architecture_process/{processId}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<architecture_process>(content);

            Assert.NotNull(result);
            Assert.Equal(processId, result.id);
            Assert.Equal(newStatusId, result.status_id);

            // Verify in database
            var statusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT status_id FROM architecture_process WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = processId });

            Assert.Equal(newStatusId, statusId);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateArchitectureStatus("Delete Status", "delete_status");
            var processId = 1014;

            CreateArchitectureProcess(processId, statusId);

            // Act
            var response = await _client.DeleteAsync($"/architecture_process/{processId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(processId, deletedId);

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM architecture_process WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = processId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetBystatus_id_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateArchitectureStatus("Status For Get", "status_for_get");
            var otherStatusId = CreateArchitectureStatus("Other Status", "other_status");

            CreateArchitectureProcess(1015, statusId);
            CreateArchitectureProcess(1016, statusId);
            CreateArchitectureProcess(1017, otherStatusId);

            // Act
            var response = await _client.GetAsync($"/architecture_process/GetBystatus_id?status_id={statusId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<architecture_process>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, process => Assert.Equal(statusId, process.status_id));
        }

        [Fact]
        public async Task ChangeStatus_ReturnsOkResponse()
        {
            // Arrange
            var originalStatusId = CreateArchitectureStatus("Original Status", "original_status_cs");
            var newStatusId = CreateArchitectureStatus("New Status Change", "new_status_change");
            var processId = 1018;

            CreateArchitectureProcess(processId, originalStatusId);

            var request = new ChangeStatusDto
            {
                application_id = processId,
                status_id = newStatusId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/architecture_process/ChangeStatus", request);

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var currentStatusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT status_id FROM architecture_process WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = processId });

            Assert.Equal(newStatusId, currentStatusId);
        }

        [Fact]
        public async Task SendToDutyPlan_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateArchitectureStatus("Duty Plan Status", "duty_plan_status");
            var processId = 1019;

            CreateArchitectureProcess(processId, statusId);

            // Create application_work_document and uploaded_application_document entities 
            var workDocId = CreateWorkDocument(processId);
            var uploadedDocId = CreateUploadedApplicationDocument(processId);

            var request = new SendToDutyPlanRequest
            {
                app_id = processId,
                workDocs = new List<int> { workDocId },
                uplDocs = new List<int> { uploadedDocId }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/architecture_process/SendToDutyPlan", request);

            // Assert
            response.EnsureSuccessStatusCode();
            // Note: Can't verify specific outcome as it depends on implementation details,
            // but at least we can confirm the request succeeded.
        }

        // Helper methods for test setup

        private int CreateArchitectureStatus(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO architecture_status (name, code, created_at) 
                VALUES (@name, @code, @created_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@created_at"] = DateTime.Now
                });
        }

        private void CreateArchitectureProcess(int id, int statusId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO architecture_process (id, status_id, created_at, updated_at) 
                VALUES (@id, @status_id, @created_at, @updated_at);",
                new Dictionary<string, object>
                {
                    ["@id"] = id,
                    ["@status_id"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateWorkDocument(int applicationId)
        {
            // Create file first
            var fileId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO file (name, path, created_at) 
                VALUES (@name, @path, @created_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = $"File for Work Doc {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@path"] = $"/path/to/workdoc/{Guid.NewGuid().ToString()}",
                    ["@created_at"] = DateTime.Now
                });

            // Create work document
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_work_document (file_id, task_id, comment, is_active, created_at) 
                VALUES (@file_id, @task_id, @comment, @is_active, @created_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@file_id"] = fileId,
                    ["@task_id"] = applicationId,  // Using application ID as task ID for simplicity
                    ["@comment"] = "Test work document",
                    ["@is_active"] = true,
                    ["@created_at"] = DateTime.Now
                });
        }

        private int CreateUploadedApplicationDocument(int applicationId)
        {
            // Create file first
            var fileId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO file (name, path, created_at) 
                VALUES (@name, @path, @created_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = $"File for Uploaded Doc {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@path"] = $"/path/to/uploadeddoc/{Guid.NewGuid().ToString()}",
                    ["@created_at"] = DateTime.Now
                });

            // Create uploaded application document
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO uploaded_application_document (file_id, application_document_id, name, created_at) 
                VALUES (@file_id, @application_document_id, @name, @created_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@file_id"] = fileId,
                    ["@application_document_id"] = applicationId,
                    ["@name"] = "Test uploaded document",
                    ["@created_at"] = DateTime.Now
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}