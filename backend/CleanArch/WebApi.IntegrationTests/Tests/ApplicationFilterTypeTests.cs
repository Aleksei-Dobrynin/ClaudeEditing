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
    public class ApplicationFilterTypeTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationFilterTypeTests()
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
            // Arrange - Create test filter types
            CreateApplicationFilterType("Test Type 1", "testtype1");
            CreateApplicationFilterType("Test Type 2", "testtype2");

            // Act
            var response = await _client.GetAsync("/ApplicationFilterType/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ApplicationFilterType>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test filter type
            var id = CreateApplicationFilterType("Single Type", "singletype");

            // Act
            var response = await _client.GetAsync($"/ApplicationFilterType/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationFilterType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Type", result.name);
            Assert.Equal("singletype", result.code);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var postId = CreateStructurePost("Test Post", "testpost");
            var structureId = CreateStructure("Test Structure");

            var request = new CreateApplicationFilterTypeRequest
            {
                name = "Created Type",
                code = "createdtype",
                description = "Test description",
                post_id = postId,
                structure_id = structureId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ApplicationFilterType/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationFilterType>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Type", result.name);
            Assert.Equal("createdtype", result.code);
            Assert.Equal(postId, result.post_id);
            Assert.Equal(structureId, result.structure_id);

            // Verify in database
            var filterType = DatabaseHelper.RunQueryList<ApplicationFilterType>(_schemaName, @"
                SELECT id, name, code, post_id, structure_id 
                FROM application_filter_type WHERE id = @id",
                reader => new ApplicationFilterType
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    post_id = reader.IsDBNull(3) ? null : reader.GetInt32(3),
                    structure_id = reader.IsDBNull(4) ? null : reader.GetInt32(4)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(filterType);
            Assert.Equal(result.id, filterType.id);
            Assert.Equal("Created Type", filterType.name);
            Assert.Equal(postId, filterType.post_id);
            Assert.Equal(structureId, filterType.structure_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateApplicationFilterType("Original Type", "originaltype");
            var newPostId = CreateStructurePost("Updated Post", "updatedpost");
            var newStructureId = CreateStructure("Updated Structure");

            var request = new UpdateApplicationFilterTypeRequest
            {
                id = id,
                name = "Updated Type",
                code = "updatedtype",
                description = "Updated description",
                post_id = newPostId,
                structure_id = newStructureId
            };

            // Act
            var response = await _client.PutAsync("/ApplicationFilterType/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationFilterType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Type", result.name);
            Assert.Equal("updatedtype", result.code);
            Assert.Equal(newPostId, result.post_id);
            Assert.Equal(newStructureId, result.structure_id);

            // Verify in database
            var filterType = DatabaseHelper.RunQueryList<ApplicationFilterType>(_schemaName, @"
                SELECT name, code, post_id, structure_id 
                FROM application_filter_type WHERE id = @id",
                reader => new ApplicationFilterType
                {
                    name = reader.GetString(0),
                    code = reader.GetString(1),
                    post_id = reader.IsDBNull(2) ? null : reader.GetInt32(2),
                    structure_id = reader.IsDBNull(3) ? null : reader.GetInt32(3)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(filterType);
            Assert.Equal("Updated Type", filterType.name);
            Assert.Equal("updatedtype", filterType.code);
            Assert.Equal(newPostId, filterType.post_id);
            Assert.Equal(newStructureId, filterType.structure_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateApplicationFilterType("Type to Delete", "typetodelete");

            // Act
            var response = await _client.DeleteAsync($"/ApplicationFilterType/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_filter_type WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange
            for (int i = 1; i <= 5; i++)
            {
                CreateApplicationFilterType($"Type {i}", $"type{i}");
            }

            // Act
            var response = await _client.GetAsync("/ApplicationFilterType/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<ApplicationFilterType>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        [Fact]
        public async Task CreateApplicationFilterWithFilterType_WorksCorrectly()
        {
            // This test verifies the relationship between filter types and filters

            // Arrange
            // 1. Create a filter type
            var typeId = CreateApplicationFilterType("Parent Type", "parenttype");

            // 2. Create a query
            var queryId = CreateQuery("Related Query", "SELECT * FROM test");

            // 3. Now create a filter that references the type
            var filterRequest = new CreateApplicationFilterRequest
            {
                name = "Child Filter",
                code = "childfilter",
                description = "Child filter description",
                type_id = typeId,
                query_id = queryId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ApplicationFilter/Create", filterRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Domain.Entities.ApplicationFilter>(content);

            // Verify the filter was created with correct relationship
            Assert.NotNull(result);
            Assert.Equal(typeId, result.type_id);

            // Verify relationship in database
            var filter = DatabaseHelper.RunQueryList<Domain.Entities.ApplicationFilter>(_schemaName, @"
                SELECT af.id, af.name, af.type_id, aft.name as type_name 
                FROM application_filter af
                JOIN application_filter_type aft ON af.type_id = aft.id
                WHERE af.id = @id",
                reader => new Domain.Entities.ApplicationFilter
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    type_id = reader.GetInt32(2),
                    type_name = reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(filter);
            Assert.Equal(typeId, filter.type_id);
            Assert.Equal("Parent Type", filter.type_name);
        }

        // Helper methods to create test data
        private int CreateApplicationFilterType(string name, string code, int? postId = null, int? structureId = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_filter_type (name, code, description, post_id, structure_id, created_at, updated_at) 
                VALUES (@name, @code, @description, @post_id, @structure_id, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = $"Description for {name}",
                    ["@post_id"] = postId as object ?? DBNull.Value,
                    ["@structure_id"] = structureId as object ?? DBNull.Value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateStructurePost(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO structure_post (name, code, created_at, updated_at) 
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

        private int CreateStructure(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, unique_id, version, is_active, date_start) 
                VALUES (@name, @uniqueId, '1.0', true, @dateStart) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@uniqueId"] = Guid.NewGuid().ToString(),
                    ["@dateStart"] = DateTime.Now
                });
        }

        private int CreateQuery(string name, string query)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_Query"" (name, code, query, created_at, updated_at) 
                VALUES (@name, @code, @query, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = name.ToLower().Replace(" ", ""),
                    ["@query"] = query,
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