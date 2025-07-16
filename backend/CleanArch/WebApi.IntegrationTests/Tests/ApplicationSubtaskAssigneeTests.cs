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
    public class ApplicationSubtaskAssigneeTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationSubtaskAssigneeTests()
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
            // Arrange - Create test application_subtask_assignees
            var (employeeInStructureId, subtaskId) = SetupPrerequisites();
            CreateApplicationSubtaskAssignee(employeeInStructureId, subtaskId);
            CreateApplicationSubtaskAssignee(employeeInStructureId, subtaskId);

            // Act
            var response = await _client.GetAsync("/application_subtask_assignee/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_subtask_assignee>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test application_subtask_assignee
            var (employeeInStructureId, subtaskId) = SetupPrerequisites();
            var id = CreateApplicationSubtaskAssignee(employeeInStructureId, subtaskId);

            // Act
            var response = await _client.GetAsync($"/application_subtask_assignee/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_subtask_assignee>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(employeeInStructureId, result.structure_employee_id);
            Assert.Equal(subtaskId, result.application_subtask_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var (employeeInStructureId, subtaskId) = SetupPrerequisites();
            var request = new Createapplication_subtask_assigneeRequest
            {
                structure_employee_id = employeeInStructureId,
                application_subtask_id = subtaskId,
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/application_subtask_assignee", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_subtask_assignee>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(employeeInStructureId, result.structure_employee_id);
            Assert.Equal(subtaskId, result.application_subtask_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var (employeeInStructureId, subtaskId) = SetupPrerequisites();
            var (newEmployeeInStructureId, _) = SetupPrerequisites(createNewApplication: false);
            var id = CreateApplicationSubtaskAssignee(employeeInStructureId, subtaskId);

            var request = new Updateapplication_subtask_assigneeRequest
            {
                id = id,
                structure_employee_id = newEmployeeInStructureId,
                application_subtask_id = subtaskId,
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PutAsync($"/application_subtask_assignee/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_subtask_assignee>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newEmployeeInStructureId, result.structure_employee_id);
            Assert.Equal(subtaskId, result.application_subtask_id);

            // Verify in database
            var updated = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT structure_employee_id FROM application_subtask_assignee WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(newEmployeeInStructureId, updated);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var (employeeInStructureId, subtaskId) = SetupPrerequisites();
            var id = CreateApplicationSubtaskAssignee(employeeInStructureId, subtaskId);

            // Act
            var response = await _client.DeleteAsync($"/application_subtask_assignee/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            int deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_subtask_assignee WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test application_subtask_assignees
            var (employeeInStructureId, subtaskId) = SetupPrerequisites();
            for (int i = 0; i < 5; i++)
            {
                CreateApplicationSubtaskAssignee(employeeInStructureId, subtaskId);
            }

            // Act
            var response = await _client.GetAsync("/application_subtask_assignee/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<application_subtask_assignee>>(content);

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
        public async Task GetBystructure_employee_id_ReturnsOkResponse()
        {
            // Arrange
            var (employeeInStructureId, subtaskId) = SetupPrerequisites();
            var (otherEmployeeInStructureId, _) = SetupPrerequisites(createNewApplication: false);

            // Create multiple entries for the same employee
            CreateApplicationSubtaskAssignee(employeeInStructureId, subtaskId);
            CreateApplicationSubtaskAssignee(employeeInStructureId, subtaskId);
            // Create another entry for different employee
            CreateApplicationSubtaskAssignee(otherEmployeeInStructureId, subtaskId);

            // Act
            var response = await _client.GetAsync($"/application_subtask_assignee/GetBystructure_employee_id?structure_employee_id={employeeInStructureId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_subtask_assignee>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(employeeInStructureId, item.structure_employee_id));
        }

        [Fact]
        public async Task GetByapplication_subtask_id_ReturnsOkResponse()
        {
            // Arrange
            var (employeeInStructureId, subtaskId) = SetupPrerequisites();
            var (_, otherSubtaskId) = SetupPrerequisites();

            // Create multiple entries for the same subtask
            CreateApplicationSubtaskAssignee(employeeInStructureId, subtaskId);
            CreateApplicationSubtaskAssignee(employeeInStructureId, subtaskId);
            // Create another entry for different subtask
            CreateApplicationSubtaskAssignee(employeeInStructureId, otherSubtaskId);

            // Act
            var response = await _client.GetAsync($"/application_subtask_assignee/GetByapplication_subtask_id?application_subtask_id={subtaskId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_subtask_assignee>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(subtaskId, item.application_subtask_id));
        }

        // Helper methods to set up test data

        private (int employeeInStructureId, int subtaskId) SetupPrerequisites(bool createNewApplication = true)
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
                INSERT INTO employee_in_structure (employee_id, structure_id, date_start, post_id) 
                VALUES (@employeeId, @structureId, @dateStart, 1) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@employeeId"] = employeeId,
                    ["@structureId"] = structureId,
                    ["@dateStart"] = DateTime.Now
                });

            int subtaskId;

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

                // 5. Create application_task
                var taskId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO application_task (application_id, name, status_id, structure_id) 
                    VALUES (@applicationId, @name, 1, @structureId) 
                    RETURNING id;",
                    new Dictionary<string, object>
                    {
                        ["@applicationId"] = applicationId,
                        ["@name"] = $"Test Task {Guid.NewGuid().ToString().Substring(0, 8)}",
                        ["@structureId"] = structureId
                    });

                // 6. Create application_subtask
                subtaskId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO application_subtask (application_id, name, status_id, application_task_id, description) 
                    VALUES (@applicationId, @name, 1, @taskId, @description) 
                    RETURNING id;",
                    new Dictionary<string, object>
                    {
                        ["@applicationId"] = applicationId,
                        ["@name"] = $"Test Subtask {Guid.NewGuid().ToString().Substring(0, 8)}",
                        ["@taskId"] = taskId,
                        ["@description"] = $"Test description for subtask {Guid.NewGuid().ToString().Substring(0, 8)}"
                    });
            }
            else
            {
                // Get an existing subtask
                subtaskId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    SELECT id FROM application_subtask ORDER BY id DESC LIMIT 1;");
            }

            return (employeeInStructureId, subtaskId);
        }

        private int CreateApplicationSubtaskAssignee(int employeeInStructureId, int subtaskId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_subtask_assignee (structure_employee_id, application_subtask_id, created_at, updated_at) 
                VALUES (@employeeInStructureId, @subtaskId, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@employeeInStructureId"] = employeeInStructureId,
                    ["@subtaskId"] = subtaskId,
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

    // DTO classes needed for testing - these would typically be in the WebApi.Dtos namespace
    // Adding them here for completeness in case they're not accessible in the test context
    public class Createapplication_subtask_assigneeRequest
    {
        public int structure_employee_id { get; set; }
        public int application_subtask_id { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
    }

    public class Updateapplication_subtask_assigneeRequest
    {
        public int id { get; set; }
        public int structure_employee_id { get; set; }
        public int application_subtask_id { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
    }
}