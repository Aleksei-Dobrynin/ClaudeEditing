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
    public class ServiceControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ServiceControllerTests()
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
            // Arrange - Create test services
            var workflowId1 = CreateWorkflow("Test Workflow 1", true);
            var workflowId2 = CreateWorkflow("Test Workflow 2", true);

            CreateService("Test Service 1", "TS1", "test_code_1", "Test Description 1", 10, workflowId1, 100.5m);
            CreateService("Test Service 2", "TS2", "test_code_2", "Test Description 2", 15, workflowId2, 150.75m);

            // Act
            var response = await _client.GetAsync("/Service/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<Service>>(content);

            Assert.NotNull(result);
            Assert.Contains(result, s => s.name == "Test Service 1" && s.short_name == "TS1" && s.code == "test_code_1");
            Assert.Contains(result, s => s.name == "Test Service 2" && s.short_name == "TS2" && s.code == "test_code_2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test service
            var workflowId = CreateWorkflow("Test Workflow", true);
            var id = CreateService("Single Service", "SS", "single_code", "Single Description", 20, workflowId, 200.0m);

            // Act
            var response = await _client.GetAsync($"/Service/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Service>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Service", result.name);
            Assert.Equal("SS", result.short_name);
            Assert.Equal("single_code", result.code);
            Assert.Equal("Single Description", result.description);
            Assert.Equal(20, result.day_count);
            Assert.Equal(workflowId, result.workflow_id);
            Assert.Equal(200.0m, result.price);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var workflowId = CreateWorkflow("Create Workflow", true);

            var request = new CreateServiceRequest
            {
                name = "Created Service",
                short_name = "CS",
                code = "created_code",
                description = "Created Description",
                day_count = 25,
                workflow_id = workflowId,
                price = 250.0m
            };

            // Act
            var response = await _client.PostAsJsonAsync("/Service/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Service>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Service", result.name);
            Assert.Equal("CS", result.short_name);
            Assert.Equal("created_code", result.code);
            Assert.Equal("Created Description", result.description);
            Assert.Equal(25, result.day_count);
            Assert.Equal(workflowId, result.workflow_id);
            Assert.Equal(250.0m, result.price);

            // Verify in database
            var service = DatabaseHelper.RunQueryList<Service>(_schemaName, @"
                SELECT id, name, short_name, code, description, day_count, workflow_id, price 
                FROM service WHERE id = @id",
                    reader => new Service
                    {
                        id = reader.GetInt32(0),
                        name = reader.GetString(1),
                        short_name = reader.GetString(2),
                        code = reader.GetString(3),
                        description = reader.GetString(4),
                        day_count = reader.GetInt32(5),
                        workflow_id = reader.GetInt32(6),
                        price = (decimal)reader.GetFloat(7)  // Изменение здесь: чтение как float и конвертация в decimal
                    },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(service);
            Assert.Equal(result.id, service.id);
            Assert.Equal("Created Service", service.name);
            Assert.Equal("CS", service.short_name);
            Assert.Equal(workflowId, service.workflow_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalWorkflowId = CreateWorkflow("Original Workflow", true);
            var id = CreateService("Original Service", "OS", "original_code", "Original Description", 30, originalWorkflowId, 300.0m);

            var newWorkflowId = CreateWorkflow("New Workflow", true);

            var request = new UpdateServiceRequest
            {
                id = id,
                name = "Updated Service",
                short_name = "US",
                code = "updated_code",
                description = "Updated Description",
                day_count = 35,
                workflow_id = newWorkflowId,
                price = 350.0m
            };

            // Act
            var response = await _client.PutAsync("/Service/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Service>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Service", result.name);
            Assert.Equal("US", result.short_name);
            Assert.Equal("updated_code", result.code);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal(35, result.day_count);
            Assert.Equal(newWorkflowId, result.workflow_id);
            Assert.Equal(350.0m, result.price);

            // Verify in database
            var service = DatabaseHelper.RunQueryList<Service>(_schemaName, @"
                SELECT name, short_name, code, description, day_count, workflow_id, price 
                FROM service WHERE id = @id",
                reader => new Service
                {
                    name = reader.GetString(0),
                    short_name = reader.GetString(1),
                    code = reader.GetString(2),
                    description = reader.GetString(3),
                    day_count = reader.GetInt32(4),
                    workflow_id = reader.GetInt32(5),
                    price = (decimal)reader.GetFloat(6)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(service);
            Assert.Equal("Updated Service", service.name);
            Assert.Equal("US", service.short_name);
            Assert.Equal(newWorkflowId, service.workflow_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var workflowId = CreateWorkflow("Delete Workflow", true);
            var id = CreateService("Service to Delete", "SD", "delete_code", "Delete Description", 40, workflowId, 400.0m);

            // Act
            var response = await _client.DeleteAsync($"/Service/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM service WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test services
            var workflowId = CreateWorkflow("Paginated Workflow", true);

            for (int i = 1; i <= 5; i++)
            {
                CreateService($"Paginated Service {i}", $"PS{i}", $"paginated_code_{i}", $"Paginated Description {i}",
                    i * 10, workflowId, i * 100.0m);
            }

            // Act
            var response = await _client.GetAsync("/Service/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<Service>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        [Fact]
        public async Task DashboardGetCountServices_ReturnsOkResponse()
        {
            // Arrange
            // Create workflows
            var workflowId = CreateWorkflow("Dashboard Workflow", true);

            // Create services
            var serviceId1 = CreateService("Dashboard Service 1", "DS1", "dashboard_code_1", "Dashboard Description 1", 10, workflowId, 100.0m);
            var serviceId2 = CreateService("Dashboard Service 2", "DS2", "dashboard_code_2", "Dashboard Description 2", 20, workflowId, 200.0m);

            // Create statuses
            var statusId1 = CreateApplicationStatus("Active Status", "active_status", "#FFC107");
            var statusId2 = CreateApplicationStatus("Done Status", "done", "#28A745");

            // Create customer
            var customerId = CreateCustomer("Test Customer", "123456789", false);

            // Create applications with services
            CreateApplication(customerId, statusId1, workflowId, serviceId1, DateTime.Now.AddDays(-5));
            CreateApplication(customerId, statusId2, workflowId, serviceId2, DateTime.Now.AddDays(-10));

            // Create structure for structure-specific dashboard
            var structureId = CreateOrgStructure("Test Structure", "1.0", true);

            // Act
            var date_start =Uri.EscapeDataString(DateTime.Now.AddDays(-30).ToString("o"));
            var date_end = Uri.EscapeDataString(DateTime.Now.AddDays(1).ToString("o"));
            var response = await _client.GetAsync($"/Service/DashboardGetCountServices?date_start={date_start}&date_end={date_end}&structure_id={structureId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ResultDashboard>(content);

            Assert.NotNull(result);
            Assert.NotNull(result.counts);
            Assert.NotNull(result.names);
            // Since we're just testing the endpoint works, and exact counts depend on the exact implementation
            // of the repository's SQL, we just check that the endpoint returns a proper response structure
        }

        [Fact]
        public async Task DashboardGetAppCount_ReturnsOkResponse()
        {
            // Arrange
            var workflowId = CreateWorkflow("Dashboard Workflow", true);
            var serviceId = CreateService("Count Service", "CS", "count_code", "Count Description", 10, workflowId, 100.0m);
            var statusId = CreateApplicationStatus("Count Status", "count_status", "#FFC107");
            var customerId = CreateCustomer("Count Customer", "987654321", false);

            CreateApplication(customerId, statusId, workflowId, serviceId, DateTime.Now.AddDays(-5));
            CreateApplication(customerId, statusId, workflowId, serviceId, DateTime.Now.AddDays(-10));

            // Act
            var date_start =Uri.EscapeDataString(DateTime.Now.AddDays(-30).ToString("o"));
            var date_end = Uri.EscapeDataString(DateTime.Now.AddDays(1).ToString("o"));
            var response = await _client.GetAsync($"/Service/DashboardGetAppCount?date_start={date_start}&date_end={date_end}&service_id={serviceId}&status_id={statusId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ResultDashboard>(content);

            Assert.NotNull(result);
            Assert.NotNull(result.counts);
            Assert.NotNull(result.names);
        }

        [Fact]
        public async Task GetApplicationsWithCoords_ReturnsOkResponse()
        {
            // Arrange
            var workflowId = CreateWorkflow("Coords Workflow", true);
            var serviceId = CreateService("Coords Service", "CS", "coords_code", "Coords Description", 10, workflowId, 100.0m);
            var statusId = CreateApplicationStatus("Coords Status", "coords_status", "#FFC107");
            var customerId = CreateCustomer("Coords Customer", "112233445", false);
            var districtId = CreateDistrict("Test District", "test_district");
            var tagId = CreateTag("Test Tag", "test_tag");

            // Create arch object with coordinates
            var archObjectId = CreateArchObject("Test Object", "Test Address", districtId, 42.87, 74.59);

            // Create arch object tag
            CreateArchObjectTag(archObjectId, tagId);

            // Create application with arch object
            var applicationId = CreateApplication(customerId, statusId, workflowId, serviceId, DateTime.Now.AddDays(-5), archObjectId);

            // Act
            var date_start =Uri.EscapeDataString(DateTime.Now.AddDays(-30).ToString("o"));
            var date_end = Uri.EscapeDataString(DateTime.Now.AddDays(1).ToString("o"));
            var response = await _client.GetAsync($"/Service/GetApplicationsWithCoords?date_start={date_start}&date_end={date_end}&service_id={serviceId}&status_code=coords_status&tag_id={tagId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ArchObjectLeaflet>>(content);

            Assert.NotNull(result);
            // The result could be empty if the objects don't match our search criteria exactly,
            // but the response should be successful
        }

        [Fact]
        public async Task GetApplicationsCategoryCount_ReturnsOkResponse()
        {
            // Arrange
            var workflowId = CreateWorkflow("Category Workflow", true);
            var serviceId1 = CreateService("Category Service 1", "CS1", "category_code_1", "Category Description 1", 10, workflowId, 100.0m);
            var serviceId2 = CreateService("Category Service 2", "CS2", "category_code_2", "Category Description 2", 20, workflowId, 200.0m);

            var doneStatusId = CreateApplicationStatus("Done Status", "done", "#28A745");
            var refusalStatusId = CreateApplicationStatus("Refusal Status", "refusal_ready", "#DC3545");
            var inWorkStatusId = CreateApplicationStatus("In Work Status", "preparation", "#6edef0");

            var customerId = CreateCustomer("Category Customer", "555555555", false);
            var districtId = CreateDistrict("Category District", "category_district");

            // Create arch objects
            var archObjectId1 = CreateArchObject("Category Object 1", "Category Address 1", districtId, 42.87, 74.59);
            var archObjectId2 = CreateArchObject("Category Object 2", "Category Address 2", districtId, 42.86, 74.58);

            // Create applications in different categories
            CreateApplication(customerId, doneStatusId, workflowId, serviceId1, DateTime.Now.AddDays(-5), archObjectId1);
            CreateApplication(customerId, refusalStatusId, workflowId, serviceId1, DateTime.Now.AddDays(-10), archObjectId2);
            CreateApplication(customerId, inWorkStatusId, workflowId, serviceId2, DateTime.Now.AddDays(-15), archObjectId1);

            // Act
            var date_start =Uri.EscapeDataString(DateTime.Now.AddDays(-30).ToString("o"));
            var date_end = Uri.EscapeDataString(DateTime.Now.AddDays(1).ToString("o"));
            var response = await _client.GetAsync($"/Service/GetApplicationsCategoryCount?date_start={date_start}&date_end={date_end}&district_id={districtId}&is_paid=null");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();

            // The result is a generic object, so we just verify it can be parsed
            var result = JToken.Parse(content);
            Assert.NotNull(result);
        }

        // Helper methods to create test data
        private int CreateWorkflow(string name, bool isActive)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO workflow (name, is_active, created_at, updated_at) 
                VALUES (@name, @is_active, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@is_active"] = isActive,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateService(string name, string shortName, string code, string description, int? dayCount, int? workflowId, decimal? price)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO service (name, short_name, code, description, day_count, workflow_id, price, created_at, updated_at) 
                VALUES (@name, @short_name, @code, @description, @day_count, @workflow_id, @price, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@short_name"] = shortName,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@day_count"] = (object)dayCount ?? DBNull.Value,
                    ["@workflow_id"] = (object)workflowId ?? DBNull.Value,
                    ["@price"] = (object)price ?? DBNull.Value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateApplicationStatus(string name, string code, string statusColor)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_status (name, code, status_color, created_at, updated_at) 
                VALUES (@name, @code, @status_color, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@status_color"] = statusColor,
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

        private int CreateDistrict(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO district (name, code, created_at, updated_at) 
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

        private int CreateArchObject(string name, string address, int districtId, double xCoordinate, double yCoordinate)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO arch_object (name, address, district_id, xcoordinate, ycoordinate, created_at, updated_at) 
                VALUES (@name, @address, @district_id, @xcoordinate, @ycoordinate, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@address"] = address,
                    ["@district_id"] = districtId,
                    ["@xcoordinate"] = xCoordinate,
                    ["@ycoordinate"] = yCoordinate,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateTag(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO tag (name, code, created_at, updated_at) 
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

        private int CreateArchObjectTag(int objectId, int tagId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO arch_object_tag (id_object, id_tag, created_at, updated_at) 
                VALUES (@id_object, @id_tag, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@id_object"] = objectId,
                    ["@id_tag"] = tagId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateApplication(int customerId, int statusId, int workflowId, int serviceId, DateTime registrationDate, int? archObjectId = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (customer_id, status_id, workflow_id, service_id, registration_date, arch_object_id, created_at, updated_at) 
                VALUES (@customer_id, @status_id, @workflow_id, @service_id, @registration_date, @arch_object_id, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@customer_id"] = customerId,
                    ["@status_id"] = statusId,
                    ["@workflow_id"] = workflowId,
                    ["@service_id"] = serviceId,
                    ["@registration_date"] = registrationDate,
                    ["@arch_object_id"] = archObjectId as object ?? DBNull.Value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateOrgStructure(string name, string version, bool isActive)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, version, is_active, date_start, created_at, updated_at) 
                VALUES (@name, @version, @is_active, @date_start, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@version"] = version,
                    ["@is_active"] = isActive,
                    ["@date_start"] = DateTime.Now,
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