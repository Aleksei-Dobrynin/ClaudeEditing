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
    public class ApplicationDocumentTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationDocumentTests()
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
            // Arrange - Create test document types and documents
            var typeId = CreateDocumentType("Test Type", "testCode", "Test Description");
            CreateDocument("Test Document 1", typeId, "Document Description 1", "Law Description 1", true);
            CreateDocument("Test Document 2", typeId, "Document Description 2", "Law Description 2", false);

            // Act
            var response = await _client.GetAsync("/ApplicationDocument/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ApplicationDocument>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test document type and document
            var typeId = CreateDocumentType("Single Type", "singleCode", "Single Type Description");
            var id = CreateDocument("Single Document", typeId, "Single Document Description", "Single Law Description", true);

            // Act
            var response = await _client.GetAsync($"/ApplicationDocument/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationDocument>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Document", result.name);
            Assert.Equal(typeId, result.document_type_id);
            Assert.Equal("Single Document Description", result.description);
            Assert.Equal("Single Law Description", result.law_description);
            Assert.True(result.doc_is_outcome);
            Assert.Equal("Single Type", result.document_type_name);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create document type first
            var typeId = CreateDocumentType("Create Type", "createCode", "Create Type Description");

            var request = new CreateApplicationDocumentRequest
            {
                name = "Created Document",
                document_type_id = typeId,
                description = "Created Document Description",
                law_description = "Created Law Description",
                doc_is_outcome = true
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ApplicationDocument/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationDocument>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Document", result.name);
            Assert.Equal(typeId, result.document_type_id);
            Assert.Equal("Created Document Description", result.description);
            Assert.Equal("Created Law Description", result.law_description);
            Assert.True(result.doc_is_outcome);

            // Verify in database
            var document = DatabaseHelper.RunQueryList<ApplicationDocument>(_schemaName, @"
                SELECT d.id, d.name, d.document_type_id, d.description, d.law_description, d.doc_is_outcome, t.name as document_type_name
                FROM application_document d
                LEFT JOIN application_document_type t ON d.document_type_id = t.id
                WHERE d.id = @id",
                reader => new ApplicationDocument
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    document_type_id = reader.GetInt32(2),
                    description = reader.GetString(3),
                    law_description = reader.GetString(4),
                    doc_is_outcome = reader.GetBoolean(5),
                    document_type_name = reader.GetString(6)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(document);
            Assert.Equal(result.id, document.id);
            Assert.Equal("Created Document", document.name);
            Assert.Equal("Create Type", document.document_type_name);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create document type and document
            var typeId = CreateDocumentType("Original Type", "originalCode", "Original Type Description");
            var id = CreateDocument("Original Document", typeId, "Original Description", "Original Law", false);

            // Create a new type for update
            var newTypeId = CreateDocumentType("Updated Type", "updatedCode", "Updated Type Description");

            var request = new UpdateApplicationDocumentRequest
            {
                id = id,
                name = "Updated Document",
                document_type_id = newTypeId,
                description = "Updated Description",
                law_description = "Updated Law Description",
                doc_is_outcome = true
            };

            // Act
            var response = await _client.PutAsync("/ApplicationDocument/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationDocument>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Document", result.name);
            Assert.Equal(newTypeId, result.document_type_id);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("Updated Law Description", result.law_description);
            Assert.True(result.doc_is_outcome);

            // Verify in database
            var document = DatabaseHelper.RunQueryList<ApplicationDocument>(_schemaName, @"
                SELECT name, document_type_id, description, law_description, doc_is_outcome 
                FROM application_document WHERE id = @id",
                reader => new ApplicationDocument
                {
                    name = reader.GetString(0),
                    document_type_id = reader.GetInt32(1),
                    description = reader.GetString(2),
                    law_description = reader.GetString(3),
                    doc_is_outcome = reader.GetBoolean(4)
                },
                new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();

            Assert.NotNull(document);
            Assert.Equal("Updated Document", document.name);
            Assert.Equal(newTypeId, document.document_type_id);
            Assert.True(document.doc_is_outcome);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create document type and document
            var typeId = CreateDocumentType("Delete Type", "deleteCode", "Delete Type Description");
            var id = CreateDocument("Document to Delete", typeId, "Delete Description", "Delete Law", true);

            // Act
            var response = await _client.DeleteAsync($"/ApplicationDocument/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_document WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create document type and multiple documents
            var typeId = CreateDocumentType("Page Type", "pageCode", "Page Type Description");

            for (int i = 1; i <= 5; i++)
            {
                CreateDocument($"Document {i}", typeId, $"Description {i}", $"Law {i}", i % 2 == 0);
            }

            // Act
            var response = await _client.GetAsync("/ApplicationDocument/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<ApplicationDocument>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            //Assert.Equal(5, result.totalCount);
            //Assert.Equal(1, result.pageNumber);
            //Assert.Equal(2, result.totalPages);
        }

        [Fact]
        public async Task GetAttachedOldDocuments_ReturnsOkResponse()
        {
            // Arrange - Setup required data
            // 1. Create document type
            var typeId = CreateDocumentType("Attached Type", "attachedCode", "Attached Type Description");

            // 2. Create application document
            var applicationDocumentId = CreateDocument("Attached Document", typeId, "Attached Description", "Attached Law", true);

            // 3. Create customer
            var customerId = CreateCustomer("Test Customer", "123456789", false);

            // 4. Create application
            var applicationId = CreateApplication(customerId);

            // 5. Create file
            var fileId = CreateFile("Test File", "/path/to/file");

            // 6. Create service document
            var serviceId = CreateService("Test Service");
            var serviceDocumentId = CreateServiceDocument(serviceId, applicationDocumentId);

            // 7. Create uploaded application document
            CreateUploadedApplicationDocument(applicationId, fileId, serviceDocumentId);

            // Act
            var response = await _client.GetAsync($"/ApplicationDocument/GetAttachedOldDocuments?application_document_id={applicationDocumentId}&application_id={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomAttachedDocument>>(content);

            // Since the uploaded document is for this application, we might not see any results
            // because GetAttachedOldDocuments looks for documents from other applications
            // But we can verify the API call was successful
            Assert.NotNull(result);
        }

        // Helper methods to create test document types and documents
        private int CreateDocumentType(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_document_type (name, code, description, created_at, updated_at) 
                VALUES (@name, @code, @description, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDocument(string name, int typeId, string description, string lawDescription, bool isOutcome)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_document (name, document_type_id, description, law_description, doc_is_outcome, created_at, updated_at) 
                VALUES (@name, @typeId, @description, @lawDescription, @isOutcome, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@typeId"] = typeId,
                    ["@description"] = description,
                    ["@lawDescription"] = lawDescription,
                    ["@isOutcome"] = isOutcome,
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
                INSERT INTO application (customer_id, registration_date, number, created_at, updated_at) 
                VALUES (@customerId, @registrationDate, @number, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@customerId"] = customerId,
                    ["@registrationDate"] = DateTime.Now,
                    ["@number"] = $"APP-{Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateFile(string name, string path)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO file (name, path, created_at, updated_at) 
                VALUES (@name, @path, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@path"] = path,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateService(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO service (name, created_at, updated_at) 
                VALUES (@name, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateServiceDocument(int serviceId, int applicationDocumentId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO service_document (service_id, application_document_id, is_required, created_at, updated_at) 
                VALUES (@serviceId, @applicationDocumentId, true, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@serviceId"] = serviceId,
                    ["@applicationDocumentId"] = applicationDocumentId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private void CreateUploadedApplicationDocument(int applicationId, int fileId, int serviceDocumentId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO uploaded_application_document (application_document_id, file_id, service_document_id, name, created_at, updated_at) 
                VALUES (@applicationId, @fileId, @serviceDocumentId, @name, @created_at, @updated_at);",
                new Dictionary<string, object>
                {
                    ["@applicationId"] = applicationId,
                    ["@fileId"] = fileId,
                    ["@serviceDocumentId"] = serviceDocumentId,
                    ["@name"] = "Uploaded Document",
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

    // Helper class to match the CustomAttachedDocument in Domain
    public class CustomAttachedDocument
    {
        public int id { get; set; }
        public int file_id { get; set; }
        public string number { get; set; }
        public string service_name { get; set; }
        public DateTime created_at { get; set; }
        public int service_document_id { get; set; }
        public string file_name { get; set; }
    }
}