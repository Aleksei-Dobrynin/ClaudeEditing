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
    public class S_DocumentTemplateTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public S_DocumentTemplateTests()
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
            // Arrange - Create test prerequisites
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM ""S_DocumentTemplateTranslation"" WHERE id > 0;");
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM ""S_DocumentTemplate"" WHERE id > 0;");
            var typeId1 = CreateDocumentTemplateType("Type 1", "Type Description 1", "type_code_1", 1);
            var typeId2 = CreateDocumentTemplateType("Type 2", "Type Description 2", "type_code_2", 2);

            var templateId1 = CreateDocumentTemplate("Template 1", "Template Description 1", "template_code_1", typeId1);
            var templateId2 = CreateDocumentTemplate("Template 2", "Template Description 2", "template_code_2", typeId2);

            // Create organization structures
            var structureId1 = CreateOrgStructure("Structure 1", "unique_1");
            var structureId2 = CreateOrgStructure("Structure 2", "unique_2");

            // Associate templates with structures
            AssociateTemplateWithStructure(templateId1, structureId1);
            AssociateTemplateWithStructure(templateId2, structureId2);

            // Act
            var response = await _client.GetAsync("/S_DocumentTemplate/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_DocumentTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            // Check first template
            var template1 = result.Find(t => t.id == templateId1);
            Assert.NotNull(template1);
            Assert.Equal("Template 1", template1.name);
            Assert.Equal("template_code_1", template1.code);
            Assert.Equal(typeId1, template1.idDocumentType);

            // Check second template
            var template2 = result.Find(t => t.id == templateId2);
            Assert.NotNull(template2);
            Assert.Equal("Template 2", template2.name);
            Assert.Equal("template_code_2", template2.code);
            Assert.Equal(typeId2, template2.idDocumentType);
        }

        [Fact]
        public async Task GetByType_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM ""S_DocumentTemplateTranslation"" WHERE id > 0;");
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM ""S_DocumentTemplate"" WHERE id > 0;");
            var typeId = CreateDocumentTemplateType("Report Type", "Report Type Description", "report", 1);
            var otherTypeId = CreateDocumentTemplateType("Other Type", "Other Type Description", "other", 2);

            var templateId1 = CreateDocumentTemplate("Report Template 1", "Report Description 1", "report_code_1", typeId);
            var templateId2 = CreateDocumentTemplate("Report Template 2", "Report Description 2", "report_code_2", typeId);
            var otherTemplateId = CreateDocumentTemplate("Other Template", "Other Description", "other_code", otherTypeId);

            // Act
            var response = await _client.GetAsync("/S_DocumentTemplate/GetByType?type=report");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_DocumentTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, t => t.id == templateId1 && t.name == "Report Template 1");
            Assert.Contains(result, t => t.id == templateId2 && t.name == "Report Template 2");
            Assert.DoesNotContain(result, t => t.id == otherTemplateId);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            var typeId = CreateDocumentTemplateType("Single Type", "Single Type Description", "single_type", 5);
            var templateId = CreateDocumentTemplate("Single Template", "Single Template Description", "single_code", typeId);

            // Create organization structures
            var structureId1 = CreateOrgStructure("Structure A", "unique_a");
            var structureId2 = CreateOrgStructure("Structure B", "unique_b");

            // Associate template with structures
            AssociateTemplateWithStructure(templateId, structureId1);
            AssociateTemplateWithStructure(templateId, structureId2);

            // Act
            var response = await _client.GetAsync($"/S_DocumentTemplate/{templateId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_DocumentTemplate>(content);

            Assert.NotNull(result);
            Assert.Equal(templateId, result.id);
            Assert.Equal("Single Template", result.name);
            Assert.Equal("Single Template Description", result.description);
            Assert.Equal("single_code", result.code);
            Assert.Equal(typeId, result.idDocumentType);

            // Check associated structures
            Assert.NotNull(result.orgStructures);
            Assert.Equal(2, result.orgStructures.Count);
            Assert.Contains(structureId1, result.orgStructures);
            Assert.Contains(structureId2, result.orgStructures);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            var typeId = CreateDocumentTemplateType("Create Type", "Create Type Description", "create_type", 10);

            // Create organization structures
            var structureId1 = CreateOrgStructure("Create Structure 1", "create_unique_1");
            var structureId2 = CreateOrgStructure("Create Structure 2", "create_unique_2");

            // Create languages for translations
            var languageId1 = CreateLanguage("English", "en");
            var languageId2 = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT id FROM ""Language"" WHERE code = 'ru'");

            // Create request
            var request = new CreateS_DocumentTemplateRequest
            {
                name = "New Template",
                description = "New Template Description",
                code = "new_template_code",
                idDocumentType = typeId,
                orgStructures = new List<int> { structureId1, structureId2 },
                translations = new List<S_DocumentTemplateTranslation>
                {
                    new S_DocumentTemplateTranslation
                    {
                        template = "<p>English content</p>",
                        idLanguage = languageId1,
                        idLanguage_name = "en"
                    },
                    new S_DocumentTemplateTranslation
                    {
                        template = "<p>Русский контент</p>",
                        idLanguage = languageId2,
                        idLanguage_name = "ru"
                    }
                }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/S_DocumentTemplate", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_DocumentTemplate>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Template", result.name);
            Assert.Equal("New Template Description", result.description);
            Assert.Equal("new_template_code", result.code);
            Assert.Equal(typeId, result.idDocumentType);

            // Verify org structures associations in database
            var structures = GetTemplateStructures(result.id);
            Assert.Equal(2, structures.Count);
            Assert.Contains(structureId1, structures);
            Assert.Contains(structureId2, structures);

            // Verify translations in database
            var translations = GetTemplateTranslations(result.id);
            Assert.Equal(2, translations.Count);
            Assert.Contains(translations, t => t.idLanguage == languageId1 && t.template == "<p>English content</p>");
            Assert.Contains(translations, t => t.idLanguage == languageId2 && t.template == "<p>Русский контент</p>");
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM ""S_DocumentTemplateTranslation"" WHERE id > 0;");
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM ""S_DocumentTemplate"" WHERE id > 0;");
            var typeId = CreateDocumentTemplateType("Update Type", "Update Type Description", "update_type", 15);
            var newTypeId = CreateDocumentTemplateType("New Update Type", "New Update Type Description", "new_update_type", 20);

            var templateId = CreateDocumentTemplate("Original Template", "Original Description", "original_code", typeId);

            // Create organization structures
            var oldStructureId = CreateOrgStructure("Old Structure", "old_unique");
            var newStructureId1 = CreateOrgStructure("New Structure 1", "new_unique_1");
            var newStructureId2 = CreateOrgStructure("New Structure 2", "new_unique_2");

            // Associate template with initial structure
            AssociateTemplateWithStructure(templateId, oldStructureId);

            // Create languages for translations
            var languageId1 = CreateLanguage("English", "en");
            var languageId2 = CreateLanguage("Russian", "ru");

            // Create initial translation
            CreateDocumentTemplateTranslation("<p>Original English content</p>", templateId, languageId1);

            // Create update request
            var request = new UpdateS_DocumentTemplateRequest
            {
                id = templateId,
                name = "Updated Template",
                description = "Updated Description",
                code = "updated_code",
                idDocumentType = newTypeId,
                orgStructures = new List<int> { newStructureId1, newStructureId2 },
                translations = new List<S_DocumentTemplateTranslation>
                {
                    new S_DocumentTemplateTranslation
                    {
                        id = 0, // New translation
                        template = "<p>Updated Russian content</p>",
                        idLanguage = languageId2,
                        idLanguage_name = "ru"
                    }
                }
            };

            // Act
            var response = await _client.PutAsync($"/S_DocumentTemplate/{templateId}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_DocumentTemplate>(content);

            Assert.NotNull(result);
            Assert.Equal(templateId, result.id);
            Assert.Equal("Updated Template", result.name);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("updated_code", result.code);
            Assert.Equal(newTypeId, result.idDocumentType);

            // Verify updated org structures associations in database
            var structures = GetTemplateStructures(templateId);
            Assert.Equal(2, structures.Count);
            Assert.Contains(newStructureId1, structures);
            Assert.Contains(newStructureId2, structures);
            Assert.DoesNotContain(oldStructureId, structures);

            // Verify translations in database - should have both
            var translations = GetTemplateTranslations(templateId);
            Assert.Equal(2, translations.Count);
            Assert.Contains(translations, t => t.idLanguage == languageId2 && t.template == "<p>Updated Russian content</p>");
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            var typeId = CreateDocumentTemplateType("Delete Type", "Delete Type Description", "delete_type", 25);
            var templateId = CreateDocumentTemplate("Template to Delete", "Delete Description", "delete_code", typeId);

            // Create organization structure and associate with template
            var structureId = CreateOrgStructure("Delete Structure", "delete_unique");
            AssociateTemplateWithStructure(templateId, structureId);

            // Create language and translation
            var languageId = CreateLanguage("Delete Language", "del");
            CreateDocumentTemplateTranslation("<p>Delete content</p>", templateId, languageId);

            // Act
            var response = await _client.DeleteAsync($"/S_DocumentTemplate/{templateId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(templateId, result);

            // Verify template deletion in database
            var templateExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM ""S_DocumentTemplate"" WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = templateId });
            Assert.Equal(0, templateExists);


            // Verify translation deletion
            var translationExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM ""S_DocumentTemplateTranslation"" WHERE ""idDocumentTemplate"" = @idDocumentTemplate",
                new Dictionary<string, object> { ["@idDocumentTemplate"] = templateId });
            Assert.Equal(0, translationExists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            var typeId = CreateDocumentTemplateType("Paginated Type", "Paginated Type Description", "paginated_type", 30);

            // Create multiple templates
            var templateIds = new List<int>();
            for (int i = 1; i <= 5; i++)
            {
                var templateId = CreateDocumentTemplate($"Paginated Template {i}", $"Paginated Description {i}", $"paginated_code_{i}", typeId);
                templateIds.Add(templateId);

                // Create structure and associate with template
                var structureId = CreateOrgStructure($"Paginated Structure {i}", $"paginated_unique_{i}");
                AssociateTemplateWithStructure(templateId, structureId);
            }

            // Act
            var response = await _client.GetAsync("/S_DocumentTemplate/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<S_DocumentTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);


        }

        [Fact]
        public async Task GetByDocumentType_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            var typeId = CreateDocumentTemplateType("Filter Type", "Filter Type Description", "filter_type", 35);
            var otherTypeId = CreateDocumentTemplateType("Other Filter Type", "Other Filter Type Description", "other_filter_type", 36);

            var templateId1 = CreateDocumentTemplate("Filter Template 1", "Filter Description 1", "filter_code_1", typeId);
            var templateId2 = CreateDocumentTemplate("Filter Template 2", "Filter Description 2", "filter_code_2", typeId);
            var otherTemplateId = CreateDocumentTemplate("Other Filter Template", "Other Filter Description", "other_filter_code", otherTypeId);

            // Act
            var response = await _client.GetAsync($"/S_DocumentTemplate/GetByidDocumentType?idDocumentType={typeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_DocumentTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, t => t.id == templateId1 && t.name == "Filter Template 1");
            Assert.Contains(result, t => t.id == templateId2 && t.name == "Filter Template 2");
            Assert.DoesNotContain(result, t => t.id == otherTemplateId);
        }

        [Fact]
        public async Task GetByApplicationType_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            var appTypeId = CreateDocumentTemplateType("Application Type", "Application Type Description", "application", 40);
            var otherTypeId = CreateDocumentTemplateType("Non-Application Type", "Non-Application Type Description", "non_application", 41);

            var appTemplateId1 = CreateDocumentTemplate("App Template 1", "App Description 1", "app_code_1", appTypeId);
            var appTemplateId2 = CreateDocumentTemplate("App Template 2", "App Description 2", "app_code_2", appTypeId);
            var otherTemplateId = CreateDocumentTemplate("Non-App Template", "Non-App Description", "non_app_code", otherTypeId);

            // Act
            var response = await _client.GetAsync("/S_DocumentTemplate/GetByApplicationType");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_DocumentTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, t => t.id == appTemplateId1 && t.name == "App Template 1");
            Assert.Contains(result, t => t.id == appTemplateId2 && t.name == "App Template 2");
            Assert.DoesNotContain(result, t => t.id == otherTemplateId);
        }

        [Fact]
        public async Task GetByApplicationTypeAndID_ReturnsOkResponse()
        {
            // Arrange - Create test prerequisites
            var appTypeId = CreateDocumentTemplateType("Application Type", "Application Type Description", "application", 50);
            var appYurTypeId = CreateDocumentTemplateType("Application Yur Type", "Application Yur Type Description", "app_yur", 51);
            var appPhysTypeId = CreateDocumentTemplateType("Application Phys Type", "Application Phys Type Description", "app_phys", 52);

            // Create templates for different types
            var commonTemplateId = CreateDocumentTemplate("Common Template", "Common Description", "common_code", appTypeId);
            var yurTemplateId = CreateDocumentTemplate("Yur Template", "Yur Description", "yur_code", appYurTypeId);
            var physTemplateId = CreateDocumentTemplate("Phys Template", "Phys Description", "phys_code", appPhysTypeId);

            // Create application with organization customer
            var customerId = CreateCustomer("Test Organization", "123456789", true);
            var applicationId = CreateApplication(customerId);

            // Create a saved document for the application
            var languageId = CreateLanguage("Test Language", "test");
            CreateSavedApplicationDocument(applicationId, commonTemplateId, languageId, "<p>Saved content</p>");

            // Act
            var response = await _client.GetAsync($"/S_DocumentTemplate/GetByApplicationTypeAndID?idApplication={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_DocumentTemplate>>(content);

            Assert.NotNull(result);
            // Should return common templates + organization templates (since customer is an organization)
            Assert.Contains(result, t => t.id == commonTemplateId);
            Assert.Contains(result, t => t.id == yurTemplateId);
            Assert.DoesNotContain(result, t => t.id == physTemplateId);

            // Check that the saved application document is included
            var commonTemplate = result.Find(t => t.id == commonTemplateId);
            Assert.NotNull(commonTemplate.saved_application_documents);
            Assert.NotEmpty(commonTemplate.saved_application_documents);
            Assert.Contains(commonTemplate.saved_application_documents, d => d.language_id == languageId);
        }

        [Fact(Skip = "This test involves complex HTML generation and requires mocking database queries")]
        public async Task GetFilledDocumentHtml_ReturnsOkResponse()
        {
            // This test involves complex logic and database queries for placeholders
            // It would require extensive mocking and setup to properly test
            // For a real integration test, we'd need to set up all the necessary data:
            // - Template with translations
            // - S_Query entries
            // - S_PlaceHolderTemplate entries
            // - Mock data for queries to return

            // For now, we'll skip this test
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

        private int CreateOrgStructure(string name, string uniqueId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, unique_id, is_active, date_start, created_at, updated_at)
                VALUES (@name, @unique_id, @is_active, @date_start, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@unique_id"] = uniqueId,
                    ["@is_active"] = true,
                    ["@date_start"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private void AssociateTemplateWithStructure(int templateId, int structureId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure_templates (template_id, structure_id, created_at, updated_at)
                VALUES (@template_id, @structure_id, @created_at, @updated_at);",
                new Dictionary<string, object>
                {
                    ["@template_id"] = templateId,
                    ["@structure_id"] = structureId,
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

        private int CreateCustomer(string fullName, string pin, bool isOrganization)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer (full_name, pin, is_organization, created_at, updated_at) 
                VALUES (@fullName, @pin, @isOrganization, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@fullName"] = fullName,
                    ["@pin"] = pin,
                    ["@isOrganization"] = isOrganization,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateApplication(int customerId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (customer_id, registration_date, created_at, updated_at) 
                VALUES (@customerId, @registrationDate, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@customerId"] = customerId,
                    ["@registrationDate"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateSavedApplicationDocument(int applicationId, int templateId, int languageId, string body)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO saved_application_document (application_id, template_id, language_id, body, created_at)
                VALUES (@application_id, @template_id, @language_id, @body, @created_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@template_id"] = templateId,
                    ["@language_id"] = languageId,
                    ["@body"] = body,
                    ["@created_at"] = DateTime.Now
                });
        }

        private List<int> GetTemplateStructures(int templateId)
        {
            return DatabaseHelper.RunQueryList<int>(_schemaName, @"
                SELECT structure_id FROM org_structure_templates WHERE template_id = @template_id",
                reader => reader.GetInt32(0),
                new Dictionary<string, object> { ["@template_id"] = templateId }
            );
        }

        private List<S_DocumentTemplateTranslation> GetTemplateTranslations(int templateId)
        {
            return DatabaseHelper.RunQueryList<S_DocumentTemplateTranslation>(_schemaName, @"
                SELECT id, template, ""idDocumentTemplate"", ""idLanguage"" FROM ""S_DocumentTemplateTranslation"" 
                WHERE ""idDocumentTemplate"" = @idDocumentTemplate",
                reader => new S_DocumentTemplateTranslation
                {
                    id = reader.GetInt32(0),
                    template = reader.GetString(1),
                    idDocumentTemplate = reader.GetInt32(2),
                    idLanguage = reader.GetInt32(3)
                },
                new Dictionary<string, object> { ["@idDocumentTemplate"] = templateId }
            );
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}