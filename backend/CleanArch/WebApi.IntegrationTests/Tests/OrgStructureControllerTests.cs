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
    public class OrgStructureControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public OrgStructureControllerTests()
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
            // Arrange - Create test org structures
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM org_structure WHERE id > 0;");
            CreateOrgStructure("Structure 1", "1.0", "S1", DateTime.Now);
            CreateOrgStructure("Structure 2", "1.0", "S2", DateTime.Now);

            // Act
            var response = await _client.GetAsync("/OrgStructure/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<OrgStructure>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.name == "Structure 1");
            Assert.Contains(result, s => s.name == "Structure 2");
        }

        [Fact]
        public async Task GetAllMy_ReturnsOkResponse()
        {
            // Arrange - Create test structure and employee
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM org_structure WHERE id > 0;");
            var structureId = CreateOrgStructure("My Structure", "1.0", "MS", DateTime.Now);
            var userId = "1"; // Test user ID that matches the one in TestAuthRepository
            var employeeId = CreateEmployee("Test", "User", userId);
            AssignEmployeeToStructure(employeeId, structureId);

            // Act
            var response = await _client.GetAsync("/OrgStructure/GetAllMy");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<OrgStructure>>(content);

            Assert.NotNull(result);
            // Since the test auth repository is set up to return roles that include "registrar",
            // it should return all structures, regardless of the employee assignment
            Assert.NotEmpty(result);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test org structure
            var id = CreateOrgStructure("Single Structure", "1.0", "SS", DateTime.Now);

            // Act
            var response = await _client.GetAsync($"/OrgStructure/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<OrgStructure>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Structure", result.name);
            Assert.Equal("1.0", result.version);
            Assert.Equal("SS", result.short_name);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now.AddMonths(6);

            var request = new CreateOrgStructureRequest
            {
                name = "Created Structure",
                version = "1.0",
                unique_id = "CS12345",
                date_start = dateStart,
                date_end = dateEnd,
                short_name = "CS"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/OrgStructure", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<OrgStructure>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Structure", result.name);
            Assert.Equal("1.0", result.version);
            Assert.Equal("CS12345", result.unique_id);
            Assert.Equal("CS", result.short_name);
            Assert.Equal(dateStart.Date, result.date_start?.Date);
            Assert.Equal(dateEnd.Date, result.date_end?.Date);

            // Verify in database
            var structure = DatabaseHelper.RunQueryList<OrgStructure>(_schemaName, @"
                SELECT id, name, version, unique_id, date_start, date_end, short_name 
                FROM org_structure 
                WHERE id = @id",
                reader => new OrgStructure
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    version = reader.GetString(2),
                    unique_id = reader.GetString(3),
                    date_start = reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                    date_end = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    short_name = reader.GetString(6)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(structure);
            Assert.Equal("Created Structure", structure.name);
            Assert.Equal("CS", structure.short_name);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateOrgStructure("Structure To Update", "1.0", "STU", DateTime.Now);
            var newDateStart = DateTime.Now.AddDays(-10);
            var newDateEnd = DateTime.Now.AddMonths(12);

            var request = new UpdateOrgStructureRequest
            {
                id = id,
                name = "Updated Structure",
                version = "2.0",
                unique_id = "US12345",
                date_start = newDateStart,
                date_end = newDateEnd,
                short_name = "US"
            };

            // Act
            var response = await _client.PutAsync($"/OrgStructure/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<OrgStructure>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Structure", result.name);
            Assert.Equal("2.0", result.version);
            Assert.Equal("US12345", result.unique_id);
            Assert.Equal("US", result.short_name);
            Assert.Equal(newDateStart.Date, result.date_start?.Date);
            Assert.Equal(newDateEnd.Date, result.date_end?.Date);

            // Verify in database
            var structure = DatabaseHelper.RunQueryList<OrgStructure>(_schemaName, @"
                SELECT name, version, unique_id, date_start, date_end, short_name 
                FROM org_structure 
                WHERE id = @id",
                reader => new OrgStructure
                {
                    name = reader.GetString(0),
                    version = reader.GetString(1),
                    unique_id = reader.GetString(2),
                    date_start = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    date_end = reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                    short_name = reader.GetString(5)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(structure);
            Assert.Equal("Updated Structure", structure.name);
            Assert.Equal("2.0", structure.version);
            Assert.Equal("US", structure.short_name);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateOrgStructure("Structure To Delete", "1.0", "STD", DateTime.Now);

            // Act
            var response = await _client.DeleteAsync($"/OrgStructure/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM org_structure WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test structures
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM org_structure WHERE id > 0;");
            for (int i = 1; i <= 5; i++)
            {
                CreateOrgStructure($"Paginated Structure {i}", $"1.{i}", $"PS{i}", DateTime.Now.AddDays(-i));
            }

            // Act
            var response = await _client.GetAsync("/OrgStructure/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<OrgStructure>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        [Fact]
        public async Task OrgStructure_WithChildren_CanBeRetrieved()
        {
            // Arrange - Create parent and child structures
            var parentId = CreateOrgStructure("Parent Structure", "1.0", "PS", DateTime.Now);
            CreateOrgStructure("Child Structure", "1.0", "CS", DateTime.Now, parentId);

            // Act
            var response = await _client.GetAsync($"/OrgStructure/{parentId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<OrgStructure>(content);

            Assert.NotNull(result);
            Assert.Equal(parentId, result.id);
            Assert.Equal("Parent Structure", result.name);

            // Verify child structure
            var childStructures = DatabaseHelper.RunQueryList<OrgStructure>(_schemaName, @"
                SELECT id, name, parent_id FROM org_structure WHERE parent_id = @parentId",
                reader => new OrgStructure
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    parent_id = reader.GetInt32(2)
                },
                new Dictionary<string, object> { ["@parentId"] = parentId }
            );

            Assert.NotEmpty(childStructures);
            Assert.Contains(childStructures, s => s.name == "Child Structure" && s.parent_id == parentId);
        }

        // Helper methods to create test data
        private int CreateOrgStructure(string name, string version, string shortName, DateTime dateStart, int? parentId = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, version, short_name, date_start, parent_id, created_at, updated_at) 
                VALUES (@name, @version, @shortName, @dateStart, @parentId, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@version"] = version,
                    ["@shortName"] = shortName,
                    ["@dateStart"] = dateStart,
                    ["@parentId"] = parentId as object ?? DBNull.Value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateEmployee(string firstName, string lastName, string userId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (first_name, last_name, user_id, created_at, updated_at) 
                VALUES (@firstName, @lastName, @userId, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@firstName"] = firstName,
                    ["@lastName"] = lastName,
                    ["@userId"] = userId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int AssignEmployeeToStructure(int employeeId, int structureId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee_in_structure (employee_id, structure_id, date_start, created_at, updated_at) 
                VALUES (@employeeId, @structureId, @dateStart, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@employeeId"] = employeeId,
                    ["@structureId"] = structureId,
                    ["@dateStart"] = DateTime.Now,
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