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
    public class CustomerDiscountControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public CustomerDiscountControllerTests()
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
            // Arrange - Create test customer discounts
            CreateCustomerDiscount("12345678", "Standard Customer Discount");
            CreateCustomerDiscount("87654321", "Premium Customer Discount");

            // Act
            var response = await _client.GetAsync("/CustomerDiscount/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomerDiscount>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, d => d.pin_customer == "12345678" && d.description == "Standard Customer Discount");
            Assert.Contains(result, d => d.pin_customer == "87654321" && d.description == "Premium Customer Discount");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test customer discount
            var id = CreateCustomerDiscount("11112222", "Single Test Discount");

            // Act
            var response = await _client.GetAsync($"/CustomerDiscount/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomerDiscount>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("11112222", result.pin_customer);
            Assert.Equal("Single Test Discount", result.description);
        }

        [Fact]
        public async Task GetOneByIdApplication_ReturnsOkResponse()
        {
            // Arrange
            var customerId = CreateCustomer("Test App Customer", "33334444", false);
            var discountId = CreateCustomerDiscount("33334444", "Application Discount");

            // Create a discount document
            var discountTypeId = CreateDiscountType("Test Type", "test_code", "Test Description");
            var documentTypeId = CreateDiscountDocumentType("Test Doc Type", "doc_code", "Doc Description");
            var fileId = CreateFile("test.pdf", "/path/to/test.pdf");
            var discountDocumentId = CreateDiscountDocument(fileId, "Doc Description", 15.0, discountTypeId, documentTypeId);

            // Link discount to document
            CreateCustomerDiscountDocument(discountId, discountDocumentId);

            // Create application
            var applicationId = CreateApplication(customerId, "33334444");

            // Act
            var response = await _client.GetAsync($"/CustomerDiscount/GetOneByIdApplication?idApplication={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomerDiscount>(content);

            Assert.NotNull(result);
            Assert.Equal(discountId, result.id);
            Assert.Equal("33334444", result.pin_customer);
            Assert.Equal("Application Discount", result.description);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var createRequest = new CreateCustomerDiscountRequest
            {
                pin_customer = "55556666",
                description = "New Created Discount"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/CustomerDiscount/Create", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomerDiscount>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("55556666", result.pin_customer);
            Assert.Equal("New Created Discount", result.description);

            // Verify in database
            var discount = DatabaseHelper.RunQueryList<CustomerDiscount>(_schemaName, @"
                SELECT id, pin_customer, description FROM customer_discount WHERE id = @id",
                reader => new CustomerDiscount
                {
                    id = reader.GetInt32(0),
                    pin_customer = reader.GetString(1),
                    description = reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(discount);
            Assert.Equal(result.id, discount.id);
            Assert.Equal("55556666", discount.pin_customer);
            Assert.Equal("New Created Discount", discount.description);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateCustomerDiscount("77778888", "Original Discount");

            var updateRequest = new UpdateCustomerDiscountRequest
            {
                id = id,
                pin_customer = "77778888",
                description = "Updated Discount Description"
            };

            // Act
            var response = await _client.PutAsync("/CustomerDiscount/Update", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomerDiscount>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("77778888", result.pin_customer);
            Assert.Equal("Updated Discount Description", result.description);

            // Verify in database
            var discount = DatabaseHelper.RunQueryList<CustomerDiscount>(_schemaName, @"
                SELECT pin_customer, description FROM customer_discount WHERE id = @id",
                reader => new CustomerDiscount
                {
                    pin_customer = reader.GetString(0),
                    description = reader.GetString(1)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(discount);
            Assert.Equal("77778888", discount.pin_customer);
            Assert.Equal("Updated Discount Description", discount.description);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateCustomerDiscount("99990000", "Discount To Delete");

            // Act
            var response = await _client.DeleteAsync($"/CustomerDiscount/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM customer_discount WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test customer discounts
            for (int i = 1; i <= 5; i++)
            {
                CreateCustomerDiscount($"PIN{i:D4}", $"Paginated Discount {i}");
            }

            // Act
            var response = await _client.GetAsync("/CustomerDiscount/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<CustomerDiscount>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        // Helper methods to create test data
        private int CreateCustomerDiscount(string pinCustomer, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer_discount (pin_customer, description, created_at, updated_at) 
                VALUES (@pin_customer, @description, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@pin_customer"] = pinCustomer,
                    ["@description"] = description,
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

        private int CreateApplication(int customerId, string customerPin)
        {
            // Get first available workflow, status, service from seed data
            var workflowId = DatabaseHelper.RunQuery<int>(_schemaName, "SELECT id FROM workflow LIMIT 1;");
            var statusId = DatabaseHelper.RunQuery<int>(_schemaName, "SELECT id FROM application_status LIMIT 1;");
            var serviceId = DatabaseHelper.RunQuery<int>(_schemaName, "SELECT id FROM service LIMIT 1;");

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (customer_id, customer_pin, status_id, workflow_id, service_id, registration_date, created_at, updated_at) 
                VALUES (@customer_id, @customer_pin, @status_id, @workflow_id, @service_id, @registration_date, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@customer_id"] = customerId,
                    ["@customer_pin"] = customerPin,
                    ["@status_id"] = statusId,
                    ["@workflow_id"] = workflowId,
                    ["@service_id"] = serviceId,
                    ["@registration_date"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateDiscountType(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO discount_type (name, code, description, created_at, updated_at) 
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

        private int CreateDiscountDocumentType(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO discount_document_type (name, code, description, created_at, updated_at) 
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

        private int CreateDiscountDocument(int fileId, string description, double discount, int discountTypeId, int documentTypeId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO discount_documents (file_id, description, discount, discount_type_id, document_type_id, start_date, end_date, created_at, updated_at) 
                VALUES (@file_id, @description, @discount, @discount_type_id, @document_type_id, @start_date, @end_date, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@file_id"] = fileId,
                    ["@description"] = description,
                    ["@discount"] = discount,
                    ["@discount_type_id"] = discountTypeId,
                    ["@document_type_id"] = documentTypeId,
                    ["@start_date"] = DateTime.Now.AddDays(-1),
                    ["@end_date"] = DateTime.Now.AddDays(30),
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateCustomerDiscountDocument(int customerDiscountId, int discountDocumentId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer_discount_documents (customer_discount_id, discount_documents_id) 
                VALUES (@customer_discount_id, @discount_documents_id) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@customer_discount_id"] = customerDiscountId,
                    ["@discount_documents_id"] = discountDocumentId
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}