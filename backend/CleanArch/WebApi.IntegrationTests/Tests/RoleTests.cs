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
    public class RoleTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public RoleTests()
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
            // Arrange - Create test roles
            CreateRole("Administrator", "admin");
            CreateRole("User", "user");

            // Act
            var response = await _client.GetAsync("/Role/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<Role>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.name == "Administrator" && r.code == "admin");
            Assert.Contains(result, r => r.name == "User" && r.code == "user");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create a test role
            var id = CreateRole("Manager", "manager");

            // Act
            var response = await _client.GetAsync($"/Role/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Role>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Manager", result.name);
            Assert.Equal("manager", result.code);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateRoleRequest
            {
                name = "Editor",
                code = "editor"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/Role/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Role>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Editor", result.name);
            Assert.Equal("editor", result.code);

            // Verify in database
            var insertedRole = DatabaseHelper.RunQueryList<Role>(_schemaName, @"
                SELECT id, name, code FROM ""Role"" WHERE id = @id",
                reader => new Role
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = result.id }).FirstOrDefault();

            Assert.NotNull(insertedRole);
            Assert.Equal("Editor", insertedRole.name);
            Assert.Equal("editor", insertedRole.code);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create a test role to update
            var id = CreateRole("Original", "original");

            var request = new UpdateRoleRequest
            {
                id = id,
                name = "Updated",
                code = "updated"
            };

            // Act
            var response = await _client.PutAsync("/Role/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Role>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated", result.name);
            Assert.Equal("updated", result.code);

            // Verify in database
            var updatedRole = DatabaseHelper.RunQueryList<Role>(_schemaName, @"
                SELECT id, name, code FROM ""Role"" WHERE id = @id",
                reader => new Role
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();

            Assert.NotNull(updatedRole);
            Assert.Equal("Updated", updatedRole.name);
            Assert.Equal("updated", updatedRole.code);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create a test role to delete
            var id = CreateRole("ToDelete", "delete");

            // Act
            var response = await _client.DeleteAsync($"/Role/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM ""Role"" WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test roles
            for (int i = 1; i <= 5; i++)
            {
                CreateRole($"Role{i}", $"role{i}");
            }

            // Act
            var response = await _client.GetAsync("/Role/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<Role>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        [Fact]
        public async Task GetPaginated_WithInvalidParams_HandlesGracefully()
        {
            // Arrange - Create several test roles
            for (int i = 1; i <= 3; i++)
            {
                CreateRole($"PaginatedRole{i}", $"paginatedrole{i}");
            }

            // Act - Test with negative page size
            var response1 = await _client.GetAsync("/Role/GetPaginated?pageSize=-1&pageNumber=1");

            // Assert - Should handle negative values gracefully (using minimum values of 1)
            response1.EnsureSuccessStatusCode();
            var content1 = await response1.Content.ReadAsStringAsync();
            var result1 = JsonConvert.DeserializeObject<PaginatedResponse<Role>>(content1);

            Assert.NotNull(result1);
            Assert.Equal(1, result1.items.Count); // Minimum page size of 1

            // Act - Test with negative page number
            var response2 = await _client.GetAsync("/Role/GetPaginated?pageSize=2&pageNumber=-5");

            // Assert
            response2.EnsureSuccessStatusCode();
            var content2 = await response2.Content.ReadAsStringAsync();
            var result2 = JsonConvert.DeserializeObject<PaginatedResponse<Role>>(content2);

            Assert.NotNull(result2);
            Assert.Equal(1, result2.pageNumber); // Minimum page number of 1
        }

        // Helper method to create a test role
        private int CreateRole(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""Role"" (name, code, created_at, updated_at) 
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