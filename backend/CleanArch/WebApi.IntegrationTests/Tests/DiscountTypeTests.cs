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
    public class DiscountTypeTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public DiscountTypeTests()
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
            // Arrange - Create test discount types
            CreateDiscountType("Test Type 1", "test_code_1", "Test Description 1");
            CreateDiscountType("Test Type 2", "test_code_2", "Test Description 2");

            // Act
            var response = await _client.GetAsync("/DiscountType/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<DiscountType>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, dt => dt.name == "Test Type 1" && dt.code == "test_code_1");
            Assert.Contains(result, dt => dt.name == "Test Type 2" && dt.code == "test_code_2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test discount type
            var id = CreateDiscountType("Single Type", "single_code", "Single Description");

            // Act
            var response = await _client.GetAsync($"/DiscountType/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<DiscountType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Type", result.name);
            Assert.Equal("single_code", result.code);
            Assert.Equal("Single Description", result.description);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateDiscountTypeRequest
            {
                name = "Created Type",
                code = "created_code",
                description = "Created Description"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/DiscountType/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<DiscountType>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Type", result.name);
            Assert.Equal("created_code", result.code);
            Assert.Equal("Created Description", result.description);

            // Verify in database
            var discountType = DatabaseHelper.RunQueryList<DiscountType>(_schemaName, @"
                SELECT id, name, code, description FROM discount_type WHERE id = @id",
                reader => new DiscountType
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    description = reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(discountType);
            Assert.Equal(result.id, discountType.id);
            Assert.Equal("Created Type", discountType.name);
            Assert.Equal("created_code", discountType.code);
            Assert.Equal("Created Description", discountType.description);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateDiscountType("Original Type", "original_code", "Original Description");

            var request = new UpdateDiscountTypeRequest
            {
                id = id,
                name = "Updated Type",
                code = "updated_code",
                description = "Updated Description"
            };

            // Act
            var response = await _client.PutAsJsonAsync("/DiscountType/Update", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<DiscountType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Type", result.name);
            Assert.Equal("updated_code", result.code);
            Assert.Equal("Updated Description", result.description);

            // Verify in database
            var discountType = DatabaseHelper.RunQueryList<DiscountType>(_schemaName, @"
                SELECT name, code, description FROM discount_type WHERE id = @id",
                reader => new DiscountType
                {
                    name = reader.GetString(0),
                    code = reader.GetString(1),
                    description = reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(discountType);
            Assert.Equal("Updated Type", discountType.name);
            Assert.Equal("updated_code", discountType.code);
            Assert.Equal("Updated Description", discountType.description);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateDiscountType("Type to Delete", "delete_code", "Delete Description");

            // Act
            var response = await _client.DeleteAsync($"/DiscountType/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM discount_type WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test discount types
            for (int i = 1; i <= 5; i++)
            {
                CreateDiscountType($"Paginated Type {i}", $"paginated_code_{i}", $"Paginated Description {i}");
            }

            // Act
            var response = await _client.GetAsync("/DiscountType/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<DiscountType>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        // Helper methods to create test data
        private int CreateDiscountType(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO discount_type (name, code, description, created_at, updated_at) 
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