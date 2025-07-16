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
    public class QueryFiltersControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public QueryFiltersControllerTests()
        {
            // Create a schema for this test
            _schemaName = DatabaseHelper.CreateTestSchema();

            // Create a client with the schema configured
            var factory = new TestWebApplicationFactory<Program>(_schemaName);
            _client = factory.CreateClient();
        }

        private int CreateSQuery(string name, string description, string code, string query)
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

        // Helper method to get S_Query
        private S_Query GetSQuery(int id)
        {
            return DatabaseHelper.RunQueryList<S_Query>(_schemaName, @"
                SELECT id, name, description, code, query FROM ""S_Query"" WHERE id = @id",
                reader => new S_Query
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    code = reader.GetString(3),
                    query = reader.IsDBNull(4) ? null : reader.GetString(4)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        [Fact]
        public async Task GetAll_ReturnsOkResponse()
        {
            // Arrange - Create test query filters
            CreateQueryFilter("Filter 1", "Filter KG 1", "filter_1", "Description 1", "application", "SELECT * FROM application");
            CreateQueryFilter("Filter 2", "Filter KG 2", "filter_2", "Description 2", "customer", "SELECT * FROM customer");

            // Act
            var response = await _client.GetAsync("/QueryFilters/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<QueryFilters>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, filter => filter.name == "Filter 1" && filter.code == "filter_1" && filter.target_table == "application");
            Assert.Contains(result, filter => filter.name == "Filter 2" && filter.code == "filter_2" && filter.target_table == "customer");
        }

        [Fact]
        public async Task GetAppTaskFilters_ReturnsOkResponse()
        {
            // Arrange - Create test query filters for application_task and other tables
            CreateQueryFilter("Task Filter 1", "Task Filter KG 1", "task_filter_1", "Task Description 1", "application_task", "SELECT * FROM application_task WHERE status_id = 1");
            CreateQueryFilter("Task Filter 2", "Task Filter KG 2", "task_filter_2", "Task Description 2", "application_task", "SELECT * FROM application_task WHERE status_id = 2");
            CreateQueryFilter("Other Filter", "Other Filter KG", "other_filter", "Other Description", "customer", "SELECT * FROM customer");

            // Act
            var response = await _client.GetAsync("/QueryFilters/GetAppTaskFilters");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<QueryFilters>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, filter => Assert.Equal("application_task", filter.target_table));
            Assert.Contains(result, filter => filter.code == "task_filter_1");
            Assert.Contains(result, filter => filter.code == "task_filter_2");
            Assert.DoesNotContain(result, filter => filter.code == "other_filter");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create a test query filter
            int id = CreateQueryFilter("Single Filter", "Single Filter KG", "single_filter", "Single Description", "application", "SELECT * FROM application WHERE id = :id");

            // Act
            var response = await _client.GetAsync($"/QueryFilters/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<QueryFilters>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Filter", result.name);
            Assert.Equal("Single Filter KG", result.name_kg);
            Assert.Equal("single_filter", result.code);
            Assert.Equal("Single Description", result.description);
            Assert.Equal("application", result.target_table);
            Assert.Equal("SELECT * FROM application WHERE id = :id", result.query);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateQueryFiltersRequest
            {
                name = "Created Filter",
                name_kg = "Created Filter KG",
                code = "created_filter",
                description = "Created Description",
                target_table = "application_task",
                query = "SELECT * FROM application_task WHERE progress > 50"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/QueryFilters/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<QueryFilters>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Filter", result.name);
            Assert.Equal("Created Filter KG", result.name_kg);
            Assert.Equal("created_filter", result.code);
            Assert.Equal("Created Description", result.description);
            Assert.Equal("application_task", result.target_table);
            Assert.Equal("SELECT * FROM application_task WHERE progress > 50", result.query);

            // Verify in database
            var dbFilter = DatabaseHelper.RunQueryList<QueryFilters>(_schemaName, @"
                SELECT id, name, name_kg, code, description, target_table, query FROM query_filters WHERE id = @id",
                reader => new QueryFilters
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    name_kg = reader.IsDBNull(2) ? null : reader.GetString(2),
                    code = reader.GetString(3),
                    description = reader.IsDBNull(4) ? null : reader.GetString(4),
                    target_table = reader.GetString(5),
                    query = reader.GetString(6)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(dbFilter);
            Assert.Equal("Created Filter", dbFilter.name);
            Assert.Equal("Created Filter KG", dbFilter.name_kg);
            Assert.Equal("created_filter", dbFilter.code);
            Assert.Equal("Created Description", dbFilter.description);
            Assert.Equal("application_task", dbFilter.target_table);
            Assert.Equal("SELECT * FROM application_task WHERE progress > 50", dbFilter.query);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create a test query filter
            int id = CreateQueryFilter("Original Filter", "Original Filter KG", "original_filter",
                "Original Description", "application", "SELECT * FROM application");

            var request = new UpdateQueryFiltersRequest
            {
                id = id,
                name = "Updated Filter",
                name_kg = "Updated Filter KG",
                code = "updated_filter",
                description = "Updated Description",
                target_table = "organization_type",
                query = "SELECT * FROM organization_type WHERE code = 'test'"
            };

            // Act
            var response = await _client.PutAsync("/QueryFilters/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<QueryFilters>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Filter", result.name);
            Assert.Equal("Updated Filter KG", result.name_kg);
            Assert.Equal("updated_filter", result.code);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("organization_type", result.target_table);
            Assert.Equal("SELECT * FROM organization_type WHERE code = 'test'", result.query);

            // Verify in database
            var dbFilter = DatabaseHelper.RunQueryList<QueryFilters>(_schemaName, @"
                SELECT id, name, name_kg, code, description, target_table, query FROM query_filters WHERE id = @id",
                reader => new QueryFilters
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    name_kg = reader.IsDBNull(2) ? null : reader.GetString(2),
                    code = reader.GetString(3),
                    description = reader.IsDBNull(4) ? null : reader.GetString(4),
                    target_table = reader.GetString(5),
                    query = reader.GetString(6)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(dbFilter);
            Assert.Equal("Updated Filter", dbFilter.name);
            Assert.Equal("Updated Filter KG", dbFilter.name_kg);
            Assert.Equal("updated_filter", dbFilter.code);
            Assert.Equal("Updated Description", dbFilter.description);
            Assert.Equal("organization_type", dbFilter.target_table);
            Assert.Equal("SELECT * FROM organization_type WHERE code = 'test'", dbFilter.query);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create a test query filter
            int id = CreateQueryFilter("Delete Filter", "Delete Filter KG", "delete_filter",
                "Delete Description", "application", "SELECT * FROM application");

            // Act
            var response = await _client.DeleteAsync($"/QueryFilters/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM query_filters WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple test query filters
            for (int i = 1; i <= 5; i++)
            {
                CreateQueryFilter($"Paginated Filter {i}", $"Paginated Filter KG {i}", $"paginated_filter_{i}",
                    $"Paginated Description {i}", "application", $"SELECT * FROM application WHERE id = {i}");
            }

            // Act
            var response = await _client.GetAsync("/QueryFilters/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<QueryFilters>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task ApplicationFilter_ReferencesQueryFilter()
        {
            // Arrange - Create a query filter
            int queryFilterId = CreateQueryFilter("Referenced Filter", "Referenced Filter KG", "referenced_filter",
                "Referenced Description", "application", "SELECT * FROM application WHERE status_id = 1");

            // Create a structure post
            int postId = CreateStructurePost("Test Post", "test_post_code");

            // Create an org structure for filter type
            int structureId = CreateOrgStructure("Test Structure");

            // Create a filter type
            int filterTypeId = CreateApplicationFilterType("Test Filter Type", "test_filter_type", "Test Filter Type Description",
                postId, structureId);

            // Create a query in S_Query that the application filter will reference
            int sQueryId = CreateSQuery("S_Query Referenced", "S Query Description", "s_query_code",
                "SELECT * FROM application WHERE status_id = 1");

            // Create an application filter that references the S_Query
            int appFilterId = CreateApplicationFilter("App Filter", "app_filter", "App Filter Description",
                filterTypeId, sQueryId, postId);

            // Act - Get the application filter
            var appFilter = GetApplicationFilter(appFilterId);

            // Assert - Verify integrity of references
            Assert.Equal(sQueryId, appFilter.query_id);
            Assert.Equal(filterTypeId, appFilter.type_id);
            Assert.Equal(postId, appFilter.post_id);
            Assert.Equal("Test Filter Type", appFilter.type_name);

            // Verify we can fetch the related query
            var sQuery = GetSQuery(sQueryId);
            Assert.NotNull(sQuery);
            Assert.Equal("S_Query Referenced", sQuery.name);
            Assert.Equal("s_query_code", sQuery.code);
        }
        // Helper method to create query filter
        private int CreateQueryFilter(string name, string nameKg, string code, string description, string targetTable, string query)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO query_filters (name, name_kg, code, description, target_table, query, created_at, updated_at) 
                VALUES (@name, @nameKg, @code, @description, @targetTable, @query, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@nameKg"] = nameKg,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@targetTable"] = targetTable,
                    ["@query"] = query,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        // Helper method to create structure_post
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

        // Helper method to create org_structure
        private int CreateOrgStructure(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, unique_id, version, is_active, created_at, updated_at) 
                VALUES (@name, @uniqueId, @version, @isActive, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@uniqueId"] = Guid.NewGuid().ToString(),
                    ["@version"] = "1.0",
                    ["@isActive"] = true,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        // Helper method to create application_filter_type
        private int CreateApplicationFilterType(string name, string code, string description, int postId, int structureId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_filter_type (name, code, description, post_id, structure_id, created_at, updated_at) 
                VALUES (@name, @code, @description, @postId, @structureId, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@postId"] = postId,
                    ["@structureId"] = structureId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        // Helper method to create application_filter
        private int CreateApplicationFilter(string name, string code, string description, int typeId, int queryId, int postId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_filter (name, code, description, type_id, query_id, post_id, created_at, updated_at) 
                VALUES (@name, @code, @description, @typeId, @queryId, @postId, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@typeId"] = typeId,
                    ["@queryId"] = queryId,
                    ["@postId"] = postId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        // Helper method to get application_filter
        private ApplicationFilter GetApplicationFilter(int id)
        {
            return DatabaseHelper.RunQueryList<ApplicationFilter>(_schemaName, @"
                SELECT af.id, af.name, af.code, af.description, af.type_id, af.query_id, af.post_id, 
                       aft.name as type_name
                FROM application_filter af
                LEFT JOIN application_filter_type aft ON af.type_id = aft.id
                WHERE af.id = @id",
                reader => new ApplicationFilter
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    description = reader.IsDBNull(3) ? null : reader.GetString(3),
                    type_id = reader.GetInt32(4),
                    query_id = reader.GetInt32(5),
                    post_id = reader.GetInt32(6),
                    type_name = reader.IsDBNull(7) ? null : reader.GetString(7)
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

    // Helper class representing ApplicationFilter for testing
    public class ApplicationFilter
    {
        public int id { get; set; }
        public string name { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public int type_id { get; set; }
        public int query_id { get; set; }
        public int post_id { get; set; }
        public string type_name { get; set; }
        public JObject parameters { get; set; }
    }
}