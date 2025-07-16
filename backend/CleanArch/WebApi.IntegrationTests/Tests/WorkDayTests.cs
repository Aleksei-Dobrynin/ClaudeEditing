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
    public class WorkDayTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public WorkDayTests()
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
            // Arrange - Create test work days
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM work_day WHERE id > 0;");
            var scheduleId = CreateWorkSchedule("Test Schedule", true, 2025);
            CreateWorkDay(1, DateTime.Now.AddHours(9), DateTime.Now.AddHours(18), scheduleId);
            CreateWorkDay(2, DateTime.Now.AddHours(9).AddDays(1), DateTime.Now.AddHours(18).AddDays(1), scheduleId);

            // Act
            var response = await _client.GetAsync("/WorkDay/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<WorkDay>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test work day
            var scheduleId = CreateWorkSchedule("Single Schedule", true, 2025);
            var startTime = DateTime.Now.AddHours(9);
            var endTime = DateTime.Now.AddHours(18);
            var id = CreateWorkDay(1, startTime, endTime, scheduleId);

            // Act
            var response = await _client.GetAsync($"/WorkDay/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkDay>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(1, result.week_number);
            Assert.Equal(scheduleId, result.schedule_id);

            // Compare only date parts due to potential timezone issues in serialization
            Assert.Equal(startTime.Date, result.time_start?.Date);
            Assert.Equal(endTime.Date, result.time_end?.Date);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var scheduleId = CreateWorkSchedule("Create Schedule", true, 2025);
            var startTime = DateTime.Now.AddHours(9);
            var endTime = DateTime.Now.AddHours(18);

            var request = new CreateWorkDayRequest
            {
                week_number = 3,
                time_start = startTime,
                time_end = endTime,
                schedule_id = scheduleId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/WorkDay", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkDay>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(3, result.week_number);
            Assert.Equal(scheduleId, result.schedule_id);

            // Compare only date parts due to potential timezone issues in serialization
            Assert.Equal(startTime.Date, result.time_start?.Date);
            Assert.Equal(endTime.Date, result.time_end?.Date);

            // Verify in database
            var workDay = DatabaseHelper.RunQueryList<WorkDay>(_schemaName, @"
                SELECT id, week_number, time_start, time_end, schedule_id
                FROM work_day 
                WHERE id = @id",
                reader => new WorkDay
                {
                    id = reader.GetInt32(0),
                    week_number = reader.GetInt32(1),
                    time_start = reader.IsDBNull(2) ? null : reader.GetDateTime(2),
                    time_end = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    schedule_id = reader.GetInt32(4)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(workDay);
            Assert.Equal(3, workDay.week_number);
            Assert.Equal(scheduleId, workDay.schedule_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var scheduleId = CreateWorkSchedule("Update Schedule", true, 2025);
            var startTime = DateTime.Now.AddHours(9);
            var endTime = DateTime.Now.AddHours(18);
            var id = CreateWorkDay(1, startTime, endTime, scheduleId);

            var newStartTime = DateTime.Now.AddHours(10);
            var newEndTime = DateTime.Now.AddHours(19);

            var request = new UpdateWorkDayRequest
            {
                id = id,
                week_number = 2,
                time_start = newStartTime,
                time_end = newEndTime,
                schedule_id = scheduleId
            };

            // Act
            var response = await _client.PutAsync($"/WorkDay/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkDay>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(2, result.week_number);
            Assert.Equal(scheduleId, result.schedule_id);

            // Verify in database
            var workDay = DatabaseHelper.RunQueryList<WorkDay>(_schemaName, @"
                SELECT week_number, time_start, time_end, schedule_id
                FROM work_day 
                WHERE id = @id",
                reader => new WorkDay
                {
                    week_number = reader.GetInt32(0),
                    time_start = reader.IsDBNull(1) ? null : reader.GetDateTime(1),
                    time_end = reader.IsDBNull(2) ? null : reader.GetDateTime(2),
                    schedule_id = reader.GetInt32(3)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(workDay);
            Assert.Equal(2, workDay.week_number);
            Assert.Equal(scheduleId, workDay.schedule_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var scheduleId = CreateWorkSchedule("Delete Schedule", true, 2025);
            var startTime = DateTime.Now.AddHours(9);
            var endTime = DateTime.Now.AddHours(18);
            var id = CreateWorkDay(1, startTime, endTime, scheduleId);

            // Act
            var response = await _client.DeleteAsync($"/WorkDay/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM work_day WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple work days
            var scheduleId = CreateWorkSchedule("Paginated Schedule", true, 2025);
            var startTime = DateTime.Now.AddHours(9);
            var endTime = DateTime.Now.AddHours(18);

            for (int i = 1; i <= 5; i++)
            {
                CreateWorkDay(i, startTime.AddDays(i), endTime.AddDays(i), scheduleId);
            }

            // Act
            var response = await _client.GetAsync("/WorkDay/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<WorkDay>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task GetByschedule_id_ReturnsOkResponse()
        {
            // Arrange - Create work days for specific schedule
            var scheduleId1 = CreateWorkSchedule("Schedule 1", true, 2025);
            var scheduleId2 = CreateWorkSchedule("Schedule 2", true, 2025);
            var startTime = DateTime.Now.AddHours(9);
            var endTime = DateTime.Now.AddHours(18);

            CreateWorkDay(1, startTime, endTime, scheduleId1);
            CreateWorkDay(2, startTime.AddDays(1), endTime.AddDays(1), scheduleId1);
            CreateWorkDay(3, startTime.AddDays(2), endTime.AddDays(2), scheduleId2);

            // Act
            var response = await _client.GetAsync($"/WorkDay/GetByschedule_id?schedule_id={scheduleId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<WorkDay>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(scheduleId1, item.schedule_id));
        }

        // Helper methods to create test data
        private int CreateWorkSchedule(string name, bool isActive, int year)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO work_schedule (name, is_active, year, created_at, updated_at) 
                VALUES (@name, @isActive, @year, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@isActive"] = isActive,
                    ["@year"] = year,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateWorkDay(int weekNumber, DateTime? timeStart, DateTime? timeEnd, int scheduleId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO work_day (week_number, time_start, time_end, schedule_id, created_at, updated_at) 
                VALUES (@weekNumber, @timeStart, @timeEnd, @scheduleId, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@weekNumber"] = weekNumber,
                    ["@timeStart"] = timeStart as object ?? DBNull.Value,
                    ["@timeEnd"] = timeEnd as object ?? DBNull.Value,
                    ["@scheduleId"] = scheduleId,
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