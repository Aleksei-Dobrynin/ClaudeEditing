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
    public class UserRoleTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public UserRoleTests()
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
            // Arrange - Create test user roles
            var (userId, roleId, structureId) = CreatePrerequisites();
            CreateUserRole(roleId, structureId, userId);
            CreateUserRole(roleId, structureId, userId);

            // Act
            var response = await _client.GetAsync("/UserRole/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<UserRole>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test user role
            var (userId, roleId, structureId) = CreatePrerequisites();
            var id = CreateUserRole(roleId, structureId, userId);

            // Act
            var response = await _client.GetAsync($"/UserRole/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UserRole>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(roleId, result.role_id);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(userId, result.user_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var (userId, roleId, structureId) = CreatePrerequisites();
            var request = new CreateUserRoleRequest
            {
                role_id = roleId,
                structure_id = structureId,
                user_id = userId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/UserRole/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UserRole>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(roleId, result.role_id);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(userId, result.user_id);

            // Verify in database
            var userRoleExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM user_role WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = result.id });

            Assert.Equal(1, userRoleExists);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var (userId, roleId, structureId) = CreatePrerequisites();
            var (newUserId, newRoleId, newStructureId) = CreatePrerequisites();

            var id = CreateUserRole(roleId, structureId, userId);

            var request = new UpdateUserRoleRequest
            {
                id = id,
                role_id = newRoleId,
                structure_id = newStructureId,
                user_id = newUserId
            };

            // Act
            var response = await _client.PutAsync("/UserRole/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UserRole>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newRoleId, result.role_id);
            Assert.Equal(newStructureId, result.structure_id);
            Assert.Equal(newUserId, result.user_id);

            // Verify in database
            var userRole = DatabaseHelper.RunQueryList<UserRoleRecord>(_schemaName, @"
                SELECT role_id, structure_id, user_id 
                FROM user_role WHERE id = @id",
                reader => new UserRoleRecord
                {
                    role_id = reader.GetInt32(0),
                    structure_id = reader.GetInt32(1),
                    user_id = reader.GetInt32(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(userRole);
            Assert.Equal(newRoleId, userRole.role_id);
            Assert.Equal(newStructureId, userRole.structure_id);
            Assert.Equal(newUserId, userRole.user_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var (userId, roleId, structureId) = CreatePrerequisites();
            var id = CreateUserRole(roleId, structureId, userId);

            // Act
            var response = await _client.DeleteAsync($"/UserRole/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM user_role WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple user roles
            var (userId, roleId, structureId) = CreatePrerequisites();

            for (int i = 0; i < 5; i++)
            {
                CreateUserRole(roleId, structureId, userId);
            }

            // Act
            var response = await _client.GetAsync("/UserRole/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<UserRole>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        // Helper methods to set up test data
        private (int userId, int roleId, int structureId) CreatePrerequisites()
        {
            // Create User
            var userId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""User"" (""userId"", email) 
                VALUES (@userId, @email) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@userId"] = Guid.NewGuid().ToString(),
                    ["@email"] = $"test{Guid.NewGuid().ToString().Substring(0, 8)}@example.com"
                });

            // Create Role
            var roleId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""Role"" (name, code) 
                VALUES (@name, @code) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = $"Role {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@code"] = $"ROLE_{Guid.NewGuid().ToString().Substring(0, 8)}"
                });

            // Create Structure
            var structureId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (unique_id, name, is_active) 
                VALUES (@uniqueId, @name, true) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@uniqueId"] = Guid.NewGuid().ToString(),
                    ["@name"] = $"Structure {Guid.NewGuid().ToString().Substring(0, 8)}"
                });

            return (userId, roleId, structureId);
        }

        private int CreateUserRole(int roleId, int structureId, int userId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO user_role (role_id, structure_id, user_id, created_at, updated_at) 
                VALUES (@roleId, @structureId, @userId, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@roleId"] = roleId,
                    ["@structureId"] = structureId,
                    ["@userId"] = userId,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }

        // Helper class for database query
        private class UserRoleRecord
        {
            public int role_id { get; set; }
            public int structure_id { get; set; }
            public int user_id { get; set; }
        }
    }
}