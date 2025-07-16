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

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class SavedApplicationDocumentTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public SavedApplicationDocumentTests()
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
            // Arrange - Create test documents
            var (applicationId, templateId, languageId) = await CreatePrerequisites();
            int docId = CreateSavedApplicationDocument(applicationId, templateId, languageId, "<p>Test document body</p>");

            // Act
            var response = await _client.GetAsync("/saved_application_document/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<saved_application_document>>(content);

            Assert.NotNull(result);
            Assert.Contains(result, d => d.id == docId);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test document
            var (applicationId, templateId, languageId) = await CreatePrerequisites();
            int docId = CreateSavedApplicationDocument(applicationId, templateId, languageId, "<p>Single test document</p>");

            // Act
            var response = await _client.GetAsync($"/saved_application_document/{docId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<saved_application_document>(content);

            Assert.NotNull(result);
            Assert.Equal(docId, result.id);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal(templateId, result.template_id);
            Assert.Equal(languageId, result.language_id);
            Assert.Equal("<p>Single test document</p>", result.body);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites
            var (applicationId, templateId, languageId) = await CreatePrerequisites();

            var createRequest = new Createsaved_application_documentRequest
            {
                application_id = applicationId,
                template_id = templateId,
                language_id = languageId,
                body = "<p>Created document body</p>"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/saved_application_document", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<saved_application_document>(content);

            Assert.NotNull(result);
            Assert.Equal(createRequest.application_id, result.application_id);
            Assert.Equal(createRequest.template_id, result.template_id);
            Assert.Equal(createRequest.language_id, result.language_id);
            Assert.Equal(createRequest.body, result.body);

            // Verify in database
            var savedDocument = await GetSavedDocumentFromDb(result.id);
            Assert.NotNull(savedDocument);
            Assert.Equal(createRequest.body, savedDocument.body);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test document
            var (applicationId, templateId, languageId) = await CreatePrerequisites();
            int docId = CreateSavedApplicationDocument(applicationId, templateId, languageId, "<p>Original document body</p>");

            var updateRequest = new Updatesaved_application_documentRequest
            {
                id = docId,
                application_id = applicationId,
                template_id = templateId,
                language_id = languageId,
                body = "<p>Updated document body</p>"
            };

            // Act
            var response = await _client.PutAsync($"/saved_application_document/{docId}", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<saved_application_document>(content);

            Assert.NotNull(result);
            Assert.Equal(docId, result.id);
            Assert.Equal("<p>Updated document body</p>", result.body);

            // Verify in database
            var updatedDocument = await GetSavedDocumentFromDb(docId);
            Assert.NotNull(updatedDocument);
            Assert.Equal("<p>Updated document body</p>", updatedDocument.body);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test document
            var (applicationId, templateId, languageId) = await CreatePrerequisites();
            int docId = CreateSavedApplicationDocument(applicationId, templateId, languageId, "<p>Document to delete</p>");

            // Act
            var response = await _client.DeleteAsync($"/saved_application_document/{docId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(docId, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM saved_application_document WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = docId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple test documents
            var (applicationId, templateId, languageId) = await CreatePrerequisites();

            // Create multiple documents
            for (int i = 0; i < 5; i++)
            {
                CreateSavedApplicationDocument(applicationId, templateId, languageId, $"<p>Document {i}</p>");
            }

            // Act
            var response = await _client.GetAsync("/saved_application_document/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<saved_application_document>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task GetByApplication_ReturnsOkResponse()
        {
            // Arrange - Create test document
            var (applicationId, templateId, languageId) = await CreatePrerequisites();
            int docId = CreateSavedApplicationDocument(applicationId, templateId, languageId, "<p>Application document</p>");

            // Create a document for a different language to test filtering
            int otherLanguageId = CreateLanguage("English", "en");
            CreateSavedApplicationDocument(applicationId, templateId, otherLanguageId, "<p>Other language document</p>");

            // Act
            var response = await _client.GetAsync($"/saved_application_document/GetByApplication?application_id={applicationId}&template_id={templateId}&language_id={languageId}&language_code=ru");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<saved_application_document>(content);

            Assert.NotNull(result);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal(templateId, result.template_id);
            Assert.Equal(languageId, result.language_id);
            Assert.Contains("<p>Application document</p>", result.body);
        }

        [Fact]
        public async Task GetByapplication_id_ReturnsOkResponse()
        {
            // Arrange - Create test documents for the same application
            var (applicationId, templateId, languageId) = await CreatePrerequisites();
            int docId1 = CreateSavedApplicationDocument(applicationId, templateId, languageId, "<p>Application document 1</p>");

            // Create another template
            int otherTemplateId = CreateDocumentTemplate("Other Template", "other_template");
            int docId2 = CreateSavedApplicationDocument(applicationId, otherTemplateId, languageId, "<p>Application document 2</p>");

            // Create a document for a different application
            var (otherAppId, _, _) = await CreatePrerequisites();
            CreateSavedApplicationDocument(otherAppId, templateId, languageId, "<p>Other application document</p>");

            // Act
            var response = await _client.GetAsync($"/saved_application_document/GetByapplication_id?application_id={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<saved_application_document>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, d => d.id == docId1);
            Assert.Contains(result, d => d.id == docId2);
            Assert.All(result, d => Assert.Equal(applicationId, d.application_id));
        }

        [Fact]
        public async Task GetBytemplate_id_ReturnsOkResponse()
        {
            // Arrange - Create test documents for the same template
            var (applicationId1, templateId, languageId) = await CreatePrerequisites();
            int docId1 = CreateSavedApplicationDocument(applicationId1, templateId, languageId, "<p>Template document 1</p>");

            // Create another application
            var (applicationId2, _, _) = await CreatePrerequisites();
            int docId2 = CreateSavedApplicationDocument(applicationId2, templateId, languageId, "<p>Template document 2</p>");

            // Create a document for a different template
            int otherTemplateId = CreateDocumentTemplate("Other Template", "other_template");
            CreateSavedApplicationDocument(applicationId1, otherTemplateId, languageId, "<p>Other template document</p>");

            // Act
            var response = await _client.GetAsync($"/saved_application_document/GetBytemplate_id?template_id={templateId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<saved_application_document>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, d => d.id == docId1);
            Assert.Contains(result, d => d.id == docId2);
            Assert.All(result, d => Assert.Equal(templateId, d.template_id));
        }

        [Fact]
        public async Task GetBylanguage_id_ReturnsOkResponse()
        {
            // Arrange - Create test documents for the same language
            var (applicationId1, templateId1, languageId) = await CreatePrerequisites();
            int docId1 = CreateSavedApplicationDocument(applicationId1, templateId1, languageId, "<p>Language document 1</p>");

            // Create another template
            int templateId2 = CreateDocumentTemplate("Other Template", "other_template");
            int docId2 = CreateSavedApplicationDocument(applicationId1, templateId2, languageId, "<p>Language document 2</p>");

            // Create a document for a different language
            int otherLanguageId = CreateLanguage("English", "en");
            CreateSavedApplicationDocument(applicationId1, templateId1, otherLanguageId, "<p>Other language document</p>");

            // Act
            var response = await _client.GetAsync($"/saved_application_document/GetBylanguage_id?language_id={languageId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<saved_application_document>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, d => d.id == docId1);
            Assert.Contains(result, d => d.id == docId2);
            Assert.All(result, d => Assert.Equal(languageId, d.language_id));
        }

        [Fact]
        public async Task GetLatestSavedDocuments_ReturnsOkResponse()
        {
            // Arrange - Create test documents with different versions
            var (applicationId, templateId, languageId) = await CreatePrerequisites();

            // Create multiple versions of the same document
            int oldVersionId = CreateSavedApplicationDocument(applicationId, templateId, languageId, "<p>Old version</p>");
            int latestVersionId = CreateSavedApplicationDocument(applicationId, templateId, languageId, "<p>Latest version</p>");

            // Create another template
            int otherTemplateId = CreateDocumentTemplate("Other Template", "other_template");
            int otherDocId = CreateSavedApplicationDocument(applicationId, otherTemplateId, languageId, "<p>Other template document</p>");

            // Act
            var response = await _client.GetAsync($"/saved_application_document/GetLatestSavedDocuments?app_id={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<saved_application_document>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            // Should contain latest versions only
            Assert.Contains(result, d => d.id == latestVersionId);
            Assert.Contains(result, d => d.id == otherDocId);
            Assert.DoesNotContain(result, d => d.id == oldVersionId);
        }

        #region Helper Methods

        private async Task<(int applicationId, int templateId, int languageId)> CreatePrerequisites()
        {
            // Create required entities for saved_application_document
            int customerId = CreateCustomer("Test Customer", "123456789", false);
            int serviceId = CreateService("Test Service", 10);
            int statusId = CreateStatus("Review", "review");
            int workflowId = CreateWorkflow("Test Workflow");

            // Create application
            int applicationId = CreateApplication(customerId, serviceId, statusId, workflowId);

            // Create document template type
            int templateTypeId = CreateDocumentTemplateType("Report", "report");

            // Create document template
            int templateId = CreateDocumentTemplate("Test Template", "test_template", templateTypeId);

            // Create language
            int languageId = CreateLanguage("Russian", "ru");

            // Create document template translation
            CreateDocumentTemplateTranslation(templateId, languageId, "<p>Template content</p>");

            return (applicationId, templateId, languageId);
        }

        private int CreateSavedApplicationDocument(int applicationId, int templateId, int languageId, string body)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO saved_application_document (
                    application_id, template_id, language_id, body, created_at, updated_at
                ) VALUES (
                    @application_id, @template_id, @language_id, @body, @created_at, @updated_at
                ) RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@template_id"] = templateId,
                    ["@language_id"] = languageId,
                    ["@body"] = body,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateCustomer(string fullName, string pin, bool isOrganization)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer (full_name, pin, is_organization, created_at, updated_at)
                VALUES (@full_name, @pin, @is_organization, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@full_name"] = fullName,
                    ["@pin"] = pin,
                    ["@is_organization"] = isOrganization,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateService(string name, int dayCount)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO service (name, day_count, is_active, created_at, updated_at)
                VALUES (@name, @day_count, @is_active, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@day_count"] = dayCount,
                    ["@is_active"] = true,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateStatus(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_status (name, code, created_at, updated_at)
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

        private int CreateWorkflow(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO workflow (name, is_active, created_at, updated_at)
                VALUES (@name, @is_active, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@is_active"] = true,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateApplication(int customerId, int serviceId, int statusId, int workflowId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (
                    registration_date, customer_id, status_id, workflow_id, service_id,
                    number, created_at, updated_at
                ) VALUES (
                    @registration_date, @customer_id, @status_id, @workflow_id, @service_id,
                    @number, @created_at, @updated_at
                ) RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@registration_date"] = DateTime.Now,
                    ["@customer_id"] = customerId,
                    ["@status_id"] = statusId,
                    ["@workflow_id"] = workflowId,
                    ["@service_id"] = serviceId,
                    ["@number"] = $"APP-{Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDocumentTemplateType(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplateType"" (name, code, created_at, updated_at)
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

        private int CreateDocumentTemplate(string name, string code, int? templateTypeId = null)
        {
            if (templateTypeId == null)
            {
                // Get or create a default template type
                templateTypeId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    SELECT id FROM ""S_DocumentTemplateType"" WHERE code = 'report' LIMIT 1;",
                    new Dictionary<string, object>());

                if (templateTypeId == 0)
                {
                    templateTypeId = CreateDocumentTemplateType("Report", "report");
                }
            }

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplate"" (name, code, ""idDocumentType"", created_at, updated_at)
                VALUES (@name, @code, @idDocumentType, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@idDocumentType"] = templateTypeId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateLanguage(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""Language"" (name, code, created_at, updated_at)
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

        private int CreateDocumentTemplateTranslation(int templateId, int languageId, string templateContent)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplateTranslation"" (""idDocumentTemplate"", ""idLanguage"", template, created_at, updated_at)
                VALUES (@idDocumentTemplate, @idLanguage, @template, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@idDocumentTemplate"] = templateId,
                    ["@idLanguage"] = languageId,
                    ["@template"] = templateContent,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<saved_application_document> GetSavedDocumentFromDb(int id)
        {
            return DatabaseHelper.RunQueryList<saved_application_document>(_schemaName, @"
                SELECT id, application_id, template_id, language_id, body, 
                       created_at, updated_at, created_by, updated_by
                FROM saved_application_document
                WHERE id = @id",
                reader => new saved_application_document
                {
                    id = reader.GetInt32(0),
                    application_id = reader.GetInt32(1),
                    template_id = reader.GetInt32(2),
                    language_id = reader.GetInt32(3),
                    body = reader.GetString(4),
                    created_at = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    updated_at = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                    created_by = reader.IsDBNull(7) ? null : reader.GetInt32(7),
                    updated_by = reader.IsDBNull(8) ? null : reader.GetInt32(8)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        #endregion

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}