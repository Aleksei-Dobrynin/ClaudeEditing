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
    public class TechCouncilSessionTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public TechCouncilSessionTests()
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
            // Arrange - Create test tech council sessions
            var sessionId1 = CreateTechCouncilSession(DateTime.Now.AddDays(1), true);
            var sessionId2 = CreateTechCouncilSession(DateTime.Now.AddDays(2), true);

            // Create tech council entries to test counts
            var structureId = CreateOrgStructure("Test Structure", true);
            var applicationId = CreateApplication();
            CreateTechCouncil(structureId, applicationId, sessionId1);
            CreateTechCouncil(structureId, applicationId, sessionId1); // Add another for same app/session to test department count

            // Act
            var response = await _client.GetAsync("/TechCouncilSession/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<TechCouncilSession>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            // Verify the session with council entries has the counts set
            var sessionWithCounts = result.Find(s => s.id == sessionId1);
            Assert.NotNull(sessionWithCounts);
            Assert.Equal(1, sessionWithCounts.count_tech_council_case); // Count of unique applications
            Assert.Equal(2, sessionWithCounts.count_tech_council_department); // Count of tech council entries
        }

        [Fact]
        public async Task GetArchiveAll_ReturnsOkResponse()
        {
            // Arrange - Create active and archived sessions
            var activeSessionId = CreateTechCouncilSession(DateTime.Now.AddDays(1), true);
            var archivedSessionId = CreateTechCouncilSession(DateTime.Now.AddDays(2), false);

            // Act
            var response = await _client.GetAsync("/TechCouncilSession/GetArchiveAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<TechCouncilSession>>(content);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(archivedSessionId, result[0].id);
            Assert.False(result[0].is_active);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange
            var sessionDate = DateTime.Now.AddDays(3);
            var id = CreateTechCouncilSession(sessionDate, true);

            // Act
            var response = await _client.GetAsync($"/TechCouncilSession/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<TechCouncilSession>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(sessionDate.Date, result.date.Date); // Compare date parts only
            Assert.True(result.is_active);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var sessionDate = DateTime.Now.AddDays(5);
            var request = new CreateTechCouncilSessionRequest
            {
                date = sessionDate,
                is_active = true
            };

            // Act
            var response = await _client.PostAsJsonAsync("/TechCouncilSession/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<TechCouncilSession>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(sessionDate.Date, result.date.Date);
            Assert.True(result.is_active);

            // Verify in database
            var session = DatabaseHelper.RunQueryList<TechCouncilSession>(_schemaName, @"
                SELECT id, date, is_active FROM tech_council_session WHERE id = @id",
                reader => new TechCouncilSession
                {
                    id = reader.GetInt32(0),
                    date = reader.GetDateTime(1),
                    is_active = reader.GetBoolean(2)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(session);
            Assert.Equal(result.id, session.id);
            Assert.Equal(sessionDate.Date, session.date.Date);
            Assert.True(session.is_active);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalDate = DateTime.Now.AddDays(7);
            var id = CreateTechCouncilSession(originalDate, true);

            var updatedDate = DateTime.Now.AddDays(10);
            var request = new UpdateTechCouncilSessionRequest
            {
                id = id,
                date = updatedDate,
                is_active = true
            };

            // Act
            var response = await _client.PutAsync("/TechCouncilSession/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<TechCouncilSession>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(updatedDate.Date, result.date.Date);
            Assert.True(result.is_active);

            // Verify in database
            var session = DatabaseHelper.RunQueryList<TechCouncilSession>(_schemaName, @"
                SELECT date, is_active FROM tech_council_session WHERE id = @id",
                reader => new TechCouncilSession
                {
                    date = reader.GetDateTime(0),
                    is_active = reader.GetBoolean(1)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(session);
            Assert.Equal(updatedDate.Date, session.date.Date);
            Assert.True(session.is_active);
        }

        [Fact]
        public async Task ToArchive_ReturnsOkResponse()
        {
            // Arrange
            // Create a document template for protocol generation
            var documentTypeId = CreateDocumentTemplateType("Report", "report");
            var templateId = CreateDocumentTemplate("Tech Council Sheet", "tech_council_sheet", documentTypeId);
            var languageId = CreateLanguage("Русский", "ru");
            CreateDocumentTemplateTranslation(templateId, languageId, "<p>Test protocol template</p>");

            // Create session, application and tech council entries
            var id = CreateTechCouncilSession(DateTime.Now.AddDays(7), true);
            var structureId = CreateOrgStructure("Test Structure", true);
            var applicationId = CreateApplication();
            CreateTechCouncil(structureId, applicationId, id);

            var request = new UpdateTechCouncilSessionRequest
            {
                id = id,
                date = DateTime.Now.AddDays(7),
                is_active = false // Will be set to false by the toArchive method
            };

            // Act
            var response = await _client.PutAsync("/TechCouncilSession/toArchive", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database that session is now archived
            var session = DatabaseHelper.RunQueryList<TechCouncilSession>(_schemaName, @"
                SELECT is_active, document FROM tech_council_session WHERE id = @id",
                reader => new TechCouncilSession
                {
                    is_active = reader.GetBoolean(0),
                    document = reader.IsDBNull(1) ? null : reader.GetString(1)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(session);
            Assert.False(session.is_active);
            Assert.NotNull(session.document); // Document should be generated
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateTechCouncilSession(DateTime.Now.AddDays(15), true);

            // Act
            var response = await _client.DeleteAsync($"/TechCouncilSession/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM tech_council_session WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple sessions
            for (int i = 1; i <= 5; i++)
            {
                CreateTechCouncilSession(DateTime.Now.AddDays(i + 20), true);
            }

            // Act
            var response = await _client.GetAsync("/TechCouncilSession/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<TechCouncilSession>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        // Helper methods to create test data
        private int CreateTechCouncilSession(DateTime date, bool isActive)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO tech_council_session (date, is_active, created_at, updated_at) 
                VALUES (@date, @is_active, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@date"] = date,
                    ["@is_active"] = isActive,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateOrgStructure(string name, bool isActive)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, is_active, date_start, created_at, updated_at) 
                VALUES (@name, @is_active, @date_start, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@is_active"] = isActive,
                    ["@date_start"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateApplication()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (registration_date, created_at, updated_at, number) 
                VALUES (@registration_date, @created_at, @updated_at, @number) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@registration_date"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now,
                    ["@number"] = $"APP-{Guid.NewGuid().ToString().Substring(0, 8)}"
                });
        }

        private int CreateTechCouncil(int structureId, int applicationId, int sessionId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO tech_council (structure_id, application_id, tech_council_session_id, created_at, updated_at) 
                VALUES (@structure_id, @application_id, @tech_council_session_id, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@structure_id"] = structureId,
                    ["@application_id"] = applicationId,
                    ["@tech_council_session_id"] = sessionId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDocumentTemplateType(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplateType"" (name, code) 
                VALUES (@name, @code) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code
                });
        }

        private int CreateDocumentTemplate(string name, string code, int documentTypeId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplate"" (name, code, ""idDocumentType"") 
                VALUES (@name, @code, @documentTypeId) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@documentTypeId"] = documentTypeId
                });
        }

        private int CreateLanguage(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""Language"" (name, code) 
                VALUES (@name, @code) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code
                });
        }

        private int CreateDocumentTemplateTranslation(int templateId, int languageId, string template)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplateTranslation"" (""idDocumentTemplate"", ""idLanguage"", template) 
                VALUES (@templateId, @languageId, @template) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@templateId"] = templateId,
                    ["@languageId"] = languageId,
                    ["@template"] = template
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}