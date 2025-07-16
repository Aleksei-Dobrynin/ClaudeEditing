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
    public class ArchiveFileTagsTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ArchiveFileTagsTests()
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
            var fileId = CreateFile("Test File", "/path/to/file");
            var tagId = CreateArchiveDocTag("Test Tag", "testtag", "Tag Description", "#FF0000", "#FFFFFF");

            CreateArchiveFileTag(fileId, tagId);
            CreateArchiveFileTag(fileId, tagId);

            // Act
            var response = await _client.GetAsync("/archive_file_tags/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<archive_file_tags>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var fileId = CreateFile("Single File", "/path/to/single/file");
            var tagId = CreateArchiveDocTag("Single Tag", "singletag", "Single Tag Description", "#00FF00", "#000000");

            var id = CreateArchiveFileTag(fileId, tagId);

            // Act
            var response = await _client.GetAsync($"/archive_file_tags/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<archive_file_tags>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(fileId, result.file_id);
            Assert.Equal(tagId, result.tag_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var fileId = CreateFile("Created File", "/path/to/created/file");
            var tagId = CreateArchiveDocTag("Created Tag", "createdtag", "Created Tag Description", "#0000FF", "#FFFFFF");

            var request = new Createarchive_file_tagsRequest
            {
                file_id = fileId,
                tag_id = tagId,
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/archive_file_tags", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<archive_file_tags>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(fileId, result.file_id);
            Assert.Equal(tagId, result.tag_id);

            // Verify in database
            var fileTag = DatabaseHelper.RunQueryList<archive_file_tags>(_schemaName, @"
                SELECT id, file_id, tag_id FROM archive_file_tags WHERE id = @id",
                reader => new archive_file_tags
                {
                    id = reader.GetInt32(0),
                    file_id = reader.GetInt32(1),
                    tag_id = reader.GetInt32(2)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(fileTag);
            Assert.Equal(result.id, fileTag.id);
            Assert.Equal(fileId, fileTag.file_id);
            Assert.Equal(tagId, fileTag.tag_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalFileId = CreateFile("Original File", "/path/to/original/file");
            var originalTagId = CreateArchiveDocTag("Original Tag", "originaltag", "Original Tag Description", "#FF0000", "#FFFFFF");

            var newFileId = CreateFile("New File", "/path/to/new/file");
            var newTagId = CreateArchiveDocTag("New Tag", "newtag", "New Tag Description", "#00FF00", "#000000");

            var id = CreateArchiveFileTag(originalFileId, originalTagId);

            var request = new Updatearchive_file_tagsRequest
            {
                id = id,
                file_id = newFileId,
                tag_id = newTagId,
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PutAsync($"/archive_file_tags/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<archive_file_tags>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newFileId, result.file_id);
            Assert.Equal(newTagId, result.tag_id);

            // Verify in database
            var fileTag = DatabaseHelper.RunQueryList<archive_file_tags>(_schemaName, @"
                SELECT file_id, tag_id FROM archive_file_tags WHERE id = @id",
                reader => new archive_file_tags
                {
                    file_id = reader.GetInt32(0),
                    tag_id = reader.GetInt32(1)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(fileTag);
            Assert.Equal(newFileId, fileTag.file_id);
            Assert.Equal(newTagId, fileTag.tag_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var fileId = CreateFile("Delete File", "/path/to/delete/file");
            var tagId = CreateArchiveDocTag("Delete Tag", "deletetag", "Delete Tag Description", "#FF0000", "#FFFFFF");

            var id = CreateArchiveFileTag(fileId, tagId);

            // Act
            var response = await _client.DeleteAsync($"/archive_file_tags/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            int deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM archive_file_tags WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test file tags
            var fileId = CreateFile("Paginated File", "/path/to/paginated/file");
            var tagId = CreateArchiveDocTag("Paginated Tag", "paginatedtag", "Paginated Tag Description", "#FF0000", "#FFFFFF");

            for (int i = 0; i < 5; i++)
            {
                CreateArchiveFileTag(fileId, tagId);
            }

            // Act
            var response = await _client.GetAsync("/archive_file_tags/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<archive_file_tags>>(content);

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

        [Fact]
        public async Task GetByFileId_ReturnsOkResponse()
        {
            // Arrange
            var fileId1 = CreateFile("File 1", "/path/to/file1");
            var fileId2 = CreateFile("File 2", "/path/to/file2");
            var tagId1 = CreateArchiveDocTag("Tag 1", "tag1", "Tag 1 Description", "#FF0000", "#FFFFFF");
            var tagId2 = CreateArchiveDocTag("Tag 2", "tag2", "Tag 2 Description", "#00FF00", "#000000");

            // Create file tags
            CreateArchiveFileTag(fileId1, tagId1);
            CreateArchiveFileTag(fileId1, tagId2);
            CreateArchiveFileTag(fileId2, tagId1);

            // Act
            var response = await _client.GetAsync($"/archive_file_tags/GetByfile_id?file_id={fileId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<archive_file_tags>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, fileTag => Assert.Equal(fileId1, fileTag.file_id));
        }

        [Fact]
        public async Task GetByTagId_ReturnsOkResponse()
        {
            // Arrange
            var fileId1 = CreateFile("File 1", "/path/to/file1");
            var fileId2 = CreateFile("File 2", "/path/to/file2");
            var tagId1 = CreateArchiveDocTag("Tag 1", "tag1", "Tag 1 Description", "#FF0000", "#FFFFFF");
            var tagId2 = CreateArchiveDocTag("Tag 2", "tag2", "Tag 2 Description", "#00FF00", "#000000");

            // Create file tags
            CreateArchiveFileTag(fileId1, tagId1);
            CreateArchiveFileTag(fileId2, tagId1);
            CreateArchiveFileTag(fileId2, tagId2);

            // Act
            var response = await _client.GetAsync($"/archive_file_tags/GetBytag_id?tag_id={tagId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<archive_file_tags>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, fileTag => Assert.Equal(tagId1, fileTag.tag_id));
        }

        // Helper methods to create test data
        private int CreateFile(string name, string path)
        {
            var fileId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO file (name, path, created_at, updated_at) 
                VALUES (@name, @path, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@path"] = path,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
            
            var objectId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO dutyplan_object (doc_number) 
                VALUES (@doc_number) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@doc_number"] = name
                });
            
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_object_file (archive_object_id, file_id) 
                VALUES (@archive_object_id, @file_id) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@archive_object_id"] = objectId,
                    ["@file_id"] = fileId,
                });
        }

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

        private int CreateArchiveFileTag(int fileId, int tagId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_file_tags (file_id, tag_id, created_at, updated_at) 
                VALUES (@fileId, @tagId, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@fileId"] = fileId,
                    ["@tagId"] = tagId,
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