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
    public class RepeatTypeTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public RepeatTypeTests()
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
            // Arrange - Create test repeat types
            CreateRepeatType("Daily", "Repeats every day", "daily", true, 1440);
            CreateRepeatType("Weekly", "Repeats every week", "weekly", true, 10080);

            // Act
            var response = await _client.GetAsync("/RepeatType/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<RepeatType>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.name == "Daily" && r.code == "daily");
            Assert.Contains(result, r => r.name == "Weekly" && r.code == "weekly");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create a test repeat type
            var id = CreateRepeatType("Monthly", "Repeats every month", "monthly", true, 43200);

            // Act
            var response = await _client.GetAsync($"/RepeatType/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<RepeatType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Monthly", result.name);
            Assert.Equal("Repeats every month", result.description);
            Assert.Equal("monthly", result.code);
            Assert.True(result.isPeriod);
            Assert.Equal(43200, result.repeatIntervalMinutes);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateRepeatTypeRequest
            {
                name = "Hourly",
                description = "Repeats every hour",
                code = "hourly",
                isPeriod = true,
                repeatIntervalMinutes = 60
            };

            // Act
            var response = await _client.PostAsJsonAsync("/RepeatType/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<RepeatType>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Hourly", result.name);
            Assert.Equal("Repeats every hour", result.description);
            Assert.Equal("hourly", result.code);
            Assert.True(result.isPeriod);
            Assert.Equal(60, result.repeatIntervalMinutes);

            // Verify in database
            var insertedType = DatabaseHelper.RunQueryList<RepeatType>(_schemaName, @"
                SELECT id, name, description, code, ""isPeriod"", ""repeatIntervalMinutes"" 
                FROM ""RepeatType"" WHERE id = @id",
                reader => new RepeatType
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    description = reader.GetString(2),
                    code = reader.GetString(3),
                    isPeriod = reader.GetBoolean(4),
                    repeatIntervalMinutes = reader.GetInt32(5)
                },
                new Dictionary<string, object> { ["@id"] = result.id }).FirstOrDefault();

            Assert.NotNull(insertedType);
            Assert.Equal("Hourly", insertedType.name);
            Assert.Equal("hourly", insertedType.code);
            Assert.Equal(60, insertedType.repeatIntervalMinutes);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create a test repeat type to update
            var id = CreateRepeatType("Original", "Original description", "original", false, 30);

            var request = new UpdateRepeatTypeRequest
            {
                id = id,
                name = "Updated",
                description = "Updated description",
                code = "updated",
                isPeriod = true,
                repeatIntervalMinutes = 120
            };

            // Act
            var response = await _client.PutAsync("/RepeatType/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<RepeatType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated", result.name);
            Assert.Equal("Updated description", result.description);
            Assert.Equal("updated", result.code);
            Assert.True(result.isPeriod);
            Assert.Equal(120, result.repeatIntervalMinutes);

            // Verify in database
            var updatedType = DatabaseHelper.RunQueryList<RepeatType>(_schemaName, @"
                SELECT id, name, description, code, ""isPeriod"", ""repeatIntervalMinutes"" 
                FROM ""RepeatType"" WHERE id = @id",
                reader => new RepeatType
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    description = reader.GetString(2),
                    code = reader.GetString(3),
                    isPeriod = reader.GetBoolean(4),
                    repeatIntervalMinutes = reader.GetInt32(5)
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();

            Assert.NotNull(updatedType);
            Assert.Equal("Updated", updatedType.name);
            Assert.Equal("updated", updatedType.code);
            Assert.True(updatedType.isPeriod);
            Assert.Equal(120, updatedType.repeatIntervalMinutes);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create a test repeat type to delete
            var id = CreateRepeatType("ToDelete", "Will be deleted", "delete", true, 5);

            // Act
            var response = await _client.DeleteAsync($"/RepeatType/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM ""RepeatType"" WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        // Helper method to create a test repeat type
        private int CreateRepeatType(string name, string description, string code, bool isPeriod, int? repeatIntervalMinutes)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""RepeatType"" (name, description, code, ""isPeriod"", ""repeatIntervalMinutes"", created_at, updated_at) 
                VALUES (@name, @description, @code, @isPeriod, @repeatIntervalMinutes, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@code"] = code,
                    ["@isPeriod"] = isPeriod,
                    ["@repeatIntervalMinutes"] = repeatIntervalMinutes,
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