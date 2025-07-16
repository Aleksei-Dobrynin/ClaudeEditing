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
using System.IO;
using System.Text;
using System.Net.Http.Headers;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ReleaseTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ReleaseTests()
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
            // Arrange - Create test releases
            CreateTestRelease("Release 1", "This is release 1", "REL001", DateTime.Now.AddDays(-1));
            CreateTestRelease("Release 2", "This is release 2", "REL002", DateTime.Now.AddDays(-2));

            // Act
            var response = await _client.GetAsync("/release/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<release>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            // Releases should be ordered by date_start desc
            Assert.Equal("Release 1", result[0].number);
            Assert.Equal("Release 2", result[1].number);
        }

        [Fact]
        public async Task GetReleaseds_ReturnsOnlyReleasesWithDateStartBeforeNow()
        {
            // Arrange
            CreateTestRelease("Past Release", "This is a past release", "REL001", DateTime.Now.AddDays(-1));
            CreateTestRelease("Future Release", "This is a future release", "REL002", DateTime.Now.AddDays(1));

            // Act
            var response = await _client.GetAsync("/release/GetReleaseds");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<release>>(content);

            Assert.NotNull(result);
            Assert.Equal(1, result.Count);
            Assert.Equal("Past Release", result[0].number);
        }

        [Fact]
        public async Task GetLastRelease_ReturnsLatestRelease()
        {
            // Arrange
            CreateTestRelease("Older Release", "This is an older release", "REL001", DateTime.Now.AddDays(-2));
            CreateTestRelease("Latest Release", "This is the latest release", "REL002", DateTime.Now.AddDays(-1));

            // Act
            var response = await _client.GetAsync("/release/GetLastRelease");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<release>(content);

            Assert.NotNull(result);
            Assert.Equal("Latest Release", result.number);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateTestRelease("Test Release", "This is a test release", "REL001", DateTime.Now);

            // Act
            var response = await _client.GetAsync($"/release/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<release>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Test Release", result.number);
            Assert.Equal("This is a test release", result.description);
            Assert.Equal("REL001", result.code);
        }

        [Fact]
        public async Task Create_WithoutFiles_ReturnsOkResponse()
        {
            // Arrange
            var requestContent = new MultipartFormDataContent();
            requestContent.Add(new StringContent("New Release"), "number");
            requestContent.Add(new StringContent("This is a new release"), "description");
            requestContent.Add(new StringContent("NEWREL"), "code");
            requestContent.Add(new StringContent(DateTime.Now.ToString("o")), "date_start");

            // Act
            var response = await _client.PostAsync("/release", requestContent);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<release>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Release", result.number);
            Assert.Equal("This is a new release", result.description);
            Assert.Equal("NEWREL", result.code);
        }

        [Fact]
        public async Task Update_WithoutFiles_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateTestRelease("Original Release", "Original description", "ORIG", DateTime.Now);

            var requestContent = new MultipartFormDataContent();
            requestContent.Add(new StringContent(id.ToString()), "id");
            requestContent.Add(new StringContent("Updated Release"), "number");
            requestContent.Add(new StringContent("Updated description"), "description");
            requestContent.Add(new StringContent("UPD"), "code");
            requestContent.Add(new StringContent(DateTime.Now.AddDays(1).ToString("o")), "date_start");

            // Act
            var response = await _client.PutAsync($"/release/{id}", requestContent);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<release>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Release", result.number);
            Assert.Equal("Updated description", result.description);
            Assert.Equal("UPD", result.code);

            // Verify in database
            var updatedRelease = GetReleaseFromDatabase(id);
            Assert.Equal("Updated Release", updatedRelease.number);
            Assert.Equal("Updated description", updatedRelease.description);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateTestRelease("Release to Delete", "This will be deleted", "DEL", DateTime.Now);

            // Act
            var response = await _client.DeleteAsync($"/release/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                @"SELECT COUNT(*) FROM release WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });
            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test releases
            for (int i = 1; i <= 5; i++)
            {
                CreateTestRelease($"Release {i}", $"Description {i}", $"REL{i:D3}", DateTime.Now.AddDays(-i));
            }

            // Act
            var response = await _client.GetAsync("/release/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<release>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task ApproveRelease_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateTestRelease("Release to Approve", "This will be approved", "APP", DateTime.Now.AddDays(-3));

            // Act
            var requestContent = new StringContent(JsonConvert.SerializeObject(new { id }), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("/release/ApproveRelease", requestContent);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<release>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.NotNull(result.date_start);

            // Verify in database
            var approvedRelease = GetReleaseFromDatabase(id);
            Assert.NotNull(approvedRelease.date_start);
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

        private release GetReleaseFromDatabase(int id)
        {
            return DatabaseHelper.RunQueryList<release>(_schemaName, @"
                SELECT id, number, description, code, date_start, created_at, updated_at, created_by, updated_by 
                FROM release WHERE id = @id",
                reader => new release
                {
                    id = reader.GetInt32(0),
                    number = reader.GetString(1),
                    description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    code = reader.IsDBNull(3) ? null : reader.GetString(3),
                    date_start = reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                    created_at = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    updated_at = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                    created_by = reader.IsDBNull(7) ? null : reader.GetInt32(7),
                    updated_by = reader.IsDBNull(8) ? null : reader.GetInt32(8)
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