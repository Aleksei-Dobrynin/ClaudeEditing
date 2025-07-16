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
    public class ApplicationLegalRecordTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationLegalRecordTests()
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
            // Arrange - Create test application_legal_records
            var applicationId1 = CreateTestApplication();
            var legalRecordId = CreateTestLegalRecord();
            var legalActId = CreateTestLegalAct();

            CreateApplicationLegalRecord(applicationId1, legalRecordId, legalActId);
            CreateApplicationLegalRecord(applicationId1, null, legalActId);

            // Act
            var response = await _client.GetAsync("/application_legal_record/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_legal_record>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test application_legal_record
            var applicationId = CreateTestApplication();
            var legalRecordId = CreateTestLegalRecord();
            var legalActId = CreateTestLegalAct();

            var id = CreateApplicationLegalRecord(applicationId, legalRecordId, legalActId);

            // Act
            var response = await _client.GetAsync($"/application_legal_record/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_legal_record>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(applicationId, result.id_application);
            Assert.Equal(legalRecordId, result.id_legalrecord);
            Assert.Equal(legalActId, result.id_legalact);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var legalRecordId = CreateTestLegalRecord();
            var legalActId = CreateTestLegalAct();

            var request = new Createapplication_legal_recordRequest
            {
                id_application = applicationId,
                id_legalrecord = legalRecordId,
                id_legalact = legalActId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/application_legal_record", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_legal_record>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(applicationId, result.id_application);
            Assert.Equal(legalRecordId, result.id_legalrecord);
            Assert.Equal(legalActId, result.id_legalact);
            Assert.NotNull(result.created_at);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var originalLegalRecordId = CreateTestLegalRecord();
            var originalLegalActId = CreateTestLegalAct();

            var newLegalRecordId = CreateTestLegalRecord();
            var newLegalActId = CreateTestLegalAct();

            var id = CreateApplicationLegalRecord(applicationId, originalLegalRecordId, originalLegalActId);

            var request = new Updateapplication_legal_recordRequest
            {
                id = id,
                id_application = applicationId,
                id_legalrecord = newLegalRecordId,
                id_legalact = newLegalActId
            };

            // Act
            var response = await _client.PutAsync($"/application_legal_record/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_legal_record>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(applicationId, result.id_application);
            Assert.Equal(newLegalRecordId, result.id_legalrecord);
            Assert.Equal(newLegalActId, result.id_legalact);

            // Verify in database
            var updatedRecord = DatabaseHelper.RunQueryList<application_legal_record>(_schemaName, @"
    SELECT * FROM application_legal_record WHERE id = @id",
    reader => new application_legal_record
    {
        id = reader.GetInt32(reader.GetOrdinal("id")),
        id_application = reader.GetInt32(reader.GetOrdinal("id_application")),
        id_legalrecord = reader.IsDBNull(reader.GetOrdinal("id_legalrecord")) ? null : reader.GetInt32(reader.GetOrdinal("id_legalrecord")),
        id_legalact = reader.IsDBNull(reader.GetOrdinal("id_legalact")) ? null : reader.GetInt32(reader.GetOrdinal("id_legalact"))
    },
    new Dictionary<string, object> { ["@id"] = id }).FirstOrDefault();

            Assert.NotNull(updatedRecord);
            Assert.Equal(newLegalRecordId, updatedRecord.id_legalrecord);
            Assert.Equal(newLegalActId, updatedRecord.id_legalact);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var legalRecordId = CreateTestLegalRecord();
            var legalActId = CreateTestLegalAct();

            var id = CreateApplicationLegalRecord(applicationId, legalRecordId, legalActId);

            // Act
            var response = await _client.DeleteAsync($"/application_legal_record/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_legal_record WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test application_legal_records
            var applicationId = CreateTestApplication();
            var legalRecordId = CreateTestLegalRecord();
            var legalActId = CreateTestLegalAct();

            for (int i = 0; i < 5; i++)
            {
                CreateApplicationLegalRecord(applicationId, legalRecordId, legalActId);
            }

            // Act
            var response = await _client.GetAsync("/application_legal_record/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<application_legal_record>>(content);

            JObject jObject = JObject.Parse(content);

            int pageNumber = jObject["pageNumber"]?.Value<int>() ?? 0;
            int totalPages = jObject["totalPages"]?.Value<int>() ?? 0;
            int totalCount = jObject["totalCount"]?.Value<int>() ?? 0;

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, totalCount);
            Assert.Equal(1, pageNumber);
            Assert.Equal(2, totalPages);
        }

        [Fact]
        public async Task GetByid_application_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var otherApplicationId = CreateTestApplication();
            var legalRecordId = CreateTestLegalRecord();
            var legalActId = CreateTestLegalAct();

            CreateApplicationLegalRecord(applicationId, legalRecordId, legalActId);
            CreateApplicationLegalRecord(applicationId, null, legalActId);
            CreateApplicationLegalRecord(otherApplicationId, legalRecordId, legalActId);

            // Act
            var response = await _client.GetAsync($"/application_legal_record/GetByid_application?id_application={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_legal_record>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(applicationId, item.id_application));
        }

        [Fact]
        public async Task GetByid_legalrecord_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var legalRecordId = CreateTestLegalRecord();
            var otherLegalRecordId = CreateTestLegalRecord();
            var legalActId = CreateTestLegalAct();

            CreateApplicationLegalRecord(applicationId, legalRecordId, legalActId);
            CreateApplicationLegalRecord(applicationId, legalRecordId, null);
            CreateApplicationLegalRecord(applicationId, otherLegalRecordId, legalActId);

            // Act
            var response = await _client.GetAsync($"/application_legal_record/GetByid_legalrecord?id_legalrecord={legalRecordId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_legal_record>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(legalRecordId, item.id_legalrecord));
        }

        [Fact]
        public async Task GetByid_legalact_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var legalRecordId = CreateTestLegalRecord();
            var legalActId = CreateTestLegalAct();
            var otherLegalActId = CreateTestLegalAct();

            CreateApplicationLegalRecord(applicationId, legalRecordId, legalActId);
            CreateApplicationLegalRecord(applicationId, null, legalActId);
            CreateApplicationLegalRecord(applicationId, legalRecordId, otherLegalActId);

            // Act
            var response = await _client.GetAsync($"/application_legal_record/GetByid_legalact?id_legalact={legalActId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_legal_record>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(legalActId, item.id_legalact));
        }

        // Helper methods to set up test data

        private int CreateTestApplication()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (registration_date, status_id, workflow_id, service_id) 
                VALUES (@registration_date, 1, 1, 1) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@registration_date"] = DateTime.Now
                });
        }

        private int CreateTestLegalRecord()
        {
            // Create legal_registry_status if it doesn't exist
            CreateLegalRegistryStatus();

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_record_registry (subject, complainant, decision, id_status) 
                VALUES (@subject, @complainant, @decision, @id_status) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@subject"] = $"Subject {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@complainant"] = $"Complainant {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@decision"] = $"Decision {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@id_status"] = 1
                });
        }

        private int CreateTestLegalAct()
        {
            // Create legal_act_registry_status if it doesn't exist
            CreateLegalActRegistryStatus();

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_act_registry (subject, act_number, decision, id_status) 
                VALUES (@subject, @act_number, @decision, @id_status) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@subject"] = $"Subject {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@act_number"] = $"ACT-{new Random().Next(10000, 99999)}",
                    ["@decision"] = $"Decision {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@id_status"] = 1
                });
        }

        private void CreateLegalRegistryStatus()
        {
            // Check if table exists
            var tableExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM information_schema.tables 
                WHERE table_schema = current_schema() AND table_name = 'legal_registry_status'");

            if (tableExists == 0)
            {
                // Create table if it doesn't exist
                DatabaseHelper.RunQuery<int>(_schemaName, @"
                    CREATE TABLE legal_registry_status (
                        id SERIAL PRIMARY KEY,
                        name TEXT,
                        description TEXT,
                        code TEXT,
                        created_at TIMESTAMP,
                        updated_at TIMESTAMP,
                        created_by INTEGER,
                        updated_by INTEGER,
                        name_kg TEXT,
                        description_kg TEXT,
                        text_color TEXT,
                        background_color TEXT
                    )");
            }

            // Check if there are any statuses
            var statusCount = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM legal_registry_status");

            if (statusCount == 0)
            {
                // Insert a default status
                DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO legal_registry_status (name, code, description) 
                    VALUES ('Active', 'active', 'Active legal registry status')");
            }
        }

        private void CreateLegalActRegistryStatus()
        {
            // Check if table exists
            var tableExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM information_schema.tables 
                WHERE table_schema = current_schema() AND table_name = 'legal_act_registry_status'");

            if (tableExists == 0)
            {
                // Create table if it doesn't exist
                DatabaseHelper.RunQuery<int>(_schemaName, @"
                    CREATE TABLE legal_act_registry_status (
                        id SERIAL PRIMARY KEY,
                        name TEXT,
                        description TEXT,
                        code TEXT,
                        created_at TIMESTAMP,
                        updated_at TIMESTAMP,
                        created_by INTEGER,
                        updated_by INTEGER,
                        name_kg TEXT,
                        description_kg TEXT,
                        text_color TEXT,
                        background_color TEXT
                    )");
            }

            // Check if there are any statuses
            var statusCount = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM legal_act_registry_status");

            if (statusCount == 0)
            {
                // Insert a default status
                DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO legal_act_registry_status (name, code, description) 
                    VALUES ('Active', 'active', 'Active legal act registry status')");
            }
        }

        private int CreateApplicationLegalRecord(int applicationId, int? legalRecordId, int? legalActId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_legal_record (id_application, id_legalrecord, id_legalact, created_at, updated_at) 
                VALUES (@id_application, @id_legalrecord, @id_legalact, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@id_application"] = applicationId,
                    ["@id_legalrecord"] = legalRecordId as object ?? DBNull.Value,
                    ["@id_legalact"] = legalActId as object ?? DBNull.Value,
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