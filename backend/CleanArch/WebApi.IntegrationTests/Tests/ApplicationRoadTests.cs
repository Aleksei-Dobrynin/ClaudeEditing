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

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ApplicationRoadTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationRoadTests()
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
            // Arrange - Create test application roads
            var applicationStatusCount = GetApplicationStatus();

            // Act
            var response = await _client.GetAsync("/ApplicationRoad/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ApplicationRoad>>(content);

            Assert.NotNull(result);
            Assert.Equal(applicationStatusCount, result.Count);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test application road
            var fromStatusId = CreateApplicationStatus("From Status", "from_status");
            var toStatusId = CreateApplicationStatus("To Status", "to_status");
            var groupId = CreateApplicationRoadGroup("single_test_group", new[] { "registrar", "employee" });

            var id = CreateApplicationRoad(fromStatusId, toStatusId, groupId, true,
                "Test rule expression", "Test description", "http://validation.url", "http://post.function.url");

            // Act
            var response = await _client.GetAsync($"/ApplicationRoad/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationRoad>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(fromStatusId, result.from_status_id);
            Assert.Equal(toStatusId, result.to_status_id);
            Assert.Equal("Test rule expression", result.rule_expression);
            Assert.Equal("Test description", result.description);
            Assert.Equal("http://validation.url", result.validation_url);
            Assert.Equal("http://post.function.url", result.post_function_url);
            Assert.True(result.is_active);
            Assert.Equal(groupId, result.group_id);

            // Verify that posts are populated from group roles
            Assert.NotNull(result.posts);
            Assert.NotEmpty(result.posts);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var fromStatusId = CreateApplicationStatus("Create From Status", "create_from_status");
            var toStatusId = CreateApplicationStatus("Create To Status", "create_to_status");

            // Create structure posts to use in the request
            var registrarPostId = CreateStructurePost("Registrar Post", "registrar");
            var employeePostId = CreateStructurePost("Employee Post", "employee");

            var request = new CreateApplicationRoadRequest
            {
                from_status_id = fromStatusId,
                to_status_id = toStatusId,
                rule_expression = "Created rule expression",
                description = "Created description",
                validation_url = "http://created.validation.url",
                post_function_url = "http://created.post.function.url",
                is_active = true,
                posts = new[] { registrarPostId, employeePostId }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ApplicationRoad/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationRoad>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(fromStatusId, result.from_status_id);
            Assert.Equal(toStatusId, result.to_status_id);
            Assert.Equal("Created rule expression", result.rule_expression);
            Assert.Equal("Created description", result.description);
            Assert.Equal("http://created.validation.url", result.validation_url);
            Assert.Equal("http://created.post.function.url", result.post_function_url);
            Assert.True(result.is_active);
            Assert.NotNull(result.group_id);

            // Verify in database
            var applicationRoad = DatabaseHelper.RunQueryList<ApplicationRoad>(_schemaName, @"
                SELECT id, from_status_id, to_status_id, rule_expression, description, validation_url, post_function_url, is_active, group_id
                FROM application_road WHERE id = @id",
                reader => new ApplicationRoad
                {
                    id = reader.GetInt32(0),
                    from_status_id = reader.GetInt32(1),
                    to_status_id = reader.GetInt32(2),
                    rule_expression = reader.IsDBNull(3) ? null : reader.GetString(3),
                    description = reader.IsDBNull(4) ? null : reader.GetString(4),
                    validation_url = reader.IsDBNull(5) ? null : reader.GetString(5),
                    post_function_url = reader.IsDBNull(6) ? null : reader.GetString(6),
                    is_active = reader.GetBoolean(7),
                    group_id = reader.IsDBNull(8) ? null : reader.GetInt32(8)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(applicationRoad);
            Assert.Equal(result.id, applicationRoad.id);
            Assert.Equal(fromStatusId, applicationRoad.from_status_id);
            Assert.Equal(toStatusId, applicationRoad.to_status_id);
            Assert.True(applicationRoad.is_active);

            // Verify group was created with roles
            var group = GetApplicationRoadGroup(applicationRoad.group_id.Value);
            Assert.NotNull(group);

            // Parse the roles JSON and verify it contains the expected roles
            var roles = JsonConvert.DeserializeObject<List<string>>(group.roles);
            Assert.Contains("registrar", roles);
            Assert.Contains("employee", roles);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalFromStatusId = CreateApplicationStatus("Original From Status", "original_from_status");
            var originalToStatusId = CreateApplicationStatus("Original To Status", "original_to_status");
            var newFromStatusId = CreateApplicationStatus("New From Status", "new_from_status");
            var newToStatusId = CreateApplicationStatus("New To Status", "new_to_status");

            var groupId = CreateApplicationRoadGroup("update_test_group", new[] { "registrar" });
            var id = CreateApplicationRoad(originalFromStatusId, originalToStatusId, groupId, true);

            // Create structure posts for the update
            var registrarPostId = CreateStructurePost("Registrar Post", "registrar");
            var employeePostId = CreateStructurePost("Employee Post", "employee");
            var adminPostId = CreateStructurePost("Admin Post", "admin");

            var request = new UpdateApplicationRoadRequest
            {
                id = id,
                from_status_id = newFromStatusId,
                to_status_id = newToStatusId,
                rule_expression = "Updated rule expression",
                description = "Updated description",
                validation_url = "http://updated.validation.url",
                post_function_url = "http://updated.post.function.url",
                is_active = false,
                posts = new[] { registrarPostId, employeePostId, adminPostId },
                group_id = groupId
            };

            // Act
            var response = await _client.PutAsync("/ApplicationRoad/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationRoad>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newFromStatusId, result.from_status_id);
            Assert.Equal(newToStatusId, result.to_status_id);
            Assert.Equal("Updated rule expression", result.rule_expression);
            Assert.Equal("Updated description", result.description);
            Assert.Equal("http://updated.validation.url", result.validation_url);
            Assert.Equal("http://updated.post.function.url", result.post_function_url);
            Assert.False(result.is_active);
            Assert.Equal(groupId, result.group_id);

            // Verify in database
            var road = DatabaseHelper.RunQueryList<ApplicationRoad>(_schemaName, @"
                SELECT from_status_id, to_status_id, rule_expression, description, validation_url, post_function_url, is_active 
                FROM application_road WHERE id = @id",
                reader => new ApplicationRoad
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
            Assert.Equal("Updated rule expression", road.rule_expression);
            Assert.Equal("Updated description", road.description);
            Assert.Equal("http://updated.validation.url", road.validation_url);
            Assert.False(road.is_active);

            // Verify group roles were updated
            var group = GetApplicationRoadGroup(groupId);
            var roles = JsonConvert.DeserializeObject<List<string>>(group.roles);
            Assert.Contains("registrar", roles);
            Assert.Contains("employee", roles);
            Assert.Contains("admin", roles);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var fromStatusId = CreateApplicationStatus("Delete From Status", "delete_from_status");
            var toStatusId = CreateApplicationStatus("Delete To Status", "delete_to_status");
            var groupId = CreateApplicationRoadGroup("delete_test_group", new[] { "registrar" });

            var id = CreateApplicationRoad(fromStatusId, toStatusId, groupId, true);

            // Act
            var response = await _client.DeleteAsync($"/ApplicationRoad/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database that the record has been deleted
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_road WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);

            // Note: The group should still exist as it's not deleted along with the road
            var groupExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_road_groups WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = groupId });

            Assert.Equal(1, groupExists);
        }

        [Fact]
        public async Task Create_WithoutGroup_CreatesNewGroup()
        {
            // Arrange
            var fromStatusId = CreateApplicationStatus("Create Status A", "create_status_a");
            var toStatusId = CreateApplicationStatus("Create Status B", "create_status_b");

            // Create structure posts to use in the request
            var registrarPostId = CreateStructurePost("Registrar2", "registrar");

            var request = new CreateApplicationRoadRequest
            {
                from_status_id = fromStatusId,
                to_status_id = toStatusId,
                rule_expression = "Test rule",
                description = "Test description",
                is_active = true,
                posts = new[] { registrarPostId }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ApplicationRoad/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationRoad>(content);

            Assert.NotNull(result);
            Assert.NotNull(result.group_id);

            // Verify the new group was created with the correct role
            var group = GetApplicationRoadGroup(result.group_id.Value);
            var roles = JsonConvert.DeserializeObject<List<string>>(group.roles);
            Assert.Contains("registrar", roles);
        }

        [Fact]
        public async Task Update_WithNewPosts_UpdatesGroupRoles()
        {
            // Arrange
            var fromStatusId = CreateApplicationStatus("Update Status A", "update_status_a");
            var toStatusId = CreateApplicationStatus("Update Status B", "update_status_b");

            // Create initial posts and group
            var registrarPostId = CreateStructurePost("Registrar3", "registrar");
            var groupId = CreateApplicationRoadGroup("roles_update_group", new[] { "registrar" });

            var id = CreateApplicationRoad(fromStatusId, toStatusId, groupId, true);

            // Create a new post for the update
            var employeePostId = CreateStructurePost("Employee2", "employee");

            var request = new UpdateApplicationRoadRequest
            {
                id = id,
                from_status_id = fromStatusId,
                to_status_id = toStatusId,
                is_active = true,
                group_id = groupId,
                posts = new[] { registrarPostId, employeePostId }
            };

            // Act
            var response = await _client.PutAsync("/ApplicationRoad/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify group roles were updated to include both roles
            var group = GetApplicationRoadGroup(groupId);
            var roles = JsonConvert.DeserializeObject<List<string>>(group.roles);
            Assert.Equal(2, roles.Count);
            Assert.Contains("registrar", roles);
            Assert.Contains("employee", roles);
        }

        // Helper methods to set up test data
        private int CreateApplicationStatus(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_status (name, code, created_at, updated_at) 
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
        
        private int GetApplicationStatus()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                select count(*) from application_road;");
        }

        private int CreateApplicationRoadGroup(string name, string[] roles)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_road_groups (name, roles, created_at, updated_at) 
                VALUES (@name, @roles::jsonb, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@roles"] = JsonConvert.SerializeObject(roles),
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private ApplicationRoadGroups GetApplicationRoadGroup(int id)
        {
            return DatabaseHelper.RunQueryList<ApplicationRoadGroups>(_schemaName, @"
                SELECT id, name, roles FROM application_road_groups WHERE id = @id",
                reader => new ApplicationRoadGroups
                {
                    id = reader.GetInt32(0),
                    name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    roles = reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        private int CreateApplicationRoad(int fromStatusId, int toStatusId, int? groupId, bool isActive,
            string ruleExpression = null, string description = null, string validationUrl = null, string postFunctionUrl = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_road (from_status_id, to_status_id, group_id, is_active, rule_expression, description, validation_url, post_function_url, created_at, updated_at) 
                VALUES (@from_status_id, @to_status_id, @group_id, @is_active, @rule_expression, @description, @validation_url, @post_function_url, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@from_status_id"] = fromStatusId,
                    ["@to_status_id"] = toStatusId,
                    ["@group_id"] = groupId as object ?? DBNull.Value,
                    ["@is_active"] = isActive,
                    ["@rule_expression"] = ruleExpression as object ?? DBNull.Value,
                    ["@description"] = description as object ?? DBNull.Value,
                    ["@validation_url"] = validationUrl as object ?? DBNull.Value,
                    ["@post_function_url"] = postFunctionUrl as object ?? DBNull.Value,
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

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}