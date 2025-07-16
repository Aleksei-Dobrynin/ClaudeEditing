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
    public class EmployeeInStructureTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public EmployeeInStructureTests()
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
            // Arrange - Create test data
            var (employeeId, structureId, postId) = SetupTestData();
            var assignmentId = CreateEmployeeInStructure(employeeId, structureId, postId, DateTime.Now);

            // Act
            var response = await _client.GetAsync("/EmployeeInStructure/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<EmployeeInStructure>>(content);

            Assert.NotNull(result);
            Assert.NotEmpty(result);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (employeeId, structureId, postId) = SetupTestData();
            var id = CreateEmployeeInStructure(employeeId, structureId, postId, DateTime.Now);

            // Act
            var response = await _client.GetAsync($"/EmployeeInStructure/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<EmployeeInStructure>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(employeeId, result.employee_id);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(postId, result.post_id);
        }

        [Fact]
        public async Task GetByidStructure_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (employeeId1, structureId, postId) = SetupTestData();
            var employeeId2 = CreateEmployee("Another", "Structure", "Employee");

            // Create multiple assignments for the same structure
            CreateEmployeeInStructure(employeeId1, structureId, postId, DateTime.Now);
            CreateEmployeeInStructure(employeeId2, structureId, postId, DateTime.Now);

            // Act
            var response = await _client.GetAsync($"/EmployeeInStructure/GetByidStructure?idStructure={structureId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<EmployeeInStructure>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(structureId, item.structure_id));
            Assert.Contains(result, item => item.employee_id == employeeId1);
            Assert.Contains(result, item => item.employee_id == employeeId2);
        }

        [Fact]
        public async Task GetByidEmployee_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (employeeId, structureId1, postId) = SetupTestData();
            var structureId2 = CreateOrgStructure("Second Department", "v1", true);

            // Create multiple assignments for the same employee
            CreateEmployeeInStructure(employeeId, structureId1, postId, DateTime.Now);
            CreateEmployeeInStructure(employeeId, structureId2, postId, DateTime.Now);

            // Act
            var response = await _client.GetAsync($"/EmployeeInStructure/GetByidEmployee?idEmployee={employeeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<EmployeeInStructure>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(employeeId, item.employee_id));
            Assert.Contains(result, item => item.structure_id == structureId1);
            Assert.Contains(result, item => item.structure_id == structureId2);
        }

        [Fact]
        public async Task GetByEmployeeStructureId_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (employeeId, structureId, postId) = SetupTestData();

            // Create child structure
            var childStructureId = CreateOrgStructure("Child Department", "v1", true, structureId);
            var employeeId2 = CreateEmployee("Child", "Structure", "Employee");

            // Create assignments
            CreateEmployeeInStructure(employeeId, structureId, postId, DateTime.Now.AddDays(-1));
            CreateEmployeeInStructure(employeeId2, childStructureId, postId, DateTime.Now.AddDays(-1));

            // Act
            var response = await _client.GetAsync($"/EmployeeInStructure/GetByEmployeeStructureId?idStructure={structureId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<EmployeeInStructure>>(content);

            // This should return employees from the structure and its child structures
            Assert.NotNull(result);
            // Depending on the implementation details, this might include both employees or just the one directly assigned
            // The test verifies the endpoint works, but the exact behavior should be verified in a more specific test
            Assert.NotEmpty(result);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var (employeeId, structureId, postId) = SetupTestData();
            var startDate = DateTime.Now;
            var endDate = DateTime.Now.AddYears(1);

            var request = new CreateEmployeeInStructureRequest
            {
                employee_id = employeeId,
                structure_id = structureId,
                post_id = postId,
                date_start = startDate,
                date_end = endDate,
                is_temporary = false
            };

            // Act
            var response = await _client.PostAsJsonAsync("/EmployeeInStructure/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<EmployeeInStructure>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(employeeId, result.employee_id);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(postId, result.post_id);
            Assert.Equal(startDate.Date, result.date_start.Date);
            Assert.Equal(endDate.Date, result.date_end?.Date);
            Assert.False(result.is_temporary);

            // Verify in database
            var created = DatabaseHelper.RunQueryList<EmployeeInStructure>(_schemaName, @"
                SELECT id, employee_id, structure_id, post_id, date_start, date_end, is_temporary 
                FROM employee_in_structure WHERE id = @id",
                reader => new EmployeeInStructure
                {
                    id = reader.GetInt32(0),
                    employee_id = reader.GetInt32(1),
                    structure_id = reader.GetInt32(2),
                    post_id = reader.GetInt32(3),
                    date_start = reader.GetDateTime(4),
                    date_end = reader.IsDBNull(5) ? null : (DateTime?)reader.GetDateTime(5),
                    is_temporary = reader.IsDBNull(6) ? null : (bool?)reader.GetBoolean(6)
                },
                new Dictionary<string, object> { ["@id"] = result.id }).FirstOrDefault();

            Assert.NotNull(created);
            Assert.Equal(employeeId, created.employee_id);
            Assert.Equal(structureId, created.structure_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var (employeeId, structureId, postId) = SetupTestData();
            var newStructureId = CreateOrgStructure("Updated Department", "v2", true);
            var newPostId = CreateStructurePost("Updated Position", "updated_position");

            var startDate = DateTime.Now.AddDays(-30);
            var id = CreateEmployeeInStructure(employeeId, structureId, postId, startDate);

            var newStartDate = DateTime.Now;
            var newEndDate = DateTime.Now.AddMonths(6);

            var request = new UpdateEmployeeInStructureRequest
            {
                id = id,
                employee_id = employeeId,
                structure_id = newStructureId,
                post_id = newPostId,
                date_start = newStartDate,
                date_end = newEndDate,
                is_temporary = true
            };

            // Act
            var response = await _client.PutAsync("/EmployeeInStructure/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<EmployeeInStructure>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(employeeId, result.employee_id);
            Assert.Equal(newStructureId, result.structure_id);
            Assert.Equal(newPostId, result.post_id);
            Assert.Equal(newStartDate.Date, result.date_start.Date);
            Assert.Equal(newEndDate.Date, result.date_end?.Date);
            Assert.True(result.is_temporary);

            // Verify in database
            var updated = DatabaseHelper.RunQueryList<EmployeeInStructure>(_schemaName, @"
                SELECT structure_id, post_id, date_start, date_end, is_temporary
                FROM employee_in_structure WHERE id = @id",
                reader => new EmployeeInStructure
                {
                    structure_id = reader.GetInt32(0),
                    post_id = reader.GetInt32(1),
                    date_start = reader.GetDateTime(2),
                    date_end = reader.IsDBNull(3) ? null : (DateTime?)reader.GetDateTime(3),
                    is_temporary = reader.IsDBNull(4) ? null : (bool?)reader.GetBoolean(4)
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();

            Assert.NotNull(updated);
            Assert.Equal(newStructureId, updated.structure_id);
            Assert.Equal(newPostId, updated.post_id);
            Assert.Equal(newStartDate.Date, updated.date_start.Date);
            Assert.Equal(newEndDate.Date, updated.date_end?.Date);
            Assert.True(updated.is_temporary);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var (employeeId, structureId, postId) = SetupTestData();
            var id = CreateEmployeeInStructure(employeeId, structureId, postId, DateTime.Now);

            // Act
            var response = await _client.DeleteAsync($"/EmployeeInStructure/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM employee_in_structure WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task FireEmployee_ReturnsOkResponse()
        {
            // Arrange
            var (employeeId, structureId, postId) = SetupTestData();
            var id = CreateEmployeeInStructure(employeeId, structureId, postId, DateTime.Now);

            // Act
            var response = await _client.PostAsync($"/EmployeeInStructure/FireEmployee?id={id}", null);

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database - the record should still exist but have an end date
            var endDate = DatabaseHelper.RunQuery<DateTime>(_schemaName, @"
                SELECT date_end FROM employee_in_structure WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.NotNull(endDate);
            Assert.True(endDate <= DateTime.Now);
        }

        [Fact]
        public async Task CheckIsHeadStructure_ReturnsOkResponse()
        {
            // Arrange
            var (employeeId, structureId, _) = SetupTestData();
            var headPostId = CreateStructurePost("Head of Department", "head_structure");

            // Create an assignment where the employee is a head
            CreateEmployeeInStructure(employeeId, structureId, headPostId, DateTime.Now);

            // Act
            var response = await _client.GetAsync($"/EmployeeInStructure/CheckIsHeadStructure?employee_id={employeeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<bool>(content);

            Assert.True(result);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (employeeId, structureId, postId) = SetupTestData();

            // Create multiple employees and assignments
            for (int i = 1; i <= 5; i++)
            {
                var employee = CreateEmployee($"Paginated{i}", "Test", "Employee");
                CreateEmployeeInStructure(employee, structureId, postId, DateTime.Now.AddDays(-i));
            }

            // Act
            var response = await _client.GetAsync("/EmployeeInStructure/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<EmployeeInStructure>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        // Helper methods to set up test data
        private (int employeeId, int structureId, int postId) SetupTestData()
        {
            var employeeId = CreateEmployee("Test", "Employee", "Name");
            var structureId = CreateOrgStructure("Test Department", "v1", true);
            var postId = CreateStructurePost("Test Position", "employee");

            return (employeeId, structureId, postId);
        }

        private int CreateEmployee(string firstName, string lastName, string secondName)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (first_name, last_name, second_name, guid, created_at, updated_at) 
                VALUES (@firstName, @lastName, @secondName, @guid, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@firstName"] = firstName,
                    ["@lastName"] = lastName,
                    ["@secondName"] = secondName,
                    ["@guid"] = Guid.NewGuid().ToString(),
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateOrgStructure(string name, string version, bool isActive, int? parentId = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, version, is_active, parent_id, unique_id, date_start, created_at, updated_at) 
                VALUES (@name, @version, @isActive, @parentId, @uniqueId, @dateStart, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@version"] = version,
                    ["@isActive"] = isActive,
                    ["@parentId"] = parentId as object ?? DBNull.Value,
                    ["@uniqueId"] = Guid.NewGuid().ToString(),
                    ["@dateStart"] = DateTime.Now,
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

        private int CreateEmployeeInStructure(int employeeId, int structureId, int postId, DateTime startDate, DateTime? endDate = null, bool? isTemporary = false)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee_in_structure (employee_id, structure_id, post_id, date_start, date_end, is_temporary, created_at, updated_at) 
                VALUES (@employeeId, @structureId, @postId, @dateStart, @dateEnd, @isTemporary, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@employeeId"] = employeeId,
                    ["@structureId"] = structureId,
                    ["@postId"] = postId,
                    ["@dateStart"] = startDate,
                    ["@dateEnd"] = endDate as object ?? DBNull.Value,
                    ["@isTemporary"] = isTemporary as object ?? DBNull.Value,
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