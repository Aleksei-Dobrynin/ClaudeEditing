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
    public class ApplicationObjectTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationObjectTests()
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
            var (applicationId1, archObjectId1) = await CreateTestPrerequisites();
            var (applicationId2, archObjectId2) = await CreateTestPrerequisites();

            // Create application_object entries
            var id1 = CreateApplicationObject(applicationId1, archObjectId1);
            var id2 = CreateApplicationObject(applicationId2, archObjectId2);

            // Act
            var response = await _client.GetAsync("/application_object/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, ao => ao.id == id1 && ao.application_id == applicationId1 && ao.arch_object_id == archObjectId1);
            Assert.Contains(result, ao => ao.id == id2 && ao.application_id == applicationId2 && ao.arch_object_id == archObjectId2);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (applicationId, archObjectId) = await CreateTestPrerequisites();
            var id = CreateApplicationObject(applicationId, archObjectId);

            // Act
            var response = await _client.GetAsync($"/application_object/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_object>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal(archObjectId, result.arch_object_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (applicationId, archObjectId) = await CreateTestPrerequisites();

            var request = new Createapplication_objectRequest
            {
                application_id = applicationId,
                arch_object_id = archObjectId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/application_object", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_object>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal(archObjectId, result.arch_object_id);

            // Verify in database
            var applicationObject = DatabaseHelper.RunQueryList<application_object>(_schemaName, @"
                SELECT id, application_id, arch_object_id, created_at, updated_at, created_by, updated_by 
                FROM application_object 
                WHERE id = @id",
                reader => new application_object
                {
                    id = reader.GetInt32(0),
                    application_id = reader.GetInt32(1),
                    arch_object_id = reader.GetInt32(2),
                    created_at = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    updated_at = reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                    created_by = reader.IsDBNull(5) ? null : reader.GetInt32(5),
                    updated_by = reader.IsDBNull(6) ? null : reader.GetInt32(6)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(applicationObject);
            Assert.Equal(result.id, applicationObject.id);
            Assert.Equal(applicationId, applicationObject.application_id);
            Assert.Equal(archObjectId, applicationObject.arch_object_id);
            Assert.NotNull(applicationObject.created_at);
            Assert.NotNull(applicationObject.updated_at);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create initial test data
            var (applicationId1, archObjectId1) = await CreateTestPrerequisites();
            var id = CreateApplicationObject(applicationId1, archObjectId1);

            // Create new data to update to
            var (applicationId2, archObjectId2) = await CreateTestPrerequisites();

            var request = new Updateapplication_objectRequest
            {
                id = id,
                application_id = applicationId2,
                arch_object_id = archObjectId2
            };

            // Act
            var response = await _client.PutAsync($"/application_object/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_object>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(applicationId2, result.application_id);
            Assert.Equal(archObjectId2, result.arch_object_id);

            // Verify in database
            var applicationObject = DatabaseHelper.RunQueryList<application_object>(_schemaName, @"
                SELECT application_id, arch_object_id, updated_at 
                FROM application_object 
                WHERE id = @id",
                reader => new application_object
                {
                    application_id = reader.GetInt32(0),
                    arch_object_id = reader.GetInt32(1),
                    updated_at = reader.IsDBNull(2) ? null : reader.GetDateTime(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(applicationObject);
            Assert.Equal(applicationId2, applicationObject.application_id);
            Assert.Equal(archObjectId2, applicationObject.arch_object_id);
            Assert.NotNull(applicationObject.updated_at);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (applicationId, archObjectId) = await CreateTestPrerequisites();
            var id = CreateApplicationObject(applicationId, archObjectId);

            // Act
            var response = await _client.DeleteAsync($"/application_object/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_object WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple test data entries
            for (int i = 0; i < 5; i++)
            {
                var (applicationId, archObjectId) = await CreateTestPrerequisites();
                CreateApplicationObject(applicationId, archObjectId);
            }

            // Act
            var response = await _client.GetAsync("/application_object/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<application_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task GetByapplication_id_ReturnsOkResponse()
        {
            // Arrange - Create test data with same application_id
            var (applicationId, archObjectId1) = await CreateTestPrerequisites();
            var (_, archObjectId2) = await CreateTestPrerequisites(createApplication: false);
            var (_, archObjectId3) = await CreateTestPrerequisites(createApplication: false);

            // Link 3 arch objects to the same application
            var id1 = CreateApplicationObject(applicationId, archObjectId1);
            var id2 = CreateApplicationObject(applicationId, archObjectId2);
            var id3 = CreateApplicationObject(applicationId, archObjectId3);

            // Create another application with its own object for distinction
            var (otherApplicationId, otherArchObjectId) = await CreateTestPrerequisites();
            CreateApplicationObject(otherApplicationId, otherArchObjectId);

            // Act
            var response = await _client.GetAsync($"/application_object/GetByapplication_id?application_id={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.All(result, ao => Assert.Equal(applicationId, ao.application_id));
            Assert.Contains(result, ao => ao.id == id1 && ao.arch_object_id == archObjectId1);
            Assert.Contains(result, ao => ao.id == id2 && ao.arch_object_id == archObjectId2);
            Assert.Contains(result, ao => ao.id == id3 && ao.arch_object_id == archObjectId3);
        }

        [Fact]
        public async Task GetByarch_object_id_ReturnsOkResponse()
        {
            // Arrange - Create test data with same arch_object_id
            var (applicationId1, archObjectId) = await CreateTestPrerequisites();
            var (applicationId2, _) = await CreateTestPrerequisites(createArchObject: false);
            var (applicationId3, _) = await CreateTestPrerequisites(createArchObject: false);

            // Link 3 applications to the same arch object
            var id1 = CreateApplicationObject(applicationId1, archObjectId);
            var id2 = CreateApplicationObject(applicationId2, archObjectId);
            var id3 = CreateApplicationObject(applicationId3, archObjectId);

            // Create another arch object with its own application for distinction
            var (otherApplicationId, otherArchObjectId) = await CreateTestPrerequisites();
            CreateApplicationObject(otherApplicationId, otherArchObjectId);

            // Act
            var response = await _client.GetAsync($"/application_object/GetByarch_object_id?arch_object_id={archObjectId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.All(result, ao => Assert.Equal(archObjectId, ao.arch_object_id));
            Assert.Contains(result, ao => ao.id == id1 && ao.application_id == applicationId1);
            Assert.Contains(result, ao => ao.id == id2 && ao.application_id == applicationId2);
            Assert.Contains(result, ao => ao.id == id3 && ao.application_id == applicationId3);
        }

        #region Helper Methods

        private async Task<(int applicationId, int archObjectId)> CreateTestPrerequisites(bool createApplication = true, bool createArchObject = true)
        {
            int applicationId = 0;
            int archObjectId = 0;

            if (createApplication)
            {
                // Create prerequisite entities for application
                var customerId = CreateCustomer($"Customer {Guid.NewGuid().ToString().Substring(0, 8)}");
                var serviceId = CreateService($"Service {Guid.NewGuid().ToString().Substring(0, 8)}");
                var statusId = CreateStatus($"Status {Guid.NewGuid().ToString().Substring(0, 8)}");
                var workflowId = CreateWorkflow($"Workflow {Guid.NewGuid().ToString().Substring(0, 8)}");

                // Create application
                applicationId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO application (registration_date, customer_id, status_id, workflow_id, service_id, created_at, updated_at) 
                    VALUES (@registration_date, @customer_id, @status_id, @workflow_id, @service_id, @created_at, @updated_at) 
                    RETURNING id;",
                    new Dictionary<string, object>
                    {
                        ["@registration_date"] = DateTime.Now,
                        ["@customer_id"] = customerId,
                        ["@status_id"] = statusId,
                        ["@workflow_id"] = workflowId,
                        ["@service_id"] = serviceId,
                        ["@created_at"] = DateTime.Now,
                        ["@updated_at"] = DateTime.Now
                    });
            }

            if (createArchObject)
            {
                // Create prerequisite entities for arch_object
                var districtId = CreateDistrict($"District {Guid.NewGuid().ToString().Substring(0, 8)}");

                // Create arch_object
                archObjectId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO arch_object (name, address, district_id, created_at, updated_at) 
                    VALUES (@name, @address, @district_id, @created_at, @updated_at) 
                    RETURNING id;",
                    new Dictionary<string, object>
                    {
                        ["@name"] = $"Arch Object {Guid.NewGuid().ToString().Substring(0, 8)}",
                        ["@address"] = $"Address {Guid.NewGuid().ToString().Substring(0, 8)}",
                        ["@district_id"] = districtId,
                        ["@created_at"] = DateTime.Now,
                        ["@updated_at"] = DateTime.Now
                    });
            }

            return (applicationId, archObjectId);
        }

        private int CreateApplicationObject(int applicationId, int archObjectId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_object (application_id, arch_object_id, created_at, updated_at) 
                VALUES (@application_id, @arch_object_id, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@arch_object_id"] = archObjectId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateCustomer(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer (full_name, pin, is_organization, created_at, updated_at) 
                VALUES (@full_name, @pin, @is_organization, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@full_name"] = name,
                    ["@pin"] = Guid.NewGuid().ToString().Substring(0, 8),
                    ["@is_organization"] = false,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateService(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO service (name, day_count, is_active, created_at, updated_at) 
                VALUES (@name, @day_count, @is_active, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@day_count"] = 10,
                    ["@is_active"] = true,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateStatus(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_status (name, code, created_at, updated_at) 
                VALUES (@name, @code, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = name.ToLower().Replace(" ", "_"),
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

        #endregion

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}