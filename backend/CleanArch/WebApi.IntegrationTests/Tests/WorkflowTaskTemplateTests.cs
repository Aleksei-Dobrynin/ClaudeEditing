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
    public class WorkflowTaskTemplateTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public WorkflowTaskTemplateTests()
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
            // Arrange - Create test workflow task templates
            var workflowId = CreateWorkflow("Test Workflow", true);
            var structureId = CreateOrgStructure("Test Structure", "1.0", true);
            var typeId = CreateTaskType("Test Task Type", true, false);

            CreateWorkflowTaskTemplate("Task 1", workflowId, 1, true, true, "Description 1", structureId, typeId);
            CreateWorkflowTaskTemplate("Task 2", workflowId, 2, true, false, "Description 2", structureId, typeId);

            // Act
            var response = await _client.GetAsync("/WorkflowTaskTemplate/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<WorkflowTaskTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, t => t.name == "Task 1" && t.order == 1);
            Assert.Contains(result, t => t.name == "Task 2" && t.order == 2);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test workflow task template
            var workflowId = CreateWorkflow("Single Workflow", true);
            var structureId = CreateOrgStructure("Single Structure", "1.0", true);
            var typeId = CreateTaskType("Single Task Type", true, false);

            var id = CreateWorkflowTaskTemplate("Single Task", workflowId, 1, true, true,
                                               "Single Description", structureId, typeId);

            // Act
            var response = await _client.GetAsync($"/WorkflowTaskTemplate/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkflowTaskTemplate>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Task", result.name);
            Assert.Equal(workflowId, result.workflow_id);
            Assert.Equal(1, result.order);
            Assert.True(result.is_active);
            Assert.True(result.is_required);
            Assert.Equal("Single Description", result.description);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(typeId, result.type_id);
        }

        [Fact]
        public async Task GetByidWorkflow_ReturnsOkResponse()
        {
            // Arrange - Create workflow with multiple tasks
            var workflowId = CreateWorkflow("Workflow For Tasks", true);
            var otherWorkflowId = CreateWorkflow("Other Workflow", true);
            var structureId = CreateOrgStructure("Structure For Tasks", "1.0", true);
            var typeId = CreateTaskType("Task Type For Tasks", true, false);

            CreateWorkflowTaskTemplate("Task For Workflow 1", workflowId, 1, true, true,
                                      "Description 1", structureId, typeId);
            CreateWorkflowTaskTemplate("Task For Workflow 2", workflowId, 2, true, false,
                                      "Description 2", structureId, typeId);
            // Create a task for another workflow to verify filtering
            CreateWorkflowTaskTemplate("Task For Other Workflow", otherWorkflowId, 1, true, true,
                                      "Other Description", structureId, typeId);

            // Act
            var response = await _client.GetAsync($"/WorkflowTaskTemplate/GetByidWorkflow?idWorkflow={workflowId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<WorkflowTaskTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, t => Assert.Equal(workflowId, t.workflow_id));
            Assert.Contains(result, t => t.name == "Task For Workflow 1");
            Assert.Contains(result, t => t.name == "Task For Workflow 2");
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var workflowId = CreateWorkflow("Workflow For Create", true);
            var structureId = CreateOrgStructure("Structure For Create", "1.0", true);
            var typeId = CreateTaskType("Task Type For Create", true, false);

            var request = new CreateWorkflowTaskTemplateRequest
            {
                workflow_id = workflowId,
                name = "Created Task",
                order = 3,
                is_active = true,
                is_required = false,
                description = "Created Description",
                structure_id = structureId,
                type_id = typeId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/WorkflowTaskTemplate/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkflowTaskTemplate>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Task", result.name);
            Assert.Equal(workflowId, result.workflow_id);
            Assert.Equal(3, result.order);
            Assert.True(result.is_active);
            Assert.False(result.is_required);
            Assert.Equal("Created Description", result.description);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(typeId, result.type_id);

            // Verify in database
            var task = DatabaseHelper.RunQueryList<WorkflowTaskTemplate>(_schemaName, @"
                SELECT * FROM workflow_task_template WHERE id = @id",
                reader => new WorkflowTaskTemplate
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    workflow_id = reader.GetInt32(reader.GetOrdinal("workflow_id")),
                    name = reader.GetString(reader.GetOrdinal("name")),
                    order = reader.GetInt32(reader.GetOrdinal("order")),
                    is_active = reader.GetBoolean(reader.GetOrdinal("is_active")),
                    is_required = reader.GetBoolean(reader.GetOrdinal("is_required")),
                    description = !reader.IsDBNull(reader.GetOrdinal("description"))
                        ? reader.GetString(reader.GetOrdinal("description"))
                        : null,
                    structure_id = !reader.IsDBNull(reader.GetOrdinal("structure_id"))
                        ? reader.GetInt32(reader.GetOrdinal("structure_id"))
                        : null,
                    type_id = !reader.IsDBNull(reader.GetOrdinal("type_id"))
                        ? reader.GetInt32(reader.GetOrdinal("type_id"))
                        : null
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(task);
            Assert.Equal("Created Task", task.name);
            Assert.Equal(workflowId, task.workflow_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalWorkflowId = CreateWorkflow("Original Workflow", true);
            var newWorkflowId = CreateWorkflow("New Workflow", true);
            var originalStructureId = CreateOrgStructure("Original Structure", "1.0", true);
            var newStructureId = CreateOrgStructure("New Structure", "1.0", true);
            var originalTypeId = CreateTaskType("Original Task Type", true, false);
            var newTypeId = CreateTaskType("New Task Type", true, false);

            var id = CreateWorkflowTaskTemplate("Original Task", originalWorkflowId, 1, true, true,
                                              "Original Description", originalStructureId, originalTypeId);

            var request = new UpdateWorkflowTaskTemplateRequest
            {
                id = id,
                workflow_id = newWorkflowId,
                name = "Updated Task",
                order = 5,
                is_active = false,
                is_required = false,
                description = "Updated Description",
                structure_id = newStructureId,
                type_id = newTypeId
            };

            // Act
            var response = await _client.PutAsync("/WorkflowTaskTemplate/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkflowTaskTemplate>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Task", result.name);
            Assert.Equal(newWorkflowId, result.workflow_id);
            Assert.Equal(5, result.order);
            Assert.False(result.is_active);
            Assert.False(result.is_required);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal(newStructureId, result.structure_id);
            Assert.Equal(newTypeId, result.type_id);

            // Verify in database
            var task = DatabaseHelper.RunQueryList<WorkflowTaskTemplate>(_schemaName, @"
                SELECT * FROM workflow_task_template WHERE id = @id",
                reader => new WorkflowTaskTemplate
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    workflow_id = reader.GetInt32(reader.GetOrdinal("workflow_id")),
                    name = reader.GetString(reader.GetOrdinal("name")),
                    order = reader.GetInt32(reader.GetOrdinal("order")),
                    is_active = reader.GetBoolean(reader.GetOrdinal("is_active")),
                    is_required = reader.GetBoolean(reader.GetOrdinal("is_required")),
                    description = !reader.IsDBNull(reader.GetOrdinal("description"))
                        ? reader.GetString(reader.GetOrdinal("description"))
                        : null,
                    structure_id = !reader.IsDBNull(reader.GetOrdinal("structure_id"))
                        ? reader.GetInt32(reader.GetOrdinal("structure_id"))
                        : null,
                    type_id = !reader.IsDBNull(reader.GetOrdinal("type_id"))
                        ? reader.GetInt32(reader.GetOrdinal("type_id"))
                        : null
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(task);
            Assert.Equal("Updated Task", task.name);
            Assert.Equal(newWorkflowId, task.workflow_id);
            Assert.Equal(5, task.order);
            Assert.False(task.is_active);
            Assert.False(task.is_required);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var workflowId = CreateWorkflow("Workflow For Delete", true);
            var structureId = CreateOrgStructure("Structure For Delete", "1.0", true);
            var typeId = CreateTaskType("Task Type For Delete", true, false);

            var id = CreateWorkflowTaskTemplate("Task To Delete", workflowId, 1, true, true,
                                              "Description For Delete", structureId, typeId);

            // Act
            var response = await _client.DeleteAsync($"/WorkflowTaskTemplate/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify task was deleted
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM workflow_task_template WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple tasks
            var workflowId = CreateWorkflow("Workflow For Pagination", true);
            var structureId = CreateOrgStructure("Structure For Pagination", "1.0", true);
            var typeId = CreateTaskType("Task Type For Pagination", true, false);

            for (int i = 1; i <= 5; i++)
            {
                CreateWorkflowTaskTemplate($"Task {i}", workflowId, i, true, i % 2 == 0,
                                         $"Description {i}", structureId, typeId);
            }

            // Act
            var response = await _client.GetAsync("/WorkflowTaskTemplate/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<WorkflowTaskTemplate>>(content);

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

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}