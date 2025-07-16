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

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ArchiveObjectCustomerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ArchiveObjectCustomerTests()
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
            var (archiveObjectId1, customerId1) = CreateTestData();
            var (archiveObjectId2, customerId2) = CreateTestData();

            CreateArchiveObjectCustomer(archiveObjectId1, customerId1, "Description 1");
            CreateArchiveObjectCustomer(archiveObjectId2, customerId2, "Description 2");

            // Act
            var response = await _client.GetAsync("/ArchiveObjectCustomer/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ArchiveObjectCustomer>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, aoc => aoc.archive_object_id == archiveObjectId1 && aoc.customer_id == customerId1 && aoc.description == "Description 1");
            Assert.Contains(result, aoc => aoc.archive_object_id == archiveObjectId2 && aoc.customer_id == customerId2 && aoc.description == "Description 2");
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (archiveObjectId, customerId) = CreateTestData();
            var id = CreateArchiveObjectCustomer(archiveObjectId, customerId, "Test Description");

            // Act
            var response = await _client.GetAsync($"/ArchiveObjectCustomer/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveObjectCustomer>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(archiveObjectId, result.archive_object_id);
            Assert.Equal(customerId, result.customer_id);
            Assert.Equal("Test Description", result.description);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (archiveObjectId, customerId) = CreateTestData();

            var createRequest = new CreateArchiveObjectCustomerRequest
            {
                archive_object_id = archiveObjectId,
                customer_id = customerId,
                description = "New relationship description"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ArchiveObjectCustomer/Create", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveObjectCustomer>(content);

            Assert.NotNull(result);
            Assert.True(result.id > 0);
            Assert.Equal(archiveObjectId, result.archive_object_id);
            Assert.Equal(customerId, result.customer_id);
            Assert.Equal("New relationship description", result.description);

            // Verify in the database
            var storedEntity = GetArchiveObjectCustomerById(result.id);
            Assert.NotNull(storedEntity);
            Assert.Equal(archiveObjectId, storedEntity.archive_object_id);
            Assert.Equal(customerId, storedEntity.customer_id);
            Assert.Equal("New relationship description", storedEntity.description);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (archiveObjectId1, customerId1) = CreateTestData();
            var (archiveObjectId2, customerId2) = CreateTestData();

            var id = CreateArchiveObjectCustomer(archiveObjectId1, customerId1, "Original description");

            var updateRequest = new UpdateArchiveObjectCustomerRequest
            {
                id = id,
                archive_object_id = archiveObjectId2, // Change to different archive object
                customer_id = customerId2, // Change to different customer
                description = "Updated description"
            };

            // Act
            var response = await _client.PutAsync($"/ArchiveObjectCustomer/{id}", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveObjectCustomer>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(archiveObjectId2, result.archive_object_id);
            Assert.Equal(customerId2, result.customer_id);
            Assert.Equal("Updated description", result.description);

            // Verify in the database
            var storedEntity = GetArchiveObjectCustomerById(id);
            Assert.NotNull(storedEntity);
            Assert.Equal(archiveObjectId2, storedEntity.archive_object_id);
            Assert.Equal(customerId2, storedEntity.customer_id);
            Assert.Equal("Updated description", storedEntity.description);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (archiveObjectId, customerId) = CreateTestData();
            var id = CreateArchiveObjectCustomer(archiveObjectId, customerId, "Delete this");

            // Act
            var response = await _client.DeleteAsync($"/ArchiveObjectCustomer/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify deletion in database
            var storedEntity = GetArchiveObjectCustomerById(id);
            Assert.Null(storedEntity);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple test relationships
            for (int i = 1; i <= 5; i++)
            {
                var (archiveObjectId, customerId) = CreateTestData();
                CreateArchiveObjectCustomer(archiveObjectId, customerId, $"Description {i}");
            }

            // Act
            var response = await _client.GetAsync("/ArchiveObjectCustomer/GetPaginated?pageSize=2&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<ArchiveObjectCustomer>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.items.Count);

        }

        #region Helper Methods

        private (int archiveObjectId, int customerId) CreateTestData()
        {
            // Create archive object
            var statusId = CreateStatus("Archive", "archive");
            var archiveObjectId = CreateArchiveObject("DOC-TEST", "Test Address", "Test Customer", statusId);

            // Create customer
            var customerId = CreateCustomerForArchiveObject("Test Customer Name", "12345678", false);

            return (archiveObjectId, customerId);
        }

        private int CreateStatus(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO status_dutyplan_object (name, code, created_at, updated_at) 
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

        private int CreateArchiveObject(string docNumber, string address, string customer, int statusId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO dutyplan_object (doc_number, address, customer, status_dutyplan_object_id, created_at, updated_at) 
                VALUES (@doc_number, @address, @customer, @status_dutyplan_object_id, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@doc_number"] = docNumber,
                    ["@address"] = address,
                    ["@customer"] = customer,
                    ["@status_dutyplan_object_id"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateCustomerForArchiveObject(string fullName, string pin, bool isOrganization)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customers_for_archive_object (full_name, pin, is_organization, created_at, updated_at) 
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

        private int CreateArchiveObjectCustomer(int archiveObjectId, int customerId, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_object_customer (archive_object_id, customer_id, description, created_at, updated_at) 
                VALUES (@archive_object_id, @customer_id, @description, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@archive_object_id"] = archiveObjectId,
                    ["@customer_id"] = customerId,
                    ["@description"] = description,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private ArchiveObjectCustomer GetArchiveObjectCustomerById(int id)
        {
            return DatabaseHelper.RunQueryList<ArchiveObjectCustomer>(_schemaName, @"
                SELECT id, archive_object_id, customer_id, description
                FROM archive_object_customer 
                WHERE id = @id",
                reader => new ArchiveObjectCustomer
                {
                    id = reader.GetInt32(0),
                    archive_object_id = reader.GetInt32(1),
                    customer_id = reader.GetInt32(2),
                    description = reader.IsDBNull(3) ? null : reader.GetString(3)
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