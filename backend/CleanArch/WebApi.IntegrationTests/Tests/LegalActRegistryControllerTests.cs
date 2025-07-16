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
    public class LegalActRegistryControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public LegalActRegistryControllerTests()
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
            // Arrange - Create test legal act registries
            var statusId = CreateLegalActRegistryStatus("Active Status", "active_status", "Active Status Description");
            CreateLegalActRegistry("Subject 1", "ACT-001", "Decision 1", statusId);
            CreateLegalActRegistry("Subject 2", "ACT-002", "Decision 2", statusId);

            // Act
            var response = await _client.GetAsync("/legal_act_registry/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_act_registry>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.subject == "Subject 1" && r.act_number == "ACT-001");
            Assert.Contains(result, r => r.subject == "Subject 2" && r.act_number == "ACT-002");
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test legal act registry
            var statusId = CreateLegalActRegistryStatus("Single Status", "single_status", "Single Status Description");
            var id = CreateLegalActRegistry("Single Subject", "ACT-SINGLE", "Single Decision", statusId);

            // Act
            var response = await _client.GetAsync($"/legal_act_registry/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_act_registry>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Subject", result.subject);
            Assert.Equal("ACT-SINGLE", result.act_number);
            Assert.Equal("Single Decision", result.decision);
            Assert.Equal(statusId, result.id_status);
        }

        [Fact]
        public async Task Create_WithObjectsAndAssignees_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalActRegistryStatus("Create Status", "create_status", "Create Status Description");

            // Create legal objects
            var objectId1 = CreateLegalObject("Object 1 Description", "Object 1 Address");
            var objectId2 = CreateLegalObject("Object 2 Description", "Object 2 Address");

            // Create employee and org structure for assignees
            var employeeId = CreateEmployee("Test", "Employee", "Name");
            var structureId = CreateOrgStructure("Test Structure", "1.0", true);
            var employeeInStructureId = CreateEmployeeInStructure(employeeId, structureId);

            var request = new Createlegal_act_registryRequest
            {
                is_active = true,
                act_type = "Test Act Type",
                date_issue = DateTime.Now,
                id_status = statusId,
                subject = "Created Subject",
                act_number = "ACT-CREATED",
                decision = "Created Decision",
                addition = "Created Addition",
                legalObjects = new List<int> { objectId1, objectId2 },
                assignees = new List<int> { employeeInStructureId }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/legal_act_registry", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_act_registry>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Subject", result.subject);
            Assert.Equal("ACT-CREATED", result.act_number);
            Assert.Equal("Created Decision", result.decision);
            Assert.Equal("Created Addition", result.addition);
            Assert.Equal(statusId, result.id_status);
            Assert.Equal("Test Act Type", result.act_type);
            Assert.True(result.is_active);

            // Verify legal_act_object entries were created
            var legalActObjects = await GetLegalActObjectsByActId(result.id);
            Assert.Equal(2, legalActObjects.Count);
            Assert.Contains(legalActObjects, o => o.id_object == objectId1);
            Assert.Contains(legalActObjects, o => o.id_object == objectId2);

            // Verify the employee assignment
            var legalActEmployees = await GetLegalActEmployeesByActId(result.id);
            Assert.Single(legalActEmployees);
            Assert.Equal(employeeInStructureId, legalActEmployees[0].id_structure_employee);
        }

        [Fact]
        public async Task Update_WithChangedObjectsAndAssignees_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalActRegistryStatus("Update Status", "update_status", "Update Status Description");
            var newStatusId = CreateLegalActRegistryStatus("New Status", "new_status", "New Status Description");

            // Create initial legal objects
            var objectId1 = CreateLegalObject("Initial Object 1", "Initial Address 1");
            var objectId2 = CreateLegalObject("Initial Object 2", "Initial Address 2");

            // Create new legal object to add during update
            var objectId3 = CreateLegalObject("New Object 3", "New Address 3");

            // Create employee and org structure for assignees
            var employeeId1 = CreateEmployee("Initial", "Employee", "Name");
            var employeeId2 = CreateEmployee("New", "Employee", "Name");
            var structureId = CreateOrgStructure("Test Structure", "1.0", true);
            var employeeInStructureId1 = CreateEmployeeInStructure(employeeId1, structureId);
            var employeeInStructureId2 = CreateEmployeeInStructure(employeeId2, structureId);

            // Create initial legal act registry
            var id = CreateLegalActRegistry("Initial Subject", "ACT-INITIAL", "Initial Decision", statusId);

            // Create initial legal_act_object connections
            CreateLegalActObject(id, objectId1);
            CreateLegalActObject(id, objectId2);

            // Create initial legal_act_employee connection
            CreateLegalActEmployee(id, employeeInStructureId1);

            // Create update request
            var request = new Updatelegal_act_registryRequest
            {
                id = id,
                is_active = false,
                act_type = "Updated Act Type",
                date_issue = DateTime.Now.AddDays(1),
                id_status = newStatusId,
                subject = "Updated Subject",
                act_number = "ACT-UPDATED",
                decision = "Updated Decision",
                addition = "Updated Addition",
                // Remove objectId2, keep objectId1, add objectId3
                legalObjects = new List<int> { objectId1, objectId3 },
                // Replace employee
                assignees = new List<int> { employeeInStructureId2 }
            };

            // Act
            var response = await _client.PutAsync($"/legal_act_registry/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<legal_act_registry>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Subject", result.subject);
            Assert.Equal("ACT-UPDATED", result.act_number);
            Assert.Equal("Updated Decision", result.decision);
            Assert.Equal("Updated Addition", result.addition);
            Assert.Equal(newStatusId, result.id_status);
            Assert.Equal("Updated Act Type", result.act_type);
            Assert.False(result.is_active);

            // Verify legal_act_object entries were updated correctly
            var legalActObjects = await GetLegalActObjectsByActId(id);
            Assert.Equal(2, legalActObjects.Count);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalActRegistryStatus("Delete Status", "delete_status", "Delete Status Description");
            var id = CreateLegalActRegistry("Delete Subject", "ACT-DELETE", "Delete Decision", statusId);

            // Act
            var response = await _client.DeleteAsync($"/legal_act_registry/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = int.Parse(content);

            Assert.Equal(id, result);

            // Verify in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM legal_act_registry WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });
            
            var isActive = DatabaseHelper.RunQuery<bool>(_schemaName, @"
                SELECT is_active FROM legal_act_registry WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(1, exists);
            Assert.False(isActive);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test legal act registries
            var statusId = CreateLegalActRegistryStatus("Paginated Status", "paginated_status", "Paginated Status Description");

            for (int i = 1; i <= 5; i++)
            {
                CreateLegalActRegistry($"Paginated Subject {i}", $"ACT-PAG-{i}", $"Paginated Decision {i}", statusId);
            }

            // Act
            var response = await _client.GetAsync("/legal_act_registry/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<legal_act_registry>>(content);

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
            var statusId1 = CreateLegalActRegistryStatus("Filter Status 1", "filter_status_1", "Filter Status Description 1");
            var statusId2 = CreateLegalActRegistryStatus("Filter Status 2", "filter_status_2", "Filter Status Description 2");

            // Create acts with different statuses
            CreateLegalActRegistry("Status 1 Subject 1", "ACT-S1-1", "Status 1 Decision 1", statusId1);
            CreateLegalActRegistry("Status 1 Subject 2", "ACT-S1-2", "Status 1 Decision 2", statusId1);
            CreateLegalActRegistry("Status 2 Subject 1", "ACT-S2-1", "Status 2 Decision 1", statusId2);

            // Act
            var response = await _client.GetAsync($"/legal_act_registry/GetByid_status?id_status={statusId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_act_registry>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, r => Assert.Equal(statusId1, r.id_status));
        }

        [Fact]
        public async Task GetByFilter_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalActRegistryStatus("Filter Test Status", "filter_test_status", "Filter Test Status Description");

            var jan1 = new DateTime(2023, 1, 1);
            var feb1 = new DateTime(2023, 2, 1);
            var mar1 = new DateTime(2023, 3, 1);

            // Create acts with different dates and act types
            CreateLegalActRegistry("Jan Type A", "ACT-JAN-A", "Jan Type A Decision", statusId, "Type A", jan1);
            CreateLegalActRegistry("Feb Type A", "ACT-FEB-A", "Feb Type A Decision", statusId, "Type A", feb1);
            CreateLegalActRegistry("Jan Type B", "ACT-JAN-B", "Jan Type B Decision", statusId, "Type B", jan1);
            CreateLegalActRegistry("Mar Type B", "ACT-MAR-B", "Mar Type B Decision", statusId, "Type B", mar1);

            // Create filter to find Type A acts from January to February
            var filter = new LegalFilter
            {
                commonFilter = "Type A"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/legal_act_registry/GetByFilter", filter);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_act_registry>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, r => Assert.Equal("Type A", r.act_type));
            Assert.Contains(result, r => r.act_number == "ACT-JAN-A");
            Assert.Contains(result, r => r.act_number == "ACT-FEB-A");
        }

        [Fact]
        public async Task GetByAddress_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateLegalActRegistryStatus("Address Test Status", "address_test_status", "Address Test Status Description");

            // Create legal objects with specific addresses
            var objectId1 = CreateLegalObject("Match Object", "123 Main Street");
            var objectId2 = CreateLegalObject("No Match Object", "456 Side Avenue");
            var objectId3 = CreateLegalObject("Another Match Object", "123 Main Street, Apt 4");

            // Create acts and associate them with objects
            var actId1 = CreateLegalActRegistry("Address Act 1", "ACT-ADDR-1", "Address Decision 1", statusId);
            var actId2 = CreateLegalActRegistry("Address Act 2", "ACT-ADDR-2", "Address Decision 2", statusId);
            var actId3 = CreateLegalActRegistry("Address Act 3", "ACT-ADDR-3", "Address Decision 3", statusId);

            CreateLegalActObject(actId1, objectId1);
            CreateLegalActObject(actId2, objectId2);
            CreateLegalActObject(actId3, objectId3);

            // Act
            var response = await _client.GetAsync("/legal_act_registry/GetByAddress?address=123 Main Street");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<legal_act_registry>>(content);

            Assert.NotNull(result);
            Assert.Equal(1, result.Count);
            Assert.Contains(result, r => r.act_number == "ACT-ADDR-1");
            Assert.DoesNotContain(result, r => r.act_number == "ACT-ADDR-3");
            Assert.DoesNotContain(result, r => r.act_number == "ACT-ADDR-2");
        }

        // Helper methods to create test data
        private int CreateLegalActRegistryStatus(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_act_registry_status (name, code, description, created_at, updated_at) 
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

        private int CreateLegalActRegistry(string subject, string actNumber, string decision, int statusId,
            string actType = "Test Act Type", DateTime? dateIssue = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_act_registry (subject, act_number, decision, id_status, act_type, date_issue, is_active, created_at, updated_at) 
                VALUES (@subject, @act_number, @decision, @id_status, @act_type, @date_issue, true, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@subject"] = subject,
                    ["@act_number"] = actNumber,
                    ["@decision"] = decision,
                    ["@id_status"] = statusId,
                    ["@act_type"] = actType,
                    ["@date_issue"] = dateIssue as object ?? DBNull.Value,
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

        private int CreateLegalActObject(int actId, int objectId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_act_object (id_act, id_object, created_at, updated_at) 
                VALUES (@id_act, @id_object, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@id_act"] = actId,
                    ["@id_object"] = objectId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateEmployee(string lastName, string firstName, string secondName)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO employee (last_name, first_name, second_name, created_at, updated_at) 
                VALUES (@last_name, @first_name, @second_name, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@last_name"] = lastName,
                    ["@first_name"] = firstName,
                    ["@second_name"] = secondName,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateOrgStructure(string name, string version, bool isActive)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, version, is_active, date_start, created_at, updated_at) 
                VALUES (@name, @version, @is_active, @date_start, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@version"] = version,
                    ["@is_active"] = isActive,
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

        private int CreateLegalActEmployee(int actId, int structureEmployeeId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO legal_act_employee (id_act, id_structure_employee, is_active, created_at, updated_at) 
                VALUES (@id_act, @id_structure_employee, true, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@id_act"] = actId,
                    ["@id_structure_employee"] = structureEmployeeId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<List<legal_act_object>> GetLegalActObjectsByActId(int actId)
        {
            return DatabaseHelper.RunQueryList<legal_act_object>(_schemaName, @"
                SELECT * FROM legal_act_object WHERE id_act = @id_act",
                reader => new legal_act_object
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    id_act = reader.GetInt32(reader.GetOrdinal("id_act")),
                    id_object = reader.GetInt32(reader.GetOrdinal("id_object"))
                },
                new Dictionary<string, object> { ["@id_act"] = actId });
        }

        private async Task<List<LegalActEmployee>> GetLegalActEmployeesByActId(int actId)
        {
            return DatabaseHelper.RunQueryList<LegalActEmployee>(_schemaName, @"
                SELECT * FROM legal_act_employee WHERE id_act = @id_act",
                reader => new LegalActEmployee
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    id_act = reader.GetInt32(reader.GetOrdinal("id_act")),
                    id_structure_employee = reader.GetInt32(reader.GetOrdinal("id_structure_employee")),
                    isActive = reader.GetBoolean(reader.GetOrdinal("is_active"))
                },
                new Dictionary<string, object> { ["@id_act"] = actId });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }

    // Additional classes needed for tests
    public class LegalFilter
    {
        public string ActType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string Address { get; set; }
        public string commonFilter { get; set; }
    }

    public class LegalActEmployee
    {
        public int id { get; set; }
        public bool isActive { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public int id_act { get; set; }
        public int id_structure_employee { get; set; }
    }
}