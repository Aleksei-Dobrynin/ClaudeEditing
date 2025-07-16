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
    public class LegalRecordObjectTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public LegalRecordObjectTests()
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
            var statusId = CreateLegalRegistryStatus("Active", "active", "Active status");
            var recordId = CreateLegalRecord("Test Subject", "Test Complainant", "Test Decision", statusId);
            var objectId1 = CreateLegalObject("Object 1", "Address 1");
            var objectId2 = CreateLegalObject("Object 2", "Address 2");

            CreateLegalRecordObject(recordId, objectId1);
            CreateLegalRecordObject(recordId, objectId2);

            // Act
            var response = await _client.GetAsync("/legal_record_object/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_record_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var statusId = CreateLegalRegistryStatus("Active", "active", "Active status");
            var recordId = CreateLegalRecord("Test Subject", "Test Complainant", "Test Decision", statusId);
            var objectId = CreateLegalObject("Test Object", "Test Address");
            var id = CreateLegalRecordObject(recordId, objectId);

            // Act
            var response = await _client.GetAsync($"/legal_record_object/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_record_object>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(recordId, result.id_record);
            Assert.Equal(objectId, result.id_object);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalRegistryStatus("Active", "active", "Active status");
            var recordId = CreateLegalRecord("Test Subject", "Test Complainant", "Test Decision", statusId);
            var objectId = CreateLegalObject("New Object", "New Address");

            var request = new Createlegal_record_objectRequest
            {
                id_record = recordId,
                id_object = objectId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/legal_record_object", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_record_object>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(recordId, result.id_record);
            Assert.Equal(objectId, result.id_object);

            // Verify in database
            var recordObject = DatabaseHelper.RunQueryList<legal_record_object>(_schemaName, @"
                SELECT id, id_record, id_object FROM legal_record_object WHERE id = @id",
                reader => new legal_record_object
                {
                    id = reader.GetInt32(0),
                    id_record = reader.GetInt32(1),
                    id_object = reader.GetInt32(2)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(recordObject);
            Assert.Equal(result.id, recordObject.id);
            Assert.Equal(recordId, recordObject.id_record);
            Assert.Equal(objectId, recordObject.id_object);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalRegistryStatus("Active", "active", "Active status");
            var recordId = CreateLegalRecord("Test Subject", "Test Complainant", "Test Decision", statusId);
            var originalObjectId = CreateLegalObject("Original Object", "Original Address");
            var newObjectId = CreateLegalObject("New Object", "New Address");

            var id = CreateLegalRecordObject(recordId, originalObjectId);

            var request = new Updatelegal_record_objectRequest
            {
                id = id,
                id_record = recordId,
                id_object = newObjectId
            };

            // Act
            var response = await _client.PutAsync($"/legal_record_object/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_record_object>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(recordId, result.id_record);
            Assert.Equal(newObjectId, result.id_object);

            // Verify in database
            var recordObject = DatabaseHelper.RunQueryList<legal_record_object>(_schemaName, @"
                SELECT id_record, id_object FROM legal_record_object WHERE id = @id",
                reader => new legal_record_object
                {
                    id_record = reader.GetInt32(0),
                    id_object = reader.GetInt32(1)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(recordObject);
            Assert.Equal(recordId, recordObject.id_record);
            Assert.Equal(newObjectId, recordObject.id_object);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalRegistryStatus("Active", "active", "Active status");
            var recordId = CreateLegalRecord("Test Subject", "Test Complainant", "Test Decision", statusId);
            var objectId = CreateLegalObject("Delete Object", "Delete Address");
            var id = CreateLegalRecordObject(recordId, objectId);

            // Act
            var response = await _client.DeleteAsync($"/legal_record_object/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM legal_record_object WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test records and objects
            var statusId = CreateLegalRegistryStatus("Active", "active", "Active status");
            var recordId = CreateLegalRecord("Paginated Subject", "Paginated Complainant", "Paginated Decision", statusId);

            for (int i = 1; i <= 5; i++)
            {
                var objectId = CreateLegalObject($"Paginated Object {i}", $"Paginated Address {i}");
                CreateLegalRecordObject(recordId, objectId);
            }

            // Act
            var response = await _client.GetAsync("/legal_record_object/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<legal_record_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        [Fact]
        public async Task GetByid_record_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalRegistryStatus("Active", "active", "Active status");
            var recordId1 = CreateLegalRecord("Record 1", "Complainant 1", "Decision 1", statusId);
            var recordId2 = CreateLegalRecord("Record 2", "Complainant 2", "Decision 2", statusId);

            var objectId1 = CreateLegalObject("Object 1", "Address 1");
            var objectId2 = CreateLegalObject("Object 2", "Address 2");
            var objectId3 = CreateLegalObject("Object 3", "Address 3");

            CreateLegalRecordObject(recordId1, objectId1);
            CreateLegalRecordObject(recordId1, objectId2);
            CreateLegalRecordObject(recordId2, objectId3);

            // Act
            var response = await _client.GetAsync($"/legal_record_object/GetByid_record?id_record={recordId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_record_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(recordId1, item.id_record));
        }

        [Fact]
        public async Task GetByid_object_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalRegistryStatus("Active", "active", "Active status");
            var recordId1 = CreateLegalRecord("Record 1", "Complainant 1", "Decision 1", statusId);
            var recordId2 = CreateLegalRecord("Record 2", "Complainant 2", "Decision 2", statusId);

            var objectId1 = CreateLegalObject("Object 1", "Address 1");
            var objectId2 = CreateLegalObject("Object 2", "Address 2");

            CreateLegalRecordObject(recordId1, objectId1);
            CreateLegalRecordObject(recordId2, objectId1);
            CreateLegalRecordObject(recordId2, objectId2);

            // Act
            var response = await _client.GetAsync($"/legal_record_object/GetByid_object?id_object={objectId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_record_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(objectId1, item.id_object));
        }

        // Helper methods to create test data
        private int CreateLegalRegistryStatus(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_registry_status (name, code, description, created_at, updated_at) 
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

        private int CreateLegalRecord(string subject, string complainant, string decision, int statusId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_record_registry (subject, complainant, decision, id_status, is_active, created_at, updated_at) 
                VALUES (@subject, @complainant, @decision, @id_status, @is_active, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@subject"] = subject,
                    ["@complainant"] = complainant,
                    ["@decision"] = decision,
                    ["@id_status"] = statusId,
                    ["@is_active"] = true,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateLegalObject(string description, string address)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_object (description, address, created_at, updated_at) 
                VALUES (@description, @address, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@description"] = description,
                    ["@address"] = address,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateLegalRecordObject(int recordId, int objectId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_record_object (id_record, id_object, created_at, updated_at) 
                VALUES (@id_record, @id_object, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@id_record"] = recordId,
                    ["@id_object"] = objectId,
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