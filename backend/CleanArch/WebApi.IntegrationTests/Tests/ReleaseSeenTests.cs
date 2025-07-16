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
    public class ReleaseSeenTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ReleaseSeenTests()
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
            var userId1 = CreateTestUser("user1@example.com");
            var userId2 = CreateTestUser("user2@example.com");
            var releaseId = CreateTestRelease("Test Release", "Description", "REL001", DateTime.Now);

            CreateReleaseSeen(releaseId, userId1, DateTime.Now.AddDays(-1));
            CreateReleaseSeen(releaseId, userId2, DateTime.Now.AddDays(-2));

            // Act
            var response = await _client.GetAsync("/release_seen/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<release_seen>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange
            var userId = CreateTestUser("user@example.com");
            var releaseId = CreateTestRelease("Single Release", "Single Description", "SIN001", DateTime.Now);
            var dateIssued = DateTime.Now.AddDays(-1);
            var id = CreateReleaseSeen(releaseId, userId, dateIssued);

            // Act
            var response = await _client.GetAsync($"/release_seen/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<release_seen>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(releaseId, result.release_id);
            Assert.Equal(userId, result.user_id);
            Assert.Equal(dateIssued.Date, result.date_issued?.Date);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var userId = CreateTestUser("create@example.com");
            var releaseId = CreateTestRelease("Create Release", "Create Description", "CRE001", DateTime.Now);
            var dateIssued = DateTime.Now;

            var request = new Createrelease_seenRequest
            {
                release_id = releaseId,
                user_id = userId,
                date_issued = dateIssued,
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/release_seen", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<release_seen>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(releaseId, result.release_id);
            Assert.Equal(userId, result.user_id);
            Assert.Equal(dateIssued.Date, result.date_issued?.Date);

            // Verify in database
            var releaseSeen = GetReleaseSeenFromDatabase(result.id);
            Assert.NotNull(releaseSeen);
            Assert.Equal(releaseId, releaseSeen.release_id);
            Assert.Equal(userId, releaseSeen.user_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalUserId = CreateTestUser("original@example.com");
            var newUserId = CreateTestUser("new@example.com");
            var releaseId = CreateTestRelease("Update Release", "Update Description", "UPD001", DateTime.Now);
            var originalDateIssued = DateTime.Now.AddDays(-2);
            var newDateIssued = DateTime.Now.AddDays(-1);

            var id = CreateReleaseSeen(releaseId, originalUserId, originalDateIssued);

            var request = new Updaterelease_seenRequest
            {
                id = id,
                release_id = releaseId,
                user_id = newUserId,
                date_issued = newDateIssued,
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PutAsync($"/release_seen/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<release_seen>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(releaseId, result.release_id);
            Assert.Equal(newUserId, result.user_id);
            Assert.Equal(newDateIssued.Date, result.date_issued?.Date);

            // Verify in database
            var updatedReleaseSeen = GetReleaseSeenFromDatabase(id);
            Assert.Equal(newUserId, updatedReleaseSeen.user_id);
            Assert.Equal(newDateIssued.Date, updatedReleaseSeen.date_issued?.Date);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var userId = CreateTestUser("delete@example.com");
            var releaseId = CreateTestRelease("Delete Release", "Delete Description", "DEL001", DateTime.Now);
            var id = CreateReleaseSeen(releaseId, userId, DateTime.Now);

            // Act
            var response = await _client.DeleteAsync($"/release_seen/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                @"SELECT COUNT(*) FROM release_seen WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple release_seen records
            var userId = CreateTestUser("paged@example.com");
            var releaseId = CreateTestRelease("Paged Release", "Paged Description", "PAGE001", DateTime.Now);

            for (int i = 1; i <= 5; i++)
            {
                CreateReleaseSeen(releaseId, userId, DateTime.Now.AddDays(-i));
            }

            // Act
            var response = await _client.GetAsync("/release_seen/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<release_seen>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task GetByrelease_id_ReturnsOkResponse()
        {
            // Arrange
            var userId1 = CreateTestUser("user1@example.com");
            var userId2 = CreateTestUser("user2@example.com");
            var releaseId1 = CreateTestRelease("Release 1", "Description 1", "REL001", DateTime.Now);
            var releaseId2 = CreateTestRelease("Release 2", "Description 2", "REL002", DateTime.Now);

            CreateReleaseSeen(releaseId1, userId1, DateTime.Now.AddDays(-1));
            CreateReleaseSeen(releaseId1, userId2, DateTime.Now.AddDays(-2));
            CreateReleaseSeen(releaseId2, userId1, DateTime.Now.AddDays(-3));

            // Act
            var response = await _client.GetAsync($"/release_seen/GetByrelease_id?release_id={releaseId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<release_seen>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, seen => Assert.Equal(releaseId1, seen.release_id));
            Assert.Contains(result, seen => seen.user_id == userId1);
            Assert.Contains(result, seen => seen.user_id == userId2);
        }

        // Helper methods

        private int CreateTestUser(string email)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""User"" (email) 
                VALUES (@email) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@email"] = email
                });
        }

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

        private int CreateReleaseSeen(int releaseId, int userId, DateTime? dateIssued)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO release_seen (release_id, user_id, date_issued, created_at, updated_at) 
                VALUES (@releaseId, @userId, @dateIssued, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@releaseId"] = releaseId,
                    ["@userId"] = userId,
                    ["@dateIssued"] = dateIssued as object ?? DBNull.Value,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private release_seen GetReleaseSeenFromDatabase(int id)
        {
            return DatabaseHelper.RunQueryList<release_seen>(_schemaName, @"
                SELECT id, release_id, user_id, date_issued, created_at, updated_at, created_by, updated_by
                FROM release_seen
                WHERE id = @id",
                reader => new release_seen
                {
                    id = reader.GetInt32(0),
                    release_id = reader.GetInt32(1),
                    user_id = reader.GetInt32(2),
                    date_issued = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    created_at = reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                    updated_at = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    created_by = reader.IsDBNull(6) ? null : reader.GetInt32(6),
                    updated_by = reader.IsDBNull(7) ? null : reader.GetInt32(7)
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