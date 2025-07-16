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
    public class EmployeeEventTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public EmployeeEventTests()
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
            var eventTypeId = CreateEventType("Vacation", "vacation", "Employee vacation");
            var employeeId = CreateEmployee("John", "Doe", "Smith");

            // Create employee events
            CreateEmployeeEvent(DateTime.Now, DateTime.Now.AddDays(7), eventTypeId, employeeId);
            CreateEmployeeEvent(DateTime.Now.AddDays(30), DateTime.Now.AddDays(35), eventTypeId, employeeId);

            // Act
            var response = await _client.GetAsync("/EmployeeEvent/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<EmployeeEvent>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var eventTypeId = CreateEventType("Sick Leave", "sick_leave", "Employee sick leave");
            var employeeId = CreateEmployee("Jane", "Smith", "Doe");
            var startDate = DateTime.Now;
            var endDate = DateTime.Now.AddDays(3);

            var id = CreateEmployeeEvent(startDate, endDate, eventTypeId, employeeId);

            // Act
            var response = await _client.GetAsync($"/EmployeeEvent/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<EmployeeEvent>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(employeeId, result.employee_id);
            Assert.Equal(eventTypeId, result.event_type_id);
            Assert.Equal(startDate.Date, result.date_start?.Date);
            Assert.Equal(endDate.Date, result.date_end?.Date);
        }

        [Fact]
        public async Task GetByIDEmployee_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var eventTypeId = CreateEventType("Business Trip", "business_trip", "Employee business trip");
            var employeeId = CreateEmployee("Employee", "With", "Events");
            var otherEmployeeId = CreateEmployee("Other", "Employee", "NoEvents");

            // Create events for the first employee
            CreateEmployeeEvent(DateTime.Now, DateTime.Now.AddDays(5), eventTypeId, employeeId);
            CreateEmployeeEvent(DateTime.Now.AddMonths(1), DateTime.Now.AddMonths(1).AddDays(3), eventTypeId, employeeId);

            // Create event for the other employee
            CreateEmployeeEvent(DateTime.Now, DateTime.Now.AddDays(2), eventTypeId, otherEmployeeId);

            // Act
            var response = await _client.GetAsync($"/EmployeeEvent/GetByIDEmployee?idEmployee={employeeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<EmployeeEvent>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, evt => Assert.Equal(employeeId, evt.employee_id));
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var eventTypeId = CreateEventType("Training", "training", "Employee training");
            var employeeId = CreateEmployee("Create", "Event", "Test");
            var temporaryEmployeeId = CreateEmployee("Temporary", "Employee", "Test");

            var startDate = DateTime.Now.AddDays(10);
            var endDate = DateTime.Now.AddDays(15);

            var request = new CreateEmployeeEventRequest
            {
                date_start = startDate,
                date_end = endDate,
                event_type_id = eventTypeId,
                employee_id = employeeId,
                temporary_employee_id = temporaryEmployeeId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/EmployeeEvent/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<EmployeeEvent>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(employeeId, result.employee_id);
            Assert.Equal(eventTypeId, result.event_type_id);
            Assert.Equal(startDate.Date, result.date_start?.Date);
            Assert.Equal(endDate.Date, result.date_end?.Date);

            // Verify in database
            var created = DatabaseHelper.RunQueryList<EmployeeEvent>(_schemaName, @"
                SELECT id, date_start, date_end, event_type_id, employee_id
                FROM employee_event WHERE id = @id",
                reader => new EmployeeEvent
                {
                    id = reader.GetInt32(0),
                    date_start = reader.GetDateTime(1),
                    date_end = reader.GetDateTime(2),
                    event_type_id = reader.GetInt32(3),
                    employee_id = reader.GetInt32(4)
                },
                new Dictionary<string, object> { ["@id"] = result.id }).FirstOrDefault();

            Assert.NotNull(created);
            Assert.Equal(startDate.Date, created.date_start?.Date);
            Assert.Equal(endDate.Date, created.date_end?.Date);

            // Verify temporary employee was added to the structure if the employee is a head
            // Note: This would require additional verification but it depends on the specific setup of the structure
            // For now, we'll just verify the event was created properly
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var eventTypeId = CreateEventType("Maternity Leave", "maternity_leave", "Employee maternity leave");
            var newEventTypeId = CreateEventType("Paternity Leave", "paternity_leave", "Employee paternity leave");
            var employeeId = CreateEmployee("Update", "Event", "Test");

            var originalStart = DateTime.Now.AddDays(5);
            var originalEnd = DateTime.Now.AddDays(15);
            var id = CreateEmployeeEvent(originalStart, originalEnd, eventTypeId, employeeId);

            var newStart = DateTime.Now.AddDays(20);
            var newEnd = DateTime.Now.AddDays(30);

            var request = new UpdateEmployeeEventRequest
            {
                id = id,
                date_start = newStart,
                date_end = newEnd,
                event_type_id = newEventTypeId,
                employee_id = employeeId
            };

            // Act
            var response = await _client.PutAsync("/EmployeeEvent/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<EmployeeEvent>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(employeeId, result.employee_id);
            Assert.Equal(newEventTypeId, result.event_type_id);
            Assert.Equal(newStart.Date, result.date_start?.Date);
            Assert.Equal(newEnd.Date, result.date_end?.Date);

            // Verify in database
            var updated = DatabaseHelper.RunQueryList<EmployeeEvent>(_schemaName, @"
                SELECT date_start, date_end, event_type_id
                FROM employee_event WHERE id = @id",
                reader => new EmployeeEvent
                {
                    date_start = reader.GetDateTime(0),
                    date_end = reader.GetDateTime(1),
                    event_type_id = reader.GetInt32(2)
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();

            Assert.NotNull(updated);
            Assert.Equal(newStart.Date, updated.date_start?.Date);
            Assert.Equal(newEnd.Date, updated.date_end?.Date);
            Assert.Equal(newEventTypeId, updated.event_type_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var eventTypeId = CreateEventType("Unpaid Leave", "unpaid_leave", "Employee unpaid leave");
            var employeeId = CreateEmployee("Delete", "Event", "Test");
            var id = CreateEmployeeEvent(DateTime.Now, DateTime.Now.AddDays(10), eventTypeId, employeeId);

            // Act
            var response = await _client.DeleteAsync($"/EmployeeEvent/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM employee_event WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var eventTypeId = CreateEventType("Remote Work", "remote_work", "Employee remote work");
            var employeeId = CreateEmployee("Paginated", "Event", "Test");

            // Create 5 events
            var baseDate = DateTime.Now;
            for (int i = 1; i <= 5; i++)
            {
                var startDate = baseDate.AddDays(i * 10);
                var endDate = startDate.AddDays(5);
                CreateEmployeeEvent(startDate, endDate, eventTypeId, employeeId);
            }

            // Act
            var response = await _client.GetAsync("/EmployeeEvent/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<EmployeeEvent>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        // Helper methods to create test data
        private int CreateEventType(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO hrms_event_type (name, code, description, created_at, updated_at) 
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

        private int CreateEmployeeEvent(DateTime startDate, DateTime endDate, int eventTypeId, int employeeId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee_event (date_start, date_end, event_type_id, employee_id, created_at, updated_at) 
                VALUES (@startDate, @endDate, @eventTypeId, @employeeId, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@startDate"] = startDate,
                    ["@endDate"] = endDate,
                    ["@eventTypeId"] = eventTypeId,
                    ["@employeeId"] = employeeId,
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