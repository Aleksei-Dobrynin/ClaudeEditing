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
    public class CustomerDiscountDocumentsControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public CustomerDiscountDocumentsControllerTests()
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
            var (customerDiscountId1, discountDocumentId1) = CreateTestData("12345678", "Discount Document 1");
            var (customerDiscountId2, discountDocumentId2) = CreateTestData("87654321", "Discount Document 2");

            // Create customer discount documents links
            CreateCustomerDiscountDocument(customerDiscountId1, discountDocumentId1);
            CreateCustomerDiscountDocument(customerDiscountId2, discountDocumentId2);

            // Act
            var response = await _client.GetAsync("/CustomerDiscountDocuments/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomerDiscountDocuments>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetByIdCustomer_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (customerDiscountId, discountDocumentId1) = CreateTestData("11112222", "Customer Specific Doc 1");
            var (_, discountDocumentId2) = CreateTestData("11112222", "Customer Specific Doc 2"); // Same customer discount

            // Create customer discount documents links
            CreateCustomerDiscountDocument(customerDiscountId, discountDocumentId1);
            CreateCustomerDiscountDocument(customerDiscountId, discountDocumentId2);

            // Act
            var response = await _client.GetAsync($"/CustomerDiscountDocuments/GetByIdCustomer?idCustomer={customerDiscountId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomerDiscountDocuments>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, doc => Assert.Equal(customerDiscountId, doc.customer_discount_id));

            // Verify that additional info is included
            Assert.All(result, doc =>
            {
                Assert.NotNull(doc.file_name);
                Assert.NotNull(doc.discount_type_name);
                Assert.NotNull(doc.discount_document_name);
                Assert.NotNull(doc.start_date);
                Assert.NotNull(doc.end_date);
                Assert.True(doc.discount > 0);
            });
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (customerDiscountId, discountDocumentId) = CreateTestData("33334444", "Single Test Doc");

            // Create customer discount documents link
            var id = CreateCustomerDiscountDocument(customerDiscountId, discountDocumentId);

            // Act
            var response = await _client.GetAsync($"/CustomerDiscountDocuments/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomerDiscountDocuments>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(customerDiscountId, result.customer_discount_id);
            Assert.Equal(discountDocumentId, result.discount_documents_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (customerDiscountId, discountDocumentId) = CreateTestData("55556666", "New Link Doc");

            // Create request
            var createRequest = new CreateCustomerDiscountDocumentsRequest
            {
                customer_discount_id = customerDiscountId,
                discount_documents_id = discountDocumentId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/CustomerDiscountDocuments/Create", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomerDiscountDocuments>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(customerDiscountId, result.customer_discount_id);
            Assert.Equal(discountDocumentId, result.discount_documents_id);

            // Verify in database
            var linkExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM customer_discount_documents 
                WHERE customer_discount_id = @customerDiscountId AND discount_documents_id = @discountDocumentId",
                new Dictionary<string, object>
                {
                    ["@customerDiscountId"] = customerDiscountId,
                    ["@discountDocumentId"] = discountDocumentId
                });

            Assert.Equal(1, linkExists);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (originalCustomerDiscountId, originalDiscountDocumentId) = CreateTestData("77778888", "Original Doc");
            var (newCustomerDiscountId, newDiscountDocumentId) = CreateTestData("99990000", "Updated Doc");

            // Create customer discount documents link
            var id = CreateCustomerDiscountDocument(originalCustomerDiscountId, originalDiscountDocumentId);

            // Create update request
            var updateRequest = new UpdateCustomerDiscountDocumentsRequest
            {
                id = id,
                customer_discount_id = newCustomerDiscountId,
                discount_documents_id = newDiscountDocumentId
            };

            // Act
            var response = await _client.PutAsync("/CustomerDiscountDocuments/Update", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomerDiscountDocuments>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newCustomerDiscountId, result.customer_discount_id);
            Assert.Equal(newDiscountDocumentId, result.discount_documents_id);

            // Verify in database
            var updatedLink = DatabaseHelper.RunQueryList<CustomerDiscountDocuments>(_schemaName, @"
                SELECT customer_discount_id, discount_documents_id FROM customer_discount_documents WHERE id = @id",
                reader => new CustomerDiscountDocuments
                {
                    customer_discount_id = reader.GetInt32(0),
                    discount_documents_id = reader.GetInt32(1)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(updatedLink);
            Assert.Equal(newCustomerDiscountId, updatedLink.customer_discount_id);
            Assert.Equal(newDiscountDocumentId, updatedLink.discount_documents_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (customerDiscountId, discountDocumentId) = CreateTestData("12121212", "Document To Delete");

            // Create customer discount documents link
            var id = CreateCustomerDiscountDocument(customerDiscountId, discountDocumentId);

            // Act
            var response = await _client.DeleteAsync($"/CustomerDiscountDocuments/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM customer_discount_documents WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test links
            var (customerDiscountId, _) = CreateTestData("13131313", "Base Document");

            for (int i = 1; i <= 5; i++)
            {
                var (_, discountDocumentId) = CreateTestData($"1313{i}", $"Paginated Document {i}");
                CreateCustomerDiscountDocument(customerDiscountId, discountDocumentId);
            }

            // Act
            var response = await _client.GetAsync("/CustomerDiscountDocuments/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<CustomerDiscountDocuments>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        // Helper methods to create test data
        private (int customerDiscountId, int discountDocumentId) CreateTestData(string pin, string docName)
        {
            // Create customer discount
            var customerDiscountId = CreateCustomerDiscount(pin, $"Discount for {docName}");

            // Create discount document
            var discountTypeId = CreateDiscountType($"Type for {docName}", $"type_{Guid.NewGuid().ToString().Substring(0, 8)}", "Type Description");
            var documentTypeId = CreateDiscountDocumentType($"Doc Type for {docName}", $"doc_type_{Guid.NewGuid().ToString().Substring(0, 8)}", "Doc Type Description");
            var fileId = CreateFile($"{docName}.pdf", $"/path/to/{docName}.pdf");
            var discountDocumentId = CreateDiscountDocument(fileId, $"Description for {docName}", 10.0 + new Random().NextDouble() * 20.0, discountTypeId, documentTypeId);

            return (customerDiscountId, discountDocumentId);
        }

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