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
    public class S_QueryTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public S_QueryTests()
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
            // Arrange - Create test queries
            CreateTestQuery("Test Query 1", "Test Description 1", "test_code_1", "SELECT * FROM users WHERE id = @id");
            CreateTestQuery("Test Query 2", "Test Description 2", "test_code_2", "SELECT * FROM applications WHERE status_id = @status_id");

            // Act
            var response = await _client.GetAsync("/S_Query/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_Query>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, q => q.name == "Test Query 1" && q.code == "test_code_1");
            Assert.Contains(result, q => q.name == "Test Query 2" && q.code == "test_code_2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test query
            var id = CreateTestQuery("Single Query", "Single Description", "single_code", "SELECT * FROM users WHERE email = @email");

            // Act
            var response = await _client.GetAsync($"/S_Query/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_Query>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Query", result.name);
            Assert.Equal("Single Description", result.description);
            Assert.Equal("single_code", result.code);
            Assert.Equal("SELECT * FROM users WHERE email = @email", result.query);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateS_QueryRequest
            {
                name = "Created Query",
                description = "Created Description",
                code = "created_code",
                query = "SELECT * FROM applications WHERE date BETWEEN @startDate AND @endDate"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/S_Query", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_Query>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Query", result.name);
            Assert.Equal("Created Description", result.description);
            Assert.Equal("created_code", result.code);
            Assert.Equal("SELECT * FROM applications WHERE date BETWEEN @startDate AND @endDate", result.query);

            // Verify in database
            var savedQuery = GetQueryById(result.id);
            Assert.Equal("Created Query", savedQuery.name);
            Assert.Equal("Created Description", savedQuery.description);
            Assert.Equal("created_code", savedQuery.code);
            Assert.Equal("SELECT * FROM applications WHERE date BETWEEN @startDate AND @endDate", savedQuery.query);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test query
            var id = CreateTestQuery("Original Query", "Original Description", "original_code", "SELECT * FROM original_table");

            var request = new UpdateS_QueryRequest
            {
                id = id,
                name = "Updated Query",
                description = "Updated Description",
                code = "updated_code",
                query = "SELECT * FROM updated_table WHERE condition = @param"
            };

            // Act
            var response = await _client.PutAsync($"/S_Query/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_Query>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Query", result.name);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("updated_code", result.code);
            Assert.Equal("SELECT * FROM updated_table WHERE condition = @param", result.query);

            // Verify in database
            var updatedQuery = GetQueryById(id);
            Assert.Equal("Updated Query", updatedQuery.name);
            Assert.Equal("Updated Description", updatedQuery.description);
            Assert.Equal("updated_code", updatedQuery.code);
            Assert.Equal("SELECT * FROM updated_table WHERE condition = @param", updatedQuery.query);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test query
            var id = CreateTestQuery("Query to Delete", "Delete Description", "delete_code", "SELECT * FROM table_to_delete");

            // Act
            var response = await _client.DeleteAsync($"/S_Query/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM ""S_Query"" WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test queries
            for (int i = 1; i <= 5; i++)
            {
                CreateTestQuery($"Paginated Query {i}", $"Paginated Description {i}", $"paginated_code_{i}", $"SELECT * FROM table_{i}");
            }

            // Act
            var response = await _client.GetAsync("/S_Query/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<S_Query>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

            // Verify pagination metadata
            var jObject = JObject.Parse(content);
            int totalCount = jObject["totalCount"]?.Value<int>() ?? 0;
            int pageNumber = jObject["pageNumber"]?.Value<int>() ?? 0;
            int totalPages = jObject["totalPages"]?.Value<int>() ?? 0;

            Assert.Equal(5, totalCount);
            Assert.Equal(1, pageNumber);
            Assert.Equal(2, totalPages);
        }

        // Helper methods to create and retrieve test data
        private int CreateTestQuery(string name, string description, string code, string query)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_Query"" (name, description, code, query, created_at, updated_at) 
                VALUES (@name, @description, @code, @query, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@code"] = code,
                    ["@query"] = query,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private S_Query GetQueryById(int id)
        {
            return DatabaseHelper.RunQueryList<S_Query>(_schemaName, @"
                SELECT id, name, description, code, query FROM ""S_Query"" WHERE id = @id",
                reader => new S_Query
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    description = reader.GetString(2),
                    code = reader.GetString(3),
                    query = reader.GetString(4)
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}