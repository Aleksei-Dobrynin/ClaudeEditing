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
    public class ApplicationFilterTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationFilterTests()
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
            // Arrange - Create test filters
            var typeId = CreateApplicationFilterType("Test Type", "testtype");
            CreateApplicationFilter("Test Filter 1", typeId);
            CreateApplicationFilter("Test Filter 2", typeId);

            // Act
            var response = await _client.GetAsync("/ApplicationFilter/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<Domain.Entities.ApplicationFilter>>(content);

            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test filter
            var typeId = CreateApplicationFilterType("Single Type", "singletype");
            var id = CreateApplicationFilter("Single Filter", typeId);

            // Act
            var response = await _client.GetAsync($"/ApplicationFilter/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Domain.Entities.ApplicationFilter>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Filter", result.name);
            Assert.Equal(typeId, result.type_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var typeId = CreateApplicationFilterType("Create Type", "createtype");
            var queryId = CreateQuery("Test Query", "SELECT * FROM test");
            var postId = CreateStructurePost("Test Post", "testpost");

            var request = new CreateApplicationFilterRequest
            {
                name = "Created Filter",
                code = "createdfilter",
                description = "Test description",
                type_id = typeId,
                query_id = queryId,
                post_id = postId,
                parameters = "{\"pageSize\":10,\"pageNumber\":1,\"sort_by\":\"id\",\"sort_type\":\"asc\"}"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ApplicationFilter/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Domain.Entities.ApplicationFilter>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Filter", result.name);
            Assert.Equal("createdfilter", result.code);
            Assert.Equal(typeId, result.type_id);
            Assert.Equal(queryId, result.query_id);
            Assert.Equal(postId, result.post_id);

            // Verify in database
            var filter = DatabaseHelper.RunQueryList<Domain.Entities.ApplicationFilter>(_schemaName, @"
                SELECT id, name, code, type_id, query_id, post_id 
                FROM application_filter WHERE id = @id",
                reader => new Domain.Entities.ApplicationFilter
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    type_id = reader.GetInt32(3),
                    query_id = reader.GetInt32(4),
                    post_id =  reader.GetInt32(5)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(filter);
            Assert.Equal(result.id, filter.id);
            Assert.Equal("Created Filter", filter.name);
            Assert.Equal(typeId, filter.type_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var typeId = CreateApplicationFilterType("Original Type", "originaltype");
            var id = CreateApplicationFilter("Original Filter", typeId);

            var newTypeId = CreateApplicationFilterType("Updated Type", "updatedtype");
            var newQueryId = CreateQuery("Updated Query", "SELECT * FROM updated");
            var newPostId = CreateStructurePost("Updated Post", "updatedpost");

            var request = new UpdateApplicationFilterRequest
            {
                id = id,
                name = "Updated Filter",
                code = "updatedfilter",
                description = "Updated description",
                type_id = newTypeId,
                query_id = newQueryId,
                post_id = newPostId,
                parameters = "{\"pageSize\":20,\"pageNumber\":1,\"sort_by\":\"name\",\"sort_type\":\"desc\"}"
            };

            // Act
            var response = await _client.PutAsync("/ApplicationFilter/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Domain.Entities.ApplicationFilter>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Filter", result.name);
            Assert.Equal("updatedfilter", result.code);
            Assert.Equal(newTypeId, result.type_id);
            Assert.Equal(newQueryId, result.query_id);
            Assert.Equal(newPostId, result.post_id);

            // Verify in database
            var filter = DatabaseHelper.RunQueryList<Domain.Entities.ApplicationFilter>(_schemaName, @"
                SELECT name, code, type_id, query_id, post_id 
                FROM application_filter WHERE id = @id",
                reader => new Domain.Entities.ApplicationFilter
                {
                    name = reader.GetString(0),
                    code = reader.GetString(1),
                    type_id = reader.GetInt32(2),
                    query_id = reader.GetInt32(3),
                    post_id = reader.GetInt32(4)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(filter);
            Assert.Equal("Updated Filter", filter.name);
            Assert.Equal("updatedfilter", filter.code);
            Assert.Equal(newTypeId, filter.type_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var typeId = CreateApplicationFilterType("Delete Type", "deletetype");
            var id = CreateApplicationFilter("Filter to Delete", typeId);

            // Act
            var response = await _client.DeleteAsync($"/ApplicationFilter/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_filter WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange
            var typeId = CreateApplicationFilterType("Page Type", "pagetype");
            for (int i = 1; i <= 5; i++)
            {
                CreateApplicationFilter($"Filter {i}", typeId);
            }

            // Act
            var response = await _client.GetAsync("/ApplicationFilter/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<Domain.Entities.ApplicationFilter>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        [Fact]
        public async Task GetFilters_ReturnsOkResponse()
        {
            // Arrange
            // 1. Create employee and assign to structure
            var employeeId = DatabaseHelper.RunQuery<int>(_schemaName,
                @"INSERT INTO employee (last_name, first_name, second_name, user_id) VALUES ('Test', 'Test', 'Test', '1') RETURNING id;");
            var structureId = CreateStructure("Test Structure");
            var postId = CreateStructurePost("Test Post", "testpost");
            CreateEmployeeInStructure(employeeId, structureId, postId);

            // 2. Create filter type and filter for this post
            var typeId = CreateApplicationFilterType("Filter Type", "filtertype", postId, structureId);
            var queryId = CreateQuery("Test Query", "SELECT * FROM test");

            var parameters = "{\"pageSize\":10,\"pageNumber\":1,\"sort_by\":\"id\",\"sort_type\":\"asc\",\"isMyOrgApplication\":true}";
            CreateApplicationFilter("Test Filter", typeId, queryId, postId, parameters);

            // Act
            var response = await _client.GetAsync("/ApplicationFilter/GetFilters");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();

            // Since GetFilters returns dynamic object, we'll verify it contains the expected properties
            var resultObj = JArray.Parse(content);

            Assert.NotNull(resultObj);
            Assert.True(resultObj.Count > 0);

            // Check first filter has expected properties
            var firstFilter = resultObj[0];
            Assert.NotNull(firstFilter["id"]);
            Assert.NotNull(firstFilter["name"]);
            Assert.NotNull(firstFilter["code"]);
            Assert.NotNull(firstFilter["type_id"]);
            Assert.NotNull(firstFilter["filter"]);
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

        private int CreateApplicationFilter(string name, int? typeId = null, int? queryId = null, int? postId = null, string parameters = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_filter (name, code, description, type_id, query_id, post_id, parameters, created_at, updated_at) 
                VALUES (@name, @code, @description, @type_id, @query_id, @post_id, @parameters::jsonb, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = name.ToLower().Replace(" ", ""),
                    ["@description"] = $"Description for {name}",
                    ["@type_id"] = typeId as object ?? DBNull.Value,
                    ["@query_id"] = queryId as object ?? DBNull.Value,
                    ["@post_id"] = postId as object ?? DBNull.Value,
                    ["@parameters"] = parameters != null ? (object)parameters : DBNull.Value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
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

        private int CreateEmployee(string lastName, string firstName, string email)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (last_name, first_name, email, user_id, guid) 
                VALUES (@lastName, @firstName, @email, @userId, @guid) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@lastName"] = lastName,
                    ["@firstName"] = firstName,
                    ["@email"] = email,
                    ["@userId"] = "test-user-id", // Using the mock test user ID
                    ["@guid"] = Guid.NewGuid().ToString()
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

        private int CreateEmployeeInStructure(int employeeId, int structureId, int postId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee_in_structure (employee_id, structure_id, post_id, date_start, created_at, updated_at) 
                VALUES (@employeeId, @structureId, @postId, @dateStart, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@employeeId"] = employeeId,
                    ["@structureId"] = structureId,
                    ["@postId"] = postId,
                    ["@dateStart"] = DateTime.Now,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}