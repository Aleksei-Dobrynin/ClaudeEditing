using System;
using System.Net;
using System.Net.Http;
using System.Text;
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
    public class ApplicationDocumentTypeTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationDocumentTypeTests()
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
            // Arrange - Create test document types
            CreateDocumentType("Test Type 1", "code1", "Description 1");
            CreateDocumentType("Test Type 2", "code2", "Description 2");

            // Act
            var response = await _client.GetAsync("/ApplicationDocumentType/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ApplicationDocumentType>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test document type
            var id = CreateDocumentType("Single Type", "singleCode", "Single Description");

            // Act
            var response = await _client.GetAsync($"/ApplicationDocumentType/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationDocumentType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Type", result.name);
            Assert.Equal("singleCode", result.code);
            Assert.Equal("Single Description", result.description);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateApplicationDocumentTypeRequest
            {
                name = "Created Type",
                code = "createdCode",
                description = "Created Description"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ApplicationDocumentType/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationDocumentType>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Type", result.name);
            Assert.Equal("createdCode", result.code);
            Assert.Equal("Created Description", result.description);

            // Verify in database
            var typeFromDb = DatabaseHelper.RunQueryList<ApplicationDocumentType>(_schemaName, @"
                SELECT id, name, code, description FROM application_document_type WHERE id = @id",
                reader => new ApplicationDocumentType
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    description = reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = result.id }).FirstOrDefault();

            Assert.NotNull(typeFromDb);
            Assert.Equal(result.id, typeFromDb.id);
            Assert.Equal("Created Type", typeFromDb.name);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateDocumentType("Original Type", "originalCode", "Original Description");

            var request = new UpdateApplicationDocumentTypeRequest
            {
                id = id,
                name = "Updated Type",
                code = "updatedCode",
                description = "Updated Description"
            };

            // Act
            var response = await _client.PutAsync("/ApplicationDocumentType/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationDocumentType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Type", result.name);
            Assert.Equal("updatedCode", result.code);
            Assert.Equal("Updated Description", result.description);

            // Verify in database
            var typeFromDb = DatabaseHelper.RunQueryList<ApplicationDocumentType>(_schemaName, @"
                SELECT id, name, code, description FROM application_document_type WHERE id = @id",
                reader => new ApplicationDocumentType
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    description = reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();

            Assert.NotNull(typeFromDb);
            Assert.Equal("Updated Type", typeFromDb.name);
            Assert.Equal("updatedCode", typeFromDb.code);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateDocumentType("Type to Delete", "deleteCode", "Delete Description");

            // Act
            var response = await _client.DeleteAsync($"/ApplicationDocumentType/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_document_type WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple document types
            for (int i = 1; i <= 5; i++)
            {
                CreateDocumentType($"Type {i}", $"code{i}", $"Description {i}");
            }

            // Act
            var response = await _client.GetAsync("/ApplicationDocumentType/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<ApplicationDocumentType>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            //Assert.Equal(5, result.totalCount);
            //Assert.Equal(1, result.pageNumber);
            //Assert.Equal(2, result.totalPages);
        }

        // Helper method to create test document type
        private int CreateDocumentType(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_document_type (name, code, description, created_at, updated_at) 
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