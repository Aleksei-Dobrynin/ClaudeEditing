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
    public class organization_typeControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public organization_typeControllerTests()
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
            // Arrange - Create test organization_types
            CreateOrganizationType("Organization Type 1", "Test Description 1", "org_type_1");
            CreateOrganizationType("Organization Type 2", "Test Description 2", "org_type_2");

            // Act
            var response = await _client.GetAsync("/organization_type/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<organization_type>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, org => org.name == "Organization Type 1" && org.code == "org_type_1");
            Assert.Contains(result, org => org.name == "Organization Type 2" && org.code == "org_type_2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test organization_type
            int id = CreateOrganizationType("Single Org Type", "Single Description", "single_org_code");

            // Act
            var response = await _client.GetAsync($"/organization_type/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<organization_type>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Org Type", result.name);
            Assert.Equal("Single Description", result.description);
            Assert.Equal("single_org_code", result.code);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new Createorganization_typeRequest
            {
                name = "Created Org Type",
                description = "Created Description",
                code = "created_org_code"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/organization_type", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<organization_type>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Org Type", result.name);
            Assert.Equal("Created Description", result.description);
            Assert.Equal("created_org_code", result.code);

            // Verify in database
            var dbOrgType = DatabaseHelper.RunQueryList<organization_type>(_schemaName, @"
                SELECT id, name, description, code FROM organization_type WHERE id = @id",
                reader => new organization_type
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    description = reader.GetString(2),
                    code = reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(dbOrgType);
            Assert.Equal("Created Org Type", dbOrgType.name);
            Assert.Equal("Created Description", dbOrgType.description);
            Assert.Equal("created_org_code", dbOrgType.code);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test organization_type
            int id = CreateOrganizationType("Original Org Type", "Original Description", "original_org_code");

            var request = new Updateorganization_typeRequest
            {
                id = id,
                name = "Updated Org Type",
                description = "Updated Description",
                code = "updated_org_code"
            };

            // Act
            var response = await _client.PutAsync($"/organization_type/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<organization_type>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Org Type", result.name);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("updated_org_code", result.code);

            // Verify in database
            var dbOrgType = DatabaseHelper.RunQueryList<organization_type>(_schemaName, @"
                SELECT id, name, description, code FROM organization_type WHERE id = @id",
                reader => new organization_type
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    description = reader.GetString(2),
                    code = reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(dbOrgType);
            Assert.Equal("Updated Org Type", dbOrgType.name);
            Assert.Equal("Updated Description", dbOrgType.description);
            Assert.Equal("updated_org_code", dbOrgType.code);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test organization_type
            int id = CreateOrganizationType("Delete Org Type", "Delete Description", "delete_org_code");

            // Act
            var response = await _client.DeleteAsync($"/organization_type/{id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM organization_type WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test organization_types
            for (int i = 1; i <= 5; i++)
            {
                CreateOrganizationType($"Paginated Org Type {i}", $"Paginated Description {i}", $"paginated_org_code_{i}");
            }

            // Act
            var response = await _client.GetAsync("/organization_type/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<organization_type>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        // Helper method to create organization_type
        private int CreateOrganizationType(string name, string description, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO organization_type (name, description, code, created_at, updated_at) 
                VALUES (@name, @description, @code, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@description"] = description,
                    ["@code"] = code,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        [Fact]
        public async Task CustomerWithOrganizationType_ReferencesExistingType()
        {
            // Arrange - Create test organization_type and customer
            int orgTypeId = CreateOrganizationType("Company", "Business organization", "company");
            int customerId = CreateCustomerWithOrgType(orgTypeId);

            // Act - Get the customer
            var customer = GetCustomer(customerId);

            // Assert - Verify organization_type reference integrity
            Assert.Equal(orgTypeId, customer.organization_type_id);
            Assert.Equal("123 Test St", customer.address);
            Assert.Equal("Test Director", customer.director);

            // Verify we can fetch the related organization_type
            var orgType = DatabaseHelper.RunQueryList<organization_type>(_schemaName, @"
                SELECT id, name, code FROM organization_type WHERE id = @id",
                reader => new organization_type
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = orgTypeId }
            ).FirstOrDefault();

            Assert.NotNull(orgType);
            Assert.Equal("Company", orgType.name);
            Assert.Equal(customer.organization_type_name, orgType.name);
        }

        // Helper method to create a customer with organization_type
        private int CreateCustomerWithOrgType(int organizationTypeId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer (full_name, pin, is_organization, address, director, okpo, organization_type_id, 
                                      is_foreign, individual_name, individual_secondname, individual_surname, created_at, updated_at) 
                VALUES (@fullName, @pin, @isOrganization, @address, @director, @okpo, @organizationTypeId, 
                        @isForeign, @individualName, @individualSecondname, @individualSurname, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@fullName"] = "Test Company",
                    ["@pin"] = "123456789",
                    ["@isOrganization"] = true,
                    ["@address"] = "123 Test St",
                    ["@director"] = "Test Director",
                    ["@okpo"] = "987654321",
                    ["@organizationTypeId"] = organizationTypeId,
                    ["@isForeign"] = false,
                    ["@individualName"] = DBNull.Value,
                    ["@individualSecondname"] = DBNull.Value,
                    ["@individualSurname"] = DBNull.Value,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private Customer GetCustomer(int id)
        {
            // First, get the main customer data
            var customer = DatabaseHelper.RunQueryList<Customer>(_schemaName, @"
                SELECT c.id, c.full_name, c.pin, c.is_organization, c.organization_type_id, 
                       c.address, c.director, c.is_foreign, c.foreign_country, 
                       c.individual_name, c.individual_secondname, c.individual_surname,
                       ot.name as organization_type_name
                FROM customer c
                LEFT JOIN organization_type ot ON c.organization_type_id = ot.id
                WHERE c.id = @id",
                reader => new Customer
                {
                    id = reader.GetInt32(0),
                    full_name = reader.GetString(1),
                    pin = reader.GetString(2),
                    is_organization = reader.GetBoolean(3),
                    organization_type_id = reader.IsDBNull(4) ? (int?)null : reader.GetInt32(4),
                    address = reader.IsDBNull(5) ? null : reader.GetString(5),
                    director = reader.IsDBNull(6) ? null : reader.GetString(6),
                    is_foreign = reader.IsDBNull(7) ? (bool?)null : reader.GetBoolean(7),
                    foreign_country = reader.IsDBNull(8) ? (int?)null : reader.GetInt32(8),
                    individual_name = reader.IsDBNull(9) ? null : reader.GetString(9),
                    individual_secondname = reader.IsDBNull(10) ? null : reader.GetString(10),
                    individual_surname = reader.IsDBNull(11) ? null : reader.GetString(11),
                    organization_type_name = reader.IsDBNull(12) ? null : reader.GetString(12)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            if (customer != null)
            {
                // Get customer contacts
                var contacts = DatabaseHelper.RunQueryList<KeyValuePair<string, string>>(_schemaName, @"
                    SELECT ct.code, cc.value
                    FROM customer_contact cc
                    JOIN contact_type ct ON cc.type_id = ct.id
                    WHERE cc.customer_id = @id",
                    reader => new KeyValuePair<string, string>(
                        reader.GetString(0),
                        reader.IsDBNull(1) ? null : reader.GetString(1)
                    ),
                    new Dictionary<string, object> { ["@id"] = id }
                );

                customer.contacts = contacts.ToDictionary(kv => kv.Key, kv => kv.Value);

                // Set SMS contacts if they exist
                if (customer.contacts.TryGetValue("sms", out var sms1))
                {
                    customer.sms_1 = sms1;
                }

                // Get customer representatives
                customer.customerRepresentatives = GetCustomerRepresentatives(id);
            }

            return customer;
        }

        private List<CustomerRepresentative> GetCustomerRepresentatives(int customerId)
        {
            return DatabaseHelper.RunQueryList<CustomerRepresentative>(_schemaName, @"
                SELECT id, customer_id, first_name, last_name, second_name, pin, contact,
                       date_start, date_end, notary_number, requisites, is_included_to_agreement, date_document
                FROM customer_representative
                WHERE customer_id = @customerId",
                reader => new CustomerRepresentative
                {
                    id = reader.GetInt32(0),
                    customer_id = reader.GetInt32(1),
                    first_name = reader.IsDBNull(2) ? null : reader.GetString(2),
                    last_name = reader.IsDBNull(3) ? null : reader.GetString(3),
                    second_name = reader.IsDBNull(4) ? null : reader.GetString(4),
                    pin = reader.IsDBNull(5) ? null : reader.GetString(5),
                    contact = reader.IsDBNull(6) ? null : reader.GetString(6),
                    date_start = reader.IsDBNull(7) ? (DateTime?)null : reader.GetDateTime(7),
                    date_end = reader.IsDBNull(8) ? (DateTime?)null : reader.GetDateTime(8),
                    notary_number = reader.IsDBNull(9) ? null : reader.GetString(9),
                    requisites = reader.IsDBNull(10) ? null : reader.GetString(10),
                    is_included_to_agreement = reader.IsDBNull(11) ? (bool?)null : reader.GetBoolean(11),
                    date_document = reader.IsDBNull(12) ? (DateTime?)null : reader.GetDateTime(12)
                },
                new Dictionary<string, object> { ["@customerId"] = customerId }
            ).ToList();
        }
        

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }

    // Helper class representing Customer for testing
    public class Customer
{
    public int id { get; set; }
    public string full_name { get; set; }
    public string pin { get; set; }
    public bool is_organization { get; set; }
    public int? organization_type_id { get; set; }
    public string address { get; set; }
    public string director { get; set; }
    public List<CustomerRepresentative> customerRepresentatives { get; set; } = new List<CustomerRepresentative>();
    public string organization_type_name { get; set; }
    public bool? is_foreign { get; set; }
    public int? foreign_country { get; set; }
    public string individual_name { get; set; }
    public string individual_secondname { get; set; }
    public string individual_surname { get; set; }
    public string sms_1 { get; set; }
    public string sms_2 { get; set; }
    public Dictionary<string, string> contacts { get; set; } = new Dictionary<string, string>();
}

// Helper class for customer representatives
public class CustomerRepresentative
{
    public int id { get; set; }
    public int customer_id { get; set; }
    public string first_name { get; set; }
    public string last_name { get; set; }
    public string second_name { get; set; }
    public string pin { get; set; }
    public string contact { get; set; }
    public DateTime? date_start { get; set; }
    public DateTime? date_end { get; set; }
    public string notary_number { get; set; }
    public string requisites { get; set; }
    public bool? is_included_to_agreement { get; set; }
    public DateTime? date_document { get; set; }
}
}