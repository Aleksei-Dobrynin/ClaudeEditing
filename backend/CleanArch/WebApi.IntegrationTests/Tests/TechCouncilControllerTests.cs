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
using System.IO;
using System.Text;
using System.Net.Http.Headers;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class TechCouncilControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public TechCouncilControllerTests()
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
            var structureId = CreateOrgStructure("Test Structure");
            var applicationId = CreateApplication();

            CreateTechCouncil(structureId, applicationId);
            CreateTechCouncil(structureId, applicationId);

            // Act
            var response = await _client.GetAsync("/TechCouncil/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<TechCouncil>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetTable_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Test Structure");
            var applicationId = CreateApplication();
            var customerId = CreateCustomer("Test Customer");
            var decisionTypeId = CreateDecisionType("Test Decision Type");
            var techDecisionId = CreateTechDecision("Test Tech Decision");

            // Update application with customer and tech decision
            UpdateApplication(applicationId, customerId, techDecisionId);

            // Create tech council with decision type
            var techCouncilId = CreateTechCouncil(structureId, applicationId, null, decisionTypeId);

            // Act
            var response = await _client.GetAsync("/TechCouncil/GetTable");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<TechCouncilTable>>(content);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(applicationId, result[0].application_id);
            Assert.NotNull(result[0].details);
        }

        [Fact]
        public async Task GetTableBySession_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Test Structure");
            var applicationId = CreateApplication();
            var sessionId = CreateTechCouncilSession(DateTime.Now);

            // Create tech council with session
            var techCouncilId = CreateTechCouncil(structureId, applicationId, sessionId);

            // Act
            var response = await _client.GetAsync($"/TechCouncil/GetTableBySession?session_id={sessionId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<TechCouncilTable>>(content);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(applicationId, result[0].application_id);
        }

        [Fact]
        public async Task GetTableByStructure_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Test Structure");
            var applicationId = CreateApplication();

            // Create tech council
            var techCouncilId = CreateTechCouncil(structureId, applicationId);

            // Act
            var response = await _client.GetAsync($"/TechCouncil/GetTableByStructure?structure_id={structureId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<TechCouncilTable>>(content);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(applicationId, result[0].application_id);
        }

        [Fact]
        public async Task GetTableWithOutSession_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Test Structure");
            var applicationId = CreateApplication();

            // Create tech council without session
            var techCouncilId = CreateTechCouncil(structureId, applicationId, null);

            // Act
            var response = await _client.GetAsync("/TechCouncil/GetTableWithOutSession");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<TechCouncilTable>>(content);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(applicationId, result[0].application_id);
        }

        [Fact]
        public async Task UpdateSessionOneCase_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Test Structure");
            var applicationId = CreateApplication();
            var sessionId = CreateTechCouncilSession(DateTime.Now);

            // Create tech council without session
            var techCouncilId = CreateTechCouncil(structureId, applicationId, null);

            var request = new UpdateSessionOneCaseRequest
            {
                application_id = applicationId,
                session_id = sessionId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/TechCouncil/UpdateSessionOneCase", request);

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database that session was updated
            var techCouncil = GetTechCouncilByApplicationId(applicationId);
            Assert.Equal(sessionId, techCouncil.tech_council_session_id);
        }

        [Fact]
        public async Task UpdateSession_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Test Structure");
            var applicationId1 = CreateApplication();
            var applicationId2 = CreateApplication();
            var sessionId = CreateTechCouncilSession(DateTime.Now);

            // Create tech councils without session
            var techCouncilId1 = CreateTechCouncil(structureId, applicationId1, null);
            var techCouncilId2 = CreateTechCouncil(structureId, applicationId2, null);

            var request = new UpdateSessionRequest
            {
                application_ids = new List<int> { applicationId1, applicationId2 },
                session_id = sessionId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/TechCouncil/UpdateSession", request);

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database that sessions were updated
            var techCouncil1 = GetTechCouncilByApplicationId(applicationId1);
            var techCouncil2 = GetTechCouncilByApplicationId(applicationId2);
            Assert.Equal(sessionId, techCouncil1.tech_council_session_id);
            Assert.Equal(sessionId, techCouncil2.tech_council_session_id);
        }

        [Fact]
        public async Task GetByApplicationId_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Test Structure");
            var applicationId = CreateApplication();

            // Create two tech councils for same application
            var techCouncilId1 = CreateTechCouncil(structureId, applicationId);
            var techCouncilId2 = CreateTechCouncil(structureId, applicationId);

            // Act
            var response = await _client.GetAsync($"/TechCouncil/GetByApplicationId?application_id={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<TechCouncil>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, tc => Assert.Equal(applicationId, tc.application_id));
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var structureId = CreateOrgStructure("Test Structure");
            var applicationId = CreateApplication();
            var decision = "Test Decision";

            // Create tech council
            var techCouncilId = CreateTechCouncil(structureId, applicationId, null, null, decision);

            // Act
            var response = await _client.GetAsync($"/TechCouncil/GetOneById?id={techCouncilId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<TechCouncil>(content);

            Assert.NotNull(result);
            Assert.Equal(techCouncilId, result.id);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal(decision, result.decision);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Create Structure");
            var applicationId = CreateApplication();
            var decisionTypeId = CreateDecisionType("Create Decision Type");
            var decision = "Created Decision";

            var request = new CreateTechCouncilRequest
            {
                structure_id = structureId,
                application_id = applicationId,
                decision = decision,
                decision_type_id = decisionTypeId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/TechCouncil/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<TechCouncil>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal(decision, result.decision);
            Assert.Equal(decisionTypeId, result.decision_type_id);

            // Verify in database
            var techCouncil = GetTechCouncilById(result.id);
            Assert.Equal(structureId, techCouncil.structure_id);
            Assert.Equal(applicationId, techCouncil.application_id);
            Assert.Equal(decision, techCouncil.decision);
            Assert.Equal(decisionTypeId, techCouncil.decision_type_id);
        }

        [Fact]
        public async Task SendTo_ReturnsOkResponse()
        {
            // Arrange
            var (employeeId, employeeId2) = SetupTestData();
            var structureId1 = CreateOrgStructure("Participant Structure 1");
            var structureId2 = CreateOrgStructure("Participant Structure 2");
            var headPostId = CreateStructurePost("Head of Department", "head_structure");
            CreateEmployeeInStructure(employeeId, structureId1, headPostId, DateTime.Now.AddDays(-3));
            CreateEmployeeInStructure(employeeId2, structureId2, headPostId, DateTime.Now.AddDays(-3));

            var applicationId = CreateApplication();

            var request = new SendToTechCouncilRequest
            {
                application_id = applicationId,
                participants = new List<int> { structureId1, structureId2 }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/TechCouncil/SendTo", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var resultId = JsonConvert.DeserializeObject<int>(content);

            Assert.Equal(applicationId, resultId);

            // Verify in database that tech councils were created
            var techCouncils = GetTechCouncilsByApplicationId(applicationId);
            Assert.Equal(2, techCouncils.Count);
            Assert.Contains(techCouncils, tc => tc.structure_id == structureId1);
            Assert.Contains(techCouncils, tc => tc.structure_id == structureId2);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            DatabaseHelper.RunQuery<int>(_schemaName, @"INSERT INTO employee 
    (last_name, first_name, second_name, user_id) VALUES ('Test', 'Test', 'Test', '1') 
            RETURNING id;");
            var structureId = CreateOrgStructure("Original Structure");
            var newStructureId = CreateOrgStructure("New Structure");
            var applicationId = CreateApplication();
            var decisionTypeId = CreateDecisionType("Original Decision Type");
            var newDecisionTypeId = CreateDecisionType("New Decision Type");

            // Create tech council
            var techCouncilId = CreateTechCouncil(structureId, applicationId, null, decisionTypeId, "Original Decision");

            var request = new UpdateTechCouncilRequest
            {
                id = techCouncilId,
                structure_id = newStructureId,
                application_id = applicationId,
                decision = "Updated Decision",
                decision_type_id = newDecisionTypeId
            };

            // Act
            var response = await _client.PutAsync("/TechCouncil/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<TechCouncil>(content);

            Assert.NotNull(result);
            Assert.Equal(techCouncilId, result.id);
            Assert.Equal(newStructureId, result.structure_id);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal("Updated Decision", result.decision);
            Assert.Equal(newDecisionTypeId, result.decision_type_id);

            // Verify in database
            var techCouncil = GetTechCouncilById(techCouncilId);
            Assert.Equal(newStructureId, techCouncil.structure_id);
            Assert.Equal("Updated Decision", techCouncil.decision);
            Assert.Equal(newDecisionTypeId, techCouncil.decision_type_id);
            // Employee ID should have been set by the controller
            Assert.NotNull(techCouncil.employee_id);
        }

        [Fact]
        public async Task UpdateLegalRecords_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Legal Structure");
            var applicationId = CreateApplication();

            // Create tech council
            var techCouncilId = CreateTechCouncil(structureId, applicationId);

            // Create legal records
            var legalRecordId1 = CreateLegalRecord();
            var legalRecordId2 = CreateLegalRecord();

            // Create application legal records
            var appLegalRecordId1 = CreateApplicationLegalRecord(applicationId, legalRecordId1);
            var appLegalRecordId2 = CreateApplicationLegalRecord(applicationId, legalRecordId2);

            var request = new UpdateLegalRecordsRequest
            {
                id = techCouncilId,
                structure_id = structureId,
                application_id = applicationId,
                legal_records = new List<int> { appLegalRecordId1, appLegalRecordId2 }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/TechCouncil/UpdateLegalRecords", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UpdateLegalRecordsRequest>(content);

            Assert.NotNull(result);
            Assert.Equal(techCouncilId, result.id);
            Assert.Equal(2, result.legal_records.Count);

            // Verify in database
            var legalRecordsInCouncil = GetLegalRecordsInCouncil(techCouncilId);
            Assert.Equal(2, legalRecordsInCouncil.Count);
            Assert.Contains(legalRecordsInCouncil, lric => lric.application_legal_record_id == appLegalRecordId1);
            Assert.Contains(legalRecordsInCouncil, lric => lric.application_legal_record_id == appLegalRecordId2);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Delete Structure");
            var applicationId = CreateApplication();

            // Create tech council
            var techCouncilId = CreateTechCouncil(structureId, applicationId);

            // Act
            var response = await _client.DeleteAsync($"/TechCouncil/Delete?id={techCouncilId}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var exists = DoesIdExistInTable("tech_council", techCouncilId);
            Assert.False(exists);
        }

        #region Helper Methods

        private int CreateOrgStructure(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, unique_id, version, is_active, date_start, created_at, updated_at) 
                VALUES (@name, @uniqueId, '1.0', true, @dateStart, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@uniqueId"] = Guid.NewGuid().ToString(),
                    ["@dateStart"] = DateTime.Now,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
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
        
        private int CreateEmployee(string firstName, string lastName, string secondName)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (first_name, last_name, second_name, created_at, updated_at) 
                VALUES (@first_name, @last_name, @second_name, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@first_name"] = firstName,
                    ["@last_name"] = lastName,
                    ["@second_name"] = secondName,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }
        
        private (int employeeId, int employeeId2) SetupTestData()
        {
            var employeeId = CreateEmployee("Test", "Employee", "Name");
            var employeeId2 = CreateEmployee("Test", "Employee", "Name");
            return (employeeId, employeeId2);
        }
        
        private int CreateApplication()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (registration_date, created_at, updated_at, number) 
                VALUES (@registrationDate, @createdAt, @updatedAt, @number) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@registrationDate"] = DateTime.Now,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now,
                    ["@number"] = $"APP-{Guid.NewGuid().ToString().Substring(0, 8)}"
                });
        }

        private void UpdateApplication(int applicationId, int customerId, int? techDecisionId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                UPDATE application 
                SET customer_id = @customerId, tech_decision_id = @techDecisionId, updated_at = @updatedAt
                WHERE id = @applicationId",
                new Dictionary<string, object>
                {
                    ["@applicationId"] = applicationId,
                    ["@customerId"] = customerId,
                    ["@techDecisionId"] = techDecisionId as object ?? DBNull.Value,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateTechCouncilSession(DateTime date)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO tech_council_session (date, is_active, created_at, updated_at) 
                VALUES (@date, true, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@date"] = date,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateCustomer(string fullName)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer (full_name, pin, is_organization, created_at, updated_at) 
                VALUES (@fullName, @pin, false, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@fullName"] = fullName,
                    ["@pin"] = Guid.NewGuid().ToString().Substring(0, 10),
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateDecisionType(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO decision_type (name, code, created_at, updated_at) 
                VALUES (@name, @code, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = name.ToLower().Replace(" ", "_"),
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateTechDecision(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO tech_decision (name, code, created_at, updated_at) 
                VALUES (@name, @code, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = name.ToLower().Replace(" ", "_"),
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateTechCouncil(int structureId, int applicationId, int? sessionId = null, int? decisionTypeId = null, string decision = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO tech_council (
                    structure_id, 
                    application_id, 
                    tech_council_session_id,
                    decision_type_id,
                    decision,
                    created_at, 
                    updated_at
                ) 
                VALUES (
                    @structureId, 
                    @applicationId, 
                    @sessionId,
                    @decisionTypeId,
                    @decision,
                    @createdAt, 
                    @updatedAt
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@structureId"] = structureId,
                    ["@applicationId"] = applicationId,
                    ["@sessionId"] = sessionId as object ?? DBNull.Value,
                    ["@decisionTypeId"] = decisionTypeId as object ?? DBNull.Value,
                    ["@decision"] = decision as object ?? DBNull.Value,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateLegalRecord()
        {
            // First, create legal registry status if it doesn't exist
            var statusId = GetOrCreateLegalRegistryStatus();

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_record_registry (subject, complainant, decision, id_status, created_at, updated_at) 
                VALUES (@subject, @complainant, @decision, @statusId, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@subject"] = $"Subject {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@complainant"] = $"Complainant {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@decision"] = $"Decision {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@statusId"] = statusId,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int GetOrCreateLegalRegistryStatus()
        {
            var statusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT id FROM legal_registry_status LIMIT 1;");

            if (statusId == 0)
            {
                statusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO legal_registry_status (name, code, created_at, updated_at) 
                    VALUES ('Active', 'active', @createdAt, @updatedAt) 
                    RETURNING id;",
                    new Dictionary<string, object>
                    {
                        ["@createdAt"] = DateTime.Now,
                        ["@updatedAt"] = DateTime.Now
                    });
            }

            return statusId;
        }

        private int CreateApplicationLegalRecord(int applicationId, int legalRecordId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_legal_record (id_application, id_legalrecord, created_at, updated_at) 
                VALUES (@applicationId, @legalRecordId, @createdAt, @updatedAt) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@applicationId"] = applicationId,
                    ["@legalRecordId"] = legalRecordId,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private TechCouncil GetTechCouncilById(int id)
        {
            return DatabaseHelper.RunQueryList<TechCouncil>(_schemaName, @"
                SELECT id, structure_id, application_id, decision, decision_type_id, date_decision, employee_id, tech_council_session_id
                FROM tech_council 
                WHERE id = @id",
                reader => new TechCouncil
                {
                    id = reader.GetInt32(0),
                    structure_id = reader.GetInt32(1),
                    application_id = reader.GetInt32(2),
                    decision = reader.IsDBNull(3) ? null : reader.GetString(3),
                    decision_type_id = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                    date_decision = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    employee_id = reader.IsDBNull(6) ? null : reader.GetInt32(6),
                    tech_council_session_id = reader.IsDBNull(7) ? null : reader.GetInt32(7)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        private TechCouncil GetTechCouncilByApplicationId(int applicationId)
        {
            return DatabaseHelper.RunQueryList<TechCouncil>(_schemaName, @"
                SELECT id, structure_id, application_id, tech_council_session_id
                FROM tech_council 
                WHERE application_id = @applicationId
                LIMIT 1",
                reader => new TechCouncil
                {
                    id = reader.GetInt32(0),
                    structure_id = reader.GetInt32(1),
                    application_id = reader.GetInt32(2),
                    tech_council_session_id = reader.IsDBNull(3) ? null : reader.GetInt32(3)
                },
                new Dictionary<string, object> { ["@applicationId"] = applicationId }
            ).FirstOrDefault();
        }

        private List<TechCouncil> GetTechCouncilsByApplicationId(int applicationId)
        {
            return DatabaseHelper.RunQueryList<TechCouncil>(_schemaName, @"
                SELECT id, structure_id, application_id
                FROM tech_council 
                WHERE application_id = @applicationId",
                reader => new TechCouncil
                {
                    id = reader.GetInt32(0),
                    structure_id = reader.GetInt32(1),
                    application_id = reader.GetInt32(2)
                },
                new Dictionary<string, object> { ["@applicationId"] = applicationId }
            );
        }

        private List<LegalRecordInCouncil> GetLegalRecordsInCouncil(int techCouncilId)
        {
            return DatabaseHelper.RunQueryList<LegalRecordInCouncil>(_schemaName, @"
                SELECT id, tech_council_id, application_legal_record_id
                FROM legal_record_in_council 
                WHERE tech_council_id = @techCouncilId",
                reader => new LegalRecordInCouncil
                {
                    id = reader.GetInt32(0),
                    tech_council_id = reader.GetInt32(1),
                    application_legal_record_id = reader.GetInt32(2)
                },
                new Dictionary<string, object> { ["@techCouncilId"] = techCouncilId }
            );
        }

        private bool DoesIdExistInTable(string tableName, int id)
        {
            var count = DatabaseHelper.RunQuery<int>(_schemaName, $@"
                SELECT COUNT(*) FROM {tableName} WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            return count > 0;
        }

        #endregion

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}