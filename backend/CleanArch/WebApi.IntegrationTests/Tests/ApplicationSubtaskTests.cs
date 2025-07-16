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
using WebApi.Controllers;
using Newtonsoft.Json.Linq;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ApplicationSubtaskTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationSubtaskTests()
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
            // Arrange - Create test application_subtasks
            var applicationTaskId = CreateTestApplicationTask();
            CreateSubtask(applicationTaskId, "Test Subtask 1");
            CreateSubtask(applicationTaskId, "Test Subtask 2");

            // Act
            var response = await _client.GetAsync("/application_subtask/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_subtask>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test application_subtasks
            var applicationTaskId = CreateTestApplicationTask();
            for (int i = 0; i < 5; i++)
            {
                CreateSubtask(applicationTaskId, $"Test Subtask {i}");
            }

            // Act
            var response = await _client.GetAsync("/application_subtask/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<application_subtask>>(content);

            JObject jObject = JObject.Parse(content);
            
            int pageNumber = jObject["pageNumber"]?.Value<int>() ?? 0;
            int totalPages = jObject["totalPages"]?.Value<int>() ?? 0;
            int totalCount = jObject["totalCount"]?.Value<int>() ?? 0;
            
            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, totalCount);
            Assert.Equal(1, pageNumber);
            Assert.Equal(2, totalPages);
        }

        [Fact]
        public async Task ChangeStatus_ReturnsOkResponse()
        {
            // Arrange - Create test subtask
            var applicationTaskId = CreateTestApplicationTask();
            var subtaskId = CreateSubtask(applicationTaskId, "Status Change Test Subtask");
            var newStatusId = CreateOrGetTaskStatus("at_work");

            var changeStatusRequest = new application_subtaskController.ChangeSubTaskStatus
            {
                subtask_id = subtaskId,
                status_id = newStatusId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/application_subtask/ChangeStatus", changeStatusRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var resultId = int.Parse(content);

            Assert.Equal(subtaskId, resultId);

            // Verify in database
            var updatedStatusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT status_id FROM application_subtask WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = subtaskId });

            Assert.Equal(newStatusId, updatedStatusId);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var applicationTaskId = CreateTestApplicationTask();
            var statusId = CreateOrGetTaskStatus("assigned");
            var applicationId = GetApplicationIdFromTask(applicationTaskId);

            var request = new Createapplication_subtaskRequest
            {
                application_id = applicationId,
                application_task_id = applicationTaskId,
                name = "New Test Subtask",
                description = "Test Description",
                status_id = statusId,
                progress = 0,
                type_id = null,
                updated_at = DateTime.Now,
                created_at = DateTime.Now,
                assignees = new List<application_subtask_assignee>()
            };

            // Act
            var response = await _client.PostAsJsonAsync("/application_subtask", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_subtask>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Test Subtask", result.name);
            Assert.Equal("Test Description", result.description);
            Assert.Equal(applicationTaskId, result.application_task_id);
            Assert.Equal(statusId, result.status_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var applicationTaskId = CreateTestApplicationTask();
            var subtaskId = CreateSubtask(applicationTaskId, "Update Test Subtask");
            var applicationId = GetApplicationIdFromTask(applicationTaskId);

            // Get current subtask to get updated_at value
            var getResponse = await _client.GetAsync($"/application_subtask/{subtaskId}");
            getResponse.EnsureSuccessStatusCode();
            var subtaskContent = await getResponse.Content.ReadAsStringAsync();
            var subtask = JsonConvert.DeserializeObject<application_subtask>(subtaskContent);

            var request = new Updateapplication_subtaskRequest
            {
                id = subtaskId,
                application_id = applicationId,
                application_task_id = applicationTaskId,
                name = "Updated Subtask Name",
                description = "Updated Description",
                status_id = subtask.status_id,
                progress = 50,
                updated_at = subtask.updated_at,
                created_at = subtask.created_at,
                assignees = new List<application_subtask_assignee>()
            };

            // Act
            var response = await _client.PutAsync($"/application_subtask/{subtaskId}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();

            // The controller returns ActionResultHelper.FromResult which might be a different structure
            // Check if we have a successful response
            Assert.True(response.IsSuccessStatusCode);

            // Verify in database
            var updatedName = DatabaseHelper.RunQuery<string>(_schemaName, @"
                SELECT name FROM application_subtask WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = subtaskId });

            Assert.Equal("Updated Subtask Name", updatedName);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var applicationTaskId = CreateTestApplicationTask();
            var subtaskId = CreateSubtask(applicationTaskId, "Delete Test Subtask");

            // Act
            var response = await _client.DeleteAsync($"/application_subtask/{subtaskId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(subtaskId, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_subtask WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = subtaskId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange
            var applicationTaskId = CreateTestApplicationTask();
            var subtaskId = CreateSubtask(applicationTaskId, "Get One Test Subtask");

            // Act
            var response = await _client.GetAsync($"/application_subtask/{subtaskId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_subtask>(content);

            Assert.NotNull(result);
            Assert.Equal(subtaskId, result.id);
            Assert.Equal("Get One Test Subtask", result.name);
            Assert.Equal(applicationTaskId, result.application_task_id);
        }

        [Fact]
        public async Task GetBysubtask_template_id_ReturnsOkResponse()
        {
            // Arrange
            var applicationTaskId = CreateTestApplicationTask();
            var templateId1 = 1; // Using a dummy template ID
            var templateId2 = 2; // Using another dummy template ID

            CreateSubtaskWithTemplate(applicationTaskId, "Template Test 1", templateId1);
            CreateSubtaskWithTemplate(applicationTaskId, "Template Test 2", templateId1);
            CreateSubtaskWithTemplate(applicationTaskId, "Template Test 3", templateId2);

            // Act
            var response = await _client.GetAsync($"/application_subtask/GetBysubtask_template_id?subtask_template_id={templateId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_subtask>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(templateId1, item.subtask_template_id));
        }

        [Fact]
        public async Task GetBystatus_id_ReturnsOkResponse()
        {
            // Arrange
            var applicationTaskId = CreateTestApplicationTask();
            var status1 = CreateOrGetTaskStatus("new");
            var status2 = CreateOrGetTaskStatus("at_work");

            CreateSubtaskWithStatus(applicationTaskId, "Status Test 1", status1);
            CreateSubtaskWithStatus(applicationTaskId, "Status Test 2", status1);
            CreateSubtaskWithStatus(applicationTaskId, "Status Test 3", status2);

            // Act
            var response = await _client.GetAsync($"/application_subtask/GetBystatus_id?status_id={status1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_subtask>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(status1, item.status_id));
        }

        [Fact]
        public async Task GetByapplication_task_id_ReturnsOkResponse()
        {
            // Arrange
            var applicationTaskId1 = CreateTestApplicationTask();
            var applicationTaskId2 = CreateTestApplicationTask();

            CreateSubtask(applicationTaskId1, "Task Subtask 1");
            CreateSubtask(applicationTaskId1, "Task Subtask 2");
            CreateSubtask(applicationTaskId2, "Task Subtask 3");

            // Act
            var response = await _client.GetAsync($"/application_subtask/GetByapplication_task_id?application_task_id={applicationTaskId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_subtask>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(applicationTaskId1, item.application_task_id));
        }

        // Helper methods to set up test data

        private int CreateTestApplication()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (registration_date, status_id, workflow_id, service_id) 
                VALUES (@registration_date, 1, 1, 1) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@registration_date"] = DateTime.Now
                });
        }

        private int CreateTestApplicationTask()
        {
            var applicationId = CreateTestApplication();
            var statusId = CreateOrGetTaskStatus("new");

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_task (
                    application_id, 
                    name, 
                    status_id, 
                    created_at,
                    is_required
                ) 
                VALUES (
                    @application_id, 
                    @name, 
                    @status_id, 
                    @created_at,
                    true
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@name"] = $"Test Task {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@status_id"] = statusId,
                    ["@created_at"] = DateTime.Now
                });
        }

        private int GetApplicationIdFromTask(int taskId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT application_id FROM application_task WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = taskId });
        }

        private int CreateOrGetTaskStatus(string code)
        {
            // Try to get an existing task_status with the given code
            var statusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COALESCE(
                    (SELECT id FROM task_status WHERE code = @code LIMIT 1),
                    0
                ) as id;",
                new Dictionary<string, object> { ["@code"] = code });

            if (statusId > 0)
            {
                return statusId;
            }

            // If status not found, create a new one
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO task_status (name, code, backcolor, textcolor) 
                VALUES (@name, @code, @backcolor, @textcolor) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = code.ToUpperInvariant(),
                    ["@code"] = code,
                    ["@backcolor"] = "#f0f8ff",
                    ["@textcolor"] = "#000000"
                });
        }

        private int CreateSubtask(int applicationTaskId, string name)
        {
            var applicationId = GetApplicationIdFromTask(applicationTaskId);
            var statusId = CreateOrGetTaskStatus("new");

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_subtask (
                    application_id,
                    application_task_id,
                    name,
                    description,
                    status_id,
                    progress,
                    created_at,
                    updated_at
                ) 
                VALUES (
                    @application_id,
                    @application_task_id,
                    @name,
                    @description,
                    @status_id,
                    @progress,
                    @created_at,
                    @updated_at
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@application_task_id"] = applicationTaskId,
                    ["@name"] = name,
                    ["@description"] = $"Description for {name}",
                    ["@status_id"] = statusId,
                    ["@progress"] = 0,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateSubtaskWithTemplate(int applicationTaskId, string name, int templateId)
        {
            var applicationId = GetApplicationIdFromTask(applicationTaskId);
            var statusId = CreateOrGetTaskStatus("new");

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_subtask (
                    application_id,
                    application_task_id,
                    name,
                    description,
                    status_id,
                    subtask_template_id,
                    progress,
                    created_at,
                    updated_at
                ) 
                VALUES (
                    @application_id,
                    @application_task_id,
                    @name,
                    @description,
                    @status_id,
                    @subtask_template_id,
                    @progress,
                    @created_at,
                    @updated_at
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@application_task_id"] = applicationTaskId,
                    ["@name"] = name,
                    ["@description"] = $"Description for {name}",
                    ["@status_id"] = statusId,
                    ["@subtask_template_id"] = templateId,
                    ["@progress"] = 0,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateSubtaskWithStatus(int applicationTaskId, string name, int statusId)
        {
            var applicationId = GetApplicationIdFromTask(applicationTaskId);

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_subtask (
                    application_id,
                    application_task_id,
                    name,
                    description,
                    status_id,
                    progress,
                    created_at,
                    updated_at
                ) 
                VALUES (
                    @application_id,
                    @application_task_id,
                    @name,
                    @description,
                    @status_id,
                    @progress,
                    @created_at,
                    @updated_at
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@application_task_id"] = applicationTaskId,
                    ["@name"] = name,
                    ["@description"] = $"Description for {name}",
                    ["@status_id"] = statusId,
                    ["@progress"] = 0,
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

    // Custom DTO classes if needed and not already in the project
    // The main DTOs are already defined in WebApi.Dtos namespace
}