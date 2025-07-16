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
    public class ReleaseVideoTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ReleaseVideoTests()
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
            // Arrange - Create test data (release, file, and release_video)
            var releaseId = CreateTestRelease("Test Release", "Description", "REL001", DateTime.Now);
            var file1Id = CreateTestFile("video1.mp4", "/path/to/video1.mp4");
            var file2Id = CreateTestFile("video2.mp4", "/path/to/video2.mp4");

            CreateReleaseVideo(releaseId, file1Id, "Video 1");
            CreateReleaseVideo(releaseId, file2Id, "Video 2");

            // Act
            var response = await _client.GetAsync("/release_video/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<release_video>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange
            var releaseId = CreateTestRelease("Single Release", "Single Description", "SIN001", DateTime.Now);
            var fileId = CreateTestFile("single.mp4", "/path/to/single.mp4");
            var id = CreateReleaseVideo(releaseId, fileId, "Single Video");

            // Act
            var response = await _client.GetAsync($"/release_video/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<release_video>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(releaseId, result.release_id);
            Assert.Equal(fileId, result.file_id);
            Assert.Equal("Single Video", result.name);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var releaseId = CreateTestRelease("Create Release", "Create Description", "CRE001", DateTime.Now);
            var fileId = CreateTestFile("create.mp4", "/path/to/create.mp4");

            var request = new Createrelease_videoRequest
            {
                release_id = releaseId,
                file_id = fileId,
                name = "Create Video",
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/release_video", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<release_video>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(releaseId, result.release_id);
            Assert.Equal(fileId, result.file_id);
            Assert.Equal("Create Video", result.name);

            // Verify in database
            var releaseVideo = GetReleaseVideoFromDatabase(result.id);
            Assert.NotNull(releaseVideo);
            Assert.Equal("Create Video", releaseVideo.name);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var releaseId = CreateTestRelease("Update Release", "Update Description", "UPD001", DateTime.Now);
            var fileId = CreateTestFile("update.mp4", "/path/to/update.mp4");
            var newFileId = CreateTestFile("new_update.mp4", "/path/to/new_update.mp4");

            var id = CreateReleaseVideo(releaseId, fileId, "Original Video");

            var request = new Updaterelease_videoRequest
            {
                id = id,
                release_id = releaseId,
                file_id = newFileId,
                name = "Updated Video",
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PutAsync($"/release_video/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<release_video>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(releaseId, result.release_id);
            Assert.Equal(newFileId, result.file_id);
            Assert.Equal("Updated Video", result.name);

            // Verify in database
            var updatedReleaseVideo = GetReleaseVideoFromDatabase(id);
            Assert.Equal(newFileId, updatedReleaseVideo.file_id);
            Assert.Equal("Updated Video", updatedReleaseVideo.name);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var releaseId = CreateTestRelease("Delete Release", "Delete Description", "DEL001", DateTime.Now);
            var fileId = CreateTestFile("delete.mp4", "/path/to/delete.mp4");
            var id = CreateReleaseVideo(releaseId, fileId, "Delete Video");

            // Act
            var response = await _client.DeleteAsync($"/release_video/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                @"SELECT COUNT(*) FROM release_video WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple release videos
            var releaseId = CreateTestRelease("Paginated Release", "Paginated Description", "PAG001", DateTime.Now);

            for (int i = 1; i <= 5; i++)
            {
                var fileId = CreateTestFile($"page{i}.mp4", $"/path/to/page{i}.mp4");
                CreateReleaseVideo(releaseId, fileId, $"Video {i}");
            }

            // Act
            var response = await _client.GetAsync("/release_video/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<release_video>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        [Fact]
        public async Task GetByrelease_id_ReturnsOkResponse()
        {
            // Arrange
            var releaseId1 = CreateTestRelease("Release 1", "Description 1", "REL001", DateTime.Now);
            var releaseId2 = CreateTestRelease("Release 2", "Description 2", "REL002", DateTime.Now);

            var file1Id = CreateTestFile("video1.mp4", "/path/to/video1.mp4");
            var file2Id = CreateTestFile("video2.mp4", "/path/to/video2.mp4");
            var file3Id = CreateTestFile("video3.mp4", "/path/to/video3.mp4");

            CreateReleaseVideo(releaseId1, file1Id, "Video 1");
            CreateReleaseVideo(releaseId1, file2Id, "Video 2");
            CreateReleaseVideo(releaseId2, file3Id, "Video 3");

            // Act
            var response = await _client.GetAsync($"/release_video/GetByrelease_id?release_id={releaseId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<release_video>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, video => Assert.Equal(releaseId1, video.release_id));

            // Verify that file_name property is populated
            Assert.Contains(result, video => video.file_name == "video1.mp4");
            Assert.Contains(result, video => video.file_name == "video2.mp4");
        }

        [Fact]
        public async Task GetByfile_id_ReturnsOkResponse()
        {
            // Arrange
            var releaseId1 = CreateTestRelease("File Release 1", "File Description 1", "FILE001", DateTime.Now);
            var releaseId2 = CreateTestRelease("File Release 2", "File Description 2", "FILE002", DateTime.Now);

            var fileId = CreateTestFile("shared.mp4", "/path/to/shared.mp4");

            CreateReleaseVideo(releaseId1, fileId, "Shared in Release 1");
            CreateReleaseVideo(releaseId2, fileId, "Shared in Release 2");

            // Act
            var response = await _client.GetAsync($"/release_video/GetByfile_id?file_id={fileId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<release_video>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, video => Assert.Equal(fileId, video.file_id));
            Assert.Contains(result, video => video.release_id == releaseId1);
            Assert.Contains(result, video => video.release_id == releaseId2);
        }

        // Helper methods

        private int CreateTestRelease(string number, string description, string code, DateTime? dateStart)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO release (number, description, code, date_start, created_at, updated_at) 
                VALUES (@number, @description, @code, @dateStart, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@number"] = number,
                    ["@description"] = description,
                    ["@code"] = code,
                    ["@dateStart"] = dateStart as object ?? DBNull.Value,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateTestFile(string name, string path)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO file (name, path, created_at, updated_at) 
                VALUES (@name, @path, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@path"] = path,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateReleaseVideo(int releaseId, int fileId, string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO release_video (release_id, file_id, name, created_at, updated_at) 
                VALUES (@releaseId, @fileId, @name, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@releaseId"] = releaseId,
                    ["@fileId"] = fileId,
                    ["@name"] = name,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private release_video GetReleaseVideoFromDatabase(int id)
        {
            return DatabaseHelper.RunQueryList<release_video>(_schemaName, @"
                SELECT rv.id, rv.release_id, rv.file_id, rv.name, rv.created_at, rv.updated_at, rv.created_by, rv.updated_by, f.name as file_name
                FROM release_video rv
                LEFT JOIN file f ON rv.file_id = f.id
                WHERE rv.id = @id",
                reader => new release_video
                {
                    id = reader.GetInt32(0),
                    release_id = reader.GetInt32(1),
                    file_id = reader.GetInt32(2),
                    name = reader.GetString(3),
                    created_at = reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                    updated_at = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    created_by = reader.IsDBNull(6) ? null : reader.GetInt32(6),
                    updated_by = reader.IsDBNull(7) ? null : reader.GetInt32(7),
                    file_name = reader.IsDBNull(8) ? null : reader.GetString(8)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}