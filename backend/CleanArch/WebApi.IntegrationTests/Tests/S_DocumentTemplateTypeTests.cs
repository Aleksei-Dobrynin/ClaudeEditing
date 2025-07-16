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
    public class S_DocumentTemplateTypeTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public S_DocumentTemplateTypeTests()
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
            // Arrange - Create test document template types
            CreateDocumentTemplateType("Test Type 1", "Description 1", "code_1", 1);
            CreateDocumentTemplateType("Test Type 2", "Description 2", "code_2", 2);

            // Act
            var response = await _client.GetAsync("/S_DocumentTemplateType/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_DocumentTemplateType>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.Count); //1 test record is in seeddata
            Assert.Contains(result, t => t.name == "Test Type 1" && t.code == "code_1");
            Assert.Contains(result, t => t.name == "Test Type 2" && t.code == "code_2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test document template type
            var id = CreateDocumentTemplateType("Single Type", "Single Description", "single_code", 5);

            // Act
            var response = await _client.GetAsync($"/S_DocumentTemplateType/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_DocumentTemplateType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Type", result.name);
            Assert.Equal("Single Description", result.description);
            Assert.Equal("single_code", result.code);
            Assert.Equal(5, result.queueNumber);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateS_DocumentTemplateTypeRequest
            {
                name = "New Type",
                description = "New Description",
                code = "new_code",
                queueNumber = 10
            };

            // Act
            var response = await _client.PostAsJsonAsync("/S_DocumentTemplateType", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_DocumentTemplateType>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Type", result.name);
            Assert.Equal("New Description", result.description);
            Assert.Equal("new_code", result.code);
            Assert.Equal(10, result.queueNumber);

            // Verify in database
            var documentType = GetDocumentTemplateType(result.id);
            Assert.NotNull(documentType);
            Assert.Equal("New Type", documentType.name);
            Assert.Equal("new_code", documentType.code);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateDocumentTemplateType("Original Type", "Original Description", "original_code", 15);

            var request = new UpdateS_DocumentTemplateTypeRequest
            {
                id = id,
                name = "Updated Type",
                description = "Updated Description",
                code = "updated_code",
                queueNumber = 20
            };

            // Act
            var response = await _client.PutAsync($"/S_DocumentTemplateType/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_DocumentTemplateType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Type", result.name);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("updated_code", result.code);
            Assert.Equal(20, result.queueNumber);

            // Verify in database
            var documentType = GetDocumentTemplateType(id);
            Assert.NotNull(documentType);
            Assert.Equal("Updated Type", documentType.name);
            Assert.Equal("updated_code", documentType.code);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateDocumentTemplateType("Type to Delete", "Delete Description", "delete_code", 25);

            // Act
            var response = await _client.DeleteAsync($"/S_DocumentTemplateType/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify deletion in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM ""S_DocumentTemplateType"" WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple document template types
            for (int i = 1; i <= 5; i++)
            {
                CreateDocumentTemplateType($"Paginated Type {i}", $"Paginated Description {i}", $"paginated_code_{i}", i * 5);
            }

            // Act
            var response = await _client.GetAsync("/S_DocumentTemplateType/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<S_DocumentTemplateType>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        // Helper methods to create and retrieve test data
        private int CreateDocumentTemplateType(string name, string description, string code, int? queueNumber)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplateType"" (name, description, code, ""queueNumber"", created_at, updated_at)
                VALUES (@name, @description, @code, @queueNumber, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@code"] = code,
                    ["@queueNumber"] = queueNumber,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private S_DocumentTemplateType GetDocumentTemplateType(int id)
        {
            return DatabaseHelper.RunQueryList<S_DocumentTemplateType>(_schemaName, @"
                SELECT id, name, description, code, ""queueNumber"" FROM ""S_DocumentTemplateType"" WHERE id = @id",
                reader => new S_DocumentTemplateType
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    description = reader.GetString(2),
                    code = reader.GetString(3),
                    queueNumber = reader.IsDBNull(4) ? null : reader.GetInt32(4)
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