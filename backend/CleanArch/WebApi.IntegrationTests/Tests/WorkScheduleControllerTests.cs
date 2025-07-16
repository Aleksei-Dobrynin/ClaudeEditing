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
    public class WorkScheduleControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public WorkScheduleControllerTests()
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
            // Arrange - Create test work schedules
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM work_schedule WHERE id > 0;");
            CreateWorkSchedule("Test Schedule 1", true, 2024);
            CreateWorkSchedule("Test Schedule 2", false, 2025);

            // Act
            var response = await _client.GetAsync("/WorkSchedule/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<WorkSchedule>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, s => s.name == "Test Schedule 1" && s.is_active == true && s.year == 2024);
            Assert.Contains(result, s => s.name == "Test Schedule 2" && s.is_active == false && s.year == 2025);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test work schedule
            var id = CreateWorkSchedule("Single Schedule", true, 2026);

            // Act
            var response = await _client.GetAsync($"/WorkSchedule/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkSchedule>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Schedule", result.name);
            Assert.True(result.is_active);
            Assert.Equal(2026, result.year);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateWorkScheduleRequest
            {
                name = "New Schedule",
                is_active = true,
                year = 2027
            };

            // Act
            var response = await _client.PostAsJsonAsync("/WorkSchedule", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkSchedule>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Schedule", result.name);
            Assert.True(result.is_active);
            Assert.Equal(2027, result.year);

            // Verify in database
            var schedule = DatabaseHelper.RunQueryList<WorkSchedule>(_schemaName, @"
                SELECT id, name, is_active, year FROM work_schedule WHERE id = @id",
                reader => new WorkSchedule
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    is_active = reader.GetBoolean(2),
                    year = reader.GetInt32(3)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(schedule);
            Assert.Equal(result.id, schedule.id);
            Assert.Equal("New Schedule", schedule.name);
            Assert.True(schedule.is_active);
            Assert.Equal(2027, schedule.year);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateWorkSchedule("Schedule To Update", false, 2029);

            var request = new UpdateWorkScheduleRequest
            {
                id = id,
                name = "Updated Schedule",
                is_active = true,
                year = 2030
            };

            // Act
            var response = await _client.PutAsync($"/WorkSchedule/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkSchedule>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Schedule", result.name);
            Assert.True(result.is_active);
            Assert.Equal(2030, result.year);

            // Verify in database
            var schedule = DatabaseHelper.RunQueryList<WorkSchedule>(_schemaName, @"
                SELECT name, is_active, year FROM work_schedule WHERE id = @id",
                reader => new WorkSchedule
                {
                    name = reader.GetString(0),
                    is_active = reader.GetBoolean(1),
                    year = reader.GetInt32(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(schedule);
            Assert.Equal("Updated Schedule", schedule.name);
            Assert.True(schedule.is_active);
            Assert.Equal(2030, schedule.year);
        }

        [Fact]
        public async Task Update_WithDuplicateActiveYear_ReturnsBadRequest()
        {
            // Arrange - Create two schedules
            CreateWorkSchedule("Existing Active", true, 2031);
            var idToUpdate = CreateWorkSchedule("Schedule To Update", false, 2032);

            var request = new UpdateWorkScheduleRequest
            {
                id = idToUpdate,
                name = "Trying Duplicate Year",
                is_active = true,
                year = 2031
            };

            // Act
            var response = await _client.PutAsync($"/WorkSchedule/{idToUpdate}", JsonContent.Create(request));

            // Assert
            Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateWorkSchedule("Schedule To Delete", false, 2033);

            // Act
            var response = await _client.DeleteAsync($"/WorkSchedule/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            int deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM work_schedule WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM work_schedule WHERE id > 0;");
            
            // Arrange - Create several test schedules
            for (int i = 1; i <= 5; i++)
            {
                CreateWorkSchedule($"Paginated Schedule {i}", i % 2 == 0, 2033 + i);
            }

            // Act
            var response = await _client.GetAsync("/WorkSchedule/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<WorkSchedule>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        // Helper method to create test work schedule
        private int CreateWorkSchedule(string name, bool isActive, int year)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO work_schedule (name, is_active, year, created_at, updated_at) 
                VALUES (@name, @is_active, @year, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@is_active"] = isActive,
                    ["@year"] = year,
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