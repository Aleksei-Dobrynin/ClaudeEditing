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
    public class WorkflowSubtaskTemplateTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public WorkflowSubtaskTemplateTests()
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
            // Arrange - Create prerequisites and test subtask templates
            var taskId = CreateWorkflowTaskTemplatePrerequisites();
            var typeId = CreateTaskType("Subtask Type", false, true);

            CreateWorkflowSubtaskTemplate("Subtask 1", "Description 1", taskId, typeId);
            CreateWorkflowSubtaskTemplate("Subtask 2", "Description 2", taskId, typeId);

            // Act
            var response = await _client.GetAsync("/WorkflowSubtaskTemplate/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<WorkflowSubtaskTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.name == "Subtask 1" && s.description == "Description 1");
            Assert.Contains(result, s => s.name == "Subtask 2" && s.description == "Description 2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites and test subtask template
            var taskId = CreateWorkflowTaskTemplatePrerequisites();
            var typeId = CreateTaskType("Single Subtask Type", false, true);

            var id = CreateWorkflowSubtaskTemplate("Single Subtask", "Single Description", taskId, typeId);

            // Act
            var response = await _client.GetAsync($"/WorkflowSubtaskTemplate/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkflowSubtaskTemplate>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Subtask", result.name);
            Assert.Equal("Single Description", result.description);
            Assert.Equal(taskId, result.workflow_task_id);
            Assert.Equal(typeId, result.type_id);
        }

        [Fact]
        public async Task GetByidWorkflowTaskTemplate_ReturnsOkResponse()
        {
            // Arrange - Create workflow task with multiple subtasks
            var taskId = CreateWorkflowTaskTemplatePrerequisites();
            var otherTaskId = CreateWorkflowTaskTemplatePrerequisites();
            var typeId = CreateTaskType("Filter Subtask Type", false, true);

            CreateWorkflowSubtaskTemplate("Subtask For Task 1", "Description 1", taskId, typeId);
            CreateWorkflowSubtaskTemplate("Subtask For Task 2", "Description 2", taskId, typeId);
            // Create a subtask for another task to verify filtering
            CreateWorkflowSubtaskTemplate("Subtask For Other Task", "Other Description", otherTaskId, typeId);

            // Act
            var response = await _client.GetAsync($"/WorkflowSubtaskTemplate/GetByidWorkflowTaskTemplate?idWorkflowTaskTemplate={taskId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<WorkflowSubtaskTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, s => Assert.Equal(taskId, s.workflow_task_id));
            Assert.Contains(result, s => s.name == "Subtask For Task 1");
            Assert.Contains(result, s => s.name == "Subtask For Task 2");
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var taskId = CreateWorkflowTaskTemplatePrerequisites();
            var typeId = CreateTaskType("Create Subtask Type", false, true);

            var request = new CreateWorkflowSubtaskTemplateRequest
            {
                name = "Created Subtask",
                description = "Created Description",
                workflow_task_id = taskId,
                type_id = typeId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/WorkflowSubtaskTemplate/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkflowSubtaskTemplate>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Subtask", result.name);
            Assert.Equal("Created Description", result.description);
            Assert.Equal(taskId, result.workflow_task_id);
            Assert.Equal(typeId, result.type_id);

            // Verify in database
            var subtask = DatabaseHelper.RunQueryList<WorkflowSubtaskTemplate>(_schemaName, @"
                SELECT * FROM workflow_subtask_template WHERE id = @id",
                reader => new WorkflowSubtaskTemplate
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    name = reader.GetString(reader.GetOrdinal("name")),
                    description = !reader.IsDBNull(reader.GetOrdinal("description"))
                        ? reader.GetString(reader.GetOrdinal("description"))
                        : null,
                    workflow_task_id = reader.GetInt32(reader.GetOrdinal("workflow_task_id")),
                    type_id = !reader.IsDBNull(reader.GetOrdinal("type_id"))
                        ? reader.GetInt32(reader.GetOrdinal("type_id"))
                        : null
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(subtask);
            Assert.Equal("Created Subtask", subtask.name);
            Assert.Equal("Created Description", subtask.description);
            Assert.Equal(taskId, subtask.workflow_task_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalTaskId = CreateWorkflowTaskTemplatePrerequisites();
            var newTaskId = CreateWorkflowTaskTemplatePrerequisites();
            var originalTypeId = CreateTaskType("Original Subtask Type", false, true);
            var newTypeId = CreateTaskType("New Subtask Type", false, true);

            var id = CreateWorkflowSubtaskTemplate("Original Subtask", "Original Description",
                                                 originalTaskId, originalTypeId);

            var request = new UpdateWorkflowSubtaskTemplateRequest
            {
                id = id,
                name = "Updated Subtask",
                description = "Updated Description",
                workflow_task_id = newTaskId,
                type_id = newTypeId
            };

            // Act
            var response = await _client.PutAsync("/WorkflowSubtaskTemplate/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkflowSubtaskTemplate>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Subtask", result.name);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal(newTaskId, result.workflow_task_id);
            Assert.Equal(newTypeId, result.type_id);

            // Verify in database
            var subtask = DatabaseHelper.RunQueryList<WorkflowSubtaskTemplate>(_schemaName, @"
                SELECT * FROM workflow_subtask_template WHERE id = @id",
                reader => new WorkflowSubtaskTemplate
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    name = reader.GetString(reader.GetOrdinal("name")),
                    description = !reader.IsDBNull(reader.GetOrdinal("description"))
                        ? reader.GetString(reader.GetOrdinal("description"))
                        : null,
                    workflow_task_id = reader.GetInt32(reader.GetOrdinal("workflow_task_id")),
                    type_id = !reader.IsDBNull(reader.GetOrdinal("type_id"))
                        ? reader.GetInt32(reader.GetOrdinal("type_id"))
                        : null
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(subtask);
            Assert.Equal("Updated Subtask", subtask.name);
            Assert.Equal("Updated Description", subtask.description);
            Assert.Equal(newTaskId, subtask.workflow_task_id);
            Assert.Equal(newTypeId, subtask.type_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var taskId = CreateWorkflowTaskTemplatePrerequisites();
            var typeId = CreateTaskType("Delete Subtask Type", false, true);

            var id = CreateWorkflowSubtaskTemplate("Subtask To Delete", "Description For Delete", taskId, typeId);

            // Act
            var response = await _client.DeleteAsync($"/WorkflowSubtaskTemplate/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify subtask was deleted
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM workflow_subtask_template WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple subtasks
            var taskId = CreateWorkflowTaskTemplatePrerequisites();
            var typeId = CreateTaskType("Pagination Subtask Type", false, true);

            for (int i = 1; i <= 5; i++)
            {
                CreateWorkflowSubtaskTemplate($"Subtask {i}", $"Description {i}", taskId, typeId);
            }

            // Act
            var response = await _client.GetAsync("/WorkflowSubtaskTemplate/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<WorkflowSubtaskTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        // Helper methods to create test data
        private int CreateWorkflow(string name, bool isActive)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO workflow (name, is_active, created_at, updated_at) 
                VALUES (@name, @isActive, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@isActive"] = isActive,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateOrgStructure(string name, string version, bool isActive)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, version, is_active, unique_id, created_at, updated_at) 
                VALUES (@name, @version, @isActive, @uniqueId, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@version"] = version,
                    ["@isActive"] = isActive,
                    ["@uniqueId"] = Guid.NewGuid().ToString(),
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateTaskType(string name, bool isForTask, bool isForSubtask)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO task_type (name, is_for_task, is_for_subtask, created_at, updated_at) 
                VALUES (@name, @isForTask, @isForSubtask, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@isForTask"] = isForTask,
                    ["@isForSubtask"] = isForSubtask,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateWorkflowTaskTemplate(string name, int workflowId, int order, bool isActive, bool isRequired,
                                              string description, int structureId, int typeId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO workflow_task_template (
                    name, workflow_id, ""order"", is_active, is_required, description, 
                    structure_id, type_id, created_at, updated_at
                ) 
                VALUES (
                    @name, @workflowId, @order, @isActive, @isRequired, @description, 
                    @structureId, @typeId, @created_at, @updated_at
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@workflowId"] = workflowId,
                    ["@order"] = order,
                    ["@isActive"] = isActive,
                    ["@isRequired"] = isRequired,
                    ["@description"] = description,
                    ["@structureId"] = structureId,
                    ["@typeId"] = typeId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateWorkflowSubtaskTemplate(string name, string description, int workflowTaskId, int typeId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO workflow_subtask_template (
                    name, description, workflow_task_id, type_id, created_at, updated_at
                )
                VALUES (
                    @name, @description, @workflowTaskId, @typeId, @created_at, @updated_at
                )
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@workflowTaskId"] = workflowTaskId,
                    ["@typeId"] = typeId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        // Creates all the prerequisites for a workflow task template and returns the task id
        private int CreateWorkflowTaskTemplatePrerequisites()
        {
            var workflowId = CreateWorkflow($"Workflow {Guid.NewGuid().ToString().Substring(0, 8)}", true);
            var structureId = CreateOrgStructure($"Structure {Guid.NewGuid().ToString().Substring(0, 8)}", "1.0", true);
            var taskTypeId = CreateTaskType($"Task Type {Guid.NewGuid().ToString().Substring(0, 8)}", true, false);

            return CreateWorkflowTaskTemplate(
                $"Task {Guid.NewGuid().ToString().Substring(0, 8)}",
                workflowId,
                1,
                true,
                true,
                $"Description {Guid.NewGuid().ToString().Substring(0, 8)}",
                structureId,
                taskTypeId
            );
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}