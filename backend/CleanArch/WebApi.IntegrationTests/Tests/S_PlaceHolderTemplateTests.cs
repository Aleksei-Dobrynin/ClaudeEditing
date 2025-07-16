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
    public class S_PlaceHolderTemplateTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public S_PlaceHolderTemplateTests()
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
            // Arrange - Create test placeholders
            var queryId = CreateS_Query("Test Query", "testquery", "SELECT * FROM test");
            var placeholderTypeId = CreateS_PlaceHolderType("Test Type", "testtype");

            CreateS_PlaceHolderTemplate("Test Placeholder 1", "Test value 1", "test_code_1", queryId, placeholderTypeId);
            CreateS_PlaceHolderTemplate("Test Placeholder 2", "Test value 2", "test_code_2", queryId, placeholderTypeId);

            // Act
            var response = await _client.GetAsync("/S_PlaceHolderTemplate/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_PlaceHolderTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            // Verify the expected properties are present
            foreach (var item in result)
            {
                Assert.Equal(queryId, item.idQuery);
                Assert.Equal(placeholderTypeId, item.idPlaceholderType);
            }
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test placeholder
            var queryId = CreateS_Query("Single Query", "singlequery", "SELECT * FROM single");
            var placeholderTypeId = CreateS_PlaceHolderType("Single Type", "singletype");

            var id = CreateS_PlaceHolderTemplate("Single Placeholder", "Single value", "single_code", queryId, placeholderTypeId);

            // Act
            var response = await _client.GetAsync($"/S_PlaceHolderTemplate/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_PlaceHolderTemplate>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Placeholder", result.name);
            Assert.Equal("Single value", result.value);
            Assert.Equal("single_code", result.code);
            Assert.Equal(queryId, result.idQuery);
            Assert.Equal(placeholderTypeId, result.idPlaceholderType);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var queryId = CreateS_Query("Create Query", "createquery", "SELECT * FROM create");
            var placeholderTypeId = CreateS_PlaceHolderType("Create Type", "createtype");

            var request = new CreateS_PlaceHolderTemplateRequest
            {
                name = "Created Placeholder",
                value = "Created value",
                code = "created_code",
                idQuery = queryId,
                idPlaceholderType = placeholderTypeId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/S_PlaceHolderTemplate", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_PlaceHolderTemplate>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Placeholder", result.name);
            Assert.Equal("Created value", result.value);
            Assert.Equal("created_code", result.code);
            Assert.Equal(queryId, result.idQuery);
            Assert.Equal(placeholderTypeId, result.idPlaceholderType);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalQueryId = CreateS_Query("Original Query", "originalquery", "SELECT * FROM original");
            var originalPlaceholderTypeId = CreateS_PlaceHolderType("Original Type", "originaltype");

            var id = CreateS_PlaceHolderTemplate("Original Placeholder", "Original value", "original_code", originalQueryId, originalPlaceholderTypeId);

            var newQueryId = CreateS_Query("New Query", "newquery", "SELECT * FROM new");
            var newPlaceholderTypeId = CreateS_PlaceHolderType("New Type", "newtype");

            var request = new UpdateS_PlaceHolderTemplateRequest
            {
                id = id,
                name = "Updated Placeholder",
                value = "Updated value",
                code = "updated_code",
                idQuery = newQueryId,
                idPlaceholderType = newPlaceholderTypeId
            };

            // Act
            var response = await _client.PutAsync($"/S_PlaceHolderTemplate/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_PlaceHolderTemplate>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Placeholder", result.name);
            Assert.Equal("Updated value", result.value);
            Assert.Equal("updated_code", result.code);
            Assert.Equal(newQueryId, result.idQuery);
            Assert.Equal(newPlaceholderTypeId, result.idPlaceholderType);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var queryId = CreateS_Query("Delete Query", "deletequery", "SELECT * FROM delete");
            var placeholderTypeId = CreateS_PlaceHolderType("Delete Type", "deletetype");

            var id = CreateS_PlaceHolderTemplate("Delete Placeholder", "Delete value", "delete_code", queryId, placeholderTypeId);

            // Act
            var response = await _client.DeleteAsync($"/S_PlaceHolderTemplate/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify it's deleted from database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM ""S_PlaceHolderTemplate"" WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple placeholder templates
            var queryId = CreateS_Query("Paginated Query", "paginatedquery", "SELECT * FROM paginated");
            var placeholderTypeId = CreateS_PlaceHolderType("Paginated Type", "paginatedtype");

            for (int i = 1; i <= 5; i++)
            {
                CreateS_PlaceHolderTemplate($"Paginated Placeholder {i}", $"Value {i}", $"code_{i}", queryId, placeholderTypeId);
            }

            // Act
            var response = await _client.GetAsync("/S_PlaceHolderTemplate/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<S_PlaceHolderTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task GetByidQuery_ReturnsOkResponse()
        {
            // Arrange
            var queryId1 = CreateS_Query("Query 1", "query1", "SELECT * FROM table1");
            var queryId2 = CreateS_Query("Query 2", "query2", "SELECT * FROM table2");
            var placeholderTypeId = CreateS_PlaceHolderType("Filter Type", "filtertype");

            CreateS_PlaceHolderTemplate("Query 1 Placeholder 1", "Value 1", "q1_code_1", queryId1, placeholderTypeId);
            CreateS_PlaceHolderTemplate("Query 1 Placeholder 2", "Value 2", "q1_code_2", queryId1, placeholderTypeId);
            CreateS_PlaceHolderTemplate("Query 2 Placeholder", "Value 3", "q2_code", queryId2, placeholderTypeId);

            // Act
            var response = await _client.GetAsync($"/S_PlaceHolderTemplate/GetByidQuery?idQuery={queryId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_PlaceHolderTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, placeholder => Assert.Equal(queryId1, placeholder.idQuery));
        }

        [Fact]
        public async Task GetByidPlaceholderType_ReturnsOkResponse()
        {
            // Arrange
            var queryId = CreateS_Query("Type Filter Query", "typefilterquery", "SELECT * FROM typefiler");
            var placeholderTypeId1 = CreateS_PlaceHolderType("Type 1", "type1");
            var placeholderTypeId2 = CreateS_PlaceHolderType("Type 2", "type2");

            CreateS_PlaceHolderTemplate("Type 1 Placeholder 1", "Value 1", "t1_code_1", queryId, placeholderTypeId1);
            CreateS_PlaceHolderTemplate("Type 1 Placeholder 2", "Value 2", "t1_code_2", queryId, placeholderTypeId1);
            CreateS_PlaceHolderTemplate("Type 2 Placeholder", "Value 3", "t2_code", queryId, placeholderTypeId2);

            // Act
            var response = await _client.GetAsync($"/S_PlaceHolderTemplate/GetByidPlaceholderType?idPlaceholderType={placeholderTypeId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_PlaceHolderTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, placeholder => Assert.Equal(placeholderTypeId1, placeholder.idPlaceholderType));
        }

        // Helper methods to create test data
        private int CreateS_Query(string name, string code, string queryText)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_Query"" (name, code, query, created_at, updated_at) 
                VALUES (@name, @code, @query, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@query"] = queryText,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateS_PlaceHolderType(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_PlaceHolderType"" (name, code, created_at, updated_at) 
                VALUES (@name, @code, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateS_PlaceHolderTemplate(string name, string value, string code, int queryId, int placeholderTypeId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_PlaceHolderTemplate"" (name, value, code, ""idQuery"", ""idPlaceholderType"", created_at, updated_at) 
                VALUES (@name, @value, @code, @idQuery, @idPlaceholderType, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@value"] = value,
                    ["@code"] = code,
                    ["@idQuery"] = queryId,
                    ["@idPlaceholderType"] = placeholderTypeId,
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