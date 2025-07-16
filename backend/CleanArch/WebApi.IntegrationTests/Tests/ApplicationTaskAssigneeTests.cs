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
    public class ApplicationTaskAssigneeTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationTaskAssigneeTests()
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
            // Arrange - Create test application_task_assignees
            var (taskId, employeeInStructureId) = SetupPrerequisites();
            CreateApplicationTaskAssignee(taskId, employeeInStructureId);
            CreateApplicationTaskAssignee(taskId, employeeInStructureId);

            // Act
            var response = await _client.GetAsync("/application_task_assignee/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_task_assignee>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test application_task_assignee
            var (taskId, employeeInStructureId) = SetupPrerequisites();
            var id = CreateApplicationTaskAssignee(taskId, employeeInStructureId);

            // Act
            var response = await _client.GetAsync($"/application_task_assignee/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_task_assignee>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(employeeInStructureId, result.structure_employee_id);
            Assert.Equal(taskId, result.application_task_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var (taskId, employeeInStructureId) = SetupPrerequisites();
            var request = new Createapplication_task_assigneeRequest
            {
                structure_employee_id = employeeInStructureId,
                application_task_id = taskId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/application_task_assignee", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_task_assignee>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(employeeInStructureId, result.structure_employee_id);
            Assert.Equal(taskId, result.application_task_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var (taskId, employeeInStructureId) = SetupPrerequisites();
            var (_, newEmployeeInStructureId) = SetupPrerequisites(createNewApplication: false);
            var id = CreateApplicationTaskAssignee(taskId, employeeInStructureId);

            var request = new Updateapplication_task_assigneeRequest
            {
                id = id,
                structure_employee_id = newEmployeeInStructureId,
                application_task_id = taskId
            };

            // Act
            var response = await _client.PutAsync($"/application_task_assignee/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_task_assignee>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newEmployeeInStructureId, result.structure_employee_id);
            Assert.Equal(taskId, result.application_task_id);

            // Verify in database
            var updated = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT structure_employee_id FROM application_task_assignee WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(newEmployeeInStructureId, updated);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var (taskId, employeeInStructureId) = SetupPrerequisites();
            var id = CreateApplicationTaskAssignee(taskId, employeeInStructureId);

            // Act
            var response = await _client.DeleteAsync($"/application_task_assignee/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_task_assignee WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test application_task_assignees
            var (taskId, employeeInStructureId) = SetupPrerequisites();
            for (int i = 0; i < 5; i++)
            {
                CreateApplicationTaskAssignee(taskId, employeeInStructureId);
            }

            // Act
            var response = await _client.GetAsync("/application_task_assignee/GetPaginated?pageSize=3&pageNumber=0");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<application_task_assignee>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            //Assert.Equal(5, result.totalCount);
            //Assert.Equal(1, result.pageNumber);
            //Assert.Equal(2, result.totalPages);
        }

        [Fact]
        public async Task GetByapplication_task_id_ReturnsOkResponse()
        {
            // Arrange
            var (taskId, employeeInStructureId) = SetupPrerequisites();
            var (otherTaskId, _) = SetupPrerequisites();

            CreateApplicationTaskAssignee(taskId, employeeInStructureId);
            CreateApplicationTaskAssignee(taskId, employeeInStructureId);
            CreateApplicationTaskAssignee(otherTaskId, employeeInStructureId);

            // Act
            var response = await _client.GetAsync($"/application_task_assignee/GetByapplication_task_id?application_task_id={taskId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_task_assignee>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(taskId, item.application_task_id));
        }

        // Helper methods to set up test data

        private (int taskId, int employeeInStructureId) SetupPrerequisites(bool createNewApplication = true)
        {
            // 1. Create employee
            var employeeId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (last_name, first_name, second_name, user_id, guid) 
                VALUES ('Test', 'Employee', 'Name', @userId, @guid) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@userId"] = Guid.NewGuid().ToString(),
                    ["@guid"] = Guid.NewGuid().ToString()
                });

            // 2. Create structure
            var structureId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (unique_id, name, version, is_active, date_start) 
                VALUES (@uniqueId, @name, @version, true, @dateStart) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@uniqueId"] = Guid.NewGuid().ToString(),
                    ["@name"] = $"Test Structure {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@version"] = "1.0",
                    ["@dateStart"] = DateTime.Now
                });

            // 3. Create employee_in_structure
            var employeeInStructureId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee_in_structure (employee_id, structure_id, date_start) 
                VALUES (@employeeId, @structureId, @dateStart) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@employeeId"] = employeeId,
                    ["@structureId"] = structureId,
                    ["@dateStart"] = DateTime.Now
                });

            int taskId;

            if (createNewApplication)
            {
                // 4. Create application
                var applicationId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO application (registration_date, status_id, workflow_id, service_id) 
                    VALUES (@registrationDate, 1, 1, 1) 
                    RETURNING id;",
                    new Dictionary<string, object>
                    {
                        ["@registrationDate"] = DateTime.Now
                    });

                // 5. Create task status if it doesn't exist
                var statusExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    SELECT COUNT(*) FROM task_status WHERE code = 'assigned';");

                if (statusExists == 0)
                {
                    DatabaseHelper.RunQuery<int>(_schemaName, @"
                        INSERT INTO task_status (name, code, backcolor, textcolor) 
                        VALUES ('Assigned', 'assigned', '#e1a7f3', '#000000');");
                }

                var statusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    SELECT id FROM task_status WHERE code = 'assigned' LIMIT 1;");

                // 6. Create application_task
                taskId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO application_task (application_id, name, status_id, structure_id) 
                    VALUES (@applicationId, @name, @statusId, @structureId) 
                    RETURNING id;",
                    new Dictionary<string, object>
                    {
                        ["@applicationId"] = applicationId,
                        ["@name"] = $"Test Task {Guid.NewGuid().ToString().Substring(0, 8)}",
                        ["@statusId"] = statusId,
                        ["@structureId"] = structureId
                    });
            }
            else
            {
                // Get an existing task
                taskId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    SELECT id FROM application_task ORDER BY id DESC LIMIT 1;");
            }

            return (taskId, employeeInStructureId);
        }

        private int CreateApplicationTaskAssignee(int taskId, int employeeInStructureId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_task_assignee (application_task_id, structure_employee_id, created_at, updated_at) 
                VALUES (@taskId, @employeeInStructureId, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@taskId"] = taskId,
                    ["@employeeInStructureId"] = employeeInStructureId,
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