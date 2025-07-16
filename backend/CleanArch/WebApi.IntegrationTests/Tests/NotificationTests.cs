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
    public class NotificationTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public NotificationTests()
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
            var userId1 = CreateUser("user1");
            var userId2 = CreateUser("user2");
            var employeeId = CreateEmployee("Test", "Employee");

            CreateNotification("Title 1", "This is notification 1", userId: userId1);
            CreateNotification("Title 2", "This is notification 2", userId: userId2);
            CreateNotification("Title 3", "This is notification 3", employeeId: employeeId);

            // Act
            var response = await _client.GetAsync("/notification/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<notification>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.Contains(result, n => n.title == "Title 1" && n.user_id == userId1);
            Assert.Contains(result, n => n.title == "Title 2" && n.user_id == userId2);
            Assert.Contains(result, n => n.title == "Title 3" && n.employee_id == employeeId);
        }

        [Fact]
        public async Task GetMyNotifications_ReturnsOkResponse()
        {
            // Arrange - We need to mock the authentication for this test
            // The TestAuthRepository.cs mocks a user with ID 1

            // Create test notifications for the mocked user ID (should be 1 according to TestAuthRepository)
            var testUserId = 1;

            CreateNotification("My Notification 1", "My first notification text", userId: testUserId, hasRead: false);
            CreateNotification("My Notification 2", "My second notification text", userId: testUserId, hasRead: false);

            // Create notification for another user (should not be returned)
            CreateNotification("Other Notification", "Other notification text", userId: 999);

            // Act
            var response = await _client.GetAsync("/notification/GetMyNotifications");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<notification>>(content);

            Assert.NotNull(result);
            // Should only return notifications for the authenticated user (ID 1)
            Assert.Equal(2, result.Count);
            Assert.All(result, n => Assert.Equal(testUserId, n.user_id));
            Assert.Contains(result, n => n.title == "My Notification 1");
            Assert.Contains(result, n => n.title == "My Notification 2");
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange
            var userId = CreateUser("singleuser");
            var id = CreateNotification("Single Notification", "This is a single notification text",
                userId: userId, code: "test_code", link: "http://example.com/notification");

            // Act
            var response = await _client.GetAsync($"/notification/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<notification>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Notification", result.title);
            Assert.Equal("This is a single notification text", result.text);
            Assert.Equal(userId, result.user_id);
            Assert.Equal("test_code", result.code);
            Assert.Equal("http://example.com/notification", result.link);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var userId = CreateUser("createuser");
            var employeeId = CreateEmployee("Create", "Employee");

            var request = new CreatenotificationRequest
            {
                title = "Created Notification",
                text = "This is a created notification text",
                user_id = userId,
                employee_id = employeeId,
                has_read = false,
                code = "created_code",
                link = "http://example.com/created",
                created_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/notification", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<notification>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Notification", result.title);
            Assert.Equal("This is a created notification text", result.text);
            Assert.Equal(userId, result.user_id);
            Assert.Equal(employeeId, result.employee_id);
            Assert.False(result.has_read);
            Assert.Equal("created_code", result.code);
            Assert.Equal("http://example.com/created", result.link);

            // Verify in database
            var notification = DatabaseHelper.RunQueryList<notification>(
                _schemaName,
                @"SELECT id, title, text, user_id, employee_id, has_read, code, link
                  FROM notification WHERE id = @id",
                reader => new notification
                {
                    id = reader.GetInt32(0),
                    title = reader.GetString(1),
                    text = reader.GetString(2),
                    user_id = reader.IsDBNull(3) ? null : (int?)reader.GetInt32(3),
                    employee_id = reader.IsDBNull(4) ? null : (int?)reader.GetInt32(4),
                    has_read = reader.IsDBNull(5) ? null : (bool?)reader.GetBoolean(5),
                    code = reader.IsDBNull(6) ? null : reader.GetString(6),
                    link = reader.IsDBNull(7) ? null : reader.GetString(7)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(notification);
            Assert.Equal(result.id, notification.id);
            Assert.Equal("Created Notification", notification.title);
            Assert.Equal(userId, notification.user_id);
            Assert.Equal(employeeId, notification.employee_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalUserId = CreateUser("originaluser");
            var newUserId = CreateUser("newuser");

            var id = CreateNotification("Original Notification", "Original text", userId: originalUserId);

            var request = new UpdatenotificationRequest
            {
                id = id,
                title = "Updated Notification",
                text = "Updated text",
                user_id = newUserId,
                has_read = true,
                code = "updated_code",
                link = "http://example.com/updated"
            };

            // Act
            var response = await _client.PutAsync($"/notification/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<notification>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Notification", result.title);
            Assert.Equal("Updated text", result.text);
            Assert.Equal(newUserId, result.user_id);
            Assert.True(result.has_read);
            Assert.Equal("updated_code", result.code);
            Assert.Equal("http://example.com/updated", result.link);

            // Verify in database
            var notification = DatabaseHelper.RunQueryList<notification>(
                _schemaName,
                @"SELECT title, text, user_id, has_read, code, link
                  FROM notification WHERE id = @id",
                reader => new notification
                {
                    title = reader.GetString(0),
                    text = reader.GetString(1),
                    user_id = reader.IsDBNull(2) ? null : (int?)reader.GetInt32(2),
                    has_read = reader.IsDBNull(3) ? null : (bool?)reader.GetBoolean(3),
                    code = reader.IsDBNull(4) ? null : reader.GetString(4),
                    link = reader.IsDBNull(5) ? null : reader.GetString(5)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(notification);
            Assert.Equal("Updated Notification", notification.title);
            Assert.Equal(newUserId, notification.user_id);
            Assert.True(notification.has_read);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var userId = CreateUser("deleteuser");
            var id = CreateNotification("Notification to Delete", "Delete this notification", userId: userId);

            // Act
            var response = await _client.DeleteAsync($"/notification/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify deletion in database
            var exists = DatabaseHelper.RunQuery<int>(
                _schemaName,
                @"SELECT COUNT(*) FROM notification WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id }
            );

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple notifications
            var userId = CreateUser("paginateduser");

            for (int i = 1; i <= 5; i++)
            {
                CreateNotification($"Paginated Notification {i}", $"Paginated text {i}", userId: userId);
            }

            // Act
            var response = await _client.GetAsync("/notification/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<notification>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        [Fact]
        public async Task ClearNotification_ReturnsOkResponse()
        {
            // Arrange
            var userId = CreateUser("clearuser");
            var id = CreateNotification("Notification to Clear", "Clear this notification", userId: userId, hasRead: false);

            var request = new { id = id };

            // Act
            var response = await _client.PostAsJsonAsync("/notification/ClearNotification", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var clearedId = int.Parse(content);

            Assert.Equal(id, clearedId);

            // Verify notification was marked as read in database
            var hasRead = DatabaseHelper.RunQuery<bool>(
                _schemaName,
                @"SELECT has_read FROM notification WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id }
            );

            Assert.True(hasRead);
        }

        [Fact]
        public async Task ClearNotifications_ReturnsOkResponse()
        {
            // Arrange - Create multiple unread notifications for the authenticated user (ID 1)
            var testUserId = 1;

            for (int i = 1; i <= 3; i++)
            {
                CreateNotification($"Unread Notification {i}", $"Unread text {i}", userId: testUserId, hasRead: false);
            }

            // Act
            var response = await _client.PostAsync("/notification/ClearNotifications", null);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var clearedCount = int.Parse(content);

            // Should match the number of unread notifications for the user
            Assert.Equal(3, clearedCount);

            // Verify all notifications for the user were marked as read
            var unreadCount = DatabaseHelper.RunQuery<int>(
                _schemaName,
                @"SELECT COUNT(*) FROM notification WHERE user_id = @userId AND has_read = false",
                new Dictionary<string, object> { ["@userId"] = testUserId }
            );

            Assert.Equal(0, unreadCount);
        }

        // Helper methods to create test data
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

        private int CreateEmployee(string firstName, string lastName)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (first_name, last_name, second_name, created_at, updated_at) 
                VALUES (@firstName, @lastName, @secondName, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@firstName"] = firstName,
                    ["@lastName"] = lastName,
                    ["@secondName"] = "Test",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateNotification(string title, string text, int? userId = null, int? employeeId = null,
            string code = null, string link = null, bool? hasRead = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO notification (title, text, user_id, employee_id, code, link, has_read, created_at, updated_at) 
                VALUES (@title, @text, @userId, @employeeId, @code, @link, @hasRead, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@title"] = title,
                    ["@text"] = text,
                    ["@userId"] = userId as object ?? DBNull.Value,
                    ["@employeeId"] = employeeId as object ?? DBNull.Value,
                    ["@code"] = code as object ?? DBNull.Value,
                    ["@link"] = link as object ?? DBNull.Value,
                    ["@hasRead"] = hasRead as object ?? DBNull.Value,
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