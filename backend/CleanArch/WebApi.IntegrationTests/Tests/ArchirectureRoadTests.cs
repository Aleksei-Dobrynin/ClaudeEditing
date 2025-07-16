using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using WebApi.IntegrationTests.Fixtures;
using WebApi.IntegrationTests.Helpers;
using Domain.Entities;
using Xunit;
using System.Collections.Generic;
using System.Net.Http.Json;
using WebApi.Dtos;
using Newtonsoft.Json.Linq;
using Application.Models;
using System.Linq;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ArchirectureRoadTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ArchirectureRoadTests()
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
            // Arrange - Create test architecture_road records
            var fromStatusId = CreateArchitectureStatus("From Status", "from_status");
            var toStatusId = CreateArchitectureStatus("To Status", "to_status");

            CreateArchirectureRoad(fromStatusId, toStatusId, true, "Test rule", "Test description");
            CreateArchirectureRoad(fromStatusId, toStatusId, false, "Another rule", "Another description");

            // Act
            var response = await _client.GetAsync("/archirecture_road/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<archirecture_road>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.rule_expression == "Test rule");
            Assert.Contains(result, r => r.rule_expression == "Another rule");
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test architecture_road
            var fromStatusId = CreateArchitectureStatus("From Status", "from_status");
            var toStatusId = CreateArchitectureStatus("To Status", "to_status");

            var id = CreateArchirectureRoad(fromStatusId, toStatusId, true, "Unique rule", "Unique description",
                "http://validation.url", "http://post.function.url");

            // Act
            var response = await _client.GetAsync($"/archirecture_road/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<archirecture_road>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(fromStatusId, result.from_status_id);
            Assert.Equal(toStatusId, result.to_status_id);
            Assert.Equal("Unique rule", result.rule_expression);
            Assert.Equal("Unique description", result.description);
            Assert.Equal("http://validation.url", result.validation_url);
            Assert.Equal("http://post.function.url", result.post_function_url);
            Assert.True(result.is_active);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var fromStatusId = CreateArchitectureStatus("Create From", "create_from");
            var toStatusId = CreateArchitectureStatus("Create To", "create_to");

            var request = new Createarchirecture_roadRequest
            {
                from_status_id = fromStatusId,
                to_status_id = toStatusId,
                rule_expression = "Created rule",
                description = "Created description",
                validation_url = "http://created.validation.url",
                post_function_url = "http://created.post.function.url",
                is_active = true,
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/archirecture_road", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<archirecture_road>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(fromStatusId, result.from_status_id);
            Assert.Equal(toStatusId, result.to_status_id);
            Assert.Equal("Created rule", result.rule_expression);
            Assert.Equal("Created description", result.description);
            Assert.Equal("http://created.validation.url", result.validation_url);
            Assert.Equal("http://created.post.function.url", result.post_function_url);
            Assert.True(result.is_active);

            // Verify in database
            var road = DatabaseHelper.RunQueryList<archirecture_road>(_schemaName, @"
                SELECT id, from_status_id, to_status_id, rule_expression, description, validation_url, post_function_url, is_active
                FROM archirecture_road WHERE id = @id",
                reader => new archirecture_road
                {
                    id = reader.GetInt32(0),
                    from_status_id = reader.GetInt32(1),
                    to_status_id = reader.GetInt32(2),
                    rule_expression = reader.IsDBNull(3) ? null : reader.GetString(3),
                    description = reader.IsDBNull(4) ? null : reader.GetString(4),
                    validation_url = reader.IsDBNull(5) ? null : reader.GetString(5),
                    post_function_url = reader.IsDBNull(6) ? null : reader.GetString(6),
                    is_active = reader.GetBoolean(7)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(road);
            Assert.Equal(result.id, road.id);
            Assert.Equal(fromStatusId, road.from_status_id);
            Assert.Equal(toStatusId, road.to_status_id);
            Assert.Equal("Created rule", road.rule_expression);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalFromStatusId = CreateArchitectureStatus("Original From", "original_from");
            var originalToStatusId = CreateArchitectureStatus("Original To", "original_to");
            var newFromStatusId = CreateArchitectureStatus("New From", "new_from");
            var newToStatusId = CreateArchitectureStatus("New To", "new_to");

            var id = CreateArchirectureRoad(originalFromStatusId, originalToStatusId, true, "Original rule", "Original description");

            var request = new Updatearchirecture_roadRequest
            {
                id = id,
                from_status_id = newFromStatusId,
                to_status_id = newToStatusId,
                rule_expression = "Updated rule",
                description = "Updated description",
                validation_url = "http://updated.validation.url",
                post_function_url = "http://updated.post.function.url",
                is_active = false,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PutAsync($"/archirecture_road/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<archirecture_road>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newFromStatusId, result.from_status_id);
            Assert.Equal(newToStatusId, result.to_status_id);
            Assert.Equal("Updated rule", result.rule_expression);
            Assert.Equal("Updated description", result.description);
            Assert.Equal("http://updated.validation.url", result.validation_url);
            Assert.Equal("http://updated.post.function.url", result.post_function_url);
            Assert.False(result.is_active);

            // Verify in database
            var road = DatabaseHelper.RunQueryList<archirecture_road>(_schemaName, @"
                SELECT from_status_id, to_status_id, rule_expression, description, validation_url, post_function_url, is_active 
                FROM archirecture_road WHERE id = @id",
                reader => new archirecture_road
                {
                    from_status_id = reader.GetInt32(0),
                    to_status_id = reader.GetInt32(1),
                    rule_expression = reader.IsDBNull(2) ? null : reader.GetString(2),
                    description = reader.IsDBNull(3) ? null : reader.GetString(3),
                    validation_url = reader.IsDBNull(4) ? null : reader.GetString(4),
                    post_function_url = reader.IsDBNull(5) ? null : reader.GetString(5),
                    is_active = reader.GetBoolean(6)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(road);
            Assert.Equal(newFromStatusId, road.from_status_id);
            Assert.Equal(newToStatusId, road.to_status_id);
            Assert.Equal("Updated rule", road.rule_expression);
            Assert.Equal("Updated description", road.description);
            Assert.Equal("http://updated.validation.url", road.validation_url);
            Assert.Equal("http://updated.post.function.url", road.post_function_url);
            Assert.False(road.is_active);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var fromStatusId = CreateArchitectureStatus("Delete From", "delete_from");
            var toStatusId = CreateArchitectureStatus("Delete To", "delete_to");

            var id = CreateArchirectureRoad(fromStatusId, toStatusId, true, "Delete rule", "Delete description");

            // Act
            var response = await _client.DeleteAsync($"/archirecture_road/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM archirecture_road WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple architecture_road records
            var fromStatusId = CreateArchitectureStatus("Paginated From", "paginated_from");
            var toStatusId = CreateArchitectureStatus("Paginated To", "paginated_to");

            for (int i = 1; i <= 5; i++)
            {
                CreateArchirectureRoad(fromStatusId, toStatusId, true, $"Rule {i}", $"Description {i}");
            }

            // Act
            var response = await _client.GetAsync("/archirecture_road/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<archirecture_road>>(content);

            JObject jObject = JObject.Parse(content);
            
            int pageNumber = jObject["pageNumber"]?.Value<int>() ?? 0;
            int totalPages = jObject["totalPages"]?.Value<int>() ?? 0;
            int totalCount = jObject["totalCount"]?.Value<int>() ?? 0;
            
            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, totalCount);
            Assert.Equal(1, pageNumber);
            Assert.Equal(2, totalPages);
        }

        [Fact]
        public async Task GetByfrom_status_id_ReturnsOkResponse()
        {
            // Arrange
            var fromStatusId1 = CreateArchitectureStatus("From Status 1", "from_status_1");
            var fromStatusId2 = CreateArchitectureStatus("From Status 2", "from_status_2");
            var toStatusId = CreateArchitectureStatus("To Status Filter", "to_status_filter");

            CreateArchirectureRoad(fromStatusId1, toStatusId, true, "Rule 1", "Description 1");
            CreateArchirectureRoad(fromStatusId1, toStatusId, true, "Rule 2", "Description 2");
            CreateArchirectureRoad(fromStatusId2, toStatusId, true, "Rule 3", "Description 3");

            // Act
            var response = await _client.GetAsync($"/archirecture_road/GetByfrom_status_id?from_status_id={fromStatusId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<archirecture_road>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, road => Assert.Equal(fromStatusId1, road.from_status_id));
        }

        [Fact]
        public async Task GetByto_status_id_ReturnsOkResponse()
        {
            // Arrange
            var fromStatusId = CreateArchitectureStatus("From Status Filter", "from_status_filter");
            var toStatusId1 = CreateArchitectureStatus("To Status 1", "to_status_1");
            var toStatusId2 = CreateArchitectureStatus("To Status 2", "to_status_2");

            CreateArchirectureRoad(fromStatusId, toStatusId1, true, "Rule To 1", "Description To 1");
            CreateArchirectureRoad(fromStatusId, toStatusId1, true, "Rule To 2", "Description To 2");
            CreateArchirectureRoad(fromStatusId, toStatusId2, true, "Rule To 3", "Description To 3");

            // Act
            var response = await _client.GetAsync($"/archirecture_road/GetByto_status_id?to_status_id={toStatusId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<archirecture_road>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, road => Assert.Equal(toStatusId1, road.to_status_id));
        }

        // Helper methods to set up test data
        private int CreateArchitectureStatus(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO architecture_status (name, code, created_at, updated_at) 
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

        private int CreateArchirectureRoad(int fromStatusId, int toStatusId, bool isActive,
            string ruleExpression = null, string description = null,
            string validationUrl = null, string postFunctionUrl = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archirecture_road (from_status_id, to_status_id, is_active, rule_expression, description, validation_url, post_function_url, created_at, updated_at) 
                VALUES (@from_status_id, @to_status_id, @is_active, @rule_expression, @description, @validation_url, @post_function_url, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@from_status_id"] = fromStatusId,
                    ["@to_status_id"] = toStatusId,
                    ["@is_active"] = isActive,
                    ["@rule_expression"] = ruleExpression as object ?? DBNull.Value,
                    ["@description"] = description as object ?? DBNull.Value,
                    ["@validation_url"] = validationUrl as object ?? DBNull.Value,
                    ["@post_function_url"] = postFunctionUrl as object ?? DBNull.Value,
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