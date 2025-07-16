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
    public class S_PlaceHolderTypeTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public S_PlaceHolderTypeTests()
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
            // Arrange - Create test placeholder types
            CreateTestPlaceHolderType("Test Type 1", "Test Description 1", "test_code_1", 1);
            CreateTestPlaceHolderType("Test Type 2", "Test Description 2", "test_code_2", 2);

            // Act
            var response = await _client.GetAsync("/S_PlaceHolderType/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_PlaceHolderType>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, t => t.name == "Test Type 1" && t.code == "test_code_1");
            Assert.Contains(result, t => t.name == "Test Type 2" && t.code == "test_code_2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test placeholder type
            var id = CreateTestPlaceHolderType("Single Type", "Single Description", "single_code", 5);

            // Act
            var response = await _client.GetAsync($"/S_PlaceHolderType/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_PlaceHolderType>(content);

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
            var request = new CreateS_PlaceHolderTypeRequest
            {
                name = "Created Type",
                description = "Created Description",
                code = "created_code",
                queueNumber = 10
            };

            // Act
            var response = await _client.PostAsJsonAsync("/S_PlaceHolderType", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_PlaceHolderType>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Type", result.name);
            Assert.Equal("Created Description", result.description);
            Assert.Equal("created_code", result.code);
            Assert.Equal(10, result.queueNumber);

            // Verify in database
            var savedType = GetPlaceHolderTypeById(result.id);
            Assert.Equal("Created Type", savedType.name);
            Assert.Equal("Created Description", savedType.description);
            Assert.Equal("created_code", savedType.code);
            Assert.Equal(10, savedType.queueNumber);
        }

        [Fact]
        public async Task Create_WithNullQueueNumber_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateS_PlaceHolderTypeRequest
            {
                name = "Null Queue Type",
                description = "Null Queue Description",
                code = "null_queue_code",
                queueNumber = null
            };

            // Act
            var response = await _client.PostAsJsonAsync("/S_PlaceHolderType", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_PlaceHolderType>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Null Queue Type", result.name);
            Assert.Equal("Null Queue Description", result.description);
            Assert.Equal("null_queue_code", result.code);
            Assert.Null(result.queueNumber);

            // Verify in database
            var savedType = GetPlaceHolderTypeById(result.id);
            Assert.Equal("Null Queue Type", savedType.name);
            Assert.Equal("Null Queue Description", savedType.description);
            Assert.Equal("null_queue_code", savedType.code);
            Assert.Null(savedType.queueNumber);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test placeholder type
            var id = CreateTestPlaceHolderType("Original Type", "Original Description", "original_code", 1);

            var request = new UpdateS_PlaceHolderTypeRequest
            {
                id = id,
                name = "Updated Type",
                description = "Updated Description",
                code = "updated_code",
                queueNumber = 20
            };

            // Act
            var response = await _client.PutAsync($"/S_PlaceHolderType/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_PlaceHolderType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Type", result.name);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("updated_code", result.code);
            Assert.Equal(20, result.queueNumber);

            // Verify in database
            var updatedType = GetPlaceHolderTypeById(id);
            Assert.Equal("Updated Type", updatedType.name);
            Assert.Equal("Updated Description", updatedType.description);
            Assert.Equal("updated_code", updatedType.code);
            Assert.Equal(20, updatedType.queueNumber);
        }

        [Fact]
        public async Task Update_WithNullQueueNumber_ReturnsOkResponse()
        {
            // Arrange - Create test placeholder type
            var id = CreateTestPlaceHolderType("Update Null Type", "Update Null Description", "update_null_code", 30);

            var request = new UpdateS_PlaceHolderTypeRequest
            {
                id = id,
                name = "Updated Null Type",
                description = "Updated Null Description",
                code = "updated_null_code",
                queueNumber = null
            };

            // Act
            var response = await _client.PutAsync($"/S_PlaceHolderType/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_PlaceHolderType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Null Type", result.name);
            Assert.Equal("Updated Null Description", result.description);
            Assert.Equal("updated_null_code", result.code);
            Assert.Null(result.queueNumber);

            // Verify in database
            var updatedType = GetPlaceHolderTypeById(id);
            Assert.Equal("Updated Null Type", updatedType.name);
            Assert.Equal("Updated Null Description", updatedType.description);
            Assert.Equal("updated_null_code", updatedType.code);
            Assert.Null(updatedType.queueNumber);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test placeholder type
            var id = CreateTestPlaceHolderType("Type to Delete", "Delete Description", "delete_code", 40);

            // Act
            var response = await _client.DeleteAsync($"/S_PlaceHolderType/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM ""S_PlaceHolderType"" WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test placeholder types
            for (int i = 1; i <= 5; i++)
            {
                CreateTestPlaceHolderType($"Paginated Type {i}", $"Paginated Description {i}", $"paginated_code_{i}", i * 10);
            }

            // Act
            var response = await _client.GetAsync("/S_PlaceHolderType/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<S_PlaceHolderType>>(content);

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
        private int CreateTestPlaceHolderType(string name, string description, string code, int? queueNumber)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_PlaceHolderType"" (name, description, code, ""queueNumber"", created_at, updated_at) 
                VALUES (@name, @description, @code, @queueNumber, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@code"] = code,
                    ["@queueNumber"] = queueNumber as object ?? DBNull.Value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private S_PlaceHolderType GetPlaceHolderTypeById(int id)
        {
            return DatabaseHelper.RunQueryList<S_PlaceHolderType>(_schemaName, @"
                SELECT id, name, description, code, ""queueNumber"" FROM ""S_PlaceHolderType"" WHERE id = @id",
                reader => new S_PlaceHolderType
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    description = reader.GetString(2),
                    code = reader.GetString(3),
                    queueNumber = reader.IsDBNull(4) ? null : reader.GetInt32(4)
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();
        }

        // Test that PlaceHolderType can be used to create PlaceHolderTemplate
        [Fact]
        public async Task PlaceHolderType_UsedInPlaceHolderTemplate_ReturnsOkResponse()
        {
            // This test verifies that we can use a PlaceHolderType to create a PlaceHolderTemplate
            // First, create a new PlaceHolderType
            var typeId = CreateTestPlaceHolderType("Template Type", "Template Description", "template_code", 50);

            // Create a query for the template
            var queryId = CreateTestQuery("Template Query", "Query for template", "template_query_code", "SELECT * FROM template_table");

            // Verify that we can create a PlaceHolderTemplate using this type
            var templateId = CreatePlaceHolderTemplate("Template Name", "Template Description", "template_value_code", queryId, typeId, "Template Value");

            // Retrieve the template and verify it's linked to our type
            var template = GetPlaceHolderTemplateById(templateId);

            Assert.NotNull(template);
            Assert.Equal(templateId, template.id);
            Assert.Equal("Template Name", template.name);
            Assert.Equal(typeId, template.idPlaceholderType);
            Assert.Equal(queryId, template.idQuery);
            Assert.Equal("Template Value", template.value);
        }

        // Helper methods for PlaceHolderTemplate testing
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

        private int CreatePlaceHolderTemplate(string name, string description, string code, int queryId, int placeholderTypeId, string value)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_PlaceHolderTemplate"" (name, description, code, ""idQuery"", ""idPlaceholderType"", value, created_at, updated_at) 
                VALUES (@name, @description, @code, @idQuery, @idPlaceholderType, @value, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@code"] = code,
                    ["@idQuery"] = queryId,
                    ["@idPlaceholderType"] = placeholderTypeId,
                    ["@value"] = value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private S_PlaceHolderTemplate GetPlaceHolderTemplateById(int id)
        {
            return DatabaseHelper.RunQueryList<S_PlaceHolderTemplate>(_schemaName, @"
                SELECT id, name, description, code, ""idQuery"", ""idPlaceholderType"", value 
                FROM ""S_PlaceHolderTemplate"" WHERE id = @id",
                reader => new S_PlaceHolderTemplate
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    description = reader.GetString(2),
                    code = reader.GetString(3),
                    idQuery = reader.GetInt32(4),
                    idPlaceholderType = reader.GetInt32(5),
                    value = reader.GetString(6)
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }

    // Helper class to match the PlaceHolderTemplate in Domain
    public class S_PlaceHolderTemplate
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string code { get; set; }
        public int idQuery { get; set; }
        public int idPlaceholderType { get; set; }
        public string value { get; set; }
    }
}