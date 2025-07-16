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
    public class WorkflowControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public WorkflowControllerTests()
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
            // Arrange - Create test workflows
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM workflow WHERE id > 0;");
            CreateWorkflow("Test Workflow 1", true, DateTime.Now.AddDays(-10), DateTime.Now.AddDays(10));
            CreateWorkflow("Test Workflow 2", false, DateTime.Now.AddDays(-5), DateTime.Now.AddDays(20));

            // Act
            var response = await _client.GetAsync("/Workflow/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<Workflow>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, w => w.name == "Test Workflow 1" && w.is_active == true);
            Assert.Contains(result, w => w.name == "Test Workflow 2" && w.is_active == false);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test workflow
            var dateStart = DateTime.Now.AddDays(-5);
            var dateEnd = DateTime.Now.AddDays(15);
            var id = CreateWorkflow("Single Workflow", true, dateStart, dateEnd);

            // Act
            var response = await _client.GetAsync($"/Workflow/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Workflow>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Workflow", result.name);
            Assert.True(result.is_active);
            // Date comparison can be tricky due to serialization/deserialization - check day resolution only
            Assert.Equal(dateStart.Date, result.date_start?.Date);
            Assert.Equal(dateEnd.Date, result.date_end?.Date);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var dateStart = DateTime.Now.AddDays(-3);
            var dateEnd = DateTime.Now.AddDays(30);

            var request = new CreateWorkflowRequest
            {
                name = "New Workflow",
                is_active = true,
                date_start = dateStart,
                date_end = dateEnd
            };

            // Act
            var response = await _client.PostAsJsonAsync("/Workflow/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Workflow>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Workflow", result.name);
            Assert.True(result.is_active);
            Assert.Equal(dateStart.Date, result.date_start?.Date);
            Assert.Equal(dateEnd.Date, result.date_end?.Date);

            // Verify in database
            var workflow = DatabaseHelper.RunQueryList<Workflow>(_schemaName, @"
                SELECT id, name, is_active, date_start, date_end FROM workflow WHERE id = @id",
                reader => new Workflow
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    is_active = reader.GetBoolean(2),
                    date_start = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    date_end = reader.IsDBNull(4) ? null : reader.GetDateTime(4)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(workflow);
            Assert.Equal(result.id, workflow.id);
            Assert.Equal("New Workflow", workflow.name);
            Assert.True(workflow.is_active);
            Assert.Equal(dateStart.Date, workflow.date_start?.Date);
            Assert.Equal(dateEnd.Date, workflow.date_end?.Date);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateWorkflow("Workflow To Update", false, DateTime.Now.AddDays(-10), DateTime.Now.AddDays(10));

            var newDateStart = DateTime.Now.AddDays(-2);
            var newDateEnd = DateTime.Now.AddDays(25);

            var request = new UpdateWorkflowRequest
            {
                id = id,
                name = "Updated Workflow",
                is_active = true,
                date_start = newDateStart,
                date_end = newDateEnd
            };

            // Act
            var response = await _client.PutAsync("/Workflow/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Workflow>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Workflow", result.name);
            Assert.True(result.is_active);
            Assert.Equal(newDateStart.Date, result.date_start?.Date);
            Assert.Equal(newDateEnd.Date, result.date_end?.Date);

            // Verify in database
            var workflow = DatabaseHelper.RunQueryList<Workflow>(_schemaName, @"
                SELECT name, is_active, date_start, date_end FROM workflow WHERE id = @id",
                reader => new Workflow
                {
                    name = reader.GetString(0),
                    is_active = reader.GetBoolean(1),
                    date_start = reader.IsDBNull(2) ? null : reader.GetDateTime(2),
                    date_end = reader.IsDBNull(3) ? null : reader.GetDateTime(3)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(workflow);
            Assert.Equal("Updated Workflow", workflow.name);
            Assert.True(workflow.is_active);
            Assert.Equal(newDateStart.Date, workflow.date_start?.Date);
            Assert.Equal(newDateEnd.Date, workflow.date_end?.Date);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateWorkflow("Workflow To Delete", false, null, null);

            // Act
            var response = await _client.DeleteAsync($"/Workflow/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM workflow WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test workflows
            for (int i = 1; i <= 5; i++)
            {
                CreateWorkflow($"Paginated Workflow {i}", i % 2 == 0,
                    DateTime.Now.AddDays(-i), DateTime.Now.AddDays(i * 5));
            }

            // Act
            var response = await _client.GetAsync("/Workflow/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<Workflow>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        [Fact]
        public async Task Workflow_UsedByService_CanBeRetrieved()
        {
            // Arrange
            // First create workflow
            var workflowId = CreateWorkflow("Service Workflow", true, DateTime.Now, DateTime.Now.AddDays(30));

            // Then create service using this workflow
            var serviceId = CreateService("Test Service", workflowId);

            // Act - Retrieve the workflow
            var response = await _client.GetAsync($"/Workflow/GetOneById?id={workflowId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Workflow>(content);

            Assert.NotNull(result);
            Assert.Equal(workflowId, result.id);
            Assert.Equal("Service Workflow", result.name);

            // Verify service uses this workflow
            var service = DatabaseHelper.RunQueryList<dynamic>(_schemaName, @"
                SELECT name, workflow_id FROM service WHERE id = @id",
                reader => new
                {
                    name = reader.GetString(0),
                    workflow_id = reader.GetInt32(1)
                },
                new Dictionary<string, object> { ["@id"] = serviceId }
            ).FirstOrDefault();

            Assert.NotNull(service);
            Assert.Equal(workflowId, service.workflow_id);
        }

        // Helper method to create test workflow
        private int CreateWorkflow(string name, bool isActive, DateTime? dateStart, DateTime? dateEnd)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO workflow (name, is_active, date_start, date_end, created_at, updated_at) 
                VALUES (@name, @is_active, @date_start, @date_end, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@is_active"] = isActive,
                    ["@date_start"] = dateStart as object ?? DBNull.Value,
                    ["@date_end"] = dateEnd as object ?? DBNull.Value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        // Helper method to create service that references a workflow
        private int CreateService(string name, int workflowId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO service (name, workflow_id, created_at, updated_at) 
                VALUES (@name, @workflow_id, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@workflow_id"] = workflowId,
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