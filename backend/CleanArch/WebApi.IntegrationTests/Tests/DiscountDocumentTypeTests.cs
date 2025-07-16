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
    public class DiscountDocumentTypeTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public DiscountDocumentTypeTests()
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
            // Arrange - Create test discount document types
            CreateDiscountDocumentType("Test Document Type 1", "test_doc_code_1", "Test Document Description 1");
            CreateDiscountDocumentType("Test Document Type 2", "test_doc_code_2", "Test Document Description 2");

            // Act
            var response = await _client.GetAsync("/DiscountDocumentType/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<DiscountDocumentType>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, dt => dt.name == "Test Document Type 1" && dt.code == "test_doc_code_1");
            Assert.Contains(result, dt => dt.name == "Test Document Type 2" && dt.code == "test_doc_code_2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test discount document type
            var id = CreateDiscountDocumentType("Single Document Type", "single_doc_code", "Single Document Description");

            // Act
            var response = await _client.GetAsync($"/DiscountDocumentType/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<DiscountDocumentType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Document Type", result.name);
            Assert.Equal("single_doc_code", result.code);
            Assert.Equal("Single Document Description", result.description);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateDiscountDocumentTypeRequest
            {
                name = "Created Document Type",
                code = "created_doc_code",
                description = "Created Document Description"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/DiscountDocumentType/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<DiscountDocumentType>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Document Type", result.name);
            Assert.Equal("created_doc_code", result.code);
            Assert.Equal("Created Document Description", result.description);

            // Verify in database
            var discountDocumentType = DatabaseHelper.RunQueryList<DiscountDocumentType>(_schemaName, @"
                SELECT id, name, code, description FROM discount_document_type WHERE id = @id",
                reader => new DiscountDocumentType
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    description = reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(discountDocumentType);
            Assert.Equal(result.id, discountDocumentType.id);
            Assert.Equal("Created Document Type", discountDocumentType.name);
            Assert.Equal("created_doc_code", discountDocumentType.code);
            Assert.Equal("Created Document Description", discountDocumentType.description);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateDiscountDocumentType("Original Document Type", "original_doc_code", "Original Document Description");

            var request = new UpdateDiscountDocumentTypeRequest
            {
                id = id,
                name = "Updated Document Type",
                code = "updated_doc_code",
                description = "Updated Document Description"
            };

            // Act
            var response = await _client.PutAsJsonAsync("/DiscountDocumentType/Update", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<DiscountDocumentType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Document Type", result.name);
            Assert.Equal("updated_doc_code", result.code);
            Assert.Equal("Updated Document Description", result.description);

            // Verify in database
            var discountDocumentType = DatabaseHelper.RunQueryList<DiscountDocumentType>(_schemaName, @"
                SELECT name, code, description FROM discount_document_type WHERE id = @id",
                reader => new DiscountDocumentType
                {
                    name = reader.GetString(0),
                    code = reader.GetString(1),
                    description = reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(discountDocumentType);
            Assert.Equal("Updated Document Type", discountDocumentType.name);
            Assert.Equal("updated_doc_code", discountDocumentType.code);
            Assert.Equal("Updated Document Description", discountDocumentType.description);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateDiscountDocumentType("Document Type to Delete", "delete_doc_code", "Delete Document Description");

            // Act
            var response = await _client.DeleteAsync($"/DiscountDocumentType/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM discount_document_type WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test discount document types
            for (int i = 1; i <= 5; i++)
            {
                CreateDiscountDocumentType($"Paginated Document Type {i}", $"paginated_doc_code_{i}", $"Paginated Document Description {i}");
            }

            // Act
            var response = await _client.GetAsync("/DiscountDocumentType/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<DiscountDocumentType>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        // Helper methods to create test data
        private int CreateDiscountDocumentType(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO discount_document_type (name, code, description, created_at, updated_at) 
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