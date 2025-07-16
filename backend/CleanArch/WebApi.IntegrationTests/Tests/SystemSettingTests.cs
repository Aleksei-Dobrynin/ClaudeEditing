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
    public class SystemSettingTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public SystemSettingTests()
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
            // Arrange - Create test system settings
            CreateSystemSetting("Email Server", "SMTP server address", "email_server", "smtp.example.com");
            CreateSystemSetting("Company Name", "Name of the company", "company_name", "Test Company");

            // Act
            var response = await _client.GetAsync("/SystemSetting/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<SystemSetting>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.name == "Email Server" && s.code == "email_server");
            Assert.Contains(result, s => s.name == "Company Name" && s.code == "company_name");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test system setting
            int settingId = CreateSystemSetting("API Key", "API key for external service", "api_key", "12345abcde");

            // Act
            var response = await _client.GetAsync($"/SystemSetting/GetOneById?id={settingId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<SystemSetting>(content);

            Assert.NotNull(result);
            Assert.Equal(settingId, result.id);
            Assert.Equal("API Key", result.name);
            Assert.Equal("api_key", result.code);
            Assert.Equal("12345abcde", result.value);
        }

        [Fact]
        public async Task GetByCodes_ReturnsOkResponse()
        {
            // Arrange - Create test system settings
            CreateSystemSetting("Max File Size", "Maximum file size in MB", "max_file_size", "10");
            CreateSystemSetting("Allowed File Types", "Allowed file extensions", "allowed_file_types", "jpg,png,pdf");
            CreateSystemSetting("Default Theme", "Default UI theme", "default_theme", "light");

            // Act
            var response = await _client.GetAsync("/SystemSetting/GetByCodes?codes=max_file_size,default_theme");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<SystemSetting>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.code == "max_file_size" && s.value == "10");
            Assert.Contains(result, s => s.code == "default_theme" && s.value == "light");
            Assert.DoesNotContain(result, s => s.code == "allowed_file_types");
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var createRequest = new CreateSystemSettingRequest
            {
                name = "Session Timeout",
                description = "Session timeout in minutes",
                code = "session_timeout",
                value = "30"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/SystemSetting/Create", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<SystemSetting>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(createRequest.name, result.name);
            Assert.Equal(createRequest.description, result.description);
            Assert.Equal(createRequest.code, result.code);
            Assert.Equal(createRequest.value, result.value);

            // Verify in database
            var savedSetting = await GetSystemSettingFromDb(result.id);
            Assert.NotNull(savedSetting);
            Assert.Equal(createRequest.name, savedSetting.name);
            Assert.Equal(createRequest.code, savedSetting.code);
            Assert.Equal(createRequest.value, savedSetting.value);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            int settingId = CreateSystemSetting("Original Setting", "Original description", "original_code", "original_value");

            var updateRequest = new UpdateSystemSettingRequest
            {
                id = settingId,
                name = "Updated Setting",
                description = "Updated description",
                code = "updated_code",
                value = "updated_value"
            };

            // Act
            var response = await _client.PutAsJsonAsync("/SystemSetting/Update", updateRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<SystemSetting>(content);

            Assert.NotNull(result);
            Assert.Equal(settingId, result.id);
            Assert.Equal(updateRequest.name, result.name);
            Assert.Equal(updateRequest.description, result.description);
            Assert.Equal(updateRequest.code, result.code);
            Assert.Equal(updateRequest.value, result.value);

            // Verify in database
            var updatedSetting = await GetSystemSettingFromDb(settingId);
            Assert.NotNull(updatedSetting);
            Assert.Equal("Updated Setting", updatedSetting.name);
            Assert.Equal("updated_code", updatedSetting.code);
            Assert.Equal("updated_value", updatedSetting.value);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            int settingId = CreateSystemSetting("Setting to Delete", "Will be deleted", "delete_me", "value");

            // Act
            var response = await _client.DeleteAsync($"/SystemSetting/Delete?id={settingId}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM system_setting WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = settingId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple test system settings
            for (int i = 1; i <= 5; i++)
            {
                CreateSystemSetting($"Setting {i}", $"Description {i}", $"code_{i}", $"value_{i}");
            }

            // Act
            var response = await _client.GetAsync("/SystemSetting/GetPaginated?pageSize=2&pageNumber=2");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<SystemSetting>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(2, result.pageNumber);
            Assert.Equal(2, result.pageSize);
            Assert.Equal(3, result.totalPages);
        }

        #region Helper Methods

        private int CreateSystemSetting(string name, string description, string code, string value)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO system_setting (name, description, code, value, created_at, updated_at) 
                VALUES (@name, @description, @code, @value, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@code"] = code,
                    ["@value"] = value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<SystemSetting> GetSystemSettingFromDb(int id)
        {
            return DatabaseHelper.RunQueryList<SystemSetting>(_schemaName, @"
                SELECT id, name, description, code, value, created_at, updated_at, created_by, updated_by 
                FROM system_setting 
                WHERE id = @id",
                reader => new SystemSetting
                {
                    id = reader.GetInt32(0),
                    name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    code = reader.IsDBNull(3) ? null : reader.GetString(3),
                    value = reader.IsDBNull(4) ? null : reader.GetString(4),
                    created_at = reader.GetDateTime(5),
                    updated_at = reader.GetDateTime(6),
                    created_by = reader.GetInt32(7),
                    updated_by =  reader.GetInt32(8)
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