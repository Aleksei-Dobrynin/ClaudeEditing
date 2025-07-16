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
    public class ContragentTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ContragentTests()
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
            // Arrange - Create test contragents
            CreateContragent("Test Company", "123 Main St", "test@example.com", "user1");
            CreateContragent("Another Company", "456 Secondary St", "another@example.com", "user2");

            // Act
            var response = await _client.GetAsync("/contragent/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<contragent>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test contragent
            var id = CreateContragent("Single Company", "789 Tertiary St", "single@example.com", "user3");

            // Act
            var response = await _client.GetAsync($"/contragent/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<contragent>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Company", result.name);
            Assert.Equal("789 Tertiary St", result.address);
            Assert.Equal("single@example.com", result.contacts);
            Assert.Equal("user3", result.user_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreatecontragentRequest
            {
                name = "Created Company",
                address = "101 Creation Blvd",
                contacts = "created@example.com",
                user_id = "user4",
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/contragent", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<contragent>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Company", result.name);
            Assert.Equal("101 Creation Blvd", result.address);
            Assert.Equal("created@example.com", result.contacts);
            Assert.Equal("user4", result.user_id);

            // Verify in database
            var contragent = DatabaseHelper.RunQueryList<contragent>(_schemaName, @"
                SELECT id, name, address, contacts, user_id 
                FROM contragent WHERE id = @id",
                reader => new contragent
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    address = reader.GetString(2),
                    contacts = reader.GetString(3),
                    user_id = reader.GetString(4)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(contragent);
            Assert.Equal(result.id, contragent.id);
            Assert.Equal("Created Company", contragent.name);
            Assert.Equal("101 Creation Blvd", contragent.address);
            Assert.Equal("created@example.com", contragent.contacts);
            Assert.Equal("user4", contragent.user_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateContragent("Original Company", "202 Origin Ave", "original@example.com", "user5");

            var request = new UpdatecontragentRequest
            {
                id = id,
                name = "Updated Company",
                address = "303 Update St",
                contacts = "updated@example.com",
                user_id = "user5",
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PutAsync($"/contragent/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<contragent>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Company", result.name);
            Assert.Equal("303 Update St", result.address);
            Assert.Equal("updated@example.com", result.contacts);
            Assert.Equal("user5", result.user_id);

            // Verify in database
            var contragent = DatabaseHelper.RunQueryList<contragent>(_schemaName, @"
                SELECT name, address, contacts 
                FROM contragent WHERE id = @id",
                reader => new contragent
                {
                    name = reader.GetString(0),
                    address = reader.GetString(1),
                    contacts = reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(contragent);
            Assert.Equal("Updated Company", contragent.name);
            Assert.Equal("303 Update St", contragent.address);
            Assert.Equal("updated@example.com", contragent.contacts);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateContragent("Company to Delete", "404 Not Found Ln", "delete@example.com", "user6");

            // Act
            var response = await _client.DeleteAsync($"/contragent/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            int deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM contragent WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test contragents
            for (int i = 1; i <= 5; i++)
            {
                CreateContragent($"Paginated Company {i}", $"Address {i}", $"contact{i}@example.com", $"user{i}");
            }

            // Act
            var response = await _client.GetAsync("/contragent/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<contragent>>(content);

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

        // Helper method to create test contragent
        private int CreateContragent(string name, string address, string contacts, string userId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO contragent (name, address, contacts, user_id, created_at, updated_at) 
                VALUES (@name, @address, @contacts, @userId, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@address"] = address,
                    ["@contacts"] = contacts,
                    ["@userId"] = userId,
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