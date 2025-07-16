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
using static WebApi.Dtos.CustomSubscribtion;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class CustomSubscribtionControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public CustomSubscribtionControllerTests()
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
            var (subscriberTypeId, scheduleId, repeatTypeId, documentId) = SetupPrerequisites();

            // Create two test subscriptions
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, 1);
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, 2);

            // Act
            var response = await _client.GetAsync("/CustomSubscribtion/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomSubscribtionIncludes>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            // Verify that related entities are populated
            foreach (var subscription in result)
            {
                Assert.NotNull(subscription.idScheduleNav);
                Assert.NotNull(subscription.idSubscriberTypeNav);
                Assert.NotNull(subscription.idRepeatTypeNav);
                Assert.NotNull(subscription.idSubscribtionContactType);
            }
        }

        [Fact]
        public async Task GetByIdEmployee_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (subscriberTypeId, scheduleId, repeatTypeId, documentId) = SetupPrerequisites();

            // Create employee
            var employeeId = CreateEmployee("Test", "Employee", "test@example.com");

            // Create subscriptions for employee
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);

            // Create another subscription for different employee
            var otherEmployeeId = CreateEmployee("Other", "Employee", "other@example.com");
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, otherEmployeeId);

            // Act
            var response = await _client.GetAsync($"/CustomSubscribtion/GetByIdEmployee?id={employeeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomSubscribtionIncludes>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, subscription => Assert.Equal(employeeId, subscription.idEmployee));
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (subscriberTypeId, scheduleId, repeatTypeId, documentId) = SetupPrerequisites();
            var employeeId = CreateEmployee("Single", "Employee", "single@example.com");

            var id = CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);

            // Act
            var response = await _client.GetAsync($"/CustomSubscribtion/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomSubscribtionIncludes>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(subscriberTypeId, result.idSubscriberType);
            Assert.Equal(scheduleId, result.idSchedule);
            Assert.Equal(repeatTypeId, result.idRepeatType);
            Assert.Equal(documentId, result.idDocument);
            Assert.Equal(employeeId, result.idEmployee);

            // Verify that related entities are populated
            Assert.NotNull(result.idScheduleNav);
            Assert.NotNull(result.idSubscriberTypeNav);
            Assert.NotNull(result.idRepeatTypeNav);
            Assert.NotNull(result.idDocumentNav);
            Assert.NotNull(result.idSubscribtionContactType);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (subscriberTypeId, scheduleId, repeatTypeId, documentId) = SetupPrerequisites();
            var employeeId = CreateEmployee("Delete", "Employee", "delete@example.com");

            var id = CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);

            // Act
            var response = await _client.DeleteAsync($"/CustomSubscribtion/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deleted in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName,
                @"SELECT COUNT(*) FROM ""CustomSubscribtion"" WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);

            // Also check that the related subscription contact type was deleted
            var contactTypeExists = DatabaseHelper.RunQuery<int>(_schemaName,
                @"SELECT COUNT(*) FROM ""SubscribtionContactType"" WHERE ""idSubscribtion"" = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(1, contactTypeExists);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (subscriberTypeId, scheduleId, repeatTypeId, documentId) = SetupPrerequisites();
            var employeeId = CreateEmployee("Create", "Employee", "create@example.com");

            // Create contact type ID array for SubscribtionContactType
            var emailContactTypeId = CreateContactType("Email", "email");
            var contactTypeIds = new[] { emailContactTypeId };

            var request = new CreateCustomSubscribtionRequest
            {
                idSubscriberType = subscriberTypeId,
                idSchedule = scheduleId,
                idRepeatType = repeatTypeId,
                sendEmpty = true,
                timeStart = DateTime.Now,
                timeEnd = DateTime.Now.AddHours(1),
                monday = true,
                tuesday = true,
                wednesday = true,
                thursday = true,
                friday = true,
                saturday = false,
                sunday = false,
                dateOfMonth = 1,
                weekOfMonth = 1,
                isActive = true,
                idDocument = documentId,
                activeDateStart = DateTime.Now,
                activeDateEnd = DateTime.Now.AddDays(30),
                body = "Test body",
                title = "Test title",
                idEmployee = employeeId,
                idStructurePost = null,
                SubscribtionContactType = new SubscribtionContactType
                {
                    idTypeContact = contactTypeIds
                }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/CustomSubscribtion/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.NotEqual(0, result);

        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (subscriberTypeId, scheduleId, repeatTypeId, documentId) = SetupPrerequisites();
            var employeeId = CreateEmployee("Update", "Employee", "update@example.com");

            // Create contact type ID array for SubscribtionContactType
            var emailContactTypeId = CreateContactType("Email", "email");
            var smsContactTypeId = CreateContactType("SMS", "sms");
            var initialContactTypeIds = new[] { emailContactTypeId };
            var updatedContactTypeIds = new[] { emailContactTypeId, smsContactTypeId };

            // Create initial subscription
            var id = CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);

            // Also create subscription contact type
            CreateSubscriptionContactType(id, initialContactTypeIds);

            var request = new UpdateCustomSubscribtionRequest
            {
                id = id,
                idSubscriberType = subscriberTypeId,
                idSchedule = scheduleId,
                idRepeatType = repeatTypeId,
                sendEmpty = false, // Changed
                timeStart = DateTime.Now.AddMinutes(30), // Changed
                timeEnd = DateTime.Now.AddHours(2), // Changed
                monday = true,
                tuesday = false, // Changed
                wednesday = true,
                thursday = false, // Changed
                friday = true,
                saturday = true, // Changed
                sunday = true, // Changed
                dateOfMonth = 15, // Changed
                weekOfMonth = 2, // Changed
                isActive = false, // Changed
                idDocument = documentId,
                activeDateStart = DateTime.Now.AddDays(1), // Changed
                activeDateEnd = DateTime.Now.AddDays(60), // Changed
                body = "Updated body", // Changed
                title = "Updated title", // Changed
                idEmployee = employeeId,
                idStructurePost = null,
                SubscribtionContactType = new SubscribtionContactType
                {
                    idTypeContact = updatedContactTypeIds // Changed
                }
            };

            // Act
            var response = await _client.PutAsync("/CustomSubscribtion/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = bool.Parse(content);

            Assert.True(result);

            // Verify in database
            var subscription = DatabaseHelper.RunQueryList<Domain.Entities.CustomSubscribtion>(_schemaName,
                @"SELECT * FROM ""CustomSubscribtion"" WHERE id = @id",
                reader => new Domain.Entities.CustomSubscribtion
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    sendEmpty = reader.GetBoolean(reader.GetOrdinal("sendEmpty")),
                    body = reader.GetString(reader.GetOrdinal("body")),
                    title = reader.GetString(reader.GetOrdinal("title")),
                    isActive = reader.GetBoolean(reader.GetOrdinal("isActive"))
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();

            Assert.NotNull(subscription);
            Assert.Equal("Updated body", subscription.body);
            Assert.Equal("Updated title", subscription.title);
            Assert.False(subscription.isActive);
            Assert.False(subscription.sendEmpty);

            // Verify subscription contact type was updated
            var contactType = DatabaseHelper.RunQueryList<SubscribtionContactType>(_schemaName,
                @"SELECT * FROM ""SubscribtionContactType"" WHERE ""idSubscribtion"" = @id",
                reader => new SubscribtionContactType
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    idSubscribtion = reader.GetInt32(reader.GetOrdinal("idSubscribtion")),
                    idTypeContact = reader.GetValue(reader.GetOrdinal("idTypeContact")) as int[]
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();

            Assert.NotNull(contactType);
            Assert.Contains(emailContactTypeId, contactType.idTypeContact);
            Assert.Contains(smsContactTypeId, contactType.idTypeContact);
        }

        [Fact]
        public async Task GetByidSubscriberType_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (subscriberTypeId, scheduleId, repeatTypeId, documentId) = SetupPrerequisites();
            var otherSubscriberTypeId = CreateSubscriberType("Other Subscriber Type", "other_subscriber");

            var employeeId = CreateEmployee("Subscriber", "Employee", "subscriber@example.com");

            // Create two subscriptions with the target subscriber type
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);

            // Create one with a different subscriber type
            CreateCustomSubscribtion(otherSubscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);

            // Act
            var response = await _client.GetAsync($"/CustomSubscribtion/GetByidSubscriberType?idSubscriberType={subscriberTypeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomSubscribtionIncludes>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, subscription => Assert.Equal(subscriberTypeId, subscription.idSubscriberType));
        }

        [Fact]
        public async Task GetByidSchedule_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (subscriberTypeId, scheduleId, repeatTypeId, documentId) = SetupPrerequisites();
            var otherScheduleId = CreateScheduleType("Other Schedule Type", "other_schedule");

            var employeeId = CreateEmployee("Schedule", "Employee", "schedule@example.com");

            // Create two subscriptions with the target schedule type
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);

            // Create one with a different schedule type
            CreateCustomSubscribtion(subscriberTypeId, otherScheduleId, repeatTypeId, documentId, employeeId);

            // Act
            var response = await _client.GetAsync($"/CustomSubscribtion/GetByidSchedule?idSchedule={scheduleId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomSubscribtionIncludes>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, subscription => Assert.Equal(scheduleId, subscription.idSchedule));
        }

        [Fact]
        public async Task GetByidRepeatType_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (subscriberTypeId, scheduleId, repeatTypeId, documentId) = SetupPrerequisites();
            var otherRepeatTypeId = CreateRepeatType("Other Repeat Type", "other_repeat");

            var employeeId = CreateEmployee("Repeat", "Employee", "repeat@example.com");

            // Create two subscriptions with the target repeat type
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);

            // Create one with a different repeat type
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, otherRepeatTypeId, documentId, employeeId);

            // Act
            var response = await _client.GetAsync($"/CustomSubscribtion/GetByidRepeatType?idRepeatType={repeatTypeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomSubscribtionIncludes>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, subscription => Assert.Equal(repeatTypeId, subscription.idRepeatType));
        }

        [Fact]
        public async Task GetByidDocument_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (subscriberTypeId, scheduleId, repeatTypeId, documentId) = SetupPrerequisites();
            var otherDocumentId = CreateDocumentTemplate("Other Document", "other_document_code");

            var employeeId = CreateEmployee("Document", "Employee", "document@example.com");

            // Create two subscriptions with the target document
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, documentId, employeeId);

            // Create one with a different document
            CreateCustomSubscribtion(subscriberTypeId, scheduleId, repeatTypeId, otherDocumentId, employeeId);

            // Act
            var response = await _client.GetAsync($"/CustomSubscribtion/GetByidDocument?idDocument={documentId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomSubscribtionIncludes>>(content);

            Assert.NotNull(result);
            Assert.Equal(1, result.Count);
            Assert.All(result, subscription => Assert.Equal(documentId, subscription.idDocument));
        }

        [Fact]
        public async Task Create_WithStructurePost_SetsEmployeeToNull()
        {
            // Arrange - Create test data
            var (subscriberTypeId, scheduleId, repeatTypeId, documentId) = SetupPrerequisites();
            var employeeId = CreateEmployee("Post", "Employee", "post@example.com");
            var structurePostId = CreateStructurePost("Test Post", "test_post");

            // Create contact type ID array for SubscribtionContactType
            var emailContactTypeId = CreateContactType("Email", "email");
            var contactTypeIds = new[] { emailContactTypeId };

            var request = new CreateCustomSubscribtionRequest
            {
                idSubscriberType = subscriberTypeId,
                idSchedule = scheduleId,
                idRepeatType = repeatTypeId,
                sendEmpty = true,
                timeStart = DateTime.Now,
                timeEnd = DateTime.Now.AddHours(1),
                monday = true,
                tuesday = true,
                wednesday = true,
                thursday = true,
                friday = true,
                saturday = false,
                sunday = false,
                dateOfMonth = 1,
                weekOfMonth = 1,
                isActive = true,
                idDocument = documentId,
                activeDateStart = DateTime.Now,
                activeDateEnd = DateTime.Now.AddDays(30),
                body = "Test body",
                title = "Test title",
                idEmployee = employeeId, // This should be ignored/set to null
                SubscribtionContactType = new SubscribtionContactType
                {
                    idTypeContact = contactTypeIds
                }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/CustomSubscribtion/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.NotEqual(0, result);

            // Verify in database that employee_id is null and structure_post_id is set
            var subscription = DatabaseHelper.RunQueryList<Domain.Entities.CustomSubscribtion>(_schemaName,
                @"SELECT ""idEmployee"", ""idStructurePost"" FROM ""CustomSubscribtion"" WHERE id = @id",
                reader => new Domain.Entities.CustomSubscribtion
                {
                    idEmployee = reader.IsDBNull(reader.GetOrdinal("idEmployee")) ? null : (int?)reader.GetInt32(reader.GetOrdinal("idEmployee")),
                    idStructurePost = reader.IsDBNull(reader.GetOrdinal("idStructurePost")) ? null : (int?)reader.GetInt32(reader.GetOrdinal("idStructurePost"))
                },
                new Dictionary<string, object> { ["@id"] = result }).FirstOrDefault();

            Assert.NotNull(subscription);
            Assert.Equal(employeeId, subscription.idEmployee);
            Assert.Null(subscription.idStructurePost);
        }

        // Helper methods to set up test data

        private (int subscriberTypeId, int scheduleId, int repeatTypeId, int documentId) SetupPrerequisites()
        {
            var subscriberTypeId = CreateSubscriberType("Test Subscriber Type", "test_subscriber");
            var scheduleId = CreateScheduleType("Test Schedule Type", "test_schedule");
            var repeatTypeId = CreateRepeatType("Test Repeat Type", "test_repeat");
            var documentId = CreateDocumentTemplate("Test Document", "test_document_code");

            return (subscriberTypeId, scheduleId, repeatTypeId, documentId);
        }

        private int CreateSubscriberType(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""SubscriberType"" (name, code, description, created_at, updated_at) 
                VALUES (@name, @code, @description, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = $"Description for {name}",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateScheduleType(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""ScheduleType"" (name, code, description, created_at, updated_at) 
                VALUES (@name, @code, @description, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = $"Description for {name}",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateRepeatType(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""RepeatType"" (name, code, description, ""isPeriod"", ""repeatIntervalMinutes"", created_at, updated_at) 
                VALUES (@name, @code, @description, @isPeriod, @repeatIntervalMinutes, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = $"Description for {name}",
                    ["@isPeriod"] = true,
                    ["@repeatIntervalMinutes"] = 60,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDocumentTemplateType()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplateType"" (name, code, description, created_at, updated_at) 
                VALUES (@name, @code, @description, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = "Test Document Type",
                    ["@code"] = "test_doc_type",
                    ["@description"] = "Description for Test Document Type",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDocumentTemplate(string name, string code)
        {
            var typeId = CreateDocumentTemplateType();

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplate"" (name, code, description, ""idDocumentType"", created_at, updated_at) 
                VALUES (@name, @code, @description, @idDocumentType, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = $"Description for {name}",
                    ["@idDocumentType"] = typeId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateEmployee(string lastName, string firstName, string email)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (last_name, first_name, email, user_id, guid) 
                VALUES (@lastName, @firstName, @email, @userId, @guid) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@lastName"] = lastName,
                    ["@firstName"] = firstName,
                    ["@email"] = email,
                    ["@userId"] = Guid.NewGuid().ToString(),
                    ["@guid"] = Guid.NewGuid().ToString()
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

        private int CreateContactType(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO contact_type (name, code, created_at, updated_at)
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

        private void CreateSubscriptionContactType(int subscriptionId, int[] contactTypeIds)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""SubscribtionContactType"" (""idSubscribtion"", ""idTypeContact"")
                VALUES (@idSubscribtion, @idTypeContact)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@idSubscribtion"] = subscriptionId,
                    ["@idTypeContact"] = contactTypeIds
                });
        }

        private int CreateCustomSubscribtion(int? subscriberTypeId, int? scheduleId, int? repeatTypeId, int? documentId, int employeeId)
        {
            // Create subscription
            var subscriptionId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""CustomSubscribtion"" (
                    ""idSubscriberType"", ""idSchedule"", ""idRepeatType"", 
                    ""sendEmpty"", ""timeStart"", ""timeEnd"", 
                    ""monday"", ""tuesday"", ""wednesday"", ""thursday"", ""friday"", ""saturday"", ""sunday"", 
                    ""dateOfMonth"", ""weekOfMonth"", ""isActive"", 
                    ""idDocument"", ""activeDateStart"", ""activeDateEnd"", 
                    ""body"", ""title"", ""idEmployee"", 
                    created_at, created_by, updated_at, updated_by)
                VALUES (
                    @idSubscriberType, @idSchedule, @idRepeatType, 
                    @sendEmpty, @timeStart, @timeEnd, 
                    @monday, @tuesday, @wednesday, @thursday, @friday, @saturday, @sunday, 
                    @dateOfMonth, @weekOfMonth, @isActive, 
                    @idDocument, @activeDateStart, @activeDateEnd, 
                    @body, @title, @idEmployee, 
                    @created_at, @created_by, @updated_at, @updated_by)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@idSubscriberType"] = subscriberTypeId as object ?? DBNull.Value,
                    ["@idSchedule"] = scheduleId as object ?? DBNull.Value,
                    ["@idRepeatType"] = repeatTypeId as object ?? DBNull.Value,
                    ["@sendEmpty"] = true,
                    ["@timeStart"] = DateTime.Now,
                    ["@timeEnd"] = DateTime.Now.AddHours(1),
                    ["@monday"] = true,
                    ["@tuesday"] = true,
                    ["@wednesday"] = true,
                    ["@thursday"] = true,
                    ["@friday"] = true,
                    ["@saturday"] = false,
                    ["@sunday"] = false,
                    ["@dateOfMonth"] = 1,
                    ["@weekOfMonth"] = 1,
                    ["@isActive"] = true,
                    ["@idDocument"] = documentId as object ?? DBNull.Value,
                    ["@activeDateStart"] = DateTime.Now,
                    ["@activeDateEnd"] = DateTime.Now.AddDays(30),
                    ["@body"] = $"Test body for subscription {employeeId}",
                    ["@title"] = $"Test title for subscription {employeeId}",
                    ["@idEmployee"] = employeeId,
                    ["@created_at"] = DateTime.Now,
                    ["@created_by"] = 1,
                    ["@updated_at"] = DateTime.Now,
                    ["@updated_by"] = 1
                });

            // Create subscription contact type
            var contactTypeId = CreateContactType("Email", "email");
            CreateSubscriptionContactType(subscriptionId, new[] { contactTypeId });

            return subscriptionId;
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}