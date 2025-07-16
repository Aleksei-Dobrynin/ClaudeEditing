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
    public class CustomerRepresentativeControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public CustomerRepresentativeControllerTests()
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
            // Arrange - Create test customers and representatives
            var customerId1 = CreateCustomer("First Customer", "12345678", false);
            var customerId2 = CreateCustomer("Second Customer", "87654321", true);

            CreateCustomerRepresentative(customerId1, "Smith", "John", "A", "11112222", DateTime.Now.AddDays(-30));
            CreateCustomerRepresentative(customerId2, "Johnson", "Robert", "B", "33334444", DateTime.Now.AddDays(-15));

            // Act
            var response = await _client.GetAsync("/CustomerRepresentative/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomerRepresentative>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.customer_id == customerId1 && r.last_name == "Smith" && r.first_name == "John");
            Assert.Contains(result, r => r.customer_id == customerId2 && r.last_name == "Johnson" && r.first_name == "Robert");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test customer and representative
            var customerId = CreateCustomer("Single Test Customer", "55556666", false);
            var repId = CreateCustomerRepresentative(
                customerId, "Brown", "Michael", "C", "77778888",
                DateTime.Now.AddDays(-20), DateTime.Now.AddYears(1),
                "N12345", "Test Requisites", true, "+996123456789"
            );

            // Act
            var response = await _client.GetAsync($"/CustomerRepresentative/GetOneById?id={repId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomerRepresentative>(content);

            Assert.NotNull(result);
            Assert.Equal(repId, result.id);
            Assert.Equal(customerId, result.customer_id);
            Assert.Equal("Brown", result.last_name);
            Assert.Equal("Michael", result.first_name);
            Assert.Equal("C", result.second_name);
            Assert.Equal("77778888", result.pin);
            Assert.Equal("N12345", result.notary_number);
            Assert.Equal("Test Requisites", result.requisites);
            Assert.True(result.is_included_to_agreement);
            Assert.Equal("+996123456789", result.contact);
        }

        [Fact]
        public async Task GetByidCustomer_ReturnsOkResponse()
        {
            // Arrange - Create test customer with multiple representatives
            var customerId = CreateCustomer("Multi-Rep Customer", "99990000", true);

            CreateCustomerRepresentative(customerId, "Davis", "Sarah", "D", "11223344", DateTime.Now.AddDays(-10));
            CreateCustomerRepresentative(customerId, "Wilson", "James", "E", "55667788", DateTime.Now.AddDays(-5));
            CreateCustomerRepresentative(customerId, "Anderson", "Emily", "F", "99001122", DateTime.Now.AddDays(-2));

            // Act
            var response = await _client.GetAsync($"/CustomerRepresentative/GetByidCustomer?idCustomer={customerId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomerRepresentative>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.All(result, r => Assert.Equal(customerId, r.customer_id));
            Assert.Contains(result, r => r.last_name == "Davis" && r.first_name == "Sarah");
            Assert.Contains(result, r => r.last_name == "Wilson" && r.first_name == "James");
            Assert.Contains(result, r => r.last_name == "Anderson" && r.first_name == "Emily");
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var customerId = CreateCustomer("Create Rep Customer", "12131415", false);

            var createRequest = new CreateCustomerRepresentativeRequest
            {
                customer_id = customerId,
                last_name = "Taylor",
                first_name = "Thomas",
                second_name = "G",
                pin = "16171819",
                date_start = DateTime.Now.AddDays(-1),
                date_end = DateTime.Now.AddDays(365),
                date_document = DateTime.Now,
                notary_number = "N67890",
                requisites = "Created Requisites",
                is_included_to_agreement = true,
                contact = "+996987654321"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/CustomerRepresentative/Create", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomerRepresentative>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(customerId, result.customer_id);
            Assert.Equal("Taylor", result.last_name);
            Assert.Equal("Thomas", result.first_name);
            Assert.Equal("G", result.second_name);
            Assert.Equal("16171819", result.pin);
            Assert.Equal("N67890", result.notary_number);
            Assert.Equal("Created Requisites", result.requisites);
            Assert.True(result.is_included_to_agreement);
            Assert.Equal("+996987654321", result.contact);

            // Verify dates are approximately correct (serialization/deserialization may cause slight differences)
            Assert.True((result.date_start?.Date - DateTime.Now.AddDays(-1).Date)?.Days <= 1);
            Assert.True((result.date_end?.Date - DateTime.Now.AddDays(365).Date)?.Days <= 1);
            Assert.True((result.date_document?.Date - DateTime.Now.Date)?.Days <= 1);

            // Verify in database
            var representative = DatabaseHelper.RunQueryList<CustomerRepresentative>(_schemaName, @"
                SELECT customer_id, last_name, first_name, second_name, pin, notary_number, requisites, is_included_to_agreement, contact 
                FROM customer_representative WHERE id = @id",
                reader => new CustomerRepresentative
                {
                    customer_id = reader.GetInt32(0),
                    last_name = reader.GetString(1),
                    first_name = reader.GetString(2),
                    second_name = reader.GetString(3),
                    pin = reader.GetString(4),
                    notary_number = reader.GetString(5),
                    requisites = reader.GetString(6),
                    is_included_to_agreement = reader.GetBoolean(7),
                    contact = reader.GetString(8)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(representative);
            Assert.Equal(customerId, representative.customer_id);
            Assert.Equal("Taylor", representative.last_name);
            Assert.Equal("Thomas", representative.first_name);
            Assert.Equal("16171819", representative.pin);
            Assert.True(representative.is_included_to_agreement);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var customerId = CreateCustomer("Update Rep Customer", "20212223", true);
            var repId = CreateCustomerRepresentative(
                customerId, "Harris", "William", "H", "24252627",
                DateTime.Now.AddDays(-30), DateTime.Now.AddDays(30),
                "N11111", "Original Requisites", false, "+996111222333"
            );

            var updateRequest = new UpdateCustomerRepresentativeRequest
            {
                id = repId,
                customer_id = customerId,
                last_name = "Harris-Updated",
                first_name = "William-Updated",
                second_name = "H-Updated",
                pin = "24252627",
                date_start = DateTime.Now.AddDays(-25),
                date_end = DateTime.Now.AddDays(60),
                date_document = DateTime.Now.AddDays(-1),
                notary_number = "N22222",
                requisites = "Updated Requisites",
                is_included_to_agreement = true,
                contact = "+996444555666"
            };

            // Act
            var response = await _client.PutAsync("/CustomerRepresentative/Update", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomerRepresentative>(content);

            Assert.NotNull(result);
            Assert.Equal(repId, result.id);
            Assert.Equal(customerId, result.customer_id);
            Assert.Equal("Harris-Updated", result.last_name);
            Assert.Equal("William-Updated", result.first_name);
            Assert.Equal("H-Updated", result.second_name);
            Assert.Equal("24252627", result.pin);
            Assert.Equal("N22222", result.notary_number);
            Assert.Equal("Updated Requisites", result.requisites);
            Assert.True(result.is_included_to_agreement);
            Assert.Equal("+996444555666", result.contact);

            // Verify dates are approximately correct
            Assert.True((result.date_start?.Date - DateTime.Now.AddDays(-25).Date)?.Days <= 1);
            Assert.True((result.date_end?.Date - DateTime.Now.AddDays(60).Date)?.Days <= 1);
            Assert.True((result.date_document?.Date - DateTime.Now.AddDays(-1).Date)?.Days <= 1);

            // Verify in database
            var representative = DatabaseHelper.RunQueryList<CustomerRepresentative>(_schemaName, @"
                SELECT last_name, first_name, second_name, is_included_to_agreement, notary_number 
                FROM customer_representative WHERE id = @id",
                reader => new CustomerRepresentative
                {
                    last_name = reader.GetString(0),
                    first_name = reader.GetString(1),
                    second_name = reader.GetString(2),
                    is_included_to_agreement = reader.GetBoolean(3),
                    notary_number = reader.GetString(4)
                },
                new Dictionary<string, object> { ["@id"] = repId }
            ).FirstOrDefault();

            Assert.NotNull(representative);
            Assert.Equal("Harris-Updated", representative.last_name);
            Assert.Equal("William-Updated", representative.first_name);
            Assert.Equal("H-Updated", representative.second_name);
            Assert.True(representative.is_included_to_agreement);
            Assert.Equal("N22222", representative.notary_number);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var customerId = CreateCustomer("Delete Rep Customer", "28293031", false);
            var repId = CreateCustomerRepresentative(
                customerId, "Smith", "Jane", "I", "32333435", DateTime.Now.AddDays(-10)
            );

            // Act
            var response = await _client.DeleteAsync($"/CustomerRepresentative/Delete?id={repId}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM customer_representative WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = repId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test customer with multiple representatives
            var customerId = CreateCustomer("Paginated Rep Customer", "40414243", true);

            for (int i = 1; i <= 5; i++)
            {
                CreateCustomerRepresentative(
                    customerId,
                    $"Page-{i}",
                    $"Rep-{i}",
                    $"X-{i}",
                    $"444{i}{i}{i}{i}",
                    DateTime.Now.AddDays(-i * 5)
                );
            }

            // Act
            var response = await _client.GetAsync("/CustomerRepresentative/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<CustomerRepresentative>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        // Helper methods to create test data
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

        private int CreateCustomerRepresentative(
            int customerId,
            string lastName,
            string firstName,
            string secondName,
            string pin,
            DateTime? dateStart,
            DateTime? dateEnd = null,
            string notaryNumber = null,
            string requisites = null,
            bool? isIncludedToAgreement = null,
            string contact = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer_representative (
                    customer_id, last_name, first_name, second_name, pin, date_start, date_end,
                    notary_number, requisites, is_included_to_agreement, date_document, contact,
                    created_at, updated_at
                ) 
                VALUES (
                    @customer_id, @last_name, @first_name, @second_name, @pin, @date_start, @date_end,
                    @notary_number, @requisites, @is_included_to_agreement, @date_document, @contact,
                    @created_at, @updated_at
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@customer_id"] = customerId,
                    ["@last_name"] = lastName,
                    ["@first_name"] = firstName,
                    ["@second_name"] = secondName,
                    ["@pin"] = pin,
                    ["@date_start"] = dateStart as object ?? DBNull.Value,
                    ["@date_end"] = dateEnd as object ?? DBNull.Value,
                    ["@notary_number"] = notaryNumber as object ?? DBNull.Value,
                    ["@requisites"] = requisites as object ?? DBNull.Value,
                    ["@is_included_to_agreement"] = isIncludedToAgreement as object ?? DBNull.Value,
                    ["@date_document"] = DateTime.Now as object,
                    ["@contact"] = contact as object ?? DBNull.Value,
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