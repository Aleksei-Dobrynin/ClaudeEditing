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
    public class NotificationTemplateTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public NotificationTemplateTests()
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
            var emailTypeId = CreateContactType("Email", "email");
            var smsTypeId = CreateContactType("SMS", "sms");

            CreateNotificationTemplate("email_welcome", "Welcome", "Welcome to our system!", emailTypeId);
            CreateNotificationTemplate("sms_verification", "Verification", "Your verification code is: {{code}}", smsTypeId);

            // Act
            var response = await _client.GetAsync("/notification_template/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<notification_template>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, t => t.code == "email_welcome" && t.contact_type_id == emailTypeId);
            Assert.Contains(result, t => t.code == "sms_verification" && t.contact_type_id == smsTypeId);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange
            var contactTypeId = CreateContactType("Telegram", "telegram");
            var id = CreateNotificationTemplate("telegram_notification", "Notification", "You have a new notification: {{message}}", contactTypeId);

            // Act
            var response = await _client.GetAsync($"/notification_template/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<notification_template>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("telegram_notification", result.code);
            Assert.Equal("Notification", result.subject);
            Assert.Equal("You have a new notification: {{message}}", result.body);
            Assert.Equal(contactTypeId, result.contact_type_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var contactTypeId = CreateContactType("Email", "email");

            var request = new Createnotification_templateRequest
            {
                code = "email_created",
                subject = "Created Subject",
                body = "This is a created template body with {{placeholder}}",
                contact_type_id = contactTypeId,
                placeholders = "placeholder",
                link = "http://example.com/notification"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/notification_template", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<notification_template>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("email_created", result.code);
            Assert.Equal("Created Subject", result.subject);
            Assert.Equal("This is a created template body with {{placeholder}}", result.body);
            Assert.Equal(contactTypeId, result.contact_type_id);
            Assert.Equal("placeholder", result.placeholders);
            Assert.Equal("http://example.com/notification", result.link);

            // Verify in database
            var template = DatabaseHelper.RunQueryList<notification_template>(
                _schemaName,
                @"SELECT id, code, subject, body, contact_type_id, placeholders, link
                  FROM notification_template WHERE id = @id",
                reader => new notification_template
                {
                    id = reader.GetInt32(0),
                    code = reader.GetString(1),
                    subject = reader.GetString(2),
                    body = reader.GetString(3),
                    contact_type_id = reader.IsDBNull(4) ? null : (int?)reader.GetInt32(4),
                    placeholders = reader.IsDBNull(5) ? null : reader.GetString(5),
                    link = reader.IsDBNull(6) ? null : reader.GetString(6)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(template);
            Assert.Equal(result.id, template.id);
            Assert.Equal("email_created", template.code);
            Assert.Equal("Created Subject", template.subject);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalContactTypeId = CreateContactType("Original", "original");
            var newContactTypeId = CreateContactType("New", "new");

            var id = CreateNotificationTemplate("original_code", "Original Subject", "Original body", originalContactTypeId);

            var request = new Updatenotification_templateRequest
            {
                id = id,
                code = "updated_code",
                subject = "Updated Subject",
                body = "Updated body with {{new_placeholder}}",
                contact_type_id = newContactTypeId,
                placeholders = "new_placeholder",
                link = "http://example.com/updated"
            };

            // Act
            var response = await _client.PutAsync($"/notification_template/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<notification_template>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("updated_code", result.code);
            Assert.Equal("Updated Subject", result.subject);
            Assert.Equal("Updated body with {{new_placeholder}}", result.body);
            Assert.Equal(newContactTypeId, result.contact_type_id);
            Assert.Equal("new_placeholder", result.placeholders);
            Assert.Equal("http://example.com/updated", result.link);

            // Verify in database
            var template = DatabaseHelper.RunQueryList<notification_template>(
                _schemaName,
                @"SELECT code, subject, body, contact_type_id, placeholders, link
                  FROM notification_template WHERE id = @id",
                reader => new notification_template
                {
                    code = reader.GetString(0),
                    subject = reader.GetString(1),
                    body = reader.GetString(2),
                    contact_type_id = reader.IsDBNull(3) ? null : (int?)reader.GetInt32(3),
                    placeholders = reader.IsDBNull(4) ? null : reader.GetString(4),
                    link = reader.IsDBNull(5) ? null : reader.GetString(5)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(template);
            Assert.Equal("updated_code", template.code);
            Assert.Equal("Updated Subject", template.subject);
            Assert.Equal(newContactTypeId, template.contact_type_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var contactTypeId = CreateContactType("Delete", "delete");
            var id = CreateNotificationTemplate("template_to_delete", "Delete Subject", "Delete body", contactTypeId);

            // Act
            var response = await _client.DeleteAsync($"/notification_template/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify deletion in database
            var exists = DatabaseHelper.RunQuery<int>(
                _schemaName,
                @"SELECT COUNT(*) FROM notification_template WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id }
            );

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple templates
            var contactTypeId = CreateContactType("Paginated", "paginated");

            for (int i = 1; i <= 5; i++)
            {
                CreateNotificationTemplate($"template_{i}", $"Subject {i}", $"Body {i}", contactTypeId);
            }

            // Act
            var response = await _client.GetAsync("/notification_template/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<notification_template>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        [Fact]
        public async Task GetBycontact_type_id_ReturnsOkResponse()
        {
            // Arrange
            var emailTypeId = CreateContactType("Email Filter", "email_filter");
            var smsTypeId = CreateContactType("SMS Filter", "sms_filter");

            // Create templates for the target contact type
            CreateNotificationTemplate("email_template_1", "Email Subject 1", "Email Body 1", emailTypeId);
            CreateNotificationTemplate("email_template_2", "Email Subject 2", "Email Body 2", emailTypeId);

            // Create template for another contact type
            CreateNotificationTemplate("sms_template", "SMS Subject", "SMS Body", smsTypeId);

            // Act
            var response = await _client.GetAsync($"/notification_template/GetBycontact_type_id?contact_type_id={emailTypeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<notification_template>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, template => Assert.Equal(emailTypeId, template.contact_type_id));
            Assert.Contains(result, template => template.code == "email_template_1");
            Assert.Contains(result, template => template.code == "email_template_2");
        }

        // Helper methods to create test data
        private int CreateContactType(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO contact_type (name, code, created_at, updated_at) 
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

        private int CreateNotificationTemplate(string code, string subject, string body, int? contactTypeId,
            string placeholders = null, string link = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO notification_template (code, subject, body, contact_type_id, placeholders, link, created_at, updated_at) 
                VALUES (@code, @subject, @body, @contactTypeId, @placeholders, @link, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@code"] = code,
                    ["@subject"] = subject,
                    ["@body"] = body,
                    ["@contactTypeId"] = contactTypeId as object ?? DBNull.Value,
                    ["@placeholders"] = placeholders as object ?? DBNull.Value,
                    ["@link"] = link as object ?? DBNull.Value,
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