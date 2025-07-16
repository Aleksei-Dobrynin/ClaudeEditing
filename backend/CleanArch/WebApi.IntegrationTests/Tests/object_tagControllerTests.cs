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
    public class object_tagControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public object_tagControllerTests()
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
            // Arrange - Create test object_tags
            CreateObjectTag("Test Tag 1", "Test Description 1", "test_code_1");
            CreateObjectTag("Test Tag 2", "Test Description 2", "test_code_2");

            // Act
            var response = await _client.GetAsync("/object_tag/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<object_tag>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, tag => tag.name == "Test Tag 1" && tag.code == "test_code_1");
            Assert.Contains(result, tag => tag.name == "Test Tag 2" && tag.code == "test_code_2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test object_tag
            int id = CreateObjectTag("Single Tag", "Single Description", "single_code");

            // Act
            var response = await _client.GetAsync($"/object_tag/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<object_tag>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Tag", result.name);
            Assert.Equal("Single Description", result.description);
            Assert.Equal("single_code", result.code);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new Createobject_tagRequest
            {
                name = "Created Tag",
                description = "Created Description",
                code = "created_code",
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/object_tag", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<object_tag>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Tag", result.name);
            Assert.Equal("Created Description", result.description);
            Assert.Equal("created_code", result.code);

            // Verify in database
            var dbTag = DatabaseHelper.RunQueryList<object_tag>(_schemaName, @"
                SELECT id, name, description, code FROM object_tag WHERE id = @id",
                reader => new object_tag
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    description = reader.GetString(2),
                    code = reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(dbTag);
            Assert.Equal("Created Tag", dbTag.name);
            Assert.Equal("Created Description", dbTag.description);
            Assert.Equal("created_code", dbTag.code);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test object_tag
            int id = CreateObjectTag("Original Tag", "Original Description", "original_code");

            var request = new Updateobject_tagRequest
            {
                id = id,
                name = "Updated Tag",
                description = "Updated Description",
                code = "updated_code",
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PutAsync($"/object_tag/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<object_tag>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Tag", result.name);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("updated_code", result.code);

            // Verify in database
            var dbTag = DatabaseHelper.RunQueryList<object_tag>(_schemaName, @"
                SELECT id, name, description, code FROM object_tag WHERE id = @id",
                reader => new object_tag
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    description = reader.GetString(2),
                    code = reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(dbTag);
            Assert.Equal("Updated Tag", dbTag.name);
            Assert.Equal("Updated Description", dbTag.description);
            Assert.Equal("updated_code", dbTag.code);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test object_tag
            int id = CreateObjectTag("Delete Tag", "Delete Description", "delete_code");

            // Act
            var response = await _client.DeleteAsync($"/object_tag/{id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM object_tag WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test object_tags
            for (int i = 1; i <= 5; i++)
            {
                CreateObjectTag($"Paginated Tag {i}", $"Paginated Description {i}", $"paginated_code_{i}");
            }

            // Act
            var response = await _client.GetAsync("/object_tag/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<object_tag>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        // Helper method to create object_tag
        private int CreateObjectTag(string name, string description, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO object_tag (name, description, code, created_at, updated_at) 
                VALUES (@name, @description, @code, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@code"] = code,
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