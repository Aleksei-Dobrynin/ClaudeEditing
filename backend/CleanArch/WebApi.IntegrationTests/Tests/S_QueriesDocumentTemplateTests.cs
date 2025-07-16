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
    public class S_QueriesDocumentTemplateTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public S_QueriesDocumentTemplateTests()
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
            var documentTemplateId = CreateDocumentTemplateWithTranslation();
            var queryId1 = CreateS_Query("Test Query 1", "test_query_1", "SELECT * FROM test1");
            var queryId2 = CreateS_Query("Test Query 2", "test_query_2", "SELECT * FROM test2");

            CreateQueriesDocumentTemplate(documentTemplateId, queryId1);
            CreateQueriesDocumentTemplate(documentTemplateId, queryId2);

            // Act
            var response = await _client.GetAsync("/S_QueriesDocumentTemplate/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_QueriesDocumentTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, qdt => qdt.idQuery == queryId1);
            Assert.Contains(result, qdt => qdt.idQuery == queryId2);
            Assert.All(result, qdt => Assert.Equal(documentTemplateId, qdt.idDocumentTemplate));
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var documentTemplateId = CreateDocumentTemplateWithTranslation();
            var queryId = CreateS_Query("Single Query", "single_query", "SELECT * FROM single");

            var id = CreateQueriesDocumentTemplate(documentTemplateId, queryId);

            // Act
            var response = await _client.GetAsync($"/S_QueriesDocumentTemplate/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_QueriesDocumentTemplate>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(documentTemplateId, result.idDocumentTemplate);
            Assert.Equal(queryId, result.idQuery);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var documentTemplateId = CreateDocumentTemplateWithTranslation();
            var queryId = CreateS_Query("Create Query", "create_query", "SELECT * FROM create_test");

            var request = new CreateS_QueriesDocumentTemplateRequest
            {
                idDocumentTemplate = documentTemplateId,
                idQuery = queryId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/S_QueriesDocumentTemplate", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_QueriesDocumentTemplate>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(documentTemplateId, result.idDocumentTemplate);
            Assert.Equal(queryId, result.idQuery);

            // Verify in database
            var dbRecord = DatabaseHelper.RunQueryList<S_QueriesDocumentTemplate>(_schemaName, @"
                SELECT id, ""idDocumentTemplate"", ""idQuery"" FROM ""S_QueriesDocumentTemplate"" WHERE id = @id",
                reader => new S_QueriesDocumentTemplate
                {
                    id = reader.GetInt32(0),
                    idDocumentTemplate = reader.GetInt32(1),
                    idQuery = reader.GetInt32(2)
                },
                new Dictionary<string, object> { ["@id"] = result.id }).FirstOrDefault();

            Assert.NotNull(dbRecord);
            Assert.Equal(documentTemplateId, dbRecord.idDocumentTemplate);
            Assert.Equal(queryId, dbRecord.idQuery);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalDocumentTemplateId = CreateDocumentTemplateWithTranslation();
            var originalQueryId = CreateS_Query("Original Query", "original_query", "SELECT * FROM original");

            var id = CreateQueriesDocumentTemplate(originalDocumentTemplateId, originalQueryId);

            var newDocumentTemplateId = CreateDocumentTemplateWithTranslation("New Template");
            var newQueryId = CreateS_Query("New Query", "new_query", "SELECT * FROM new");

            var request = new UpdateS_QueriesDocumentTemplateRequest
            {
                id = id,
                idDocumentTemplate = newDocumentTemplateId,
                idQuery = newQueryId
            };

            // Act
            var response = await _client.PutAsync($"/S_QueriesDocumentTemplate/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<S_QueriesDocumentTemplate>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newDocumentTemplateId, result.idDocumentTemplate);
            Assert.Equal(newQueryId, result.idQuery);

            // Verify in database
            var updated = DatabaseHelper.RunQueryList<S_QueriesDocumentTemplate>(_schemaName, @"
                SELECT ""idDocumentTemplate"", ""idQuery"" FROM ""S_QueriesDocumentTemplate"" WHERE id = @id",
                reader => new S_QueriesDocumentTemplate
                {
                    idDocumentTemplate = reader.GetInt32(0),
                    idQuery = reader.GetInt32(1)
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();

            Assert.NotNull(updated);
            Assert.Equal(newDocumentTemplateId, updated.idDocumentTemplate);
            Assert.Equal(newQueryId, updated.idQuery);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var documentTemplateId = CreateDocumentTemplateWithTranslation();
            var queryId = CreateS_Query("Delete Query", "delete_query", "SELECT * FROM delete_test");

            var id = CreateQueriesDocumentTemplate(documentTemplateId, queryId);

            // Act
            var response = await _client.DeleteAsync($"/S_QueriesDocumentTemplate/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database that it was deleted
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM ""S_QueriesDocumentTemplate"" WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple entries
            var documentTemplateId = CreateDocumentTemplateWithTranslation();

            for (int i = 1; i <= 5; i++)
            {
                var queryId = CreateS_Query($"Paged Query {i}", $"paged_query_{i}", $"SELECT * FROM paged_test_{i}");
                CreateQueriesDocumentTemplate(documentTemplateId, queryId);
            }

            // Act
            var response = await _client.GetAsync("/S_QueriesDocumentTemplate/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<S_QueriesDocumentTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task GetByidDocumentTemplate_ReturnsOkResponse()
        {
            // Arrange
            var documentTemplateId1 = CreateDocumentTemplateWithTranslation("Template 1");
            var documentTemplateId2 = CreateDocumentTemplateWithTranslation("Template 2");

            var queryId1 = CreateS_Query("Filter Query 1", "filter_query_1", "SELECT * FROM filter1");
            var queryId2 = CreateS_Query("Filter Query 2", "filter_query_2", "SELECT * FROM filter2");
            var queryId3 = CreateS_Query("Filter Query 3", "filter_query_3", "SELECT * FROM filter3");

            CreateQueriesDocumentTemplate(documentTemplateId1, queryId1);
            CreateQueriesDocumentTemplate(documentTemplateId1, queryId2);
            CreateQueriesDocumentTemplate(documentTemplateId2, queryId3);

            // Act
            var response = await _client.GetAsync($"/S_QueriesDocumentTemplate/GetByidDocumentTemplate?idDocumentTemplate={documentTemplateId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_QueriesDocumentTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, qdt => Assert.Equal(documentTemplateId1, qdt.idDocumentTemplate));
            Assert.Contains(result, qdt => qdt.idQuery == queryId1);
            Assert.Contains(result, qdt => qdt.idQuery == queryId2);
        }

        [Fact]
        public async Task GetByidQuery_ReturnsOkResponse()
        {
            // Arrange
            var documentTemplateId1 = CreateDocumentTemplateWithTranslation("Template A");
            var documentTemplateId2 = CreateDocumentTemplateWithTranslation("Template B");

            var queryId1 = CreateS_Query("Query Filter 1", "query_filter_1", "SELECT * FROM query_filter1");
            var queryId2 = CreateS_Query("Query Filter 2", "query_filter_2", "SELECT * FROM query_filter2");

            CreateQueriesDocumentTemplate(documentTemplateId1, queryId1);
            CreateQueriesDocumentTemplate(documentTemplateId2, queryId1);
            CreateQueriesDocumentTemplate(documentTemplateId2, queryId2);

            // Act
            var response = await _client.GetAsync($"/S_QueriesDocumentTemplate/GetByidQuery?idQuery={queryId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<S_QueriesDocumentTemplate>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, qdt => Assert.Equal(queryId1, qdt.idQuery));
            Assert.Contains(result, qdt => qdt.idDocumentTemplate == documentTemplateId1);
            Assert.Contains(result, qdt => qdt.idDocumentTemplate == documentTemplateId2);
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

            return translationId; // Return the translation ID as it's used as the document template ID in S_QueriesDocumentTemplate
        }

        private int CreateQueriesDocumentTemplate(int documentTemplateId, int queryId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""S_QueriesDocumentTemplate"" (""idDocumentTemplate"", ""idQuery"", created_at, updated_at) 
                VALUES (@idDocumentTemplate, @idQuery, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@idDocumentTemplate"] = documentTemplateId,
                    ["@idQuery"] = queryId,
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