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
    public class ContragentInteractionTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ContragentInteractionTests()
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
            // Arrange - Create test data
            var (applicationId, contragentId) = await CreatePrerequisites();
            int interactionId = CreateContragentInteraction(applicationId, contragentId, "Test interaction");

            // Act
            var response = await _client.GetAsync("/contragent_interaction/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<contragent_interaction>>(content);

            Assert.NotNull(result);
            Assert.Contains(result, i => i.id == interactionId);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (applicationId, contragentId) = await CreatePrerequisites();

            // Create multiple interactions
            for (int i = 0; i < 5; i++)
            {
                CreateContragentInteraction(applicationId, contragentId, $"Test interaction {i}");
            }

            // Act
            var response = await _client.GetAsync("/contragent_interaction/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<contragent_interaction>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (applicationId, contragentId) = await CreatePrerequisites();
            int interactionId = CreateContragentInteraction(applicationId, contragentId, "Single Test Interaction");

            // Act
            var response = await _client.GetAsync($"/contragent_interaction/{interactionId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<contragent_interaction>(content);

            Assert.NotNull(result);
            Assert.Equal(interactionId, result.id);
            Assert.Equal("Single Test Interaction", result.name);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal(contragentId, result.contragent_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites
            var (applicationId, contragentId) = await CreatePrerequisites();

            // Create a task for the application
            int taskId = CreateApplicationTask(applicationId);

            var createRequest = new Createcontragent_interactionRequest
            {
                application_id = applicationId,
                contragent_id = contragentId,
                task_id = taskId,
                name = "Created Interaction",
                description = "Test Description",
                progress = 25,
                status = "В работе"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/contragent_interaction", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<contragent_interaction>(content);

            Assert.NotNull(result);
            Assert.Equal(createRequest.name, result.name);
            Assert.Equal(createRequest.description, result.description);
            Assert.Equal(createRequest.progress, result.progress);
            Assert.Equal(createRequest.status, result.status);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal(contragentId, result.contragent_id);
            Assert.Equal(taskId, result.task_id);

            // Verify in database
            var savedInteraction = await GetContragentInteractionFromDb(result.id);
            Assert.NotNull(savedInteraction);
            Assert.Equal(createRequest.name, savedInteraction.name);
            Assert.Equal(createRequest.description, savedInteraction.description);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (applicationId, contragentId) = await CreatePrerequisites();
            int interactionId = CreateContragentInteraction(applicationId, contragentId, "Original Interaction");

            var updateRequest = new Updatecontragent_interactionRequest
            {
                id = interactionId,
                application_id = applicationId,
                contragent_id = contragentId,
                name = "Updated Interaction",
                description = "Updated Description",
                progress = 50,
                status = "Завершено"
            };

            // Act
            var response = await _client.PutAsync($"/contragent_interaction/{interactionId}", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<contragent_interaction>(content);

            Assert.NotNull(result);
            Assert.Equal(updateRequest.id, result.id);
            Assert.Equal(updateRequest.name, result.name);
            Assert.Equal(updateRequest.description, result.description);
            Assert.Equal(updateRequest.progress, result.progress);
            Assert.Equal(updateRequest.status, result.status);

            // Verify in database
            var updatedInteraction = await GetContragentInteractionFromDb(interactionId);
            Assert.NotNull(updatedInteraction);
            Assert.Equal("Updated Interaction", updatedInteraction.name);
            Assert.Equal("Updated Description", updatedInteraction.description);
            Assert.Equal(50, updatedInteraction.progress);
            Assert.Equal("Завершено", updatedInteraction.status);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (applicationId, contragentId) = await CreatePrerequisites();
            int interactionId = CreateContragentInteraction(applicationId, contragentId, "To Delete Interaction");

            // Act
            var response = await _client.DeleteAsync($"/contragent_interaction/{interactionId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(interactionId, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM contragent_interaction WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = interactionId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetByapplication_id_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (applicationId, contragentId) = await CreatePrerequisites();
            int interaction1 = CreateContragentInteraction(applicationId, contragentId, "App Interaction 1");
            int interaction2 = CreateContragentInteraction(applicationId, contragentId, "App Interaction 2");

            // Create a different application and interaction
            var (otherAppId, _) = await CreatePrerequisites();
            CreateContragentInteraction(otherAppId, contragentId, "Other App Interaction");

            // Act
            var response = await _client.GetAsync($"/contragent_interaction/GetByapplication_id?application_id={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<contragent_interaction>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, i => i.id == interaction1);
            Assert.Contains(result, i => i.id == interaction2);
            Assert.All(result, i => Assert.Equal(applicationId, i.application_id));
        }

        [Fact]
        public async Task GetBytask_id_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (applicationId, contragentId) = await CreatePrerequisites();
            int taskId = CreateApplicationTask(applicationId);
            int interaction1 = CreateContragentInteraction(applicationId, contragentId, "Task Interaction 1", taskId);
            int interaction2 = CreateContragentInteraction(applicationId, contragentId, "Task Interaction 2", taskId);

            // Create a different task and interaction
            int otherTaskId = CreateApplicationTask(applicationId);
            CreateContragentInteraction(applicationId, contragentId, "Other Task Interaction", otherTaskId);

            // Act
            var response = await _client.GetAsync($"/contragent_interaction/GetBytask_id?task_id={taskId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<contragent_interaction>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, i => i.id == interaction1);
            Assert.Contains(result, i => i.id == interaction2);
            Assert.All(result, i => Assert.Equal(taskId, i.task_id));
        }

        [Fact]
        public async Task GetBycontragent_id_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (applicationId, contragentId) = await CreatePrerequisites();
            int interaction1 = CreateContragentInteraction(applicationId, contragentId, "Contragent Interaction 1");

            // Create a different application but same contragent
            var (otherAppId, _) = await CreatePrerequisites();
            int interaction2 = CreateContragentInteraction(otherAppId, contragentId, "Contragent Interaction 2");

            // Create a different contragent
            int otherContragentId = CreateContragent("Other Contragent");
            CreateContragentInteraction(applicationId, otherContragentId, "Other Contragent Interaction");

            // Act
            var response = await _client.GetAsync($"/contragent_interaction/GetBycontragent_id?contragent_id={contragentId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<contragent_interaction>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, i => i.id == interaction1);
            Assert.Contains(result, i => i.id == interaction2);
            Assert.All(result, i => Assert.Equal(contragentId, i.contragent_id));
        }

        [Fact]
        public async Task GetFilter_ReturnsOkResponse()
        {
            // Arrange - Create test data with specific properties for filtering
            var districtId = CreateDistrict("Test District");
            var customerId = CreateCustomer("Test Customer", "123456789", false);
            var archObjectId = CreateArchObject("Test Object", "Filtering Address", districtId);
            var serviceId = CreateService("Test Service", 10);
            var statusId = CreateStatus("Review", "review");
            var workflowId = CreateWorkflow("Test Workflow");

            // Create application with specific number and link with arch object
            var applicationId = CreateApplication(customerId, serviceId, statusId, workflowId, "TEST-FILTER-123");
            LinkApplicationToArchObject(applicationId, archObjectId);

            var contragentId = CreateContragent("Test Contragent");
            int interactionId = CreateContragentInteraction(applicationId, contragentId, "Filterable Interaction");

            // Act
            var response = await _client.GetAsync("/contragent_interaction/GetFilter?number=FILTER&address=Filtering&pin=123456789");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<contragent_interaction>>(content);

            //Assert.NotNull(result);
            //Assert.Contains(result, i => i.id == interactionId);
        }

        #region Helper Methods

        private async Task<(int applicationId, int contragentId)> CreatePrerequisites()
        {
            // Create required entities for contragent_interaction
            int districtId = CreateDistrict("Test District");
            int customerId = CreateCustomer("Test Customer", "123456789", false);
            int archObjectId = CreateArchObject("Test Object", "Test Address", districtId);
            int serviceId = CreateService("Test Service", 10);
            int statusId = CreateStatus("Review", "review");
            int workflowId = CreateWorkflow("Test Workflow");

            // Create application and link with arch object
            int applicationId = CreateApplication(customerId, serviceId, statusId, workflowId);
            LinkApplicationToArchObject(applicationId, archObjectId);

            int contragentId = CreateContragent("Test Contragent");

            return (applicationId, contragentId);
        }

        private int CreateContragentInteraction(int applicationId, int contragentId, string name, int? taskId = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO contragent_interaction (
                    application_id, contragent_id, task_id, name, description, progress, status, created_at, updated_at
                ) VALUES (
                    @application_id, @contragent_id, @task_id, @name, @description, @progress, @status, @created_at, @updated_at
                ) RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@contragent_id"] = contragentId,
                    ["@task_id"] = taskId as object ?? DBNull.Value,
                    ["@name"] = name,
                    ["@description"] = "Test description",
                    ["@progress"] = 0,
                    ["@status"] = "В работе",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDistrict(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO district (name, created_at, updated_at)
                VALUES (@name, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateCustomer(string fullName, string pin, bool isOrganization)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer (full_name, pin, is_organization, created_at, updated_at)
                VALUES (@full_name, @pin, @is_organization, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@full_name"] = fullName,
                    ["@pin"] = pin,
                    ["@is_organization"] = isOrganization,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateArchObject(string name, string address, int districtId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO arch_object (name, address, district_id, created_at, updated_at)
                VALUES (@name, @address, @district_id, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@address"] = address,
                    ["@district_id"] = districtId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateService(string name, int dayCount)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO service (name, day_count, is_active, created_at, updated_at)
                VALUES (@name, @day_count, @is_active, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@day_count"] = dayCount,
                    ["@is_active"] = true,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateStatus(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_status (name, code, created_at, updated_at)
                VALUES (@name, @code, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateWorkflow(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO workflow (name, is_active, created_at, updated_at)
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

        private int CreateApplication(int customerId, int serviceId, int statusId, int workflowId, string number = null)
        {
            if (string.IsNullOrEmpty(number))
            {
                number = $"APP-{Guid.NewGuid().ToString().Substring(0, 8)}";
            }

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (
                    registration_date, customer_id, status_id, workflow_id, service_id,
                    number, created_at, updated_at
                ) VALUES (
                    @registration_date, @customer_id, @status_id, @workflow_id, @service_id,
                    @number, @created_at, @updated_at
                ) RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@registration_date"] = DateTime.Now,
                    ["@customer_id"] = customerId,
                    ["@status_id"] = statusId,
                    ["@workflow_id"] = workflowId,
                    ["@service_id"] = serviceId,
                    ["@number"] = number,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private void LinkApplicationToArchObject(int applicationId, int archObjectId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_object (application_id, arch_object_id, created_at, updated_at)
                VALUES (@application_id, @arch_object_id, @created_at, @updated_at);",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@arch_object_id"] = archObjectId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateContragent(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO contragent (name, created_at, updated_at)
                VALUES (@name, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateApplicationTask(int applicationId)
        {
            // First create task status if needed
            int statusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT id FROM task_status WHERE code = 'assigned' LIMIT 1;",
                new Dictionary<string, object>());

            if (statusId == 0)
            {
                statusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO task_status (name, code, created_at, updated_at)
                    VALUES (@name, @code, @created_at, @updated_at)
                    RETURNING id;",
                    new Dictionary<string, object>
                    {
                        ["@name"] = "Assigned",
                        ["@code"] = "assigned",
                        ["@created_at"] = DateTime.Now,
                        ["@updated_at"] = DateTime.Now
                    });
            }

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_task (
                    application_id, name, comment, is_required, status_id, progress, created_at, updated_at
                ) VALUES (
                    @application_id, @name, @comment, @is_required, @status_id, @progress, @created_at, @updated_at
                ) RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@name"] = "Test Task",
                    ["@comment"] = "Test task comment",
                    ["@is_required"] = true,
                    ["@status_id"] = statusId,
                    ["@progress"] = 0,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<contragent_interaction> GetContragentInteractionFromDb(int id)
        {
            return DatabaseHelper.RunQueryList<contragent_interaction>(_schemaName, @"
                SELECT id, application_id, contragent_id, task_id, name, description, progress, status,
                       created_at, updated_at, created_by, updated_by
                FROM contragent_interaction
                WHERE id = @id",
                reader => new contragent_interaction
                {
                    id = reader.GetInt32(0),
                    application_id = reader.GetInt32(1),
                    contragent_id = reader.GetInt32(2),
                    task_id = reader.IsDBNull(3) ? null : reader.GetInt32(3),
                    name = reader.GetString(4),
                    description = reader.GetString(5),
                    progress = reader.IsDBNull(6) ? null : reader.GetInt32(6),
                    status = reader.IsDBNull(7) ? null : reader.GetString(7),
                    created_at = reader.IsDBNull(8) ? null : reader.GetDateTime(8),
                    updated_at = reader.IsDBNull(9) ? null : reader.GetDateTime(9),
                    created_by = reader.IsDBNull(10) ? null : reader.GetInt32(10),
                    updated_by = reader.IsDBNull(11) ? null : reader.GetInt32(11)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        #endregion

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}