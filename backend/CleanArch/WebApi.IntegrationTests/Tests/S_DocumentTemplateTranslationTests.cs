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
    public class S_DocumentTemplateTranslationTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public S_DocumentTemplateTranslationTests()
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
            // Arrange - Create test prerequisites and document template translations
            var documentTypeId = CreateDocumentTemplateType("Document Type", "Type Description", "type_code", 1);
            var documentTemplateId = CreateDocumentTemplate("Template 1", "Template Description", "template_code", documentTypeId);
            var languageId1 = CreateLanguage("English", "en");
            var languageId2 = CreateLanguage("Russian", "ru");

            CreateDocumentTemplateTranslation("<p>English translation</p>", documentTemplateId, languageId1);
            CreateDocumentTemplateTranslation("<p>Russian translation</p>", documentTemplateId, languageId2);

            // Act
            var response = await _client.GetAsync("/S_DocumentTemplateTranslation/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_DocumentTemplateTranslation>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.Count);// first record is in seeddata
            Assert.Contains(result, t => t.template == "<p>English translation</p>" && t.idLanguage == languageId1);
            Assert.Contains(result, t => t.template == "<p>Russian translation</p>" && t.idLanguage == languageId2);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites and document template translation
            var documentTypeId = CreateDocumentTemplateType("Single Doc Type", "Single Type Desc", "single_type_code", 1);
            var documentTemplateId = CreateDocumentTemplate("Single Template", "Single Template Desc", "single_template_code", documentTypeId);
            var languageId = CreateLanguage("German", "de");

            var id = CreateDocumentTemplateTranslation("<p>German translation</p>", documentTemplateId, languageId);

            // Act
            var response = await _client.GetAsync($"/S_DocumentTemplateTranslation/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_DocumentTemplateTranslation>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("<p>German translation</p>", result.template);
            Assert.Equal(documentTemplateId, result.idDocumentTemplate);
            Assert.Equal(languageId, result.idLanguage);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            var documentTypeId = CreateDocumentTemplateType("Create Doc Type", "Create Type Desc", "create_type_code", 1);
            var documentTemplateId = CreateDocumentTemplate("Create Template", "Create Template Desc", "create_template_code", documentTypeId);
            var languageId = CreateLanguage("French", "fr");

            var request = new CreateS_DocumentTemplateTranslationRequest
            {
                template = "<p>French translation</p>",
                idDocumentTemplate = documentTemplateId,
                idLanguage = languageId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/S_DocumentTemplateTranslation", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_DocumentTemplateTranslation>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("<p>French translation</p>", result.template);
            Assert.Equal(documentTemplateId, result.idDocumentTemplate);
            Assert.Equal(languageId, result.idLanguage);

            // Verify in database
            var translation = GetDocumentTemplateTranslation(result.id);
            Assert.NotNull(translation);
            Assert.Equal("<p>French translation</p>", translation.template);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites and document template translation
            var documentTypeId = CreateDocumentTemplateType("Update Doc Type", "Update Type Desc", "update_type_code", 1);
            var documentTemplateId = CreateDocumentTemplate("Update Template", "Update Template Desc", "update_template_code", documentTypeId);
            var languageId = CreateLanguage("Italian", "it");

            var id = CreateDocumentTemplateTranslation("<p>Original Italian translation</p>", documentTemplateId, languageId);

            var request = new UpdateS_DocumentTemplateTranslationRequest
            {
                id = id,
                template = "<p>Updated Italian translation</p>",
                idDocumentTemplate = documentTemplateId,
                idLanguage = languageId
            };

            // Act
            var response = await _client.PutAsync($"/S_DocumentTemplateTranslation/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_DocumentTemplateTranslation>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("<p>Updated Italian translation</p>", result.template);
            Assert.Equal(documentTemplateId, result.idDocumentTemplate);
            Assert.Equal(languageId, result.idLanguage);

            // Verify in database
            var translation = GetDocumentTemplateTranslation(id);
            Assert.NotNull(translation);
            Assert.Equal("<p>Updated Italian translation</p>", translation.template);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites and document template translation
            var documentTypeId = CreateDocumentTemplateType("Delete Doc Type", "Delete Type Desc", "delete_type_code", 1);
            var documentTemplateId = CreateDocumentTemplate("Delete Template", "Delete Template Desc", "delete_template_code", documentTypeId);
            var languageId = CreateLanguage("Spanish", "es");

            var id = CreateDocumentTemplateTranslation("<p>Spanish translation to delete</p>", documentTemplateId, languageId);

            // Act
            var response = await _client.DeleteAsync($"/S_DocumentTemplateTranslation/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify deletion in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM ""S_DocumentTemplateTranslation"" WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            var documentTypeId = CreateDocumentTemplateType("Paginated Doc Type", "Paginated Type Desc", "paginated_type_code", 1);
            var documentTemplateId = CreateDocumentTemplate("Paginated Template", "Paginated Template Desc", "paginated_template_code", documentTypeId);

            // Create multiple languages and translations
            var languageCodes = new[] { "en", "ru", "de", "fr", "es" };
            foreach (var code in languageCodes)
            {
                var languageId = CreateLanguage($"Language {code.ToUpper()}", code);
                CreateDocumentTemplateTranslation($"<p>Translation for {code}</p>", documentTemplateId, languageId);
            }

            // Act
            var response = await _client.GetAsync("/S_DocumentTemplateTranslation/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<S_DocumentTemplateTranslation>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task GetByidDocumentTemplate_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            var documentTypeId = CreateDocumentTemplateType("Template Test Type", "Template Test Desc", "template_test_code", 1);
            var documentTemplateId = CreateDocumentTemplate("Template for Translations", "Template Desc", "translations_template_code", documentTypeId);

            // Create languages and translations
            var languageId1 = CreateLanguage("English", "en");
            var languageId2 = CreateLanguage("Russian", "ru");
            var languageId3 = CreateLanguage("German", "de");

            CreateDocumentTemplateTranslation("<p>English content</p>", documentTemplateId, languageId1);
            CreateDocumentTemplateTranslation("<p>Russian content</p>", documentTemplateId, languageId2);
            // Not creating German translation to test empty response handling

            // Act
            var response = await _client.GetAsync($"/S_DocumentTemplateTranslation/GetByidDocumentTemplate?idDocumentTemplate={documentTemplateId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_DocumentTemplateTranslation>>(content);

            Assert.NotNull(result);
            // Should return items for all languages (including those without translations)
            Assert.True(result.Count >= 2);
            Assert.Contains(result, t => t.idLanguage == languageId1 && t.template == "<p>English content</p>");
            Assert.Contains(result, t => t.idLanguage == languageId2 && t.template == "<p>Russian content</p>");
            // Should include entry for German language (without translation)
            Assert.Contains(result, t => t.idLanguage == languageId3);
        }

        [Fact]
        public async Task GetByidLanguage_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            var documentTypeId = CreateDocumentTemplateType("Language Test Type", "Language Test Desc", "language_test_code", 1);
            var documentTemplateId1 = CreateDocumentTemplate("Template 1 for Language", "Template 1 Desc", "language_template_1", documentTypeId);
            var documentTemplateId2 = CreateDocumentTemplate("Template 2 for Language", "Template 2 Desc", "language_template_2", documentTypeId);

            var languageId = CreateLanguage("Spanish", "es");

            CreateDocumentTemplateTranslation("<p>Spanish content for template 1</p>", documentTemplateId1, languageId);
            CreateDocumentTemplateTranslation("<p>Spanish content for template 2</p>", documentTemplateId2, languageId);

            // Act
            var response = await _client.GetAsync($"/S_DocumentTemplateTranslation/GetByidLanguage?idLanguage={languageId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_DocumentTemplateTranslation>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, t => t.idDocumentTemplate == documentTemplateId1 && t.template == "<p>Spanish content for template 1</p>");
            Assert.Contains(result, t => t.idDocumentTemplate == documentTemplateId2 && t.template == "<p>Spanish content for template 2</p>");
        }

        // Helper methods to create and retrieve test data
        private int CreateDocumentTemplateType(string name, string description, string code, int? queueNumber)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplateType"" (name, description, code, ""queueNumber"", created_at, updated_at)
                VALUES (@name, @description, @code, @queueNumber, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@code"] = code,
                    ["@queueNumber"] = queueNumber,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDocumentTemplate(string name, string description, string code, int documentTypeId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplate"" (name, description, code, ""idDocumentType"", created_at, updated_at)
                VALUES (@name, @description, @code, @idDocumentType, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@code"] = code,
                    ["@idDocumentType"] = documentTypeId,
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

        private int CreateDocumentTemplateTranslation(string template, int documentTemplateId, int languageId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplateTranslation"" (template, ""idDocumentTemplate"", ""idLanguage"", created_at, updated_at)
                VALUES (@template, @idDocumentTemplate, @idLanguage, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@template"] = template,
                    ["@idDocumentTemplate"] = documentTemplateId,
                    ["@idLanguage"] = languageId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private S_DocumentTemplateTranslation GetDocumentTemplateTranslation(int id)
        {
            return DatabaseHelper.RunQueryList<S_DocumentTemplateTranslation>(_schemaName, @"
                SELECT id, template, ""idDocumentTemplate"", ""idLanguage"" FROM ""S_DocumentTemplateTranslation"" WHERE id = @id",
                reader => new S_DocumentTemplateTranslation
                {
                    id = reader.GetInt32(0),
                    template = reader.GetString(1),
                    idDocumentTemplate = reader.GetInt32(2),
                    idLanguage = reader.GetInt32(3)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}