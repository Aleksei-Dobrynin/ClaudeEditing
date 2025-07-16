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
    public class task_statusTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public task_statusTests()
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
            // Arrange - Create test task statuses
            CreateTaskStatus("In Progress", "in_progress", "Task is in progress", "#28A745", "#FFFFFF");
            CreateTaskStatus("Completed", "completed", "Task is completed", "#17A2B8", "#FFFFFF");

            // Act
            var response = await _client.GetAsync("/task_status/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<task_status>>(content);

            Assert.NotNull(result);
            Assert.Equal(5, result.Count);
            Assert.Contains(result, status => status.name == "In Progress" && status.code == "in_progress");
            Assert.Contains(result, status => status.name == "Completed" && status.code == "completed");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test task status
            var id = CreateTaskStatus("On Hold", "on_hold", "Task is on hold", "#FFC107", "#000000");

            // Act
            var response = await _client.GetAsync($"/task_status/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<task_status>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("On Hold", result.name);
            Assert.Equal("on_hold", result.code);
            Assert.Equal("Task is on hold", result.description);
            Assert.Equal("#FFC107", result.backcolor);
            Assert.Equal("#000000", result.textcolor);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new Createtask_statusRequest
            {
                name = "New Status",
                code = "new_status",
                description = "This is a new status",
                backcolor = "#6C757D",
                textcolor = "#FFFFFF"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/task_status", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<task_status>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Status", result.name);
            Assert.Equal("new_status", result.code);
            Assert.Equal("This is a new status", result.description);
            Assert.Equal("#6C757D", result.backcolor);
            Assert.Equal("#FFFFFF", result.textcolor);

            // Verify in database
            var status = DatabaseHelper.RunQueryList<task_status>(_schemaName, @"
                SELECT id, name, code, description, backcolor, textcolor FROM task_status WHERE id = @id",
                reader => new task_status
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    description = reader.GetString(3),
                    backcolor = reader.GetString(4),
                    textcolor = reader.GetString(5)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(status);
            Assert.Equal("New Status", status.name);
            Assert.Equal("new_status", status.code);
            Assert.Equal("This is a new status", status.description);
            Assert.Equal("#6C757D", status.backcolor);
            Assert.Equal("#FFFFFF", status.textcolor);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateTaskStatus("Original Status", "original_status", "Original Description", "#007BFF", "#FFFFFF");

            var request = new Updatetask_statusRequest
            {
                id = id,
                name = "Updated Status",
                code = "updated_status",
                description = "Updated Description",
                backcolor = "#DC3545",
                textcolor = "#FFFFFF"
            };

            // Act
            var response = await _client.PutAsync($"/task_status/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<task_status>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Status", result.name);
            Assert.Equal("updated_status", result.code);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("#DC3545", result.backcolor);
            Assert.Equal("#FFFFFF", result.textcolor);

            // Verify in database
            var status = DatabaseHelper.RunQueryList<task_status>(_schemaName, @"
                SELECT name, code, description, backcolor, textcolor FROM task_status WHERE id = @id",
                reader => new task_status
                {
                    name = reader.GetString(0),
                    code = reader.GetString(1),
                    description = reader.GetString(2),
                    backcolor = reader.GetString(3),
                    textcolor = reader.GetString(4)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(status);
            Assert.Equal("Updated Status", status.name);
            Assert.Equal("updated_status", status.code);
            Assert.Equal("Updated Description", status.description);
            Assert.Equal("#DC3545", status.backcolor);
            Assert.Equal("#FFFFFF", status.textcolor);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateTaskStatus("Status to Delete", "delete_status", "Status to be deleted", "#343A40", "#FFFFFF");

            // Act
            var response = await _client.DeleteAsync($"/task_status/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM task_status WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple task statuses
            for (int i = 1; i <= 5; i++)
            {
                CreateTaskStatus($"Status {i}", $"status_{i}", $"Description {i}", $"#00{i}000", "#FFFFFF");
            }

            // Act
            var response = await _client.GetAsync("/task_status/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();

            // Parse as JObject first to get metadata
            var jObject = JObject.Parse(content);

            var totalPages = jObject["totalPages"]?.Value<int>() ?? 0;
            var totalCount = jObject["totalCount"]?.Value<int>() ?? 0;
            var pageNumber = jObject["pageNumber"]?.Value<int>() ?? 0;

            // Now deserialize the whole object
            var result = JsonConvert.DeserializeObject<PaginatedResponse<task_status>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        // Helper methods to create test data
        private int CreateTaskStatus(string name, string code, string description, string backcolor, string textcolor)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO task_status (name, code, description, backcolor, textcolor, created_at, updated_at) 
                VALUES (@name, @code, @description, @backcolor, @textcolor, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@backcolor"] = backcolor,
                    ["@textcolor"] = textcolor,
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