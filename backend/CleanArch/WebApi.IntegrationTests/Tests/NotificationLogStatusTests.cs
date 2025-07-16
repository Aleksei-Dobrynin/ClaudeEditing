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
    public class NotificationLogStatusTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public NotificationLogStatusTests()
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
            // Arrange - Create test statuses
            CreateNotificationLogStatus("Pending", "pending", "Notification is pending");
            CreateNotificationLogStatus("Sent", "sent", "Notification was sent");

            // Act
            var response = await _client.GetAsync("/notification_log_status/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<notification_log_status>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.name == "Pending" && s.code == "pending");
            Assert.Contains(result, s => s.name == "Sent" && s.code == "sent");
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateNotificationLogStatus("Error", "error", "Notification error");

            // Act
            var response = await _client.GetAsync($"/notification_log_status/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<notification_log_status>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Error", result.name);
            Assert.Equal("error", result.code);
            Assert.Equal("Notification error", result.description);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new Createnotification_log_statusRequest
            {
                name = "Created Status",
                name_kg = "Жаратылган статус",
                code = "created",
                description = "Created notification status",
                description_kg = "Билдирүү жаратылган статусунда",
                text_color = "#000000",
                background_color = "#FFFFFF",
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/notification_log_status", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<notification_log_status>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Status", result.name);
            Assert.Equal("created", result.code);
            Assert.Equal("Created notification status", result.description);
            Assert.Equal("#000000", result.text_color);
            Assert.Equal("#FFFFFF", result.background_color);

            // Verify in database
            var status = DatabaseHelper.RunQueryList<notification_log_status>(
                _schemaName,
                @"SELECT id, name, code, description, text_color, background_color 
                  FROM notification_log_status WHERE id = @id",
                reader => new notification_log_status
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    description = reader.GetString(3),
                    text_color = reader.GetString(4),
                    background_color = reader.GetString(5)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(status);
            Assert.Equal(result.id, status.id);
            Assert.Equal("Created Status", status.name);
            Assert.Equal("created", status.code);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateNotificationLogStatus("Original Status", "original", "Original description");

            var request = new Updatenotification_log_statusRequest
            {
                id = id,
                name = "Updated Status",
                name_kg = "Жаратылган статус",
                code = "updated",
                description = "Updated description",
                description_kg = "Билдирүү жаратылган статусунда",
                text_color = "#111111",
                background_color = "#222222",
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PutAsync($"/notification_log_status/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<notification_log_status>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Status", result.name);
            Assert.Equal("updated", result.code);
            Assert.Equal("Updated description", result.description);
            Assert.Equal("#111111", result.text_color);
            Assert.Equal("#222222", result.background_color);

            // Verify in database
            var status = DatabaseHelper.RunQueryList<notification_log_status>(
                _schemaName,
                @"SELECT name, code, description, text_color, background_color 
                  FROM notification_log_status WHERE id = @id",
                reader => new notification_log_status
                {
                    name = reader.GetString(0),
                    code = reader.GetString(1),
                    description = reader.GetString(2),
                    text_color = reader.GetString(3),
                    background_color = reader.GetString(4)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(status);
            Assert.Equal("Updated Status", status.name);
            Assert.Equal("updated", status.code);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateNotificationLogStatus("To Delete", "delete", "Status to delete");

            // Act
            var response = await _client.DeleteAsync($"/notification_log_status/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify deletion in database
            var exists = DatabaseHelper.RunQuery<int>(
                _schemaName,
                @"SELECT COUNT(*) FROM notification_log_status WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id }
            );

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple statuses
            for (int i = 1; i <= 5; i++)
            {
                CreateNotificationLogStatus($"Status {i}", $"status_{i}", $"Description {i}");
            }

            // Act
            var response = await _client.GetAsync("/notification_log_status/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<notification_log_status>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        // Helper methods to create test data
        private int CreateNotificationLogStatus(string name, string code, string description,
            string textColor = "#000000", string backgroundColor = "#FFFFFF")
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO notification_log_status (name, code, description, text_color, background_color, created_at, updated_at) 
                VALUES (@name, @code, @description, @textColor, @backgroundColor, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@textColor"] = textColor,
                    ["@backgroundColor"] = backgroundColor,
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