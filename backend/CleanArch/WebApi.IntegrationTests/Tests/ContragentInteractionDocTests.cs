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
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;
using System.Text;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ContragentInteractionDocTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ContragentInteractionDocTests()
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
            var (interactionId, fileId) = await CreatePrerequisites();
            int docId = CreateInteractionDoc(interactionId, fileId);

            // Act
            var response = await _client.GetAsync("/contragent_interaction_doc/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<contragent_interaction_doc>>(content);

            Assert.NotNull(result);
            Assert.Contains(result, d => d.id == docId);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (interactionId, fileId) = await CreatePrerequisites();

            // Create multiple documents
            for (int i = 0; i < 5; i++)
            {
                CreateInteractionDoc(interactionId, fileId, $"Test message {i}");
            }

            // Act
            var response = await _client.GetAsync("/contragent_interaction_doc/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<contragent_interaction_doc>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(3, result.pageSize);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (interactionId, fileId) = await CreatePrerequisites();
            int docId = CreateInteractionDoc(interactionId, fileId, "Test message");

            // Act
            var response = await _client.GetAsync($"/contragent_interaction_doc/{docId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<contragent_interaction_doc>(content);

            Assert.NotNull(result);
            Assert.Equal(docId, result.id);
            Assert.Equal(interactionId, result.interaction_id);
            Assert.Equal(fileId, result.file_id);
            Assert.Equal("Test message", result.message);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create prerequisites
            var (interactionId, _) = await CreatePrerequisites();

            // Check if optional columns exist in the database schema
            var columns = DatabaseHelper.RunQueryList<string>(_schemaName, @"
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'contragent_interaction_doc'",
                reader => reader.GetString(0),
                new Dictionary<string, object>()
            );

            var hasIsPortal = columns.Contains("is_portal");
            var hasForCustomer = columns.Contains("for_customer");

            // Prepare multipart form content
            var multipartContent = new MultipartFormDataContent();

            // Add file content
            var fileContent = new ByteArrayContent(Encoding.UTF8.GetBytes("Test file content"));
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            multipartContent.Add(fileContent, "document.file", "test_file.txt");
            multipartContent.Add(new StringContent("Test Document"), "document.name");
            multipartContent.Add(new StringContent(interactionId.ToString()), "interaction_id");
            multipartContent.Add(new StringContent("Test message from client"), "message");

            // Only add optional fields if they exist in the schema
            if (hasIsPortal)
            {
                multipartContent.Add(new StringContent("true"), "is_portal");
            }

            if (hasForCustomer)
            {
                multipartContent.Add(new StringContent("true"), "for_customer");
            }

            // Set file_id to 0 as it will be generated from the uploaded file
            multipartContent.Add(new StringContent("0"), "file_id");

            // Act
            var response = await _client.PostAsync("/contragent_interaction_doc", multipartContent);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<contragent_interaction_doc>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(interactionId, result.interaction_id);
            Assert.NotNull(result.file_id);
            Assert.Equal("Test message from client", result.message);

            // Only verify optional fields if they exist in the schema
            if (hasIsPortal)
            {
                Assert.True(result.is_portal);
            }

            if (hasForCustomer)
            {
                Assert.True(result.for_customer);
            }

            // Verify in database
            var savedDoc = await GetInteractionDocFromDb(result.id);
            Assert.NotNull(savedDoc);
            Assert.Equal(interactionId, savedDoc.interaction_id);
            Assert.Equal("Test message from client", savedDoc.message);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (interactionId, fileId) = await CreatePrerequisites();
            int docId = CreateInteractionDoc(interactionId, fileId);

            // Create another file for update
            int newFileId = CreateFile("Updated file");

            var updateRequest = new Updatecontragent_interaction_docRequest
            {
                id = docId,
                interaction_id = interactionId,
                file_id = newFileId
            };

            // Act
            var response = await _client.PutAsync($"/contragent_interaction_doc/{docId}", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<contragent_interaction_doc>(content);

            Assert.NotNull(result);
            Assert.Equal(docId, result.id);
            Assert.Equal(interactionId, result.interaction_id);
            Assert.Equal(newFileId, result.file_id);

            // Verify in database
            var updatedDoc = await GetInteractionDocFromDb(docId);
            Assert.NotNull(updatedDoc);
            Assert.Equal(newFileId, updatedDoc.file_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (interactionId, fileId) = await CreatePrerequisites();
            int docId = CreateInteractionDoc(interactionId, fileId);

            // Act
            var response = await _client.DeleteAsync($"/contragent_interaction_doc/{docId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(docId, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM contragent_interaction_doc WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = docId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetByfile_id_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (interactionId, fileId) = await CreatePrerequisites();
            int docId1 = CreateInteractionDoc(interactionId, fileId, "Doc 1");

            // Create another interaction with the same file
            var (otherInteractionId, _) = await CreatePrerequisites();
            int docId2 = CreateInteractionDoc(otherInteractionId, fileId, "Doc 2");

            // Create another doc with a different file
            int otherFileId = CreateFile("Other file");
            CreateInteractionDoc(interactionId, otherFileId, "Other file doc");

            // Act
            var response = await _client.GetAsync($"/contragent_interaction_doc/GetByfile_id?file_id={fileId}");

            // If the test fails, log the response for debugging
            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Error response: {errorResponse}");
                Console.WriteLine($"Status code: {response.StatusCode}");
            }

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<contragent_interaction_doc>>(content);

            Assert.NotNull(result);

            // Verify we have documents matching our file
            var docIds = result.Select(d => d.id).ToList();
            Assert.Contains(docId1, docIds);
            Assert.Contains(docId2, docIds);

            // Verify all returned docs have our file ID
            foreach (var doc in result)
            {
                Assert.Equal(fileId, doc.file_id);
            }
        }

        [Fact]
        public async Task GetByinteraction_id_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (interactionId, fileId) = await CreatePrerequisites();
            int docId1 = CreateInteractionDoc(interactionId, fileId, "Doc 1");

            // Create another file for the same interaction
            int otherFileId = CreateFile("Other file");
            int docId2 = CreateInteractionDoc(interactionId, otherFileId, "Doc 2");

            // Create another interaction and doc
            var (otherInteractionId, _) = await CreatePrerequisites();
            CreateInteractionDoc(otherInteractionId, fileId, "Other interaction doc");

            // Act
            var response = await _client.GetAsync($"/contragent_interaction_doc/GetByinteraction_id?interaction_id={interactionId}");

            // If the test fails, log the response for debugging
            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Error response: {errorResponse}");
                Console.WriteLine($"Status code: {response.StatusCode}");
            }

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<contragent_interaction_doc>>(content);

            Assert.NotNull(result);
            // Verify we have documents matching our interaction
            var docIds = result.Select(d => d.id).ToList();
            Assert.Contains(docId1, docIds);
            Assert.Contains(docId2, docIds);
            // Verify all returned docs belong to our interaction
            foreach (var doc in result)
            {
                Assert.Equal(interactionId, doc.interaction_id);
            }
        }

        #region Helper Methods

        private async Task<(int interactionId, int fileId)> CreatePrerequisites()
        {
            // Create required entities for contragent_interaction_doc
            int districtId = CreateDistrict("Test District");
            int customerId = CreateCustomer("Test Customer", "123456789", false);
            int archObjectId = CreateArchObject("Test Object", "Test Address", districtId);
            int serviceId = CreateService("Test Service", 10);
            int statusId = CreateStatus("Review", "review");
            int workflowId = CreateWorkflow("Test Workflow");

            // Create application and link with arch object
            int applicationId = CreateApplication(customerId, serviceId, statusId, workflowId);
            LinkApplicationToArchObject(applicationId, archObjectId);

            int contragentId = CreateContragent("Test Contragent");
            int interactionId = CreateContragentInteraction(applicationId, contragentId, "Test Interaction");

            // Create file
            int fileId = CreateFile("Test File");

            return (interactionId, fileId);
        }

        private int CreateInteractionDoc(int interactionId, int fileId, string message = null)
        {
            // Directly use the known required columns
            var sql = @"
                INSERT INTO contragent_interaction_doc (
                    interaction_id, file_id, message, type_org, created_at, updated_at
                ) VALUES (
                    @interaction_id, @file_id, @message, @type_org, @created_at, @updated_at
                ) RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@interaction_id"] = interactionId,
                ["@file_id"] = fileId,
                ["@message"] = message ?? "Test document message",
                ["@type_org"] = "bga",
                ["@created_at"] = DateTime.Now,
                ["@updated_at"] = DateTime.Now
            };

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        private int CreateFile(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO file (name, path, created_at, updated_at)
                VALUES (@name, @path, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@path"] = $"/uploads/{Guid.NewGuid()}.txt",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDistrict(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO district (name, created_at, updated_at)
                VALUES (@name, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
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

        private int CreateArchObject(string name, string address, int districtId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO arch_object (name, address, district_id, created_at, updated_at)
                VALUES (@name, @address, @district_id, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@address"] = address,
                    ["@district_id"] = districtId,
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

        private void LinkApplicationToArchObject(int applicationId, int archObjectId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_object (application_id, arch_object_id, created_at, updated_at)
                VALUES (@application_id, @arch_object_id, @created_at, @updated_at);",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@arch_object_id"] = archObjectId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateContragent(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO contragent (name, created_at, updated_at)
                VALUES (@name, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateContragentInteraction(int applicationId, int contragentId, string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO contragent_interaction (
                    application_id, contragent_id, name, description, progress, status, created_at, updated_at
                ) VALUES (
                    @application_id, @contragent_id, @name, @description, @progress, @status, @created_at, @updated_at
                ) RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@contragent_id"] = contragentId,
                    ["@name"] = name,
                    ["@description"] = "Test description",
                    ["@progress"] = 0,
                    ["@status"] = "В работе",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<contragent_interaction_doc> GetInteractionDocFromDb(int id)
        {
            // Get column information from the schema
            var columns = DatabaseHelper.RunQueryList<string>(_schemaName, @"
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'contragent_interaction_doc'
                ORDER BY ordinal_position",
                reader => reader.GetString(0),
                new Dictionary<string, object>()
            );

            var columnsList = string.Join(", ", columns);

            // Build a dynamic mapper based on available columns
            return DatabaseHelper.RunQueryList<contragent_interaction_doc>(_schemaName, $@"
                SELECT {columnsList}
                FROM contragent_interaction_doc
                WHERE id = @id",
                reader =>
                {
                    var doc = new contragent_interaction_doc();

                    // Keep track of column index
                    var colIndex = 0;

                    // Set base properties that should always exist
                    doc.id = reader.GetInt32(colIndex++);

                    // Map each column dynamically based on name
                    for (int i = 1; i < columns.Count; i++)
                    {
                        var colName = columns[i];

                        switch (colName)
                        {
                            case "file_id":
                                doc.file_id = reader.IsDBNull(i) ? null : reader.GetInt32(i);
                                break;
                            case "interaction_id":
                                doc.interaction_id = reader.GetInt32(i);
                                break;
                            case "user_id":
                                doc.user_id = reader.IsDBNull(i) ? null : reader.GetInt32(i);
                                break;
                            case "type_org":
                                doc.type_org = reader.IsDBNull(i) ? null : reader.GetString(i);
                                break;
                            case "message":
                                doc.message = reader.IsDBNull(i) ? null : reader.GetString(i);
                                break;
                            case "sent_at":
                                doc.sent_at = reader.IsDBNull(i) ? DateTime.Now : reader.GetDateTime(i);
                                break;
                            case "for_customer":
                                doc.for_customer = reader.IsDBNull(i) ? null : reader.GetBoolean(i);
                                break;
                            case "is_portal":
                                doc.is_portal = reader.IsDBNull(i) ? null : reader.GetBoolean(i);
                                break;
                            case "created_at":
                                doc.created_at = reader.IsDBNull(i) ? null : reader.GetDateTime(i);
                                break;
                            case "updated_at":
                                doc.updated_at = reader.IsDBNull(i) ? null : reader.GetDateTime(i);
                                break;
                            case "created_by":
                                doc.created_by = reader.IsDBNull(i) ? null : reader.GetInt32(i);
                                break;
                            case "updated_by":
                                doc.updated_by = reader.IsDBNull(i) ? null : reader.GetInt32(i);
                                break;
                        }
                    }

                    return doc;
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