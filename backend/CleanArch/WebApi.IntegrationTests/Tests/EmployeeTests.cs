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
using WebApi.Controllers;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class EmployeeTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;
        private readonly int _authenticatedEmployeeId; // Track the authenticated employee ID

        public EmployeeTests()
        {
            // Create a schema for this test
            _schemaName = DatabaseHelper.CreateTestSchema();

            // Set up the authenticated user/employee
            _authenticatedEmployeeId = SetupAuthenticatedEmployee();

            // Create a client with the schema configured
            var factory = new TestWebApplicationFactory<Program>(_schemaName);
            _client = factory.CreateClient();
        }

        // Create an employee that corresponds to the test authenticated user
        private int SetupAuthenticatedEmployee()
        {
            // First create the user that matches our TestAuthHandler
            // The test auth handler uses "test.user@example.com" as the email and "test-user-id" as the userId
            var userId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""User"" (""userId"", email, password_hash, active, first_reset, created_at, updated_at) 
                VALUES (@userId, @email, @passwordHash, @active, @firstReset, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@userId"] = "test-user-id", // Must match the user_id in TestAuthHandler
                    ["@email"] = "test.user@example.com", // Must match the email in TestAuthHandler
                    ["@passwordHash"] = "test-hash",
                    ["@active"] = true,
                    ["@firstReset"] = false,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });

            // Then create the employee linked to this user
            var employeeId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (
                    last_name, 
                    first_name, 
                    second_name, 
                    pin, 
                    user_id, 
                    email, 
                    guid, 
                    created_at, 
                    updated_at
                ) 
                VALUES (
                    @lastName, 
                    @firstName, 
                    @secondName, 
                    @pin, 
                    @userId, 
                    @email, 
                    @guid, 
                    @createdAt, 
                    @updatedAt
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@lastName"] = "Test",
                    ["@firstName"] = "User",
                    ["@secondName"] = "Auth",
                    ["@pin"] = "12345",
                    ["@userId"] = "test-user-id", // Must match the user_id in TestAuthHandler
                    ["@email"] = "test.user@example.com", // Must match the email in TestAuthHandler
                    ["@guid"] = Guid.NewGuid().ToString(),
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });

            // Create structure, post, and employee_in_structure records
            var structureId = CreateStructure();
            var postId = GetPostId("registrar"); // Use a valid post with code

            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee_in_structure (
                    employee_id, 
                    structure_id, 
                    post_id, 
                    date_start, 
                    created_at, 
                    updated_at
                ) 
                VALUES (
                    @employeeId, 
                    @structureId, 
                    @postId, 
                    @dateStart, 
                    @createdAt, 
                    @updatedAt
                );",
                new Dictionary<string, object>
                {
                    ["@employeeId"] = employeeId,
                    ["@structureId"] = structureId,
                    ["@postId"] = postId,
                    ["@dateStart"] = DateTime.Now,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });

            return employeeId;
        }

        // Get or create a post ID for a specific code
        private int GetPostId(string code)
        {
            var postId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT id FROM structure_post WHERE code = @code LIMIT 1;",
                new Dictionary<string, object> { ["@code"] = code });

            if (postId == 0)
            {
                postId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO structure_post (name, code, created_at, updated_at) 
                    VALUES (@name, @code, @createdAt, @updatedAt) 
                    RETURNING id;",
                    new Dictionary<string, object>
                    {
                        ["@name"] = $"Test Post {code}",
                        ["@code"] = code,
                        ["@createdAt"] = DateTime.Now,
                        ["@updatedAt"] = DateTime.Now
                    });
            }

            return postId;
        }

        private int CreateStructure()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, unique_id, is_active, created_at, updated_at) 
                VALUES (@name, @uniqueId, @isActive, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = $"Test Structure {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@uniqueId"] = Guid.NewGuid().ToString(),
                    ["@isActive"] = true,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        [Fact]
        public async Task GetAll_ReturnsOkResponse()
        {
            // Arrange - Create test employees
            CreateEmployee("Smith", "John", "A", "12345");
            CreateEmployee("Doe", "Jane", "B", "67890");

            // Act
            var response = await _client.GetAsync("/Employee/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<Employee>>(content);

            Assert.NotNull(result);
            Assert.True(result.Count >= 2); // There might be more than 2 because of the authenticated user
            // Check for expected employees
            Assert.Contains(result, e => e.last_name == "Smith" && e.first_name == "John" && e.second_name == "A" && e.pin == "12345");
            Assert.Contains(result, e => e.last_name == "Doe" && e.first_name == "Jane" && e.second_name == "B" && e.pin == "67890");
        }

        [Fact]
        public async Task GetAllRegister_ReturnsOkResponse()
        {
            // Arrange - Create employees with registrar role
            var (employeeId1, _) = CreateEmployeeWithRole("Green", "Tom", "C", "11111", "registrar");
            var (employeeId2, _) = CreateEmployeeWithRole("Black", "Sarah", "D", "22222", "registrar");
            CreateEmployeeWithRole("White", "Bob", "E", "33333", "employee"); // Not a registrar

            // Act
            var response = await _client.GetAsync("/Employee/GetAllRegister");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<Employee>>(content);

            Assert.NotNull(result);
            Assert.True(result.Count >= 2); // At least 2 registrars (could include test auth user)
            // Should include employees with registrar role
            Assert.Contains(result, e => e.last_name == "Green" && e.first_name == "Tom");
            Assert.Contains(result, e => e.last_name == "Black" && e.first_name == "Sarah");
            Assert.DoesNotContain(result, e => e.last_name == "White" && e.first_name == "Bob");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test employee
            var id = CreateEmployee("Johnson", "Robert", "F", "54321");

            // Act
            var response = await _client.GetAsync($"/Employee/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Employee>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Johnson", result.last_name);
            Assert.Equal("Robert", result.first_name);
            Assert.Equal("F", result.second_name);
            Assert.Equal("54321", result.pin);
        }

        [Fact]
        public async Task GetByUserId_ReturnsOkResponse()
        {
            // Arrange - Create test employee with user_id
            var userId = CreateUser();
            var employeeId = CreateEmployeeWithUserId("Anderson", "Jack", "G", "99999", userId.ToString());

            // Act
            var response = await _client.GetAsync($"/Employee/GetByUserId?userId={userId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Employee>(content);

            Assert.NotNull(result);
            Assert.Equal(employeeId, result.id);
            Assert.Equal("Anderson", result.last_name);
            Assert.Equal("Jack", result.first_name);
            Assert.Equal("G", result.second_name);
            Assert.Equal("99999", result.pin);
            Assert.Equal(userId.ToString(), result.user_id);
        }

        [Fact]
        public async Task GetOneByUserId_ReturnsOkResponse()
        {
            // Arrange - Create test employee with email
            var email = "test.employee@example.com";
            var employeeId = CreateEmployeeWithEmail("Taylor", "Emma", "H", "77777", email);

            // Act
            var response = await _client.GetAsync($"/Employee/GetOneByUserId?email={email}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Employee>(content);

            Assert.NotNull(result);
            Assert.Equal(employeeId, result.id);
            Assert.Equal("Taylor", result.last_name);
            Assert.Equal("Emma", result.first_name);
            Assert.Equal("H", result.second_name);
            Assert.Equal("77777", result.pin);
            Assert.Equal(email, result.email);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple test employees
            for (int i = 1; i <= 10; i++)
            {
                CreateEmployee($"Last{i}", $"First{i}", $"Mid{i}", $"PIN{i}");
            }

            // Act
            var response = await _client.GetAsync("/Employee/GetPaginated?pageSize=5&pageNumber=2");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedList<Employee>>(content);

            Assert.NotNull(result);
            Assert.Equal(5, result.Items.Count);
        }

        [Fact]
        public async Task GetUser_ReturnsOkResponse()
        {
            var employeeId = DatabaseHelper.RunQuery<int>(_schemaName,
@"INSERT INTO employee (last_name, first_name, second_name, user_id) VALUES ('Test', 'Test', 'Test', '1') RETURNING id;");


            // Act - This now should work with our authenticated test employee
            var response = await _client.GetAsync("/Employee/GetUser");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Employee>(content);

            // Verify it's our test authenticated employee
            Assert.NotNull(result);
            Assert.Equal("Test", result.last_name);
            Assert.Equal("Test", result.first_name);
            Assert.Equal("Test", result.second_name);
        }

        [Fact]
        public async Task GetDashboardInfo_ReturnsOkResponse()
        {
            // Arrange - Add head of structures data
            var employeeId = DatabaseHelper.RunQuery<int>(_schemaName,
    @"INSERT INTO employee (last_name, first_name, second_name, user_id) VALUES ('Test', 'Test', 'Test', '1') RETURNING id;");
            SetupDashboardData();

            // Act - This now should work with our authenticated test employee
            var response = await _client.GetAsync("/Employee/GetDashboardInfo");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Employee>(content);

            // Verify it's our test authenticated employee
            Assert.NotNull(result);
            Assert.Equal(employeeId, result.id);
        }

        [Fact]
        public async Task GetEmployeeDashboardInfo_ReturnsOkResponse()
        {

            var employeeId = DatabaseHelper.RunQuery<int>(_schemaName,
    @"INSERT INTO employee (last_name, first_name, second_name, user_id) VALUES ('Test', 'Test', 'Test', '1') RETURNING id;");

            // Arrange - Add dashboard data
            SetupDashboardData();

            // Act - This now should work with our authenticated test employee
            var response = await _client.GetAsync("/Employee/GetEmployeeDashboardInfo");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Employee>(content);

            // Verify it's our test authenticated employee
            Assert.NotNull(result);
            Assert.Equal(employeeId, result.id);
        }

        private void SetupDashboardData()
        {
            // Create test structures
            var structureId = CreateStructure();

            // Add employee to structure as head
            var postId = GetPostId("head_structure");
            var empStructId = DatabaseHelper.RunQuery<int>(_schemaName, @"
        INSERT INTO employee_in_structure (employee_id, structure_id, post_id, date_start, created_at, updated_at) 
        VALUES (@employeeId, @structureId, @postId, @dateStart, @createdAt, @updatedAt) 
        RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@employeeId"] = _authenticatedEmployeeId,
                    ["@structureId"] = structureId,
                    ["@postId"] = postId,
                    ["@dateStart"] = DateTime.Now,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });

            // Create services for dashboard tests
            var serviceId = DatabaseHelper.RunQuery<int>(_schemaName, @"
        INSERT INTO service (name, code, created_at, updated_at)
        VALUES (@name, @code, @createdAt, @updatedAt)
        RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = "Test Service",
                    ["@code"] = "test_service",
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateEmployeeRequest
            {
                last_name = "Garcia",
                first_name = "Carlos",
                second_name = "J",
                pin = "12345-ABC",
                remote_id = "REM123",
                user_id = "USR123",
                email = "carlos.garcia@example.com",
                telegram = "@carlosgarcia"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/Employee/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Employee>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Garcia", result.last_name);
            Assert.Equal("Carlos", result.first_name);
            Assert.Equal("J", result.second_name);
            Assert.Equal("12345-ABC", result.pin);
            Assert.Equal("REM123", result.remote_id);
            Assert.Equal("USR123", result.user_id);
            Assert.Equal("carlos.garcia@example.com", result.email);
            Assert.Equal("@carlosgarcia", result.telegram);

            // Verify in database
            var employee = DatabaseHelper.RunQueryList<Employee>(_schemaName, @"
                SELECT id, last_name, first_name, second_name, pin, remote_id, user_id, email, telegram
                FROM employee WHERE id = @id",
                reader => new Employee
                {
                    id = reader.GetInt32(0),
                    last_name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    first_name = reader.IsDBNull(2) ? null : reader.GetString(2),
                    second_name = reader.IsDBNull(3) ? null : reader.GetString(3),
                    pin = reader.IsDBNull(4) ? null : reader.GetString(4),
                    remote_id = reader.IsDBNull(5) ? null : reader.GetString(5),
                    user_id = reader.IsDBNull(6) ? null : reader.GetString(6),
                    email = reader.IsDBNull(7) ? null : reader.GetString(7),
                    telegram = reader.IsDBNull(8) ? null : reader.GetString(8)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(employee);
            Assert.Equal(result.id, employee.id);
            Assert.Equal("Garcia", employee.last_name);
            Assert.Equal("Carlos", employee.first_name);
            Assert.Equal("J", employee.second_name);
            Assert.Equal("12345-ABC", employee.pin);
            Assert.Equal("REM123", employee.remote_id);
            Assert.Equal("USR123", employee.user_id);
            Assert.Equal("carlos.garcia@example.com", employee.email);
            Assert.Equal("@carlosgarcia", employee.telegram);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateEmployee("Wilson", "David", "K", "ABCDE");

            var request = new UpdateEmployeeRequest
            {
                id = id,
                last_name = "Wilson-Updated",
                first_name = "David-Updated",
                second_name = "K-Updated",
                pin = "ABCDE-Updated",
                remote_id = "REM456",
                user_id = "USR456",
                email = "david.wilson@example.com",
                telegram = "@davidwilson"
            };

            // Act
            var response = await _client.PutAsync("/Employee/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Employee>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Wilson-Updated", result.last_name);
            Assert.Equal("David-Updated", result.first_name);
            Assert.Equal("K-Updated", result.second_name);
            Assert.Equal("ABCDE-Updated", result.pin);
            Assert.Equal("REM456", result.remote_id);
            Assert.Equal("USR456", result.user_id);
            Assert.Equal("david.wilson@example.com", result.email);
            Assert.Equal("@davidwilson", result.telegram);

            // Verify in database
            var employee = DatabaseHelper.RunQueryList<Employee>(_schemaName, @"
                SELECT last_name, first_name, second_name, pin, remote_id, user_id, email, telegram
                FROM employee WHERE id = @id",
                reader => new Employee
                {
                    last_name = reader.IsDBNull(0) ? null : reader.GetString(0),
                    first_name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    second_name = reader.IsDBNull(2) ? null : reader.GetString(2),
                    pin = reader.IsDBNull(3) ? null : reader.GetString(3),
                    remote_id = reader.IsDBNull(4) ? null : reader.GetString(4),
                    user_id = reader.IsDBNull(5) ? null : reader.GetString(5),
                    email = reader.IsDBNull(6) ? null : reader.GetString(6),
                    telegram = reader.IsDBNull(7) ? null : reader.GetString(7)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(employee);
            Assert.Equal("Wilson-Updated", employee.last_name);
            Assert.Equal("David-Updated", employee.first_name);
            Assert.Equal("K-Updated", employee.second_name);
            Assert.Equal("ABCDE-Updated", employee.pin);
            Assert.Equal("REM456", employee.remote_id);
            Assert.Equal("USR456", employee.user_id);
            Assert.Equal("david.wilson@example.com", employee.email);
            Assert.Equal("@davidwilson", employee.telegram);
        }

        [Fact]
        public async Task UpdateInitials_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateEmployee("Brown", "Michael", "L", "XYZ123");

            var request = new UpdateInitialsEmployeeRequest
            {
                id = id,
                last_name = "Brown-Changed",
                first_name = "Michael-Changed",
                second_name = "L-Changed"
            };

            // Act
            var response = await _client.PutAsync("/Employee/UpdateInitials", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Employee>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Brown-Changed", result.last_name);
            Assert.Equal("Michael-Changed", result.first_name);
            Assert.Equal("L-Changed", result.second_name);

            // Verify in database
            var employee = DatabaseHelper.RunQueryList<Employee>(_schemaName, @"
                SELECT last_name, first_name, second_name
                FROM employee WHERE id = @id",
                reader => new Employee
                {
                    last_name = reader.IsDBNull(0) ? null : reader.GetString(0),
                    first_name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    second_name = reader.IsDBNull(2) ? null : reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(employee);
            Assert.Equal("Brown-Changed", employee.last_name);
            Assert.Equal("Michael-Changed", employee.first_name);
            Assert.Equal("L-Changed", employee.second_name);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateEmployee("Miller", "Susan", "M", "DEL123");

            // Act
            var response = await _client.DeleteAsync($"/Employee/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM employee WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task CreateUser_ReturnsOkResponse()
        {
            // Arrange - Create tables needed for AuthRepository.Create operation
            CreateRolesTable();

            // Create an employee to work with
            var employeeId = CreateEmployee("Harris", "William", "N", "USER456");

            // Setup the request
            var request = new EmployeeController.EmployeeID
            {
                id = employeeId,
                email = "william.harris@example.com"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/Employee/createUser", request);

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify employee has been updated with user_id and email
            var employee = DatabaseHelper.RunQueryList<Employee>(_schemaName, @"
                SELECT email, user_id
                FROM employee WHERE id = @id",
                reader => new Employee
                {
                    email = reader.IsDBNull(0) ? null : reader.GetString(0),
                    user_id = reader.IsDBNull(1) ? null : reader.GetString(1)
                },
                new Dictionary<string, object> { ["@id"] = employeeId }
            ).FirstOrDefault();

            Assert.NotNull(employee);
            Assert.Equal("william.harris@example.com", employee.email);
            Assert.NotNull(employee.user_id); // TestAuthRepository would have generated a user_id
        }

        private void CreateRolesTable()
        {
            // Create Role table if it doesn't exist already
            try
            {
                DatabaseHelper.RunQuery<int>(_schemaName, @"
            SELECT 1 FROM ""Role"" LIMIT 1",
                    new Dictionary<string, object>());
            }
            catch
            {
                // If the table doesn't exist, create it
                DatabaseHelper.RunQuery<int>(_schemaName, @"
            CREATE TABLE IF NOT EXISTS ""Role"" (
                id serial primary key,
                name varchar,
                code varchar,
                created_at timestamp,
                created_by integer,
                updated_at timestamp,
                updated_by integer
            )",
                    new Dictionary<string, object>());

                // Add a default role
                DatabaseHelper.RunQuery<int>(_schemaName, @"
            INSERT INTO ""Role"" (name, code, created_at, updated_at)
            VALUES (@name, @code, @createdAt, @updatedAt)",
                    new Dictionary<string, object>
                    {
                        ["@name"] = "User",
                        ["@code"] = "user",
                        ["@createdAt"] = DateTime.Now,
                        ["@updatedAt"] = DateTime.Now
                    });
            }
        }

        [Fact]
        public async Task GetContact_ReturnsOkResponse()
        {
            // Arrange - Create employee with contacts
            var employeeId = CreateEmployee("Clark", "Diana", "O", "CONT789");
            CreateUser("diana.clark@example.com", employeeId);
            CreateEmployeeContact(employeeId, "telegram", "@dianaclark", true);
            CreateEmployeeContact(employeeId, "sms", "+12345678901", true);

            // Act
            var response = await _client.GetAsync($"/Employee/getContact?id={employeeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Dictionary<string, object>>(content);

            Assert.NotNull(result);
            Assert.True(result.ContainsKey("telegram"));
            Assert.True(result.ContainsKey("sms"));
            Assert.True(result.ContainsKey("email"));
            Assert.Equal("@dianaclark", result["telegram"]);
            Assert.Equal("+12345678901", result["sms"]);
        }

        [Fact]
        public async Task GetEmployeeByToken_ReturnsOkResponse()
        {
            // Arrange - Create employee
            var employeeId = DatabaseHelper.RunQuery<int>(_schemaName,
    @"INSERT INTO employee (last_name, first_name, second_name, user_id) VALUES ('Test', 'Test', 'Test', '1') RETURNING id;");

            // Act - This now should work with our authenticated test employee
            var response = await _client.PostAsync("/Employee/GetEmployeeByToken", null);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Employee>(content);

            // Verify it's our test authenticated employee
            Assert.NotNull(result);
            Assert.Equal(employeeId, result.id);
            Assert.Equal("Test", result.last_name);
            Assert.Equal("Test", result.first_name);
            Assert.Equal("Test", result.second_name);
        }

        // Helper methods to create test data
        private int CreateEmployee(string lastName, string firstName, string secondName, string pin)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (last_name, first_name, second_name, pin, guid, created_at, updated_at) 
                VALUES (@lastName, @firstName, @secondName, @pin, @guid, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@lastName"] = lastName,
                    ["@firstName"] = firstName,
                    ["@secondName"] = secondName,
                    ["@pin"] = pin,
                    ["@guid"] = Guid.NewGuid().ToString(),
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateEmployeeWithEmail(string lastName, string firstName, string secondName, string pin, string email)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (last_name, first_name, second_name, pin, email, guid, created_at, updated_at) 
                VALUES (@lastName, @firstName, @secondName, @pin, @email, @guid, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@lastName"] = lastName,
                    ["@firstName"] = firstName,
                    ["@secondName"] = secondName,
                    ["@pin"] = pin,
                    ["@email"] = email,
                    ["@guid"] = Guid.NewGuid().ToString(),
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateEmployeeWithUserId(string lastName, string firstName, string secondName, string pin, string userId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (last_name, first_name, second_name, pin, user_id, guid, created_at, updated_at) 
                VALUES (@lastName, @firstName, @secondName, @pin, @userId, @guid, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@lastName"] = lastName,
                    ["@firstName"] = firstName,
                    ["@secondName"] = secondName,
                    ["@pin"] = pin,
                    ["@userId"] = userId,
                    ["@guid"] = Guid.NewGuid().ToString(),
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private (int employeeId, int structureEmployeeId) CreateEmployeeWithRole(string lastName, string firstName, string secondName, string pin, string roleCode)
        {
            var employeeId = CreateEmployee(lastName, firstName, secondName, pin);

            // Create structure and post with the roleCode
            var structureId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, unique_id, is_active, created_at, updated_at) 
                VALUES (@name, @uniqueId, @isActive, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = $"Test Structure {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@uniqueId"] = Guid.NewGuid().ToString(),
                    ["@isActive"] = true,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });

            var postId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO structure_post (name, code, created_at, updated_at) 
                VALUES (@name, @code, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = $"Test Post {roleCode}",
                    ["@code"] = roleCode,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });

            // Link employee to structure with the post
            var employeeInStructureId = DatabaseHelper.RunQuery<int>(_schemaName, @"
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

            return (employeeId, employeeInStructureId);
        }

        private int CreateUser(string email = null, int? employeeId = null)
        {
            var userId = Guid.NewGuid().ToString();

            var userDbId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""User"" (""userId"", email, password_hash, created_at, updated_at) 
                VALUES (@userId, @email, @passwordHash, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@userId"] = userId,
                    ["@email"] = email ?? $"user_{Guid.NewGuid().ToString().Substring(0, 8)}@example.com",
                    ["@passwordHash"] = "test-hash", // Add a mock password hash
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });

            if (employeeId.HasValue)
            {
                // Update employee with user_id
                DatabaseHelper.RunQuery<int>(_schemaName, @"
                    UPDATE employee SET user_id = @userId WHERE id = @employeeId",
                    new Dictionary<string, object>
                    {
                        ["@userId"] = userId,
                        ["@employeeId"] = employeeId.Value
                    });
            }

            return userDbId;
        }

        private void CreateEmployeeContact(int employeeId, string contactTypeCode, string value, bool allowNotification)
        {
            // Get or create contact type
            var contactTypeId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT id FROM contact_type WHERE code = @code LIMIT 1;",
                new Dictionary<string, object> { ["@code"] = contactTypeCode });

            if (contactTypeId == 0)
            {
                contactTypeId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO contact_type (name, description, code, created_at, updated_at) 
                    VALUES (@name, @description, @code, @createdAt, @updatedAt) 
                    RETURNING id;",
                    new Dictionary<string, object>
                    {
                        ["@name"] = contactTypeCode.ToUpper(),
                        ["@description"] = $"Contact type for {contactTypeCode}",
                        ["@code"] = contactTypeCode,
                        ["@createdAt"] = DateTime.Now,
                        ["@updatedAt"] = DateTime.Now
                    });
            }

            // Create employee contact
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee_contact (employee_id, type_id, value, allow_notification, created_at, updated_at) 
                VALUES (@employeeId, @typeId, @value, @allowNotification, @createdAt, @updatedAt);",
                new Dictionary<string, object>
                {
                    ["@employeeId"] = employeeId,
                    ["@typeId"] = contactTypeId,
                    ["@value"] = value,
                    ["@allowNotification"] = allowNotification,
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