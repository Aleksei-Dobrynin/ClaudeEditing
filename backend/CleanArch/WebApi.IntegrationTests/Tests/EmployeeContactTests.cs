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
    public class EmployeeContactTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public EmployeeContactTests()
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
            var contactTypeId = CreateContactType("Test Type", "test_type", "Test Description");
            var employeeId = CreateEmployee("Test", "Employee", "Name");

            // Create employee contacts
            CreateEmployeeContact("test1@example.com", employeeId, contactTypeId, true);
            CreateEmployeeContact("test2@example.com", employeeId, contactTypeId, false);

            // Act
            var response = await _client.GetAsync("/employee_contact/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<employee_contact>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, contact => contact.value == "test1@example.com" && contact.allow_notification == true);
            Assert.Contains(result, contact => contact.value == "test2@example.com" && contact.allow_notification == false);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var contactTypeId = CreateContactType("Single Type", "single_type", "Single Type Description");
            var employeeId = CreateEmployee("Single", "Employee", "Name");
            var id = CreateEmployeeContact("single@example.com", employeeId, contactTypeId, true);

            // Act
            var response = await _client.GetAsync($"/employee_contact/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<employee_contact>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("single@example.com", result.value);
            Assert.Equal(employeeId, result.employee_id);
            Assert.Equal(contactTypeId, result.type_id);
            Assert.True(result.allow_notification);
        }

        [Fact]
        public async Task GetByIDEmployee_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var contactTypeId = CreateContactType("Employee Type", "employee_type", "Employee Type Description");
            var employeeId = CreateEmployee("Employee", "For", "Contacts");
            var otherEmployeeId = CreateEmployee("Other", "Employee", "Name");

            // Create contacts for both employees
            CreateEmployeeContact("employee1@example.com", employeeId, contactTypeId, true);
            CreateEmployeeContact("employee2@example.com", employeeId, contactTypeId, false);
            CreateEmployeeContact("other@example.com", otherEmployeeId, contactTypeId, true);

            // Act
            var response = await _client.GetAsync($"/employee_contact/GetByIDEmployee?idEmployee={employeeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<employee_contact>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, contact => Assert.Equal(employeeId, contact.employee_id));
            Assert.Contains(result, contact => contact.value == "employee1@example.com");
            Assert.Contains(result, contact => contact.value == "employee2@example.com");
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var contactTypeId = CreateContactType("Create Type", "create_type", "Create Type Description");
            var employeeId = CreateEmployee("Create", "Contact", "Test");

            var request = new Createemployee_contactRequest
            {
                value = "create@example.com",
                employee_id = employeeId,
                type_id = contactTypeId,
                allow_notification = true
            };

            // Act
            var response = await _client.PostAsJsonAsync("/employee_contact", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<employee_contact>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("create@example.com", result.value);
            Assert.Equal(employeeId, result.employee_id);
            Assert.Equal(contactTypeId, result.type_id);
            Assert.True(result.allow_notification);

            // Verify in database
            var created = DatabaseHelper.RunQueryList<employee_contact>(_schemaName, @"
                SELECT id, value, employee_id, type_id, allow_notification 
                FROM employee_contact WHERE id = @id",
                reader => new employee_contact
                {
                    id = reader.GetInt32(0),
                    value = reader.GetString(1),
                    employee_id = reader.GetInt32(2),
                    type_id = reader.GetInt32(3),
                    allow_notification = reader.GetBoolean(4)
                },
                new Dictionary<string, object> { ["@id"] = result.id }).FirstOrDefault();

            Assert.NotNull(created);
            Assert.Equal("create@example.com", created.value);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var contactTypeId = CreateContactType("Update Type", "update_type", "Update Type Description");
            var employeeId = CreateEmployee("Update", "Contact", "Test");
            var id = CreateEmployeeContact("original@example.com", employeeId, contactTypeId, false);

            var request = new Updateemployee_contactRequest
            {
                id = id,
                value = "updated@example.com",
                employee_id = employeeId,
                type_id = contactTypeId,
                allow_notification = true
            };

            // Act
            var response = await _client.PutAsync($"/employee_contact/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<employee_contact>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("updated@example.com", result.value);
            Assert.Equal(employeeId, result.employee_id);
            Assert.Equal(contactTypeId, result.type_id);
            Assert.True(result.allow_notification);

            // Verify in database
            var updated = DatabaseHelper.RunQuery<string>(_schemaName, @"
                SELECT value FROM employee_contact WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal("updated@example.com", updated);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var contactTypeId = CreateContactType("Delete Type", "delete_type", "Delete Type Description");
            var employeeId = CreateEmployee("Delete", "Contact", "Test");
            var id = CreateEmployeeContact("delete@example.com", employeeId, contactTypeId, true);

            // Act
            var response = await _client.DeleteAsync($"/employee_contact/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM employee_contact WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var contactTypeId = CreateContactType("Paginated Type", "paginated_type", "Paginated Type Description");
            var employeeId = CreateEmployee("Paginated", "Contact", "Test");

            // Create 5 contacts
            for (int i = 1; i <= 5; i++)
            {
                CreateEmployeeContact($"paginated{i}@example.com", employeeId, contactTypeId, i % 2 == 0);
            }

            // Act
            var response = await _client.GetAsync("/employee_contact/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<employee_contact>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        // Helper methods to create test data
        private int CreateContactType(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO contact_type (name, code, description, created_at, updated_at) 
                VALUES (@name, @code, @description, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
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

        private int CreateEmployeeContact(string value, int employeeId, int typeId, bool allowNotification)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee_contact (value, employee_id, type_id, allow_notification, created_at, updated_at) 
                VALUES (@value, @employeeId, @typeId, @allowNotification, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@value"] = value,
                    ["@employeeId"] = employeeId,
                    ["@typeId"] = typeId,
                    ["@allowNotification"] = allowNotification,
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