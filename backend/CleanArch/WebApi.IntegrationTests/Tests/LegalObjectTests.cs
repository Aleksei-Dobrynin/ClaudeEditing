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
    public class LegalObjectTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public LegalObjectTests()
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
            // Arrange - Create test legal objects
            CreateLegalObject("Test Description 1", "Test Address 1", "{\"type\":\"Point\",\"coordinates\":[74.59,42.87]}");
            CreateLegalObject("Test Description 2", "Test Address 2", "{\"type\":\"Polygon\",\"coordinates\":[[[74.59,42.87],[74.60,42.87],[74.60,42.88],[74.59,42.88],[74.59,42.87]]]}");

            // Act
            var response = await _client.GetAsync("/legal_object/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, lo => lo.description == "Test Description 1" && lo.address == "Test Address 1");
            Assert.Contains(result, lo => lo.description == "Test Description 2" && lo.address == "Test Address 2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test legal object
            var id = CreateLegalObject("Single Description", "Single Address", "{\"type\":\"Point\",\"coordinates\":[74.60,42.88]}");

            // Act
            var response = await _client.GetAsync($"/legal_object/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_object>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Description", result.description);
            Assert.Equal("Single Address", result.address);
            var expected = JObject.Parse("{\"type\":\"Point\",\"coordinates\":[74.60,42.88]}");
            var actual = JObject.Parse(result.geojson.ToString());

            Assert.True(JToken.DeepEquals(expected, actual));
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new Createlegal_objectRequest
            {
                description = "Created Description",
                address = "Created Address",
                geojson = "{\"type\":\"Point\",\"coordinates\":[74.61,42.89]}"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/legal_object", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_object>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Description", result.description);
            Assert.Equal("Created Address", result.address);
            Assert.Equal("{\"type\":\"Point\",\"coordinates\":[74.61,42.89]}", result.geojson);

            // Verify in database
            var legalObject = DatabaseHelper.RunQueryList<legal_object>(_schemaName, @"
                SELECT id, description, address, geojson::text FROM legal_object WHERE id = @id",
                reader => new legal_object
                {
                    id = reader.GetInt32(0),
                    description = reader.IsDBNull(1) ? null : reader.GetString(1),
                    address = reader.IsDBNull(2) ? null : reader.GetString(2),
                    geojson = reader.IsDBNull(3) ? null : reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(legalObject);
            Assert.Equal(result.id, legalObject.id);
            Assert.Equal("Created Description", legalObject.description);
            Assert.Equal("Created Address", legalObject.address);
            // The formatting of JSON might be different when retrieved from the database
            Assert.Contains("Point", legalObject.geojson);
            Assert.Contains("74.61", legalObject.geojson);
            Assert.Contains("42.89", legalObject.geojson);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateLegalObject("Original Description", "Original Address", "{\"type\":\"Point\",\"coordinates\":[74.62,42.90]}");

            var request = new Updatelegal_objectRequest
            {
                id = id,
                description = "Updated Description",
                address = "Updated Address",
                geojson = "{\"type\":\"Point\",\"coordinates\":[74.63,42.91]}"
            };

            // Act
            var response = await _client.PutAsync($"/legal_object/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_object>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("Updated Address", result.address);
            Assert.Equal("{\"type\":\"Point\",\"coordinates\":[74.63,42.91]}", result.geojson);

            // Verify in database
            var legalObject = DatabaseHelper.RunQueryList<legal_object>(_schemaName, @"
                SELECT description, address, geojson::text FROM legal_object WHERE id = @id",
                reader => new legal_object
                {
                    description = reader.IsDBNull(0) ? null : reader.GetString(0),
                    address = reader.IsDBNull(1) ? null : reader.GetString(1),
                    geojson = reader.IsDBNull(2) ? null : reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(legalObject);
            Assert.Equal("Updated Description", legalObject.description);
            Assert.Equal("Updated Address", legalObject.address);
            Assert.Contains("74.63", legalObject.geojson);
            Assert.Contains("42.91", legalObject.geojson);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateLegalObject("Delete Description", "Delete Address", "{\"type\":\"Point\",\"coordinates\":[74.64,42.92]}");

            // Act
            var response = await _client.DeleteAsync($"/legal_object/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM legal_object WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test legal objects
            for (int i = 1; i <= 5; i++)
            {
                CreateLegalObject($"Paginated Description {i}", $"Paginated Address {i}",
                    $"{{\"type\":\"Point\",\"coordinates\":[{74.65 + i * 0.01},{42.93 + i * 0.01}]}}");
            }

            // Act
            var response = await _client.GetAsync("/legal_object/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<legal_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            // The total count might vary depending on what's already in the database
        }

        [Fact]
        public async Task LegalObject_UsedByLegalActObject_CanBeRetrieved()
        {
            // Arrange - Create legal object and legal_act_registry status
            var legalObjectId = CreateLegalObject("Object for Act", "Address for Act", "{\"type\":\"Point\",\"coordinates\":[74.70,42.95]}");
            var statusId = CreateLegalActRegistryStatus("Active", "active", "Active status", "#28A745", "#FFFFFF");

            // Create legal_act_registry
            var actId = CreateLegalActRegistry("Subject 1", "ACT-001", "Decision 1", "Addition 1", true, "Type 1", DateTime.Now, statusId);

            // Create legal_act_object relation
            CreateLegalActObject(actId, legalObjectId);

            // Act - retrieve the legal object
            var response = await _client.GetAsync($"/legal_object/{legalObjectId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_object>(content);

            Assert.NotNull(result);
            Assert.Equal(legalObjectId, result.id);
            Assert.Equal("Object for Act", result.description);
            Assert.Equal("Address for Act", result.address);

            // Verify relation exists in database
            var relationExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM legal_act_object 
                WHERE id_act = @actId AND id_object = @objectId",
                new Dictionary<string, object>
                {
                    ["@actId"] = actId,
                    ["@objectId"] = legalObjectId
                });

            Assert.Equal(1, relationExists);
        }

        // Helper methods to create test data
        private int CreateLegalObject(string description, string address, string geojson)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_object (description, address, geojson, created_at, updated_at) 
                VALUES (@description, @address, @geojson::jsonb, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@description"] = description,
                    ["@address"] = address,
                    ["@geojson"] = geojson,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateLegalActRegistryStatus(string name, string code, string description, string textColor, string backgroundColor)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_act_registry_status (name, code, description, text_color, background_color, created_at, updated_at) 
                VALUES (@name, @code, @description, @textColor, @backgroundColor, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@textColor"] = textColor,
                    ["@backgroundColor"] = backgroundColor,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateLegalActRegistry(string subject, string actNumber, string decision, string addition,
            bool isActive, string actType, DateTime? dateIssue, int statusId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_act_registry (subject, act_number, decision, addition, is_active, act_type, date_issue, id_status, created_at, updated_at) 
                VALUES (@subject, @actNumber, @decision, @addition, @isActive, @actType, @dateIssue, @statusId, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@subject"] = subject,
                    ["@actNumber"] = actNumber,
                    ["@decision"] = decision,
                    ["@addition"] = addition,
                    ["@isActive"] = isActive,
                    ["@actType"] = actType,
                    ["@dateIssue"] = dateIssue as object ?? DBNull.Value,
                    ["@statusId"] = statusId,
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