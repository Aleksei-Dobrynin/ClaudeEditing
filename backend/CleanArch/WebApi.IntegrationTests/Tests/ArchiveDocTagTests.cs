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
    public class ArchiveDocTagTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ArchiveDocTagTests()
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
            CreateArchiveDocTag("Tag 1", "tag1", "Description 1", "#FF0000", "#FFFFFF");
            CreateArchiveDocTag("Tag 2", "tag2", "Description 2", "#00FF00", "#000000");

            // Act
            var response = await _client.GetAsync("/archive_doc_tag/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<archive_doc_tag>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test tag
            var id = CreateArchiveDocTag("Single Tag", "singletag", "Single Description", "#0000FF", "#FFFFFF");

            // Act
            var response = await _client.GetAsync($"/archive_doc_tag/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<archive_doc_tag>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Tag", result.name);
            Assert.Equal("singletag", result.code);
            Assert.Equal("Single Description", result.description);
            Assert.Equal("#0000FF", result.text_color);
            Assert.Equal("#FFFFFF", result.background_color);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new Createarchive_doc_tagRequest
            {
                name = "Created Tag",
                name_kg = "Created Tag kg",
                code = "createdtag",
                description = "Created Description",
                description_kg = "Created Description kg",
                text_color = "#FF00FF",
                background_color = "#00FFFF",
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/archive_doc_tag", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<archive_doc_tag>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Tag", result.name);
            Assert.Equal("createdtag", result.code);
            Assert.Equal("Created Description", result.description);
            Assert.Equal("#FF00FF", result.text_color);
            Assert.Equal("#00FFFF", result.background_color);

            // Verify in database
            var tag = DatabaseHelper.RunQueryList<archive_doc_tag>(_schemaName, @"
                SELECT id, name, code, description, text_color, background_color 
                FROM archive_doc_tag WHERE id = @id",
                reader => new archive_doc_tag
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

            Assert.NotNull(tag);
            Assert.Equal(result.id, tag.id);
            Assert.Equal("Created Tag", tag.name);
            Assert.Equal("createdtag", tag.code);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateArchiveDocTag("Original Tag", "originaltag", "Original Description", "#000000", "#FFFFFF");

            var request = new Updatearchive_doc_tagRequest
            {
                id = id,
                name = "Updated Tag",
                name_kg = "Updated Tag kg",
                code = "updatedtag",
                description = "Updated Description",
                description_kg = "Updated Description kg",
                text_color = "#111111",
                background_color = "#EEEEEE",
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PutAsync($"/archive_doc_tag/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<archive_doc_tag>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Tag", result.name);
            Assert.Equal("updatedtag", result.code);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("#111111", result.text_color);
            Assert.Equal("#EEEEEE", result.background_color);

            // Verify in database
            var tag = DatabaseHelper.RunQueryList<archive_doc_tag>(_schemaName, @"
                SELECT name, code, description, text_color, background_color 
                FROM archive_doc_tag WHERE id = @id",
                reader => new archive_doc_tag
                {
                    name = reader.GetString(0),
                    code = reader.GetString(1),
                    description = reader.GetString(2),
                    text_color = reader.GetString(3),
                    background_color = reader.GetString(4)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(tag);
            Assert.Equal("Updated Tag", tag.name);
            Assert.Equal("updatedtag", tag.code);
            Assert.Equal("Updated Description", tag.description);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateArchiveDocTag("Tag to Delete", "tagdelete", "Delete Description", "#FF0000", "#FFFFFF");

            // Act
            var response = await _client.DeleteAsync($"/archive_doc_tag/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            int deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM archive_doc_tag WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test tags
            for (int i = 1; i <= 5; i++)
            {
                CreateArchiveDocTag($"Tag {i}", $"tag{i}", $"Description {i}", "#FF0000", "#FFFFFF");
            }

            // Act
            var response = await _client.GetAsync("/archive_doc_tag/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<archive_doc_tag>>(content);

            JObject jObject = JObject.Parse(content);

            int pageNumber = jObject["pageNumber"]?.Value<int>() ?? 0;
            int totalPages = jObject["totalPages"]?.Value<int>() ?? 0;
            int totalCount = jObject["totalCount"]?.Value<int>() ?? 0;

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, totalCount);
            Assert.Equal(1, pageNumber);
            Assert.Equal(2, totalPages);
        }

        // Helper methods to create test data
        private int CreateArchiveDocTag(string name, string code, string description, string textColor, string backgroundColor)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_doc_tag (name, code, description, text_color, background_color, created_at, updated_at) 
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