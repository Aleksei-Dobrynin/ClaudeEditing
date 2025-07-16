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
using System.Net.Http.Headers;
using System.IO;
using FluentResults;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ApplicationTaskTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationTaskTests()
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
            // Arrange - Create test application_tasks
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();

            CreateApplicationTask(applicationId, structureId, "Task 1");
            CreateApplicationTask(applicationId, structureId, "Task 2");

            // Act
            var response = await _client.GetAsync("/application_task/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_task>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test application_task
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();

            var id = CreateApplicationTask(applicationId, structureId, "Test Task");

            // Act
            var response = await _client.GetAsync($"/application_task/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_task>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Test Task", result.name);
            Assert.Equal(applicationId, result.application_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();

            // Setup status
            var statusId = CreateTaskStatus("assigned", "Assigned");

            // Setup type
            var typeId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO task_type (name, code) 
                VALUES ('Test Type', 'test_type') 
                RETURNING id;");

            // Create work_document_type
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                CREATE TABLE IF NOT EXISTS work_document_type (
                    id SERIAL PRIMARY KEY,
                    name TEXT,
                    code TEXT
                );
                
                INSERT INTO work_document_type (name, code) 
                VALUES ('Work Document', 'work') 
                RETURNING id;");

            // Create multipart form content
            var formData = new MultipartFormDataContent();
            formData.Add(new StringContent(applicationId.ToString()), "application_id");
            formData.Add(new StringContent(structureId.ToString()), "structure_id");
            formData.Add(new StringContent("Test Task from Test"), "name");
            formData.Add(new StringContent("Test Comment"), "comment");
            formData.Add(new StringContent(statusId.ToString()), "status_id");
            formData.Add(new StringContent("true"), "is_required");
            formData.Add(new StringContent("1"), "order");
            formData.Add(new StringContent(typeId.ToString()), "type_id");

            // Act
            var response = await _client.PostAsync("/application_task", formData);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_task>(content);

            Assert.NotNull(result);
            //Assert.True(result.);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Test Task from Test", result.name);
            Assert.Equal("Test Comment", result.comment);
            Assert.Equal(applicationId, result.application_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();
            var statusId = CreateTaskStatus("assigned", "Assigned");

            var id = CreateApplicationTask(applicationId, structureId, "Original Task");

            // Get the current task to get updated_at
            var getResponse = await _client.GetAsync($"/application_task/{id}");
            getResponse.EnsureSuccessStatusCode();
            var taskContent = await getResponse.Content.ReadAsStringAsync();
            var task = JsonConvert.DeserializeObject<application_task>(taskContent);

            // Create multipart form content for update
            var formData = new MultipartFormDataContent();
            formData.Add(new StringContent(id.ToString()), "id");
            formData.Add(new StringContent(applicationId.ToString()), "application_id");
            formData.Add(new StringContent(structureId.ToString()), "structure_id");
            formData.Add(new StringContent("Updated Task"), "name");
            formData.Add(new StringContent("Updated Comment"), "comment");
            formData.Add(new StringContent(statusId.ToString()), "status_id");
            formData.Add(new StringContent("true"), "is_required");
            formData.Add(new StringContent("1"), "order");
            formData.Add(new StringContent("1"), "type_id");
            formData.Add(new StringContent(task.updated_at?.ToString("o") ?? DateTime.Now.ToString("o")), "updated_at");

            // Act
            var response = await _client.PutAsync($"/application_task/{id}", formData);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_task>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Task", result.name);
            Assert.Equal("Updated Comment", result.comment);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();

            var id = CreateApplicationTask(applicationId, structureId, "Task to Delete");

            // Act
            var response = await _client.DeleteAsync($"/application_task/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_task WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetByapplication_id_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();

            CreateApplicationTask(applicationId, structureId, "Task 1 for App");
            CreateApplicationTask(applicationId, structureId, "Task 2 for App");

            // Create another application with tasks to confirm filtering
            var otherAppId = CreateTestApplication();
            CreateApplicationTask(otherAppId, structureId, "Task for Other App");

            // Act
            var response = await _client.GetAsync($"/application_task/GetByapplication_id?application_id={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_task>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(applicationId, item.application_id));
        }

        [Fact]
        public async Task ChangeStatus_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();

            // Create statuses
            var currentStatusId = CreateTaskStatus("assigned", "Assigned");
            var newStatusId = CreateTaskStatus("at_work", "At Work");

            // Create app status for the test
            var reviewStatusId = CreateApplicationStatus("review", "Review");
            var preparationStatusId = CreateApplicationStatus("preparation", "Preparation");

            // Update application with needed status
            DatabaseHelper.RunQuery<int>(_schemaName, @"
        UPDATE application SET status_id = @status_id
        WHERE id = @id",
                new Dictionary<string, object>
                {
                    ["@id"] = applicationId,
                    ["@status_id"] = reviewStatusId
                });

            // Create tables needed for status change
            DatabaseHelper.RunQuery<int>(_schemaName, @"
        CREATE TABLE IF NOT EXISTS application_status_history (
            id SERIAL PRIMARY KEY,
            application_id INTEGER,
            status_id INTEGER,
            date_change TIMESTAMP,
            user_id INTEGER,
            old_status_id INTEGER
        );");

            // Create n8n repository table if needed
            DatabaseHelper.RunQuery<int>(_schemaName, @"
        CREATE TABLE IF NOT EXISTS n8n_repository (
            id SERIAL PRIMARY KEY,
            name TEXT,
            url TEXT,
            description TEXT
        );");

            var taskId = CreateApplicationTask(applicationId, structureId, "Task Status Change", currentStatusId);

            var request = new application_taskController.ChangeTaskStatus
            {
                task_id = taskId,
                status_id = newStatusId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/application_task/ChangeStatus", request);

            // If response is not successful, get the error content for diagnostics
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Error response: {errorContent}");
                Console.WriteLine($"Status Code: {response.StatusCode}");
            }

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(taskId, result);

            // Verify in database
            var statusUpdated = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT status_id FROM application_task WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = taskId });

            Assert.Equal(newStatusId, statusUpdated);

            // Verify application status was updated (review -> preparation)
            var appStatus = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT status_id FROM application WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = applicationId });

            Assert.Equal(preparationStatusId, appStatus);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test application_tasks
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();

            for (int i = 0; i < 5; i++)
            {
                CreateApplicationTask(applicationId, structureId, $"Task {i + 1}");
            }

            // Act
            var response = await _client.GetAsync("/application_task/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<application_task>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount); //TODO check values
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        [Fact]
        public async Task GetMyTasks_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();

            // Создаем связь между test-user-id и сотрудником
            SetupTestEmployee(structureId);

            // Создаем задачи для текущего пользователя (установленного в TestAuthHandler)
            var taskId1 = CreateApplicationTaskWithAssignee(applicationId, structureId, "My Task 1");
            var taskId2 = CreateApplicationTaskWithAssignee(applicationId, structureId, "My Task 2");

            // Создаем подзадачи для задач
            CreateTestSubtask(taskId1, "Subtask 1", "assigned");
            CreateTestSubtask(taskId2, "Subtask 2", "at_work");

            var request = new application_taskController.ParametersTask
            {
                search = "",
                date_start = DateTime.Now.AddDays(-10),
                date_end = DateTime.Now.AddDays(10),
                isExpiredTasks = false,
                isResolwedTasks = true
            };

            // Act
            var response = await _client.PostAsJsonAsync("/application_task/GetMyTasks", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<datanested>>(content);

            Assert.NotNull(result);
            // Должно быть хотя бы одно задание
            Assert.True(result.Count > 0);
        }


        private void SetupTestEmployee(int structureId)
        {
            // Проверяем, существует ли сотрудник
            var employeeId = DatabaseHelper.RunQuery<int?>(_schemaName, @"
        SELECT id FROM employee WHERE user_id = '1'");

            if (employeeId == null)
            {
                // Создаем сотрудника
                employeeId = DatabaseHelper.RunQuery<int>(_schemaName, @"
            INSERT INTO employee (last_name, first_name, user_id, email) 
            VALUES ('Test', 'User', '1', 'test.user@example.com') 
            RETURNING id;");
            }

            // Проверяем связь сотрудника со структурой
            var eisExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT COUNT(*) FROM employee_in_structure 
        WHERE employee_id = @employee_id AND structure_id = @structure_id",
                new Dictionary<string, object>
                {
                    ["@employee_id"] = employeeId,
                    ["@structure_id"] = structureId
                });

            if (eisExists == 0)
            {
                // Связываем сотрудника со структурой
                DatabaseHelper.RunQuery<int>(_schemaName, @"
            INSERT INTO employee_in_structure (employee_id, structure_id, date_start, date_end) 
            VALUES (@employee_id, @structure_id, @date_start, @date_end) 
            RETURNING id;",
                    new Dictionary<string, object>
                    {
                        ["@employee_id"] = employeeId,
                        ["@structure_id"] = structureId,
                        ["@date_start"] = DateTime.Now.AddDays(-60),
                        ["@date_end"] = DateTime.Now.AddDays(60)
                    });
            }
        }


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

        private int CreateTestStructure()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, is_active, date_start) 
                VALUES (@name, true, @date_start) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = $"Test Structure {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@date_start"] = DateTime.Now
                });
        }

        private int CreateTaskStatus(string code, string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO task_status (code, name) 
                VALUES (@code, @name) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@code"] = code,
                    ["@name"] = name
                });
        }
        private int CreateApplicationStatus(string code, string name)
        {
            // First check if a status with this code already exists
            var existingIdResult = DatabaseHelper.RunQuery<object>(_schemaName,
                "SELECT id FROM application_status WHERE code = @code",
                new Dictionary<string, object> { ["@code"] = code });

            if (existingIdResult != null)
            {
                // Status already exists, return its ID
                return Convert.ToInt32(existingIdResult);
            }

            // Status doesn't exist, create it with auto-generated ID
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
        INSERT INTO application_status (name, code) 
        VALUES (@name, @code)
        RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code
                });
        }
        private int CreateApplicationTask(int applicationId, int structureId, string name, int? statusId = null)
        {
            if (statusId == null)
            {
                statusId = CreateTaskStatus("assigned", "Assigned");
            }

            // Create type_id if needed
            var typeId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO task_type (name, code) 
                VALUES ('Test Type', 'test_type') 
                RETURNING id;");

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_task (application_id, structure_id, name, status_id, created_at, updated_at, type_id) 
                VALUES (@application_id, @structure_id, @name, @status_id, @created_at, @updated_at, @type_id) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@structure_id"] = structureId,
                    ["@name"] = name,
                    ["@status_id"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now,
                    ["@type_id"] = typeId
                });
        }


        private int CreateApplicationTaskWithAssignee(int applicationId, int structureId, string name)
        {
            // Create task with appropriate status
            var statusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT id FROM task_status WHERE code = 'assigned'");

            // Create task type if needed
            var typeId = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT id FROM task_type WHERE code = 'default_task'");
            
            // Create a task
            var taskId = DatabaseHelper.RunQuery<int>(_schemaName, @"
        INSERT INTO application_task (application_id, structure_id, name, status_id, created_at, updated_at, type_id, is_main) 
        VALUES (@application_id, @structure_id, @name, @status_id, @created_at, @updated_at, @type_id, true) 
        RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@structure_id"] = structureId,
                    ["@name"] = name,
                    ["@status_id"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now,
                    ["@type_id"] = typeId
                });

            // Get or create test employee by user_id
            var employeeId = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT id FROM employee WHERE user_id = '1'");

            if (employeeId == 0)
            {
                employeeId = DatabaseHelper.RunQuery<int>(_schemaName, @"INSERT INTO employee 
    (last_name, first_name, second_name, user_id) VALUES ('Test', 'Test', 'Test', '1') 
            RETURNING id;");
            }

            // Get or create employee_in_structure
            var eisId = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT id FROM employee_in_structure 
        WHERE employee_id = @employee_id AND structure_id = @structure_id",
                new Dictionary<string, object>
                {
                    ["@employee_id"] = employeeId,
                    ["@structure_id"] = structureId
                });

            if (eisId == 0)
            {
                eisId = DatabaseHelper.RunQuery<int>(_schemaName, @"
            INSERT INTO employee_in_structure (employee_id, structure_id, date_start, created_at) 
            VALUES (@employee_id, @structure_id, @date_start, @created_at) 
            RETURNING id;",
                    new Dictionary<string, object>
                    {
                        ["@employee_id"] = employeeId,
                        ["@structure_id"] = structureId,
                        ["@date_start"] = DateTime.Now.AddDays(-30),
                        ["@created_at"] = DateTime.Now
                    });
            }

            // Create task assignee if not already assigned
            var assigneeExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT COUNT(*) FROM application_task_assignee 
        WHERE application_task_id = @task_id AND structure_employee_id = @eis_id",
                new Dictionary<string, object>
                {
                    ["@task_id"] = taskId,
                    ["@eis_id"] = eisId
                });

            if (assigneeExists == 0)
            {
                DatabaseHelper.RunQuery<int>(_schemaName, @"
            INSERT INTO application_task_assignee (application_task_id, structure_employee_id, created_at, updated_at) 
            VALUES (@task_id, @eis_id, @created_at, @updated_at);",
                    new Dictionary<string, object>
                    {
                        ["@task_id"] = taskId,
                        ["@eis_id"] = eisId,
                        ["@created_at"] = DateTime.Now,
                        ["@updated_at"] = DateTime.Now
                    });
            }

            return taskId;
        }

        private int CreateTestSubtask(int taskId, string name, string statusCode)
        {
            var statusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT id FROM task_status WHERE code = @code",
                new Dictionary<string, object> { ["@code"] = statusCode });

            var applicationId = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT application_id FROM application_task WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = taskId });

            // Check if subtask already exists
            var existingSubtaskId = DatabaseHelper.RunQuery<int?>(_schemaName, @"
        SELECT id FROM application_subtask 
        WHERE application_task_id = @task_id AND name = @name",
                new Dictionary<string, object>
                {
                    ["@task_id"] = taskId,
                    ["@name"] = name
                });

            if (existingSubtaskId != null)
            {
                return existingSubtaskId.Value;
            }

            // Create a type for the subtask if needed
            var typeId = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT id FROM task_type WHERE name = 'Согласование'");

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
        INSERT INTO application_subtask (application_id, name, status_id, application_task_id, created_at, updated_at, type_id) 
        VALUES (@application_id, @name, @status_id, @task_id, @created_at, @updated_at, @type_id) 
        RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@name"] = name,
                    ["@status_id"] = statusId,
                    ["@task_id"] = taskId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now,
                    ["@type_id"] = typeId
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }

}