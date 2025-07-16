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
    public class CustomerControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public CustomerControllerTests()
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
            // Arrange - Create test customers
            int orgTypeId = CreateOrganizationType("Company", "company_type");
            int identityDocTypeId = CreateIdentityDocumentType("Passport", "passport_type");
            int countryId = CreateCountry("Kyrgyzstan", "KG");

            CreateCustomer("12345678", true, "Test Company LLC", "Test Address", orgTypeId, null, null);
            CreateCustomer("87654321", false, null, "Test Address 2", null, identityDocTypeId, countryId,
                "John", "Middle", "Doe");

            // Act
            var response = await _client.GetAsync("/Customer/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<Customer>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, c => c.pin == "12345678");
            Assert.Contains(result, c => c.pin == "87654321");

            // Check if organization type name is populated correctly
            var orgCustomer = result.Find(c => c.pin == "12345678");
            Assert.Equal("Company", orgCustomer.organization_type_name);
        }

        [Fact]
        public async Task BySearch_ReturnsOkResponse()
        {
            // Arrange - Create test customers
            int orgTypeId = CreateOrganizationType("Company", "company_type");
            int identityDocTypeId = CreateIdentityDocumentType("Passport", "passport_type");

            CreateCustomer("12345678", true, "Alpha Company LLC", "Test Address", orgTypeId, null, null);
            CreateCustomer("87654321", false, null, "Test Address 2", null, identityDocTypeId, null,
                "John", "Middle", "Beta");

            // Act - Search by PIN
            var responseByPin = await _client.GetAsync("/Customer/BySearch?text=12345");

            // Assert - Pin search
            responseByPin.EnsureSuccessStatusCode();
            var contentByPin = await responseByPin.Content.ReadAsStringAsync();
            var resultByPin = JsonConvert.DeserializeObject<List<Customer>>(contentByPin);

            Assert.NotNull(resultByPin);
            Assert.Single(resultByPin);
            Assert.Equal("12345678", resultByPin[0].pin);

            // Act - Search by name
            var responseByName = await _client.GetAsync("/Customer/BySearch?text=beta");

            // Assert - Name search
            responseByName.EnsureSuccessStatusCode();
            var contentByName = await responseByName.Content.ReadAsStringAsync();
            var resultByName = JsonConvert.DeserializeObject<List<Customer>>(contentByName);

        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test customer with representatives and contacts
            int orgTypeId = CreateOrganizationType("Company", "company_type");
            int contactTypeId = CreateContactType("SMS", "sms");

            int customerId = CreateCustomer("12345678", true, "Test Company LLC", "Test Address",
                orgTypeId, null, null);

            // Create a representative for the customer
            CreateCustomerRepresentative(customerId, "Smith", "Agent", "Middle");

            // Create customer contacts
            CreateCustomerContact(customerId, contactTypeId, "+996555123456");
            CreateCustomerContact(customerId, contactTypeId, "+996700123456");

            // Act
            var response = await _client.GetAsync($"/Customer/GetOneById?id={customerId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Customer>(content);

            Assert.NotNull(result);
            Assert.Equal(customerId, result.id);
            Assert.Equal("12345678", result.pin);
            Assert.Equal("Test Company LLC", result.full_name);

            // Check if representative is included
            Assert.NotNull(result.customerRepresentatives);
            Assert.Single(result.customerRepresentatives);
            Assert.Equal("Smith", result.customerRepresentatives[0].last_name);
            Assert.Equal("Agent", result.customerRepresentatives[0].first_name);

        }

        [Fact]
        public async Task GetOneByPin_ReturnsOkResponse()
        {
            // Arrange - Create test customers
            int orgTypeId = CreateOrganizationType("Company", "company_type");
            int customerId = CreateCustomer("12345678", true, "Test Company LLC", "Test Address", orgTypeId, null, null);

            // Act - Get by PIN with different customer ID
            var response = await _client.GetAsync($"/Customer/GetOneByPin?pin=12345678&customer_id={customerId + 1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Customer>(content);

            Assert.NotNull(result);
            Assert.Equal(customerId, result.id);
            Assert.Equal("12345678", result.pin);

            // Act - Get by PIN with same customer ID (should return no results)
            var responseExcludingSelf = await _client.GetAsync($"/Customer/GetOneByPin?pin=12345678&customer_id={customerId}");

            // Assert
            responseExcludingSelf.EnsureSuccessStatusCode();
            var contentExcludingSelf = await responseExcludingSelf.Content.ReadAsStringAsync();

            // Should return null or empty object as we're excluding the same customer ID
            Assert.Equal("", contentExcludingSelf);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test customers
            for (int i = 1; i <= 5; i++)
            {
                CreateCustomer($"1000{i}", false, null, $"Address {i}", null, null, null, $"FirstName{i}", "Middle", $"LastName{i}");
            }

            // Act
            var response = await _client.GetAsync("/Customer/GetPaginated?pageSize=3&pageNumber=1&orderBy=id&orderType=asc");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<Customer>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            int orgTypeId = CreateOrganizationType("Company", "company_type");
            int identityDocTypeId = CreateIdentityDocumentType("Passport", "passport_type");
            int countryId = CreateCountry("Kyrgyzstan", "KG");

            // Create contact types for the sms, email, and telegram fields
            int smsTypeId = CreateContactType("SMS", "sms");
            int emailTypeId = CreateContactType("Email", "email");
            int telegramTypeId = CreateContactType("Telegram", "telegram");

            var request = new CreateCustomerRequest
            {
                pin = "9876543210",
                is_organization = true,
                full_name = "New Test Company",
                address = "New Test Address",
                director = "John Director",
                okpo = "12345",
                organization_type_id = orgTypeId,
                payment_account = "000123456789",
                postal_code = "720001",
                ugns = "1234",
                bank = "Test Bank",
                bik = "123456",
                registration_number = "REG123",
                is_foreign = true,
                foreign_country = countryId,
                sms_1 = "+996555111222",
                sms_2 = "+996700111222",
                email_1 = "test@example.com",
                email_2 = "info@example.com",
                telegram_1 = "@test_user",
                telegram_2 = "@company",
                customerRepresentatives = new List<Domain.Entities.CustomerRepresentative>
                {
                    new Domain.Entities.CustomerRepresentative
                    {
                        first_name = "Rep",
                        second_name = "Middle",
                        last_name = "Agent",
                        pin = "1122334455",
                        contact = "+996555333444"
                    }
                }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/Customer/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Customer>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("9876543210", result.pin);
            Assert.Equal("New Test Company", result.full_name);
            Assert.True(result.is_organization);
            Assert.Equal(orgTypeId, result.organization_type_id);

            // Verify in database
            var customer = await GetCustomerFromDatabase(result.id);
            Assert.NotNull(customer);
            Assert.Equal("New Test Company", customer.full_name);

            // Verify representative was created
            var representatives = await GetCustomerRepresentativesFromDatabase(result.id);
            Assert.Single(representatives);
            Assert.Equal("Agent", representatives[0].last_name);

        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            int originalOrgTypeId = CreateOrganizationType("Original Company", "original_company_type");
            int newOrgTypeId = CreateOrganizationType("New Company", "new_company_type");
            int identityDocTypeId = CreateIdentityDocumentType("Passport", "passport_type");
            int countryId = CreateCountry("Kyrgyzstan", "KG");

            var customerId = CreateCustomer("12345678", true, "Original Company Name", "Original Address",
                originalOrgTypeId, null, null, null, null, null, "Original Director");

            var request = new UpdateCustomerRequest
            {
                id = customerId,
                pin = "87654321", // Changed PIN
                is_organization = true,
                full_name = "Updated Company Name",
                address = "Updated Address",
                director = "Updated Director",
                okpo = "54321",
                organization_type_id = newOrgTypeId, // Changed org type
                payment_account = "999888777666",
                postal_code = "720002",
                ugns = "4321",
                bank = "Updated Bank",
                bik = "654321",
                registration_number = "REG321",
                is_foreign = true,
                foreign_country = countryId
            };

            // Act
            var response = await _client.PutAsJsonAsync("/Customer/Update", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Customer>(content);

            Assert.NotNull(result);
            Assert.Equal(customerId, result.id);
            Assert.Equal("87654321", result.pin);
            Assert.Equal("Updated Company Name", result.full_name);
            Assert.Equal(newOrgTypeId, result.organization_type_id);
            Assert.Equal("Updated Director", result.director);

            // Verify in database
            var customer = await GetCustomerFromDatabase(customerId);
            Assert.NotNull(customer);
            Assert.Equal("87654321", customer.pin);
            Assert.Equal("Updated Company Name", customer.full_name);
            Assert.Equal("Updated Director", customer.director);
            Assert.Equal(newOrgTypeId, customer.organization_type_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var customerId = CreateCustomer("12345678", false, null, "Address to Delete", null, null, null,
                "DeleteFirst", "DeleteMiddle", "DeleteLast");

            // Act
            var response = await _client.DeleteAsync($"/Customer/Delete?id={customerId}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var exists = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM customer WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = customerId });

            Assert.Equal(0, exists);
        }

        // Helper methods for creating test data

        private int CreateOrganizationType(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO organization_type (name, code, created_at, updated_at) 
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

        private int CreateIdentityDocumentType(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO identity_document_type (name, code, created_at, updated_at) 
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

        private int CreateCountry(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO country (name, code, created_at, updated_at) 
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

        private int CreateContactType(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO contact_type (name, code, created_at, updated_at) 
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

        private int CreateCustomer(string pin,
                                  bool? isOrganization,
                                  string fullName,
                                  string address,
                                  int? organizationTypeId,
                                  int? identityDocumentTypeId,
                                  int? foreignCountry,
                                  string individualName = null,
                                  string individualSecondname = null,
                                  string individualSurname = null,
                                  string director = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer (
                    pin, is_organization, full_name, address, organization_type_id, identity_document_type_id,
                    individual_name, individual_secondname, individual_surname, created_at, updated_at,
                    is_foreign, foreign_country, director
                ) 
                VALUES (
                    @pin, @isOrganization, @fullName, @address, @organizationTypeId, @identityDocumentTypeId,
                    @individualName, @individualSecondname, @individualSurname, @created_at, @updated_at,
                    @isForeign, @foreignCountry, @director
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@pin"] = pin,
                    ["@isOrganization"] = isOrganization,
                    ["@fullName"] = fullName,
                    ["@address"] = address,
                    ["@organizationTypeId"] = organizationTypeId as object ?? DBNull.Value,
                    ["@identityDocumentTypeId"] = identityDocumentTypeId as object ?? DBNull.Value,
                    ["@individualName"] = individualName as object ?? DBNull.Value,
                    ["@individualSecondname"] = individualSecondname as object ?? DBNull.Value,
                    ["@individualSurname"] = individualSurname as object ?? DBNull.Value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now,
                    ["@isForeign"] = foreignCountry != null,
                    ["@foreignCountry"] = foreignCountry as object ?? DBNull.Value,
                    ["@director"] = director as object ?? DBNull.Value
                });
        }

        private int CreateCustomerRepresentative(int customerId, string lastName, string firstName, string secondName)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer_representative (
                    customer_id, last_name, first_name, second_name, created_at, updated_at
                ) 
                VALUES (
                    @customerId, @lastName, @firstName, @secondName, @created_at, @updated_at
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@customerId"] = customerId,
                    ["@lastName"] = lastName,
                    ["@firstName"] = firstName,
                    ["@secondName"] = secondName,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateCustomerContact(int customerId, int typeId, string value)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer_contact (
                    customer_id, type_id, value, allow_notification, created_at, updated_at
                ) 
                VALUES (
                    @customerId, @typeId, @value, true, @created_at, @updated_at
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@customerId"] = customerId,
                    ["@typeId"] = typeId,
                    ["@value"] = value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<Customer> GetCustomerFromDatabase(int id)
        {
            return DatabaseHelper.RunQueryList<Customer>(_schemaName, @"
                SELECT c.*, ot.name as organization_type_name
                FROM customer c
                LEFT JOIN organization_type ot ON c.organization_type_id = ot.id
                WHERE c.id = @id",
                reader => new Customer
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    pin = reader.IsDBNull(reader.GetOrdinal("pin")) ? null : reader.GetString(reader.GetOrdinal("pin")),
                    is_organization = reader.GetBoolean(reader.GetOrdinal("is_organization")),
                    full_name = reader.IsDBNull(reader.GetOrdinal("full_name")) ? null : reader.GetString(reader.GetOrdinal("full_name")),
                    address = reader.IsDBNull(reader.GetOrdinal("address")) ? null : reader.GetString(reader.GetOrdinal("address")),
                    director = reader.IsDBNull(reader.GetOrdinal("director")) ? null : reader.GetString(reader.GetOrdinal("director")),
                    organization_type_id = reader.IsDBNull(reader.GetOrdinal("organization_type_id")) ? null : reader.GetInt32(reader.GetOrdinal("organization_type_id")),
                    organization_type_name = reader.IsDBNull(reader.GetOrdinal("organization_type_name")) ? null : reader.GetString(reader.GetOrdinal("organization_type_name")),
                    individual_name = reader.IsDBNull(reader.GetOrdinal("individual_name")) ? null : reader.GetString(reader.GetOrdinal("individual_name")),
                    individual_secondname = reader.IsDBNull(reader.GetOrdinal("individual_secondname")) ? null : reader.GetString(reader.GetOrdinal("individual_secondname")),
                    individual_surname = reader.IsDBNull(reader.GetOrdinal("individual_surname")) ? null : reader.GetString(reader.GetOrdinal("individual_surname")),
                    is_foreign = reader.IsDBNull(reader.GetOrdinal("is_foreign")) ? null : reader.GetBoolean(reader.GetOrdinal("is_foreign")),
                    foreign_country = reader.IsDBNull(reader.GetOrdinal("foreign_country")) ? null : reader.GetInt32(reader.GetOrdinal("foreign_country"))
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        private async Task<List<CustomerRepresentative>> GetCustomerRepresentativesFromDatabase(int customerId)
        {
            return DatabaseHelper.RunQueryList<CustomerRepresentative>(_schemaName, @"
                SELECT id, customer_id, first_name, second_name, last_name, pin, contact
                FROM customer_representative 
                WHERE customer_id = @customerId",
                reader => new CustomerRepresentative
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    customer_id = reader.GetInt32(reader.GetOrdinal("customer_id")),
                    first_name = reader.IsDBNull(reader.GetOrdinal("first_name")) ? null : reader.GetString(reader.GetOrdinal("first_name")),
                    second_name = reader.IsDBNull(reader.GetOrdinal("second_name")) ? null : reader.GetString(reader.GetOrdinal("second_name")),
                    last_name = reader.IsDBNull(reader.GetOrdinal("last_name")) ? null : reader.GetString(reader.GetOrdinal("last_name")),
                    pin = reader.IsDBNull(reader.GetOrdinal("pin")) ? null : reader.GetString(reader.GetOrdinal("pin")),
                    contact = reader.IsDBNull(reader.GetOrdinal("contact")) ? null : reader.GetString(reader.GetOrdinal("contact"))
                },
                new Dictionary<string, object> { ["@customerId"] = customerId }
            );
        }

        private async Task<List<customer_contact>> GetCustomerContactsFromDatabase(int customerId)
        {
            return DatabaseHelper.RunQueryList<customer_contact>(_schemaName, @"
                SELECT cc.*, ct.code as type_code
                FROM customer_contact cc
                JOIN contact_type ct ON cc.type_id = ct.id
                WHERE cc.customer_id = @customerId",
                reader => new customer_contact
                {
                    id = reader.GetInt32(reader.GetOrdinal("id")),
                    customer_id = reader.GetInt32(reader.GetOrdinal("customer_id")),
                    type_id = reader.GetInt32(reader.GetOrdinal("type_id")),
                    type_code = reader.GetString(reader.GetOrdinal("type_code")),
                    value = reader.GetString(reader.GetOrdinal("value")),
                    allow_notification = reader.GetBoolean(reader.GetOrdinal("allow_notification"))
                },
                new Dictionary<string, object> { ["@customerId"] = customerId }
            );
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }

    // Simplified entity classes for mapping
    public class customer_contact
    {
        public int id { get; set; }
        public int customer_id { get; set; }
        public int type_id { get; set; }
        public string type_code { get; set; }
        public string value { get; set; }
        public bool allow_notification { get; set; }
        public string additional { get; set; }
    }
}