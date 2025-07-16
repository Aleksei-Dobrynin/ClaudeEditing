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
    public class S_TemplateDocumentPlaceholderTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public S_TemplateDocumentPlaceholderTests()
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
            var templateDocumentId = CreateDocumentTemplateWithTranslation();
            var placeholderId1 = CreatePlaceholder("Placeholder 1");
            var placeholderId2 = CreatePlaceholder("Placeholder 2");

            CreateTemplateDocumentPlaceholder(templateDocumentId, placeholderId1);
            CreateTemplateDocumentPlaceholder(templateDocumentId, placeholderId2);

            // Act
            var response = await _client.GetAsync("/S_TemplateDocumentPlaceholder/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_TemplateDocumentPlaceholder>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, tdp => tdp.idPlaceholder == placeholderId1);
            Assert.Contains(result, tdp => tdp.idPlaceholder == placeholderId2);
            Assert.All(result, tdp => Assert.Equal(templateDocumentId, tdp.idTemplateDocument));
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange
            var templateDocumentId = CreateDocumentTemplateWithTranslation();
            var placeholderId = CreatePlaceholder("Single Placeholder");

            var id = CreateTemplateDocumentPlaceholder(templateDocumentId, placeholderId);

            // Act
            var response = await _client.GetAsync($"/S_TemplateDocumentPlaceholder/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_TemplateDocumentPlaceholder>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(templateDocumentId, result.idTemplateDocument);
            Assert.Equal(placeholderId, result.idPlaceholder);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var templateDocumentId = CreateDocumentTemplateWithTranslation();
            var placeholderId = CreatePlaceholder("Create Placeholder");

            var request = new CreateS_TemplateDocumentPlaceholderRequest
            {
                idTemplateDocument = templateDocumentId,
                idPlaceholder = placeholderId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/S_TemplateDocumentPlaceholder", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_TemplateDocumentPlaceholder>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(templateDocumentId, result.idTemplateDocument);
            Assert.Equal(placeholderId, result.idPlaceholder);

            // Verify in database
            var dbRecord = DatabaseHelper.RunQueryList<S_TemplateDocumentPlaceholder>(_schemaName, @"
                SELECT id, ""idTemplateDocument"", ""idPlaceholder"" FROM ""S_TemplateDocumentPlaceholder"" WHERE id = @id",
                reader => new S_TemplateDocumentPlaceholder
                {
                    id = reader.GetInt32(0),
                    idTemplateDocument = reader.GetInt32(1),
                    idPlaceholder = reader.GetInt32(2)
                },
                new Dictionary<string, object> { ["@id"] = result.id }).FirstOrDefault();

            Assert.NotNull(dbRecord);
            Assert.Equal(templateDocumentId, dbRecord.idTemplateDocument);
            Assert.Equal(placeholderId, dbRecord.idPlaceholder);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalTemplateId = CreateDocumentTemplateWithTranslation("Original Template");
            var originalPlaceholderId = CreatePlaceholder("Original Placeholder");

            var id = CreateTemplateDocumentPlaceholder(originalTemplateId, originalPlaceholderId);

            var newTemplateId = CreateDocumentTemplateWithTranslation("New Template");
            var newPlaceholderId = CreatePlaceholder("New Placeholder");

            var request = new UpdateS_TemplateDocumentPlaceholderRequest
            {
                id = id,
                idTemplateDocument = newTemplateId,
                idPlaceholder = newPlaceholderId
            };

            // Act
            var response = await _client.PutAsync($"/S_TemplateDocumentPlaceholder/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_TemplateDocumentPlaceholder>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newTemplateId, result.idTemplateDocument);
            Assert.Equal(newPlaceholderId, result.idPlaceholder);

            // Verify in database
            var updated = DatabaseHelper.RunQueryList<S_TemplateDocumentPlaceholder>(_schemaName, @"
                SELECT ""idTemplateDocument"", ""idPlaceholder"" FROM ""S_TemplateDocumentPlaceholder"" WHERE id = @id",
                reader => new S_TemplateDocumentPlaceholder
                {
                    idTemplateDocument = reader.GetInt32(0),
                    idPlaceholder = reader.GetInt32(1)
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();

            Assert.NotNull(updated);
            Assert.Equal(newTemplateId, updated.idTemplateDocument);
            Assert.Equal(newPlaceholderId, updated.idPlaceholder);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var templateDocumentId = CreateDocumentTemplateWithTranslation();
            var placeholderId = CreatePlaceholder("Delete Placeholder");

            var id = CreateTemplateDocumentPlaceholder(templateDocumentId, placeholderId);

            // Act
            var response = await _client.DeleteAsync($"/S_TemplateDocumentPlaceholder/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database that it was deleted
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM ""S_TemplateDocumentPlaceholder"" WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple entries
            var templateDocumentId = CreateDocumentTemplateWithTranslation();

            for (int i = 1; i <= 5; i++)
            {
                var placeholderId = CreatePlaceholder($"Paged Placeholder {i}");
                CreateTemplateDocumentPlaceholder(templateDocumentId, placeholderId);
            }

            // Act
            var response = await _client.GetAsync("/S_TemplateDocumentPlaceholder/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<S_TemplateDocumentPlaceholder>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task GetByidTemplateDocument_ReturnsOkResponse()
        {
            // Arrange
            var templateDocumentId1 = CreateDocumentTemplateWithTranslation("Template Doc 1");
            var templateDocumentId2 = CreateDocumentTemplateWithTranslation("Template Doc 2");

            var placeholderId1 = CreatePlaceholder("Filter Placeholder 1");
            var placeholderId2 = CreatePlaceholder("Filter Placeholder 2");
            var placeholderId3 = CreatePlaceholder("Filter Placeholder 3");

            CreateTemplateDocumentPlaceholder(templateDocumentId1, placeholderId1);
            CreateTemplateDocumentPlaceholder(templateDocumentId1, placeholderId2);
            CreateTemplateDocumentPlaceholder(templateDocumentId2, placeholderId3);

            // Act
            var response = await _client.GetAsync($"/S_TemplateDocumentPlaceholder/GetByidTemplateDocument?idTemplateDocument={templateDocumentId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_TemplateDocumentPlaceholder>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, tdp => Assert.Equal(templateDocumentId1, tdp.idTemplateDocument));
            Assert.Contains(result, tdp => tdp.idPlaceholder == placeholderId1);
            Assert.Contains(result, tdp => tdp.idPlaceholder == placeholderId2);
        }

        [Fact]
        public async Task GetByidPlaceholder_ReturnsOkResponse()
        {
            // Arrange
            var templateDocumentId1 = CreateDocumentTemplateWithTranslation("Doc Template A");
            var templateDocumentId2 = CreateDocumentTemplateWithTranslation("Doc Template B");

            var placeholderId1 = CreatePlaceholder("Placeholder Filter 1");
            var placeholderId2 = CreatePlaceholder("Placeholder Filter 2");

            CreateTemplateDocumentPlaceholder(templateDocumentId1, placeholderId1);
            CreateTemplateDocumentPlaceholder(templateDocumentId2, placeholderId1);
            CreateTemplateDocumentPlaceholder(templateDocumentId2, placeholderId2);

            // Act
            var response = await _client.GetAsync($"/S_TemplateDocumentPlaceholder/GetByidPlaceholder?idPlaceholder={placeholderId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_TemplateDocumentPlaceholder>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, tdp => Assert.Equal(placeholderId1, tdp.idPlaceholder));
            Assert.Contains(result, tdp => tdp.idTemplateDocument == templateDocumentId1);
            Assert.Contains(result, tdp => tdp.idTemplateDocument == templateDocumentId2);
        }

        // Helper methods to create test data
        private int CreateS_Query(string name, string code, string queryText)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_Query"" (name, code, query, created_at, updated_at) 
                VALUES (@name, @code, @query, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@query"] = queryText,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateS_PlaceHolderType(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_PlaceHolderType"" (name, code, created_at, updated_at) 
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

        private int CreatePlaceholder(string name)
        {
            // Create a query and placeholder type first
            var queryId = CreateS_Query($"{name} Query", name.ToLower().Replace(" ", "_") + "_query", $"SELECT * FROM {name.ToLower().Replace(" ", "_")}");
            var placeholderTypeId = CreateS_PlaceHolderType($"{name} Type", name.ToLower().Replace(" ", "_") + "_type");

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_PlaceHolderTemplate"" (name, value, code, ""idQuery"", ""idPlaceholderType"", created_at, updated_at) 
                VALUES (@name, @value, @code, @idQuery, @idPlaceholderType, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@value"] = $"{{{{ {name.ToLower().Replace(" ", "_")}_value }}}}",
                    ["@code"] = name.ToLower().Replace(" ", "_"),
                    ["@idQuery"] = queryId,
                    ["@idPlaceholderType"] = placeholderTypeId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDocumentTemplateType()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplateType"" (name, code, created_at, updated_at) 
                VALUES (@name, @code, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = "Test Document Template Type",
                    ["@code"] = "test_doc_template_type",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDocumentTemplate(string name = "Test Document Template")
        {
            var typeId = CreateDocumentTemplateType();

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplate"" (name, code, ""idDocumentType"", created_at, updated_at) 
                VALUES (@name, @code, @idDocumentType, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = name.ToLower().Replace(" ", "_"),
                    ["@idDocumentType"] = typeId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateLanguage()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""Language"" (name, code, created_at, updated_at) 
                VALUES (@name, @code, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = "Test Language",
                    ["@code"] = "test_lang",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDocumentTemplateTranslation(int documentTemplateId, int languageId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_DocumentTemplateTranslation"" (template, ""idDocumentTemplate"", ""idLanguage"", created_at, updated_at) 
                VALUES (@template, @idDocumentTemplate, @idLanguage, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@template"] = "<p>Test template content</p>",
                    ["@idDocumentTemplate"] = documentTemplateId,
                    ["@idLanguage"] = languageId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDocumentTemplateWithTranslation(string name = "Test Document Template")
        {
            var documentTemplateId = CreateDocumentTemplate(name);
            var languageId = CreateLanguage();
            var translationId = CreateDocumentTemplateTranslation(documentTemplateId, languageId);

            return translationId; // Return the translation ID as it's used as the document template ID in S_TemplateDocumentPlaceholder
        }

        private int CreateTemplateDocumentPlaceholder(int templateDocumentId, int placeholderId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_TemplateDocumentPlaceholder"" (""idTemplateDocument"", ""idPlaceholder"", created_at, updated_at) 
                VALUES (@idTemplateDocument, @idPlaceholder, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@idTemplateDocument"] = templateDocumentId,
                    ["@idPlaceholder"] = placeholderId,
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