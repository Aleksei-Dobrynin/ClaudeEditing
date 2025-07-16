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
    public class CustomersForArchiveObjectTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public CustomersForArchiveObjectTests()
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
            CreateCustomerForArchiveObject("Customer 1", "12345678", "Test Address 1", false, "Test Description 1");
            CreateCustomerForArchiveObject("Customer 2", "87654321", "Test Address 2", true, "Test Description 2");

            // Act
            var response = await _client.GetAsync("/customers_for_archive_object/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<customers_for_archive_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, c => c.full_name == "Customer 1" && c.pin == "12345678");
            Assert.Contains(result, c => c.full_name == "Customer 2" && c.pin == "87654321");
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test data
            for (int i = 1; i <= 5; i++)
            {
                CreateCustomerForArchiveObject($"Customer {i}", $"PIN{i}", $"Address {i}", i % 2 == 0, $"Description {i}");
            }

            // Act
            var response = await _client.GetAsync("/customers_for_archive_object/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<customers_for_archive_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var id = CreateCustomerForArchiveObject("Single Customer", "SINGLE123", "Single Address", true, "Single Description", "OUT-123");

            // Act
            var response = await _client.GetAsync($"/customers_for_archive_object/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<customers_for_archive_object>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Customer", result.full_name);
            Assert.Equal("SINGLE123", result.pin);
            Assert.Equal("Single Address", result.address);
            Assert.True(result.is_organization);
            Assert.Equal("Single Description", result.description);
            Assert.Equal("OUT-123", result.dp_outgoing_number);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new Createcustomers_for_archive_objectRequest
            {
                full_name = "New Customer",
                pin = "NEW123456",
                address = "New Address",
                is_organization = true,
                description = "New Description",
                dp_outgoing_number = "NEW-OUT-123"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/customers_for_archive_object/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<customers_for_archive_object>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Customer", result.full_name);
            Assert.Equal("NEW123456", result.pin);
            Assert.Equal("New Address", result.address);
            Assert.True(result.is_organization);
            Assert.Equal("New Description", result.description);
            Assert.Equal("NEW-OUT-123", result.dp_outgoing_number);

            // Verify in database
            var createdCustomer = await GetCustomerForArchiveObjectById(result.id);
            Assert.NotNull(createdCustomer);
            Assert.Equal("New Customer", createdCustomer.full_name);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var id = CreateCustomerForArchiveObject("Original Customer", "ORIG123", "Original Address", false, "Original Description");

            var request = new Updatecustomers_for_archive_objectRequest
            {
                id = id,
                full_name = "Updated Customer",
                pin = "UPD123",
                address = "Updated Address",
                is_organization = true,
                description = "Updated Description",
                dp_outgoing_number = "UPD-OUT-123"
            };

            // Act
            var response = await _client.PutAsync($"/customers_for_archive_object/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<customers_for_archive_object>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("UPD123", result.pin);
            Assert.Equal("Updated Address", result.address);
            Assert.True(result.is_organization);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("UPD-OUT-123", result.dp_outgoing_number);

            // Verify in database
            var updatedCustomer = await GetCustomerForArchiveObjectById(id);
            Assert.NotNull(updatedCustomer);
            Assert.Equal("UPD123", updatedCustomer.pin);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var id = CreateCustomerForArchiveObject("Customer To Delete", "DELETE123", "Delete Address", true, "Delete Description");

            // Act
            var response = await _client.DeleteAsync($"/customers_for_archive_object/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.Equal(id.ToString(), content);

            // Verify the object was deleted in the database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM customers_for_archive_object WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, exists);
        }

        [Fact]
        public async Task GetCustomersForArchiveObjects_ReturnsOkResponse()
        {
            // Arrange
            // 1. Create customers
            var customerId1 = CreateCustomerForArchiveObject("Archive Customer 1", "ARCH1", "Archive Address 1", false, "Archive Description 1");
            var customerId2 = CreateCustomerForArchiveObject("Archive Customer 2", "ARCH2", "Archive Address 2", true, "Archive Description 2");

            // 2. Create status for dutyplan_object
            var statusId = CreateStatusDutyplanObject("Status", "status_code", "Status Description");

            // 3. Create dutyplan_objects
            var objectId1 = CreateDutyplanObject("DOC1", "Object Address 1", statusId);
            var objectId2 = CreateDutyplanObject("DOC2", "Object Address 2", statusId);

            // 4. Create archive_object_customer relations
            CreateArchiveObjectCustomer(objectId1, customerId1);
            CreateArchiveObjectCustomer(objectId2, customerId2);

            // Act
            var response = await _client.GetAsync("/customers_for_archive_object/GetCustomersForArchiveObjects");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<customers_objects>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, co => co.full_name == "Archive Customer 1" && co.obj_id == objectId1);
            Assert.Contains(result, co => co.full_name == "Archive Customer 2" && co.obj_id == objectId2);
        }

        [Fact]
        public async Task GetByCustomersIdArchiveObject_ReturnsOkResponse()
        {
            // Arrange
            // 1. Create customers
            var customerId1 = CreateCustomerForArchiveObject("Target Customer 1", "TARGET1", "Target Address 1", false, "Target Description 1");
            var customerId2 = CreateCustomerForArchiveObject("Target Customer 2", "TARGET2", "Target Address 2", true, "Target Description 2");
            var customerId3 = CreateCustomerForArchiveObject("Other Customer", "OTHER1", "Other Address", false, "Other Description");

            // 2. Create status for dutyplan_object
            var statusId = CreateStatusDutyplanObject("Status", "status_code", "Status Description");

            // 3. Create dutyplan_object
            var objectId = CreateDutyplanObject("TARGET-DOC", "Target Object Address", statusId);
            var otherId = CreateDutyplanObject("OTHER-DOC", "Other Object Address", statusId);

            // 4. Link customers to the object
            CreateArchiveObjectCustomer(objectId, customerId1);
            CreateArchiveObjectCustomer(objectId, customerId2);
            CreateArchiveObjectCustomer(otherId, customerId3);

            // Act
            var response = await _client.GetAsync($"/customers_for_archive_object/GetByCustomersIdArchiveObject?ArchiveObject_id={objectId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<customers_for_archive_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, c => c.id == customerId1 && c.full_name == "Target Customer 1");
            Assert.Contains(result, c => c.id == customerId2 && c.full_name == "Target Customer 2");
            Assert.DoesNotContain(result, c => c.id == customerId3);
        }

        // Helper methods to create test data
        private int CreateCustomerForArchiveObject(string fullName, string pin, string address, bool isOrganization, string description, string dpOutgoingNumber = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customers_for_archive_object (
                    full_name, pin, address, is_organization, description, dp_outgoing_number, 
                    created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @fullName, @pin, @address, @isOrganization, @description, @dpOutgoingNumber, 
                    @createdAt, @updatedAt, @createdBy, @updatedBy
                ) RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@fullName"] = fullName,
                    ["@pin"] = pin,
                    ["@address"] = address,
                    ["@isOrganization"] = isOrganization,
                    ["@description"] = description,
                    ["@dpOutgoingNumber"] = dpOutgoingNumber as object ?? DBNull.Value,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now,
                    ["@createdBy"] = 1,
                    ["@updatedBy"] = 1
                });
        }

        private int CreateStatusDutyplanObject(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO status_dutyplan_object (
                    name, code, description, 
                    created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @name, @code, @description, 
                    @createdAt, @updatedAt, @createdBy, @updatedBy
                ) RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now,
                    ["@createdBy"] = 1,
                    ["@updatedBy"] = 1
                });
        }

        private int CreateDutyplanObject(string docNumber, string address, int statusId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO dutyplan_object (
                    doc_number, address, status_dutyplan_object_id,
                    created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @docNumber, @address, @statusId,
                    @createdAt, @updatedAt, @createdBy, @updatedBy
                ) RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@docNumber"] = docNumber,
                    ["@address"] = address,
                    ["@statusId"] = statusId,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now,
                    ["@createdBy"] = 1,
                    ["@updatedBy"] = 1
                });
        }

        private void CreateArchiveObjectCustomer(int archiveObjectId, int customerId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_object_customer (
                    archive_object_id, customer_id,
                    created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @archiveObjectId, @customerId,
                    @createdAt, @updatedAt, @createdBy, @updatedBy
                );",
                new Dictionary<string, object>
                {
                    ["@archiveObjectId"] = archiveObjectId,
                    ["@customerId"] = customerId,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now,
                    ["@createdBy"] = 1,
                    ["@updatedBy"] = 1
                });
        }

        private async Task<customers_for_archive_object> GetCustomerForArchiveObjectById(int id)
        {
            var customers = DatabaseHelper.RunQueryList<customers_for_archive_object>(_schemaName, @"
                SELECT id, full_name, pin, address, is_organization, description, dp_outgoing_number
                FROM customers_for_archive_object
                WHERE id = @Id",
                reader => new customers_for_archive_object
                {
                    id = reader.GetInt32(0),
                    full_name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    pin = reader.IsDBNull(2) ? null : reader.GetString(2),
                    address = reader.IsDBNull(3) ? null : reader.GetString(3),
                    is_organization = reader.IsDBNull(4) ? null : (bool?)reader.GetBoolean(4),
                    description = reader.IsDBNull(5) ? null : reader.GetString(5),
                    dp_outgoing_number = reader.IsDBNull(6) ? null : reader.GetString(6)
                },
                new Dictionary<string, object> { ["@Id"] = id });

            return customers.FirstOrDefault();
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}