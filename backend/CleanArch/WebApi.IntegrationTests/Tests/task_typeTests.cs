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
    public class task_typeTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public task_typeTests()
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
            // Arrange - Create test task types
            CreateTaskType("Review", "review", "Review task type", true, false, "#9C27B0");
            CreateTaskType("Approval", "approval", "Approval task type", true, true, "#4CAF50");

            // Act
            var response = await _client.GetAsync("/task_type/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<task_type>>(content);

            Assert.NotNull(result);
            Assert.Equal(5, result.Count);
            Assert.Contains(result, type => type.name == "Review" && type.code == "review");
            Assert.Contains(result, type => type.name == "Approval" && type.code == "approval");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test task type
            var id = CreateTaskType("Discussion", "discussion", "Discussion task type", true, true, "#FF9800");

            // Act
            var response = await _client.GetAsync($"/task_type/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<task_type>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Discussion", result.name);
            Assert.Equal("discussion", result.code);
            Assert.Equal("Discussion task type", result.description);
            Assert.True(result.is_for_task);
            Assert.True(result.is_for_subtask);
            Assert.Equal("#FF9800", result.icon_color);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var svgIconId = CreateSvgIcon("Test SVG Icon", "/path/to/icon");

            var request = new Createtask_typeRequest
            {
                name = "New Task Type",
                code = "new_type",
                description = "This is a new task type",
                is_for_task = true,
                is_for_subtask = false,
                icon_color = "#2196F3",
                svg_icon_id = svgIconId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/task_type", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<task_type>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Task Type", result.name);
            Assert.Equal("new_type", result.code);
            Assert.Equal("This is a new task type", result.description);
            Assert.True(result.is_for_task);
            Assert.False(result.is_for_subtask);
            Assert.Equal("#2196F3", result.icon_color);
            Assert.Equal(svgIconId, result.svg_icon_id);

            // Verify in database
            var taskType = DatabaseHelper.RunQueryList<task_type>(_schemaName, @"
                SELECT id, name, code, description, is_for_task, is_for_subtask, icon_color, svg_icon_id 
                FROM task_type WHERE id = @id",
                reader => new task_type
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    description = reader.GetString(3),
                    is_for_task = reader.GetBoolean(4),
                    is_for_subtask = reader.GetBoolean(5),
                    icon_color = reader.GetString(6),
                    svg_icon_id = reader.IsDBNull(7) ? null : (int?)reader.GetInt32(7)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(taskType);
            Assert.Equal("New Task Type", taskType.name);
            Assert.Equal("new_type", taskType.code);
            Assert.Equal("This is a new task type", taskType.description);
            Assert.True(taskType.is_for_task);
            Assert.False(taskType.is_for_subtask);
            Assert.Equal("#2196F3", taskType.icon_color);
            Assert.Equal(svgIconId, taskType.svg_icon_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalSvgIconId = CreateSvgIcon("Original Icon", "/path/to/original");
            var newSvgIconId = CreateSvgIcon("New Icon", "/path/to/new");

            var id = CreateTaskType("Original Type", "original_type", "Original Description", true, true, "#E91E63", originalSvgIconId);

            var request = new Updatetask_typeRequest
            {
                id = id,
                name = "Updated Type",
                code = "updated_type",
                description = "Updated Description",
                is_for_task = false,
                is_for_subtask = true,
                icon_color = "#3F51B5",
                svg_icon_id = newSvgIconId
            };

            // Act
            var response = await _client.PutAsync($"/task_type/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<task_type>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Type", result.name);
            Assert.Equal("updated_type", result.code);
            Assert.Equal("Updated Description", result.description);
            Assert.False(result.is_for_task);
            Assert.True(result.is_for_subtask);
            Assert.Equal("#3F51B5", result.icon_color);
            Assert.Equal(newSvgIconId, result.svg_icon_id);

            // Verify in database
            var taskType = DatabaseHelper.RunQueryList<task_type>(_schemaName, @"
                SELECT name, code, description, is_for_task, is_for_subtask, icon_color, svg_icon_id 
                FROM task_type WHERE id = @id",
                reader => new task_type
                {
                    name = reader.GetString(0),
                    code = reader.GetString(1),
                    description = reader.GetString(2),
                    is_for_task = reader.GetBoolean(3),
                    is_for_subtask = reader.GetBoolean(4),
                    icon_color = reader.GetString(5),
                    svg_icon_id = reader.IsDBNull(6) ? null : (int?)reader.GetInt32(6)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(taskType);
            Assert.Equal("Updated Type", taskType.name);
            Assert.Equal("updated_type", taskType.code);
            Assert.Equal("Updated Description", taskType.description);
            Assert.False(taskType.is_for_task);
            Assert.True(taskType.is_for_subtask);
            Assert.Equal("#3F51B5", taskType.icon_color);
            Assert.Equal(newSvgIconId, taskType.svg_icon_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateTaskType("Type to Delete", "delete_type", "Type to be deleted", false, false, "#795548");

            // Act
            var response = await _client.DeleteAsync($"/task_type/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM task_type WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple task types
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM task_type WHERE id > 0;");
            for (int i = 1; i <= 5; i++)
            {
                CreateTaskType($"Type {i}", $"type_{i}", $"Description {i}", i % 2 == 0, i % 3 == 0, $"#CC{i}{i}CC");
            }

            // Act
            var response = await _client.GetAsync("/task_type/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();

            // Parse as JObject first to get metadata
            var jObject = JObject.Parse(content);

            var totalPages = jObject["totalPages"]?.Value<int>() ?? 0;
            var totalCount = jObject["totalCount"]?.Value<int>() ?? 0;
            var pageNumber = jObject["pageNumber"]?.Value<int>() ?? 0;

            // Now deserialize the whole object
            var result = JsonConvert.DeserializeObject<PaginatedResponse<task_type>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        // Helper methods to create test data
        private int CreateTaskType(string name, string code, string description, bool isForTask, bool isForSubtask, string iconColor, int? svgIconId = null)
        {
            var parameters = new Dictionary<string, object>
            {
                ["@name"] = name,
                ["@code"] = code,
                ["@description"] = description,
                ["@is_for_task"] = isForTask,
                ["@is_for_subtask"] = isForSubtask,
                ["@icon_color"] = iconColor,
                ["@created_at"] = DateTime.Now,
                ["@updated_at"] = DateTime.Now
            };

            if (svgIconId.HasValue)
            {
                parameters.Add("@svg_icon_id", svgIconId.Value);
                return DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO task_type (name, code, description, is_for_task, is_for_subtask, icon_color, svg_icon_id, created_at, updated_at) 
                    VALUES (@name, @code, @description, @is_for_task, @is_for_subtask, @icon_color, @svg_icon_id, @created_at, @updated_at) 
                    RETURNING id;", parameters);
            }
            else
            {
                return DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO task_type (name, code, description, is_for_task, is_for_subtask, icon_color, created_at, updated_at) 
                    VALUES (@name, @code, @description, @is_for_task, @is_for_subtask, @icon_color, @created_at, @updated_at) 
                    RETURNING id;", parameters);
            }
        }

        private int CreateSvgIcon(string name, string svgPath)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""CustomSvgIcon"" (name, ""svgPath"", created_at, updated_at) 
                VALUES (@name, @svgPath, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@svgPath"] = svgPath,
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