using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using WebApi.IntegrationTests.Fixtures;
using WebApi.IntegrationTests.Helpers;
using Domain.Entities;
using Xunit;
using System.Collections.Generic;
using System.Net.Http.Json;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ApplicationStatusHistoryTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationStatusHistoryTests()
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
            var applicationId = CreateTestApplication();
            var userId = CreateTestUser();
            var statusId1 = CreateApplicationStatus("Status 1", "status1");
            var statusId2 = CreateApplicationStatus("Status 2", "status2");

            // Create two status history records
            CreateApplicationStatusHistory(applicationId, statusId1, statusId2, userId, DateTime.Now.AddDays(-1));
            CreateApplicationStatusHistory(applicationId, statusId2, statusId1, userId, DateTime.Now);

            // Act
            var response = await _client.GetAsync("/ApplicationStatusHistory/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ApplicationStatusHistory>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, history => Assert.Equal(applicationId, history.application_id));
        }

        [Fact]
        public async Task GetByApplicationId_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var application1Id = CreateTestApplication();
            var application2Id = CreateTestApplication();
            var userId = CreateTestUser();
            var statusId1 = CreateApplicationStatus("Status 1", "status1");
            var statusId2 = CreateApplicationStatus("Status 2", "status2");

            // Create status history records for both applications
            CreateApplicationStatusHistory(application1Id, statusId1, statusId2, userId, DateTime.Now.AddDays(-2));
            CreateApplicationStatusHistory(application1Id, statusId2, statusId1, userId, DateTime.Now.AddDays(-1));
            CreateApplicationStatusHistory(application2Id, statusId1, statusId2, userId, DateTime.Now);

            // Act
            var response = await _client.GetAsync($"/ApplicationStatusHistory/GetByApplication?application_id={application1Id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ApplicationStatusHistory>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, history => Assert.Equal(application1Id, history.application_id));
        }

        // Helper methods to set up test data
        private int CreateTestApplication()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (registration_date, created_at, updated_at) 
                VALUES (@registration_date, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@registration_date"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateTestUser(string userId = "test@example.com")
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""User"" (""userId"", active, created_at, updated_at) 
                VALUES (@userId, true, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@userId"] = userId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private void CreateTestEmployee(int userId, string lastName, string firstName)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (last_name, first_name, user_id, created_at, updated_at) 
                VALUES (@lastName, @firstName, @userId, @created_at, @updated_at);",
                new Dictionary<string, object>
                {
                    ["@lastName"] = lastName,
                    ["@firstName"] = firstName,
                    ["@userId"] = userId.ToString(),
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

        private int CreateApplicationStatusHistory(int applicationId, int statusId, int oldStatusId, int userId, DateTime dateChange)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_status_history (application_id, status_id, old_status_id, user_id, date_change, created_at, updated_at) 
                VALUES (@application_id, @status_id, @old_status_id, @user_id, @date_change, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@status_id"] = statusId,
                    ["@old_status_id"] = oldStatusId,
                    ["@user_id"] = userId,
                    ["@date_change"] = dateChange,
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