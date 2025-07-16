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
    public class WorkflowTaskDependencyTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public WorkflowTaskDependencyTests()
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
            // Arrange - Create test task dependencies
            var (workflowId, taskIds) = CreateWorkflowWithMultipleTasks("Workflow For Dependencies", 3);

            CreateWorkflowTaskDependency(taskIds[1], taskIds[0]); // Task 2 depends on Task 1
            CreateWorkflowTaskDependency(taskIds[2], taskIds[1]); // Task 3 depends on Task 2

            // Act
            var response = await _client.GetAsync("/WorkflowTaskDependency/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<WorkflowTaskDependency>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, d => d.task_id == taskIds[1] && d.dependent_task_id == taskIds[0]);
            Assert.Contains(result, d => d.task_id == taskIds[2] && d.dependent_task_id == taskIds[1]);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test task dependency
            var (workflowId, taskIds) = CreateWorkflowWithMultipleTasks("Single Workflow", 2);

            var id = CreateWorkflowTaskDependency(taskIds[1], taskIds[0]); // Task 2 depends on Task 1

            // Act
            var response = await _client.GetAsync($"/WorkflowTaskDependency/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkflowTaskDependency>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(taskIds[1], result.task_id);
            Assert.Equal(taskIds[0], result.dependent_task_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var (workflowId, taskIds) = CreateWorkflowWithMultipleTasks("Workflow For Create", 2);

            var request = new CreateWorkflowTaskDependencyRequest
            {
                task_id = taskIds[1],
                dependent_task_id = taskIds[0]
            };

            // Act
            var response = await _client.PostAsJsonAsync("/WorkflowTaskDependency/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkflowTaskDependency>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(taskIds[1], result.task_id);
            Assert.Equal(taskIds[0], result.dependent_task_id);

            // Verify in database
            var dependency = DatabaseHelper.RunQueryList<WorkflowTaskDependency>(_schemaName, @"
                SELECT id, task_id, dependent_task_id FROM workflow_task_dependency WHERE id = @id",
                reader => new WorkflowTaskDependency
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    task_id = reader.GetInt32(reader.GetOrdinal("task_id")),
                    dependent_task_id = reader.GetInt32(reader.GetOrdinal("dependent_task_id"))
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(dependency);
            Assert.Equal(taskIds[1], dependency.task_id);
            Assert.Equal(taskIds[0], dependency.dependent_task_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var (workflowId, taskIds) = CreateWorkflowWithMultipleTasks("Workflow For Update", 3);

            // Initially, Task 3 depends on Task 1
            var id = CreateWorkflowTaskDependency(taskIds[2], taskIds[0]);

            // Update to make Task 3 depend on Task 2 instead
            var request = new UpdateWorkflowTaskDependencyRequest
            {
                id = id,
                task_id = taskIds[2],
                dependent_task_id = taskIds[1]
            };

            // Act
            var response = await _client.PutAsync("/WorkflowTaskDependency/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkflowTaskDependency>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(taskIds[2], result.task_id);
            Assert.Equal(taskIds[1], result.dependent_task_id);

            // Verify in database
            var dependency = DatabaseHelper.RunQueryList<WorkflowTaskDependency>(_schemaName, @"
                SELECT task_id, dependent_task_id FROM workflow_task_dependency WHERE id = @id",
                reader => new WorkflowTaskDependency
                {
                    task_id = reader.GetInt32(reader.GetOrdinal("task_id")),
                    dependent_task_id = reader.GetInt32(reader.GetOrdinal("dependent_task_id"))
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(dependency);
            Assert.Equal(taskIds[2], dependency.task_id);
            Assert.Equal(taskIds[1], dependency.dependent_task_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var (workflowId, taskIds) = CreateWorkflowWithMultipleTasks("Workflow For Delete", 2);

            var id = CreateWorkflowTaskDependency(taskIds[1], taskIds[0]); // Task 2 depends on Task 1

            // Act
            var response = await _client.DeleteAsync($"/WorkflowTaskDependency/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify dependency was deleted
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM workflow_task_dependency WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create workflow with multiple tasks
            var (workflowId, taskIds) = CreateWorkflowWithMultipleTasks("Workflow For Pagination", 6);

            // Create 5 dependencies between different tasks
            for (int i = 1; i < 6; i++)
            {
                CreateWorkflowTaskDependency(taskIds[i], taskIds[i - 1]); // Each task depends on the previous one
            }

            // Act
            var response = await _client.GetAsync("/WorkflowTaskDependency/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<WorkflowTaskDependency>>(content);

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

        private int CreateWorkflowTaskDependency(int taskId, int dependentTaskId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO workflow_task_dependency (
                    task_id, dependent_task_id, created_at, updated_at
                )
                VALUES (
                    @taskId, @dependentTaskId, @created_at, @updated_at
                )
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@taskId"] = taskId,
                    ["@dependentTaskId"] = dependentTaskId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        // Create a workflow with a specified number of tasks and return their IDs
        private (int workflowId, List<int> taskIds) CreateWorkflowWithMultipleTasks(string workflowName, int taskCount)
        {
            var workflowId = CreateWorkflow(workflowName, true);
            var structureId = CreateOrgStructure($"Structure for {workflowName}", "1.0", true);
            var taskTypeId = CreateTaskType($"Task Type for {workflowName}", true, false);

            var taskIds = new List<int>();

            for (int i = 0; i < taskCount; i++)
            {
                var taskId = CreateWorkflowTaskTemplate(
                    $"Task {i + 1} for {workflowName}",
                    workflowId,
                    i + 1,
                    true,
                    true,
                    $"Description for Task {i + 1}",
                    structureId,
                    taskTypeId
                );
                taskIds.Add(taskId);
            }

            return (workflowId, taskIds);
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}