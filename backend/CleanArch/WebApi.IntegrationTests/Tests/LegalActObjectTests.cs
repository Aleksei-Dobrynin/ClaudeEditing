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
    public class LegalActObjectTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public LegalActObjectTests()
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
            // Arrange - Create test entities
            var (actId1, objectId1) = CreateTestPrerequisites();
            var (actId2, objectId2) = CreateTestPrerequisites();

            // Create legal_act_object relations
            CreateLegalActObject(actId1, objectId1);
            CreateLegalActObject(actId2, objectId2);

            // Act
            var response = await _client.GetAsync("/legal_act_object/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_act_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, lao => lao.id_act == actId1 && lao.id_object == objectId1);
            Assert.Contains(result, lao => lao.id_act == actId2 && lao.id_object == objectId2);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test entities
            var (actId, objectId) = CreateTestPrerequisites();

            // Create legal_act_object relation
            var id = CreateLegalActObject(actId, objectId);

            // Act
            var response = await _client.GetAsync($"/legal_act_object/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_act_object>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(actId, result.id_act);
            Assert.Equal(objectId, result.id_object);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create test entities
            var (actId, objectId) = CreateTestPrerequisites();

            var request = new Createlegal_act_objectRequest
            {
                id_act = actId,
                id_object = objectId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/legal_act_object", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_act_object>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(actId, result.id_act);
            Assert.Equal(objectId, result.id_object);

            // Verify in database
            var legalActObject = DatabaseHelper.RunQueryList<legal_act_object>(_schemaName, @"
                SELECT id, id_act, id_object, created_at, updated_at FROM legal_act_object WHERE id = @id",
                reader => new legal_act_object
                {
                    id = reader.GetInt32(0),
                    id_act = reader.GetInt32(1),
                    id_object = reader.GetInt32(2),
                    created_at = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    updated_at = reader.IsDBNull(4) ? null : reader.GetDateTime(4)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(legalActObject);
            Assert.Equal(result.id, legalActObject.id);
            Assert.Equal(actId, legalActObject.id_act);
            Assert.Equal(objectId, legalActObject.id_object);
            Assert.NotNull(legalActObject.created_at);
            Assert.NotNull(legalActObject.updated_at);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test entities for original relation
            var (originalActId, originalObjectId) = CreateTestPrerequisites();

            // Create legal_act_object relation
            var id = CreateLegalActObject(originalActId, originalObjectId);

            // Create test entities for updated relation
            var (newActId, newObjectId) = CreateTestPrerequisites();

            var request = new Updatelegal_act_objectRequest
            {
                id = id,
                id_act = newActId,
                id_object = newObjectId
            };

            // Act
            var response = await _client.PutAsync($"/legal_act_object/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_act_object>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newActId, result.id_act);
            Assert.Equal(newObjectId, result.id_object);

            // Verify in database
            var legalActObject = DatabaseHelper.RunQueryList<legal_act_object>(_schemaName, @"
                SELECT id_act, id_object FROM legal_act_object WHERE id = @id",
                reader => new legal_act_object
                {
                    id_act = reader.GetInt32(0),
                    id_object = reader.GetInt32(1)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(legalActObject);
            Assert.Equal(newActId, legalActObject.id_act);
            Assert.Equal(newObjectId, legalActObject.id_object);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test entities
            var (actId, objectId) = CreateTestPrerequisites();

            // Create legal_act_object relation
            var id = CreateLegalActObject(actId, objectId);

            // Act
            var response = await _client.DeleteAsync($"/legal_act_object/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM legal_act_object WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test entities
            var (actId, objectId) = CreateTestPrerequisites();

            // Create multiple legal_act_object relations
            for (int i = 0; i < 5; i++)
            {
                CreateLegalActObject(actId, objectId);
            }

            // Act
            var response = await _client.GetAsync("/legal_act_object/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<legal_act_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(3, result.pageSize);
            // The total count might vary depending on what's already in the database
        }

        [Fact]
        public async Task GetByid_act_ReturnsOkResponse()
        {
            // Arrange - Create test entities
            var (actId, objectId1) = CreateTestPrerequisites();
            var (_, objectId2) = CreateTestPrerequisites();
            var (otherActId, objectId3) = CreateTestPrerequisites();

            // Create multiple legal_act_object relations for the same act
            CreateLegalActObject(actId, objectId1);
            CreateLegalActObject(actId, objectId2);
            CreateLegalActObject(otherActId, objectId3);

            // Act
            var response = await _client.GetAsync($"/legal_act_object/GetByid_act?id_act={actId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_act_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, lao => Assert.Equal(actId, lao.id_act));
            Assert.Contains(result, lao => lao.id_object == objectId1);
            Assert.Contains(result, lao => lao.id_object == objectId2);
        }

        [Fact]
        public async Task GetByid_object_ReturnsOkResponse()
        {
            // Arrange - Create test entities
            var (actId1, objectId) = CreateTestPrerequisites();
            var (actId2, _) = CreateTestPrerequisites();
            var (actId3, otherObjectId) = CreateTestPrerequisites();

            // Create multiple legal_act_object relations for the same object
            CreateLegalActObject(actId1, objectId);
            CreateLegalActObject(actId2, objectId);
            CreateLegalActObject(actId3, otherObjectId);

            // Act
            var response = await _client.GetAsync($"/legal_act_object/GetByid_object?id_object={objectId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_act_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, lao => Assert.Equal(objectId, lao.id_object));
            Assert.Contains(result, lao => lao.id_act == actId1);
            Assert.Contains(result, lao => lao.id_act == actId2);
        }

        // Helper methods to create test data
        private (int actId, int objectId) CreateTestPrerequisites()
        {
            // Create legal_act_registry_status
            var statusId = CreateLegalActRegistryStatus();

            // Create legal_act_registry
            var actId = CreateLegalActRegistry(statusId);

            // Create legal_object
            var objectId = CreateLegalObject();

            return (actId, objectId);
        }

        private int CreateLegalActRegistryStatus()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_act_registry_status (name, code, description, created_at, updated_at) 
                VALUES (@name, @code, @description, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = $"Status {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@code"] = $"code_{Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@description"] = "Test status description",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateLegalActRegistry(int statusId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_act_registry (subject, act_number, decision, addition, is_active, act_type, date_issue, id_status, created_at, updated_at) 
                VALUES (@subject, @actNumber, @decision, @addition, @isActive, @actType, @dateIssue, @statusId, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@subject"] = $"Subject {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@actNumber"] = $"ACT-{new Random().Next(10000, 99999)}",
                    ["@decision"] = "Test decision",
                    ["@addition"] = "Test addition",
                    ["@isActive"] = true,
                    ["@actType"] = "Test type",
                    ["@dateIssue"] = DateTime.Now,
                    ["@statusId"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateLegalObject()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_object (description, address, geojson, created_at, updated_at) 
                VALUES (@description, @address, @geojson::jsonb, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@description"] = $"Description {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@address"] = $"Address {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@geojson"] = "{\"type\":\"Point\",\"coordinates\":[74.59,42.87]}",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateLegalActObject(int actId, int objectId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_act_object (id_act, id_object, created_at, updated_at) 
                VALUES (@actId, @objectId, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@actId"] = actId,
                    ["@objectId"] = objectId,
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