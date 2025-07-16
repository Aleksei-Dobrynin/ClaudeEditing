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
    public class StatusDutyplanObjectTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public StatusDutyplanObjectTests()
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
            // Arrange - Create test status objects
            int statusId1 = CreateStatusDutyplanObject("Active", "active", "Active status", "#28A745", "#FFFFFF");
            int statusId2 = CreateStatusDutyplanObject("Inactive", "inactive", "Inactive status", "#DC3545", "#FFFFFF");

            // Act
            var response = await _client.GetAsync("/status_dutyplan_object/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<status_dutyplan_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.id == statusId1 && s.name == "Active" && s.code == "active");
            Assert.Contains(result, s => s.id == statusId2 && s.name == "Inactive" && s.code == "inactive");
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test status object
            int statusId = CreateStatusDutyplanObject("On Review", "on_review", "Status for review", "#FFC107", "#000000");

            // Act
            var response = await _client.GetAsync($"/status_dutyplan_object/{statusId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<status_dutyplan_object>(content);

            Assert.NotNull(result);
            Assert.Equal(statusId, result.id);
            Assert.Equal("On Review", result.name);
            Assert.Equal("on_review", result.code);
            Assert.Equal("Status for review", result.description);
            Assert.Equal("#FFC107", result.text_color);
            Assert.Equal("#000000", result.background_color);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var createRequest = new Createstatus_dutyplan_objectRequest
            {
                name = "Created Status",
                code = "created_status",
                description = "Status created through API",
                name_kg = "Created Status KG",
                description_kg = "Status created through API KG",
                text_color = "#007BFF",
                background_color = "#FFFFFF"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/status_dutyplan_object", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<status_dutyplan_object>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(createRequest.name, result.name);
            Assert.Equal(createRequest.code, result.code);
            Assert.Equal(createRequest.description, result.description);
            Assert.Equal(createRequest.name_kg, result.name_kg);
            Assert.Equal(createRequest.description_kg, result.description_kg);
            Assert.Equal(createRequest.text_color, result.text_color);
            Assert.Equal(createRequest.background_color, result.background_color);

            // Verify in database
            var savedStatus = await GetStatusDutyplanObjectFromDb(result.id);
            Assert.NotNull(savedStatus);
            Assert.Equal(createRequest.name, savedStatus.name);
            Assert.Equal(createRequest.code, savedStatus.code);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test status object
            int statusId = CreateStatusDutyplanObject("Original Status", "original_status", "Original description", "#000000", "#FFFFFF");

            var updateRequest = new Updatestatus_dutyplan_objectRequest
            {
                id = statusId,
                name = "Updated Status",
                code = "updated_status",
                description = "Updated description",
                name_kg = "Updated Status KG",
                description_kg = "Updated description KG",
                text_color = "#FF0000",
                background_color = "#EEEEEE"
            };

            // Act
            var response = await _client.PutAsync($"/status_dutyplan_object/{statusId}", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<status_dutyplan_object>(content);

            Assert.NotNull(result);
            Assert.Equal(statusId, result.id);
            Assert.Equal(updateRequest.name, result.name);
            Assert.Equal(updateRequest.code, result.code);
            Assert.Equal(updateRequest.description, result.description);
            Assert.Equal(updateRequest.name_kg, result.name_kg);
            Assert.Equal(updateRequest.description_kg, result.description_kg);
            Assert.Equal(updateRequest.text_color, result.text_color);
            Assert.Equal(updateRequest.background_color, result.background_color);

            // Verify in database
            var updatedStatus = await GetStatusDutyplanObjectFromDb(statusId);
            Assert.NotNull(updatedStatus);
            Assert.Equal("Updated Status", updatedStatus.name);
            Assert.Equal("updated_status", updatedStatus.code);
            Assert.Equal("#FF0000", updatedStatus.text_color);
            Assert.Equal("#EEEEEE", updatedStatus.background_color);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test status object
            int statusId = CreateStatusDutyplanObject("Status To Delete", "status_to_delete", "Will be deleted", "#CCCCCC", "#333333");

            // Act
            var response = await _client.DeleteAsync($"/status_dutyplan_object/{statusId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(statusId, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM status_dutyplan_object WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = statusId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple test status objects
            for (int i = 0; i < 5; i++)
            {
                CreateStatusDutyplanObject($"Status {i}", $"status_{i}", $"Description {i}", "#000000", "#FFFFFF");
            }

            // Act
            var response = await _client.GetAsync("/status_dutyplan_object/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<status_dutyplan_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        [Fact]
        public async Task StatusDutyplanObject_UsedByDutyplanObject_CanBeRetrieved()
        {
            // Arrange - Create test status
            int statusId = CreateStatusDutyplanObject("Used Status", "used_status", "Status used by dutyplan object", "#00FF00", "#FFFFFF");

            // Create a dutyplan object using this status
            int dutyplanObjectId = CreateDutyplanObject("Document-123", "Test Address", statusId);

            // Act
            var response = await _client.GetAsync($"/status_dutyplan_object/{statusId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<status_dutyplan_object>(content);

            Assert.NotNull(result);
            Assert.Equal(statusId, result.id);
            Assert.Equal("Used Status", result.name);

            // Verify relationship exists in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM dutyplan_object WHERE status_dutyplan_object_id = @status_id",
                new Dictionary<string, object> { ["@status_id"] = statusId });

            Assert.Equal(1, count);
        }

        #region Helper Methods

        private int CreateStatusDutyplanObject(string name, string code, string description, string textColor, string backgroundColor)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO status_dutyplan_object (
                    name, code, description, name_kg, description_kg, text_color, background_color, created_at, updated_at
                ) VALUES (
                    @name, @code, @description, @name_kg, @description_kg, @text_color, @background_color, @created_at, @updated_at
                ) RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@name_kg"] = $"{name} KG",
                    ["@description_kg"] = $"{description} KG",
                    ["@text_color"] = textColor,
                    ["@background_color"] = backgroundColor,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDutyplanObject(string docNumber, string address, int statusId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO dutyplan_object (
                    doc_number, address, status_dutyplan_object_id, created_at, updated_at
                ) VALUES (
                    @doc_number, @address, @status_dutyplan_object_id, @created_at, @updated_at
                ) RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@doc_number"] = docNumber,
                    ["@address"] = address,
                    ["@status_dutyplan_object_id"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<status_dutyplan_object> GetStatusDutyplanObjectFromDb(int id)
        {
            return DatabaseHelper.RunQueryList<status_dutyplan_object>(_schemaName, @"
                SELECT id, name, description, code, name_kg, description_kg, text_color, background_color,
                       created_at, updated_at, created_by, updated_by
                FROM status_dutyplan_object
                WHERE id = @id",
                reader => new status_dutyplan_object
                {
                    id = reader.GetInt32(0),
                    name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    code = reader.IsDBNull(3) ? null : reader.GetString(3),
                    name_kg = reader.IsDBNull(4) ? null : reader.GetString(4),
                    description_kg = reader.IsDBNull(5) ? null : reader.GetString(5),
                    text_color = reader.IsDBNull(6) ? null : reader.GetString(6),
                    background_color = reader.IsDBNull(7) ? null : reader.GetString(7),
                    created_at = reader.IsDBNull(8) ? null : reader.GetDateTime(8),
                    updated_at = reader.IsDBNull(9) ? null : reader.GetDateTime(9),
                    created_by = reader.IsDBNull(10) ? null : reader.GetInt32(10),
                    updated_by = reader.IsDBNull(11) ? null : reader.GetInt32(11)
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