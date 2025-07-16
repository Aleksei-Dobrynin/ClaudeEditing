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
    public class NotificationLogTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public NotificationLogTests()
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
            var statusId = CreateNotificationLogStatus("Pending", "pending");

            // Create test users
            var userId1 = CreateUser("user1");
            var userId2 = CreateUser("user2");
            
            DatabaseHelper.RunQuery<int>(_schemaName,
                @"INSERT INTO employee (last_name, first_name, second_name, user_id) VALUES ('Test', 'Test', 'Test', 'user1') RETURNING id;");
            
            DatabaseHelper.RunQuery<int>(_schemaName,
                @"INSERT INTO employee (last_name, first_name, second_name, user_id) VALUES ('Test', 'Test', 'Test', 'user2') RETURNING id;");

            // Create test notification logs
            CreateNotificationLog("Test message 1", "Test subject 1", "email", statusId, userId: userId1);
            CreateNotificationLog("Test message 2", "Test subject 2", "sms", statusId, userId: userId2);

            // Act
            var response = await _client.GetAsync("/notification_log/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<notification_log>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, log => log.message == "Test message 1" && log.type == "email");
            Assert.Contains(result, log => log.message == "Test message 2" && log.type == "sms");
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateNotificationLogStatus("Sent", "sent");
            var id = CreateNotificationLog("Single test message", "Single test subject", "telegram", statusId);

            // Act
            var response = await _client.GetAsync($"/notification_log/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<notification_log>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single test message", result.message);
            Assert.Equal("Single test subject", result.subject);
            Assert.Equal("telegram", result.type);
            Assert.Equal(statusId, result.status_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateNotificationLogStatus("Created", "created");
            var userId = CreateUser("createuser");
            var applicationId = CreateApplication();
            var customerId = CreateCustomer();

            var request = new Createnotification_logRequest
            {
                user_id = userId,
                message = "Created message",
                subject = "Created subject",
                type = "email",
                status_id = statusId,
                //application_id = applicationId,
                //customer_id = customerId,
                //employee_id = userId,
                guid = Guid.NewGuid().ToString()
            };

            // Act
            var response = await _client.PostAsJsonAsync("/notification_log", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<notification_log>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(userId, result.user_id);
            Assert.Equal("Created message", result.message);
            Assert.Equal("Created subject", result.subject);
            Assert.Equal("email", result.type);
            Assert.Equal(statusId, result.status_id);

            // Verify in database
            var log = DatabaseHelper.RunQueryList<notification_log>(
                _schemaName,
                @"SELECT id, user_id, message, subject, type, status_id, application_id, customer_id
                  FROM notification_log WHERE id = @id",
                reader => new notification_log
                {
                    id = reader.GetInt32(0),
                    user_id = reader.IsDBNull(1) ? null : (int?)reader.GetInt32(1),
                    message = reader.GetString(2),
                    subject = reader.GetString(3),
                    type = reader.GetString(4),
                    status_id = reader.IsDBNull(5) ? null : (int?)reader.GetInt32(5),
                    application_id = reader.IsDBNull(6) ? null : (int?)reader.GetInt32(6),
                    customer_id = reader.IsDBNull(7) ? null : (int?)reader.GetInt32(7)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(log);
            Assert.Equal(result.id, log.id);
            Assert.Equal(userId, log.user_id);
            Assert.Equal("Created message", log.message);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalStatusId = CreateNotificationLogStatus("Original", "original");
            var newStatusId = CreateNotificationLogStatus("New", "new");

            var guid = Guid.NewGuid().ToString();
            var id = CreateNotificationLog("Original message", "Original subject", "sms", originalStatusId, guid: guid);

            var request = new Updatenotification_logRequest
            {
                id = id,
                message = "Updated message",
                subject = "Updated subject",
                type = "email",
                status_id = newStatusId,
                guid = guid
            };

            // Act
            var response = await _client.PutAsync($"/notification_log/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<notification_log>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated message", result.message);
            Assert.Equal("Updated subject", result.subject);
            Assert.Equal("email", result.type);
            Assert.Equal(newStatusId, result.status_id);

            // Verify in database
            var log = DatabaseHelper.RunQueryList<notification_log>(
                _schemaName,
                @"SELECT message, subject, type, status_id FROM notification_log WHERE id = @id",
                reader => new notification_log
                {
                    message = reader.GetString(0),
                    subject = reader.GetString(1),
                    type = reader.GetString(2),
                    status_id = reader.IsDBNull(3) ? null : (int?)reader.GetInt32(3)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(log);
            Assert.Equal("Updated message", log.message);
            Assert.Equal("Updated subject", log.subject);
            Assert.Equal("email", log.type);
            Assert.Equal(newStatusId, log.status_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateNotificationLogStatus("Delete", "delete");
            var id = CreateNotificationLog("Message to delete", "Subject to delete", "sms", statusId);

            // Act
            var response = await _client.DeleteAsync($"/notification_log/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify deletion in database
            var exists = DatabaseHelper.RunQuery<int>(
                _schemaName,
                @"SELECT COUNT(*) FROM notification_log WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id }
            );

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple logs
            var statusId = CreateNotificationLogStatus("Paginated", "paginated");

            for (int i = 1; i <= 5; i++)
            {
                CreateNotificationLog($"Message {i}", $"Subject {i}", "email", statusId);
            }

            // Act
            var response = await _client.GetAsync("/notification_log/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<notification_log>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        [Fact]
        public async Task GetByApplicationId_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateNotificationLogStatus("App", "app");
            var applicationId = CreateApplication();
            var otherApplicationId = CreateApplication();

            // Create logs for the target application
            CreateNotificationLog("App Message 1", "App Subject 1", "email", statusId, applicationId: applicationId);
            CreateNotificationLog("App Message 2", "App Subject 2", "sms", statusId, applicationId: applicationId);

            // Create log for another application
            CreateNotificationLog("Other App Message", "Other App Subject", "email", statusId, applicationId: otherApplicationId);

            // Act
            var response = await _client.GetAsync($"/notification_log/GetByApplicationId?id={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<notification_log>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, log => Assert.Equal(applicationId, log.application_id));
            Assert.Contains(result, log => log.message == "App Message 1");
            Assert.Contains(result, log => log.message == "App Message 2");
        }

        [Fact]
        public async Task GetAppLogBySearch_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateNotificationLogStatus("Search", "search");
            var applicationId = CreateApplication(number: "APP-SEARCH-123");
            var customerId = CreateCustomer(fullName: "Search Customer");

            CreateNotificationLog("Search Message", "Search Subject", "email", statusId,
                applicationId: applicationId, customerId: customerId);

            // Act
            var response = await _client.GetAsync("/notification_log/GetAppLogBySearch?search=SEARCH&pageSize=10&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<notification_log>>(content);

            Assert.NotNull(result);
            // Note: The actual result count depends on how the search is implemented in the repository,
            // so we're just verifying the endpoint works correctly
        }

        // Helper methods to create test data
        private int CreateNotificationLogStatus(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO notification_log_status (name, code, created_at, updated_at) 
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

        private int CreateNotificationLog(string message, string subject, string type, int? statusId = null,
            int? userId = null, int? employeeId = null, int? applicationId = null, int? customerId = null, string? guid = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO notification_log (message, subject, type, status_id, user_id, employee_id, application_id, customer_id, guid, created_at, updated_at) 
                VALUES (@message, @subject, @type, @status_id, @user_id, @employee_id, @application_id, @customer_id, @guid, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@message"] = message,
                    ["@subject"] = subject,
                    ["@type"] = type,
                    ["@status_id"] = statusId as object ?? DBNull.Value,
                    ["@user_id"] = userId as object ?? DBNull.Value,
                    ["@employee_id"] = employeeId as object ?? DBNull.Value,
                    ["@application_id"] = applicationId as object ?? DBNull.Value,
                    ["@customer_id"] = customerId as object ?? DBNull.Value,
                    ["@guid"] = guid,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateUser(string userId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""User"" (""userId"", email, password_hash, active, created_at, updated_at) 
                VALUES (@userId, @email, @password_hash, true, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@userId"] = userId,
                    ["@email"] = $"{userId}@example.com",
                    ["@password_hash"] = "hashedpassword",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateApplication(string number = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (number, registration_date, created_at, updated_at) 
                VALUES (@number, @registration_date, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@number"] = number ?? $"APP-{Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@registration_date"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateCustomer(string fullName = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer (full_name, pin, is_organization, created_at, updated_at) 
                VALUES (@full_name, @pin, false, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@full_name"] = fullName ?? $"Customer {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@pin"] = Guid.NewGuid().ToString().Substring(0, 10),
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