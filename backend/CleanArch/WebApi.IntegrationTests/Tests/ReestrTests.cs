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
    public class ReestrTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ReestrTests()
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
            var statusId = CreateReestrStatus("Test Status", "Status description", "test_code");
            CreateReestr("Test Reestr 1", 1, 2023, statusId);
            CreateReestr("Test Reestr 2", 2, 2023, statusId);

            // Act
            var response = await _client.GetAsync("/reestr/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<reestr>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.name == "Test Reestr 1" && r.month == 1 && r.year == 2023);
            Assert.Contains(result, r => r.name == "Test Reestr 2" && r.month == 2 && r.year == 2023);
            // Verify status name and code are included
            Assert.All(result, r => Assert.Equal("Test Status", r.status_name));
            Assert.All(result, r => Assert.Equal("test_code", r.status_code));
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var statusId = CreateReestrStatus("Single Status", "Status description", "single_code");
            var id = CreateReestr("Single Reestr", 3, 2023, statusId);

            // Act
            var response = await _client.GetAsync($"/reestr/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<reestr>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Reestr", result.name);
            Assert.Equal(3, result.month);
            Assert.Equal(2023, result.year);
            Assert.Equal(statusId, result.status_id);
            Assert.Equal("Single Status", result.status_name);
            Assert.Equal("single_code", result.status_code);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create a status first
            var statusId = CreateReestrStatus("Created Status", "Created description", "edited");

            var request = new CreatereestrRequest
            {
                name = "Created Reestr",
                month = 4,
                year = 2023,
                status_id = statusId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/reestr", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<reestr>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Reestr", result.name);
            Assert.Equal(4, result.month);
            Assert.Equal(2023, result.year);
            Assert.Equal(statusId, result.status_id);
            Assert.NotNull(result.created_at);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateReestrStatus("Update Status", "Update description", "update_code");
            var newStatusId = CreateReestrStatus("New Status", "New description", "new_code");
            var id = CreateReestr("Original Reestr", 5, 2023, statusId);

            var request = new UpdatereestrRequest
            {
                id = id,
                name = "Updated Reestr",
                month = 6,
                year = 2024,
                status_id = newStatusId
            };

            // Act
            var response = await _client.PutAsync($"/reestr/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<reestr>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Reestr", result.name);
            Assert.Equal(6, result.month);
            Assert.Equal(2024, result.year);
            Assert.Equal(newStatusId, result.status_id);
            Assert.NotNull(result.updated_at);

            // Verify database update
            var updatedReestr = await GetReestrFromDb(id);
            Assert.Equal("Updated Reestr", updatedReestr.name);
            Assert.Equal(6, updatedReestr.month);
            Assert.Equal(2024, updatedReestr.year);
            Assert.Equal(newStatusId, updatedReestr.status_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateReestrStatus("Delete Status", "Delete description", "delete_code");
            var id = CreateReestr("Delete Reestr", 7, 2023, statusId);

            // Act
            var response = await _client.DeleteAsync($"/reestr/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM reestr WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple reestrs
            var statusId = CreateReestrStatus("Paginated Status", "Paginated description", "paginated_code");

            for (int i = 1; i <= 5; i++)
            {
                CreateReestr($"Reestr {i}", i, 2023, statusId);
            }

            // Act
            var response = await _client.GetAsync("/reestr/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<reestr>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        [Fact]
        public async Task GetBystatus_id_ReturnsOkResponse()
        {
            // Arrange
            var statusId1 = CreateReestrStatus("Status One", "Status One description", "status_one_code");
            var statusId2 = CreateReestrStatus("Status Two", "Status Two description", "status_two_code");

            CreateReestr("Reestr Status 1-1", 1, 2023, statusId1);
            CreateReestr("Reestr Status 1-2", 2, 2023, statusId1);
            CreateReestr("Reestr Status 2", 3, 2023, statusId2);

            // Act
            var response = await _client.GetAsync($"/reestr/GetBystatus_id?status_id={statusId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<reestr>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, r => Assert.Equal(statusId1, r.status_id));
        }

        [Fact]
        public async Task ChangeReestrStatus_ReturnsOkResponse()
        {
            // Arrange
            // Create status codes that match those in the application
            var editedStatusId = CreateReestrStatus("Edited", "Edited description", "edited");
            var approvedStatusId = CreateReestrStatus("Approved", "Approved description", "approved");

            var reestrId = CreateReestr("Status Change Reestr", 8, 2023, editedStatusId);

            var request = new ChangeReestrStatusRequest
            {
                reestr_id = reestrId,
                status_code = "approved" // This should match the code of one of our created statuses
            };

            // Act
            var response = await _client.PostAsJsonAsync("/reestr/ChangeReestrStatus", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = bool.Parse(content);

            Assert.True(result);

            // Verify status change in database
            var updatedReestr = await GetReestrFromDb(reestrId);
            Assert.Equal(approvedStatusId, updatedReestr.status_id);
        }

        [Fact]
        public async Task SetApplicationToReestr_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateReestrStatus("Application Status", "Application description", "application_code");
            var reestrId = CreateReestr("Application Reestr", 9, 2023, statusId);

            // Create application status
            var applicationStatusId = CreateApplicationStatus("Review", "review");

            // Create an application
            var applicationId = CreateApplication(applicationStatusId);

            var request = new SetApplicationToReestrRequest
            {
                application_id = applicationId,
                reestr_id = reestrId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/reestr/SetApplicationToReestr", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_in_reestr>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal(reestrId, result.reestr_id);
            Assert.NotNull(result.created_at);

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_in_reestr 
                WHERE application_id = @applicationId AND reestr_id = @reestrId",
                new Dictionary<string, object>
                {
                    ["@applicationId"] = applicationId,
                    ["@reestrId"] = reestrId
                });

            Assert.Equal(1, exists);
        }

        [Fact]
        public async Task ChangeAllApplicationStatusInReestr_ReturnsOkResponse()
        {
            // Arrange
            // Create necessary statuses
            var reestrStatusId = CreateReestrStatus("Change All Status", "Change All description", "change_all_code");
            var reestrId = CreateReestr("Change All Reestr", 10, 2023, reestrStatusId);

            // Create application statuses
            var initialStatusId = CreateApplicationStatus("Review", "review");
            var doneStatusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT id FROM application_status WHERE code = 'done';");

            // Create applications and add to reestr
            var app1Id = CreateApplication(initialStatusId);
            var app2Id = CreateApplication(initialStatusId);

            AddApplicationToReestr(app1Id, reestrId);
            AddApplicationToReestr(app2Id, reestrId);

            var request = new ChangeReestrStatusRequest
            {
                reestr_id = reestrId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/reestr/ChangeAllApplicationStatusInReestr", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = bool.Parse(content);

            Assert.True(result);

            // Verify all applications in reestr now have status "done"
            var app1 = await GetApplicationFromDb(app1Id);
            var app2 = await GetApplicationFromDb(app2Id);

            Assert.Equal(doneStatusId, app1.status_id);
            Assert.Equal(doneStatusId, app2.status_id);
        }

        // Helper methods
        private int CreateReestrStatus(string name, string description, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO reestr_status (name, description, code, created_at, updated_at) 
                VALUES (@name, @description, @code, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@code"] = code,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateReestr(string name, int? month, int? year, int statusId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO reestr (name, month, year, status_id, created_at, updated_at) 
                VALUES (@name, @month, @year, @status_id, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@month"] = month as object ?? DBNull.Value,
                    ["@year"] = year as object ?? DBNull.Value,
                    ["@status_id"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateApplicationStatus(string name, string code)
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

        private int CreateApplication(int statusId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (registration_date, status_id, created_at, updated_at) 
                VALUES (@registration_date, @status_id, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@registration_date"] = DateTime.Now,
                    ["@status_id"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private void AddApplicationToReestr(int applicationId, int reestrId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_in_reestr (application_id, reestr_id, created_at, updated_at) 
                VALUES (@application_id, @reestr_id, @created_at, @updated_at)",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@reestr_id"] = reestrId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<reestr> GetReestrFromDb(int id)
        {
            return DatabaseHelper.RunQueryList<reestr>(_schemaName, @"
                SELECT id, name, month, year, status_id, created_at, updated_at, created_by, updated_by
                FROM reestr 
                WHERE id = @id",
                reader => new reestr
                {
                    id = reader.GetInt32(0),
                    name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    month = reader.IsDBNull(2) ? (int?)null : reader.GetInt32(2), // Fix: Use nullable int
                    year = reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3), // Fix: Use nullable int
                    status_id = reader.GetInt32(4),
                    created_at = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    updated_at = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                    created_by = reader.IsDBNull(7) ? (int?)null : reader.GetInt32(7), // Fix: Use nullable int
                    updated_by = reader.IsDBNull(8) ? (int?)null : reader.GetInt32(8)  // Fix: Use nullable int
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        private async Task<Domain.Entities.Application> GetApplicationFromDb(int id)
        {
            return DatabaseHelper.RunQueryList<Domain.Entities.Application>(_schemaName, @"
                SELECT id, status_id
                FROM application 
                WHERE id = @id",
                reader => new Domain.Entities.Application
                {
                    id = reader.GetInt32(0),
                    status_id = reader.GetInt32(1)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}