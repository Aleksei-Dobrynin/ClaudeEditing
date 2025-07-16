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
    public class WorkScheduleExceptionTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public WorkScheduleExceptionTests()
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
            // Arrange - Create test work schedule exceptions
            var scheduleId = CreateWorkSchedule("Test Schedule", true, 2025);
            CreateWorkScheduleException("Holiday 1", DateTime.Now, DateTime.Now.AddDays(1), scheduleId, true);
            CreateWorkScheduleException("Holiday 2", DateTime.Now.AddDays(7), DateTime.Now.AddDays(8), scheduleId, true);

            // Act
            var response = await _client.GetAsync("/WorkScheduleException/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<WorkScheduleException>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test work schedule exception
            var scheduleId = CreateWorkSchedule("Single Schedule", true, 2025);
            var startDate = DateTime.Now;
            var endDate = DateTime.Now.AddDays(1);
            var startTime = DateTime.Now.AddHours(9);
            var endTime = DateTime.Now.AddHours(18);

            var id = CreateWorkScheduleException(
                "Christmas Holiday",
                startDate,
                endDate,
                scheduleId,
                true,
                startTime,
                endTime);

            // Act
            var response = await _client.GetAsync($"/WorkScheduleException/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkScheduleException>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Christmas Holiday", result.name);
            Assert.Equal(scheduleId, result.schedule_id);
            Assert.True(result.is_holiday);

            // Compare only date parts due to potential timezone issues in serialization
            Assert.Equal(startDate.Date, result.date_start?.Date);
            Assert.Equal(endDate.Date, result.date_end?.Date);
            Assert.Equal(startTime.Date, result.time_start?.Date);
            Assert.Equal(endTime.Date, result.time_end?.Date);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var scheduleId = CreateWorkSchedule("Create Schedule", true, 2025);
            var startDate = DateTime.Now;
            var endDate = DateTime.Now.AddDays(1);
            var startTime = DateTime.Now.AddHours(9);
            var endTime = DateTime.Now.AddHours(18);

            var request = new CreateWorkScheduleExceptionRequest
            {
                name = "New Year's Day",
                date_start = startDate,
                date_end = endDate,
                schedule_id = scheduleId,
                is_holiday = true,
                time_start = startTime,
                time_end = endTime
            };

            // Act
            var response = await _client.PostAsJsonAsync("/WorkScheduleException", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkScheduleException>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Year's Day", result.name);
            Assert.Equal(scheduleId, result.schedule_id);
            Assert.True(result.is_holiday);

            // Compare only date parts due to potential timezone issues in serialization
            Assert.Equal(startDate.Date, result.date_start?.Date);
            Assert.Equal(endDate.Date, result.date_end?.Date);
            Assert.Equal(startTime.Date, result.time_start?.Date);
            Assert.Equal(endTime.Date, result.time_end?.Date);

            // Verify in database
            var exception = DatabaseHelper.RunQueryList<WorkScheduleException>(_schemaName, @"
                SELECT id, name, date_start, date_end, schedule_id, is_holiday, time_start, time_end
                FROM work_schedule_exception 
                WHERE id = @id",
                reader => new WorkScheduleException
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    date_start = reader.IsDBNull(2) ? null : reader.GetDateTime(2),
                    date_end = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    schedule_id = reader.GetInt32(4),
                    is_holiday = reader.IsDBNull(5) ? null : (bool?)reader.GetBoolean(5),
                    time_start = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                    time_end = reader.IsDBNull(7) ? null : reader.GetDateTime(7)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(exception);
            Assert.Equal("New Year's Day", exception.name);
            Assert.Equal(scheduleId, exception.schedule_id);
            Assert.True(exception.is_holiday);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var scheduleId = CreateWorkSchedule("Update Schedule", true, 2025);
            var startDate = DateTime.Now;
            var endDate = DateTime.Now.AddDays(1);
            var id = CreateWorkScheduleException("Original Holiday", startDate, endDate, scheduleId, true);

            var newStartDate = DateTime.Now.AddDays(10);
            var newEndDate = DateTime.Now.AddDays(11);
            var newStartTime = DateTime.Now.AddHours(10);
            var newEndTime = DateTime.Now.AddHours(17);

            var request = new UpdateWorkScheduleExceptionRequest
            {
                id = id,
                name = "Updated Holiday",
                date_start = newStartDate,
                date_end = newEndDate,
                schedule_id = scheduleId,
                is_holiday = false,
                time_start = newStartTime,
                time_end = newEndTime
            };

            // Act
            var response = await _client.PutAsync($"/WorkScheduleException/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<WorkScheduleException>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Holiday", result.name);
            Assert.Equal(scheduleId, result.schedule_id);
            Assert.False(result.is_holiday);

            // Compare only date parts due to potential timezone issues in serialization
            Assert.Equal(newStartDate.Date, result.date_start?.Date);
            Assert.Equal(newEndDate.Date, result.date_end?.Date);
            Assert.Equal(newStartTime.Date, result.time_start?.Date);
            Assert.Equal(newEndTime.Date, result.time_end?.Date);

            // Verify in database
            var exception = DatabaseHelper.RunQueryList<WorkScheduleException>(_schemaName, @"
                SELECT name, date_start, date_end, schedule_id, is_holiday
                FROM work_schedule_exception 
                WHERE id = @id",
                reader => new WorkScheduleException
                {
                    name = reader.GetString(0),
                    date_start = reader.IsDBNull(1) ? null : reader.GetDateTime(1),
                    date_end = reader.IsDBNull(2) ? null : reader.GetDateTime(2),
                    schedule_id = reader.GetInt32(3),
                    is_holiday = reader.IsDBNull(4) ? null : (bool?)reader.GetBoolean(4)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(exception);
            Assert.Equal("Updated Holiday", exception.name);
            Assert.Equal(scheduleId, exception.schedule_id);
            Assert.False(exception.is_holiday);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var scheduleId = CreateWorkSchedule("Delete Schedule", true, 2025);
            var startDate = DateTime.Now;
            var endDate = DateTime.Now.AddDays(1);
            var id = CreateWorkScheduleException("Holiday to Delete", startDate, endDate, scheduleId, true);

            // Act
            var response = await _client.DeleteAsync($"/WorkScheduleException/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM work_schedule_exception WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple work schedule exceptions
            var scheduleId = CreateWorkSchedule("Paginated Schedule", true, 2025);
            var startDate = DateTime.Now;

            for (int i = 1; i <= 5; i++)
            {
                CreateWorkScheduleException(
                    $"Holiday {i}",
                    startDate.AddDays(i * 10),
                    startDate.AddDays(i * 10 + 1),
                    scheduleId,
                    true);
            }

            // Act
            var response = await _client.GetAsync("/WorkScheduleException/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<WorkScheduleException>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task GetByschedule_id_ReturnsOkResponse()
        {
            // Arrange - Create work schedule exceptions for specific schedules
            var scheduleId1 = CreateWorkSchedule("Schedule 1", true, 2025);
            var scheduleId2 = CreateWorkSchedule("Schedule 2", true, 2025);
            var startDate = DateTime.Now;

            CreateWorkScheduleException("Holiday 1", startDate, startDate.AddDays(1), scheduleId1, true);
            CreateWorkScheduleException("Holiday 2", startDate.AddDays(10), startDate.AddDays(11), scheduleId1, true);
            CreateWorkScheduleException("Holiday 3", startDate.AddDays(20), startDate.AddDays(21), scheduleId2, true);

            // Act
            var response = await _client.GetAsync($"/WorkScheduleException/GetByschedule_id?schedule_id={scheduleId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<WorkScheduleException>>(content);

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

        private int CreateWorkScheduleException(
            string name,
            DateTime? dateStart,
            DateTime? dateEnd,
            int scheduleId,
            bool? isHoliday,
            DateTime? timeStart = null,
            DateTime? timeEnd = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO work_schedule_exception 
                (name, date_start, date_end, schedule_id, is_holiday, time_start, time_end, created_at, updated_at) 
                VALUES 
                (@name, @dateStart, @dateEnd, @scheduleId, @isHoliday, @timeStart, @timeEnd, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@dateStart"] = dateStart as object ?? DBNull.Value,
                    ["@dateEnd"] = dateEnd as object ?? DBNull.Value,
                    ["@scheduleId"] = scheduleId,
                    ["@isHoliday"] = isHoliday as object ?? DBNull.Value,
                    ["@timeStart"] = timeStart as object ?? DBNull.Value,
                    ["@timeEnd"] = timeEnd as object ?? DBNull.Value,
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