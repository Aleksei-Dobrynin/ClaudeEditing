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
    public class LegalRecordRegistryTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public LegalRecordRegistryTests()
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
            var statusId1 = CreateLegalRegistryStatus("Active", "active", "Active status");
            var statusId2 = CreateLegalRegistryStatus("Pending", "pending", "Pending status");

            CreateLegalRecord("Subject 1", "Complainant 1", "Defendant 1", "Decision 1", "Addition 1", statusId1);
            CreateLegalRecord("Subject 2", "Complainant 2", "Defendant 2", "Decision 2", "Addition 2", statusId2);

            // Act
            var response = await _client.GetAsync("/legal_record_registry/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_record_registry>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.subject == "Subject 1" && r.complainant == "Complainant 1");
            Assert.Contains(result, r => r.subject == "Subject 2" && r.complainant == "Complainant 2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var statusId = CreateLegalRegistryStatus("Active", "active", "Active status");
            var id = CreateLegalRecord("Single Subject", "Single Complainant", "Single Defendant",
                "Single Decision", "Single Addition", statusId);

            // Act
            var response = await _client.GetAsync($"/legal_record_registry/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_record_registry>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Subject", result.subject);
            Assert.Equal("Single Complainant", result.complainant);
            Assert.Equal("Single Defendant", result.defendant);
            Assert.Equal("Single Decision", result.decision);
            Assert.Equal("Single Addition", result.addition);
            Assert.Equal(statusId, result.id_status);
            Assert.True(result.is_active);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalRegistryStatus("Active", "active", "Active status");
            var objectId1 = CreateLegalObject("Object 1", "Address 1");
            var objectId2 = CreateLegalObject("Object 2", "Address 2");

            // Create employee and structure for assignees
            var employeeId1 = CreateEmployee("John", "Doe", "Smith");
            var structureId = CreateOrgStructure("Test Structure", "1.0");
            var employeeInStructureId1 = CreateEmployeeInStructure(employeeId1, structureId);

            var employeeId2 = CreateEmployee("Jane", "Doe", "Smith");
            var employeeInStructureId2 = CreateEmployeeInStructure(employeeId2, structureId);

            var request = new Createlegal_record_registryRequest
            {
                subject = "Created Subject",
                complainant = "Created Complainant",
                defendant = "Created Defendant",
                decision = "Created Decision",
                addition = "Created Addition",
                id_status = statusId,
                is_active = true,
                legalObjects = new List<int> { objectId1, objectId2 },
                assignees = new List<int> { employeeInStructureId1, employeeInStructureId2 }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/legal_record_registry", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_record_registry>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Subject", result.subject);
            Assert.Equal("Created Complainant", result.complainant);
            Assert.Equal("Created Defendant", result.defendant);
            Assert.Equal("Created Decision", result.decision);
            Assert.Equal("Created Addition", result.addition);
            Assert.Equal(statusId, result.id_status);
            Assert.True(result.is_active);

            // Verify in database
            var record = DatabaseHelper.RunQueryList<legal_record_registry>(_schemaName, @"
                SELECT id, subject, complainant, defendant, decision, addition, id_status, is_active
                FROM legal_record_registry WHERE id = @id",
                reader => new legal_record_registry
                {
                    id = reader.GetInt32(0),
                    subject = reader.IsDBNull(1) ? null : reader.GetString(1),
                    complainant = reader.IsDBNull(2) ? null : reader.GetString(2),
                    defendant = reader.IsDBNull(3) ? null : reader.GetString(3),
                    decision = reader.IsDBNull(4) ? null : reader.GetString(4),
                    addition = reader.IsDBNull(5) ? null : reader.GetString(5),
                    id_status = reader.GetInt32(6),
                    is_active = reader.IsDBNull(7) ? null : (bool?)reader.GetBoolean(7)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(record);
            Assert.Equal(result.id, record.id);
            Assert.Equal("Created Subject", record.subject);
            Assert.Equal(statusId, record.id_status);

            // Verify legal objects were created
            var objectCount = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM legal_record_object WHERE id_record = @id_record",
                new Dictionary<string, object> { ["@id_record"] = result.id });

            Assert.Equal(2, objectCount);

            // Verify assignees were created
            var assigneeCount = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM legal_record_employee WHERE id_record = @id_record",
                new Dictionary<string, object> { ["@id_record"] = result.id });

            Assert.Equal(2, assigneeCount);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM legal_record_employee WHERE id > 0;");
            var originalStatusId = CreateLegalRegistryStatus("Original Status", "original", "Original status");
            var newStatusId = CreateLegalRegistryStatus("New Status", "new", "New status");

            var originalObjectId = CreateLegalObject("Original Object", "Original Address");
            var newObjectId = CreateLegalObject("New Object", "New Address");

            // Create employee and structure for assignees
            var employeeId1 = CreateEmployee("Original", "Employee", "Name");
            var structureId = CreateOrgStructure("Test Structure", "1.0");
            var originalEmployeeInStructureId = CreateEmployeeInStructure(employeeId1, structureId);

            var employeeId2 = CreateEmployee("New", "Employee", "Name");
            var newEmployeeInStructureId = CreateEmployeeInStructure(employeeId2, structureId);

            // Create original record with object and assignee
            var id = CreateLegalRecord("Original Subject", "Original Complainant", "Original Defendant",
                "Original Decision", "Original Addition", originalStatusId);

            CreateLegalRecordObject(id, originalObjectId);
            CreateLegalRecordEmployee(id, originalEmployeeInStructureId);

            var request = new Updatelegal_record_registryRequest
            {
                id = id,
                subject = "Updated Subject",
                complainant = "Updated Complainant",
                defendant = "Updated Defendant",
                decision = "Updated Decision",
                addition = "Updated Addition",
                id_status = newStatusId,
                is_active = false,
                legalObjects = new List<int> { newObjectId },
                assignees = new List<int> { newEmployeeInStructureId }
            };

            // Act
            var response = await _client.PutAsync($"/legal_record_registry/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_record_registry>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Subject", result.subject);
            Assert.Equal("Updated Complainant", result.complainant);
            Assert.Equal("Updated Defendant", result.defendant);
            Assert.Equal("Updated Decision", result.decision);
            Assert.Equal("Updated Addition", result.addition);
            Assert.Equal(newStatusId, result.id_status);
            Assert.False(result.is_active);

            // Verify in database
            var record = DatabaseHelper.RunQueryList<legal_record_registry>(_schemaName, @"
                SELECT subject, complainant, defendant, decision, addition, id_status, is_active 
                FROM legal_record_registry WHERE id = @id",
                reader => new legal_record_registry
                {
                    subject = reader.IsDBNull(0) ? null : reader.GetString(0),
                    complainant = reader.IsDBNull(1) ? null : reader.GetString(1),
                    defendant = reader.IsDBNull(2) ? null : reader.GetString(2),
                    decision = reader.IsDBNull(3) ? null : reader.GetString(3),
                    addition = reader.IsDBNull(4) ? null : reader.GetString(4),
                    id_status = reader.GetInt32(5),
                    is_active = reader.IsDBNull(6) ? null : (bool?)reader.GetBoolean(6)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(record);
            Assert.Equal("Updated Subject", record.subject);
            Assert.Equal(newStatusId, record.id_status);
            Assert.False(record.is_active);

            // Verify legal objects were updated (the original should be removed, the new one added)
            var objectIds = DatabaseHelper.RunQueryList<int>(_schemaName, @"
                SELECT id_object FROM legal_record_object WHERE id_record = @id_record",
                reader => reader.GetInt32(0),
                new Dictionary<string, object> { ["@id_record"] = id });

            Assert.Single(objectIds);
            Assert.Equal(newObjectId, objectIds[0]);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalRegistryStatus("Delete Status", "delete", "Delete status");
            var id = CreateLegalRecord("Delete Subject", "Delete Complainant", "Delete Defendant",
                "Delete Decision", "Delete Addition", statusId);

            // Act
            var response = await _client.DeleteAsync($"/legal_record_registry/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM legal_record_registry WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });
            
            var isActive = DatabaseHelper.RunQuery<bool>(_schemaName, @"
                SELECT is_active FROM legal_record_registry WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(1, count);
            Assert.False(isActive);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test records
            var statusId = CreateLegalRegistryStatus("Paginated Status", "paginated", "Paginated status");

            for (int i = 1; i <= 5; i++)
            {
                CreateLegalRecord($"Paginated Subject {i}", $"Paginated Complainant {i}",
                    $"Paginated Defendant {i}", $"Paginated Decision {i}", $"Paginated Addition {i}", statusId);
            }

            // Act
            var response = await _client.GetAsync("/legal_record_registry/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<legal_record_registry>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        [Fact]
        public async Task GetByid_status_ReturnsOkResponse()
        {
            // Arrange
            var statusId1 = CreateLegalRegistryStatus("Status 1", "status1", "Status 1 description");
            var statusId2 = CreateLegalRegistryStatus("Status 2", "status2", "Status 2 description");

            CreateLegalRecord("Subject 1", "Complainant 1", "Defendant 1", "Decision 1", "Addition 1", statusId1);
            CreateLegalRecord("Subject 2", "Complainant 2", "Defendant 2", "Decision 2", "Addition 2", statusId1);
            CreateLegalRecord("Subject 3", "Complainant 3", "Defendant 3", "Decision 3", "Addition 3", statusId2);

            // Act
            var response = await _client.GetAsync($"/legal_record_registry/GetByid_status?id_status={statusId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_record_registry>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(statusId1, item.id_status));
        }

        [Fact]
        public async Task GetByAddress_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalRegistryStatus("Address Status", "address", "Address status");

            var objectId1 = CreateLegalObject("Object with Address", "Specific Address");
            var objectId2 = CreateLegalObject("Another Object", "Different Address");

            var recordId1 = CreateLegalRecord("Address Subject 1", "Address Complainant 1",
                "Address Defendant 1", "Address Decision 1", "Address Addition 1", statusId);
            var recordId2 = CreateLegalRecord("Address Subject 2", "Address Complainant 2",
                "Address Defendant 2", "Address Decision 2", "Address Addition 2", statusId);

            CreateLegalRecordObject(recordId1, objectId1);
            CreateLegalRecordObject(recordId2, objectId2);

            // Act
            var response = await _client.GetAsync("/legal_record_registry/GetByAddress?address=Specific Address");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_record_registry>>(content);

            Assert.NotNull(result);
            // The result count depends on how the repository implements the address search
            // We expect at least one record with the matching address
            Assert.Contains(result, item => item.id == recordId1);
        }

        [Fact]
        public async Task GetByFilter_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalRegistryStatus("Filter Status", "filter", "Filter status");

            CreateLegalRecord("Filter Subject", "Filter Complainant", "Filter Defendant",
                "Filter Decision", "Filter Addition", statusId);

            var filter = new LegalFilter
            {
                commonFilter = "Filter"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/legal_record_registry/GetByFilter", filter);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_record_registry>>(content);

            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Contains(result, item => item.subject.Contains("Filter") ||
                                          item.complainant.Contains("Filter") ||
                                          item.defendant.Contains("Filter"));
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

        private int CreateLegalRecord(string subject, string complainant, string defendant,
            string decision, string addition, int statusId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_record_registry (subject, complainant, defendant, decision, addition, id_status, is_active, created_at, updated_at) 
                VALUES (@subject, @complainant, @defendant, @decision, @addition, @id_status, @is_active, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@subject"] = subject,
                    ["@complainant"] = complainant,
                    ["@defendant"] = defendant,
                    ["@decision"] = decision,
                    ["@addition"] = addition,
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

        private int CreateEmployee(string firstName, string lastName, string secondName)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (first_name, last_name, second_name, created_at, updated_at) 
                VALUES (@first_name, @last_name, @second_name, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@first_name"] = firstName,
                    ["@last_name"] = lastName,
                    ["@second_name"] = secondName,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateOrgStructure(string name, string version)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, version, is_active, date_start, created_at, updated_at) 
                VALUES (@name, @version, @is_active, @date_start, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@version"] = version,
                    ["@is_active"] = true,
                    ["@date_start"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateEmployeeInStructure(int employeeId, int structureId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee_in_structure (employee_id, structure_id, date_start, created_at, updated_at) 
                VALUES (@employee_id, @structure_id, @date_start, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@employee_id"] = employeeId,
                    ["@structure_id"] = structureId,
                    ["@date_start"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateLegalRecordEmployee(int recordId, int employeeInStructureId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_record_employee (id_record, id_structure_employee, is_active, created_at, updated_at) 
                VALUES (@id_record, @id_structure_employee, @is_active, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@id_record"] = recordId,
                    ["@id_structure_employee"] = employeeInStructureId,
                    ["@is_active"] = true,
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