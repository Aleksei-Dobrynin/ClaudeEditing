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
    public class TagTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public TagTests()
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
            // Arrange - Create test tags
            CreateTag("Test Tag 1", "test_code_1", "Test Description 1");
            CreateTag("Test Tag 2", "test_code_2", "Test Description 2");

            // Act
            var response = await _client.GetAsync("/Tag/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<Tag>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, tag => tag.name == "Test Tag 1" && tag.code == "test_code_1");
            Assert.Contains(result, tag => tag.name == "Test Tag 2" && tag.code == "test_code_2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test tag
            var id = CreateTag("Single Tag", "single_code", "Single Description");

            // Act
            var response = await _client.GetAsync($"/Tag/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Tag>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Tag", result.name);
            Assert.Equal("single_code", result.code);
            Assert.Equal("Single Description", result.description);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateTagRequest
            {
                name = "New Tag",
                code = "new_code",
                description = "New Description"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/Tag/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Tag>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Tag", result.name);
            Assert.Equal("new_code", result.code);
            Assert.Equal("New Description", result.description);

            // Verify in database
            var tag = DatabaseHelper.RunQueryList<Tag>(_schemaName, @"
                SELECT id, name, code, description FROM tag WHERE id = @id",
                reader => new Tag
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    description = reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(tag);
            Assert.Equal("New Tag", tag.name);
            Assert.Equal("new_code", tag.code);
            Assert.Equal("New Description", tag.description);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateTag("Original Tag", "original_code", "Original Description");

            var request = new UpdateTagRequest
            {
                id = id,
                name = "Updated Tag",
                code = "updated_code",
                description = "Updated Description"
            };

            // Act
            var response = await _client.PutAsync($"/Tag/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Tag>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Tag", result.name);
            Assert.Equal("updated_code", result.code);
            Assert.Equal("Updated Description", result.description);

            // Verify in database
            var tag = DatabaseHelper.RunQueryList<Tag>(_schemaName, @"
                SELECT name, code, description FROM tag WHERE id = @id",
                reader => new Tag
                {
                    name = reader.GetString(0),
                    code = reader.GetString(1),
                    description = reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(tag);
            Assert.Equal("Updated Tag", tag.name);
            Assert.Equal("updated_code", tag.code);
            Assert.Equal("Updated Description", tag.description);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateTag("Tag to Delete", "delete_code", "Delete Description");

            // Act
            var response = await _client.DeleteAsync($"/Tag/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM tag WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple tags
            for (int i = 1; i <= 5; i++)
            {
                CreateTag($"Paginated Tag {i}", $"paginated_code_{i}", $"Paginated Description {i}");
            }

            // Act
            var response = await _client.GetAsync("/Tag/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();

            // Parse as JObject first to check individual properties
            var jObject = JObject.Parse(content);

            // Extract metadata from the paginated list
            var totalPages = jObject["totalPages"]?.Value<int>() ?? 0;
            var totalCount = jObject["totalCount"]?.Value<int>() ?? 0;
            var pageNumber = jObject["pageNumber"]?.Value<int>() ?? 0;
            var pageSize = jObject["pageSize"]?.Value<int>() ?? 0;

            // Now deserialize the whole object
            var result = JsonConvert.DeserializeObject<PaginatedResponse<Tag>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, totalCount);
            Assert.Equal(1, pageNumber);
            Assert.Equal(2, totalPages);
        }

        // Helper methods to create test data
        private int CreateTag(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO tag (name, code, description, created_at, updated_at) 
                VALUES (@name, @code, @description, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
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