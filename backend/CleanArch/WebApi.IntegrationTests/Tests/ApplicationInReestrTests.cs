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
    public class ApplicationInReestrTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationInReestrTests()
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
            // Arrange - Create test application_in_reestr entries
            var reestrId = CreateTestReestr();
            var applicationId1 = CreateTestApplication();
            var applicationId2 = CreateTestApplication();

            CreateApplicationInReestr(reestrId, applicationId1);
            CreateApplicationInReestr(reestrId, applicationId2);

            // Act
            var response = await _client.GetAsync("/application_in_reestr/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_in_reestr>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test application_in_reestr entries
            var reestrId = CreateTestReestr();

            for (int i = 0; i < 5; i++)
            {
                var applicationId = CreateTestApplication();
                CreateApplicationInReestr(reestrId, applicationId);
            }

            // Act
            var response = await _client.GetAsync("/application_in_reestr/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<application_in_reestr>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var reestrId = CreateTestReestr();
            var applicationId = CreateTestApplication();

            var request = new Createapplication_in_reestrRequest
            {
                reestr_id = reestrId,
                application_id = applicationId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/application_in_reestr", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_in_reestr>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(reestrId, result.reestr_id);
            Assert.Equal(applicationId, result.application_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var reestrId = CreateTestReestr();
            var newReestrId = CreateTestReestr();
            var applicationId = CreateTestApplication();

            var id = CreateApplicationInReestr(reestrId, applicationId);

            var request = new Updateapplication_in_reestrRequest
            {
                id = id,
                reestr_id = newReestrId,
                application_id = applicationId
            };

            // Act
            var response = await _client.PutAsync($"/application_in_reestr/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_in_reestr>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newReestrId, result.reestr_id);
            Assert.Equal(applicationId, result.application_id);

            // Verify in database
            var updated = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT reestr_id FROM application_in_reestr WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(newReestrId, updated);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var reestrId = CreateTestReestr();
            var applicationId = CreateTestApplication();

            var id = CreateApplicationInReestr(reestrId, applicationId);

            // Act
            var response = await _client.DeleteAsync($"/application_in_reestr/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            int deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_in_reestr WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task DeleteByAppId_ReturnsOkResponse()
        {
            // Arrange
            var reestrId1 = CreateTestReestr();
            var reestrId2 = CreateTestReestr();
            var applicationId = CreateTestApplication();
            var otherApplicationId = CreateTestApplication();

            // Create multiple entries with the same application_id
            CreateApplicationInReestr(reestrId1, applicationId);
            CreateApplicationInReestr(reestrId2, applicationId);
            // Create another entry with different application_id
            CreateApplicationInReestr(reestrId1, otherApplicationId);

            // Act
            var response = await _client.DeleteAsync($"/application_in_reestr/DeleteByAppId/{applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedCount = int.Parse(content);

            Assert.Equal(2, deletedCount); // Should have deleted 2 entries

            // Verify in database
            var remainingCount = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_in_reestr WHERE application_id = @application_id",
                new Dictionary<string, object> { ["@application_id"] = applicationId });

            Assert.Equal(0, remainingCount);

            // Other application entry should still exist
            var otherCount = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_in_reestr WHERE application_id = @application_id",
                new Dictionary<string, object> { ["@application_id"] = otherApplicationId });

            Assert.Equal(1, otherCount);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange
            var reestrId = CreateTestReestr();
            var applicationId = CreateTestApplication();

            var id = CreateApplicationInReestr(reestrId, applicationId);

            // Act
            var response = await _client.GetAsync($"/application_in_reestr/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_in_reestr>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(reestrId, result.reestr_id);
            Assert.Equal(applicationId, result.application_id);
        }

        [Fact]
        public async Task GetByreestr_id_ReturnsOkResponse()
        {
            // Arrange
            var reestrId = CreateTestReestr();
            var otherReestrId = CreateTestReestr();

            var applicationId1 = CreateTestApplication();
            var applicationId2 = CreateTestApplication();
            var applicationId3 = CreateTestApplication();

            CreateApplicationInReestr(reestrId, applicationId1);
            CreateApplicationInReestr(reestrId, applicationId2);
            CreateApplicationInReestr(otherReestrId, applicationId3);

            // Act
            var response = await _client.GetAsync($"/application_in_reestr/GetByreestr_id?reestr_id={reestrId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_in_reestr>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(reestrId, item.reestr_id));
        }

        [Fact]
        public async Task GetOtchetData_ReturnsOkResponse()
        {
            // Arrange
            var reestrId = CreateTestReestr();
            var applicationId = CreateTestApplication();

            CreateApplicationInReestr(reestrId, applicationId);

            // Set up customer and arch_object for application
            SetupCustomerAndObjectForApplication(applicationId);

            // Act
            var response = await _client.GetAsync($"/application_in_reestr/GetOtchetData?reestr_id={reestrId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ReestrOtchetData>(content);

            Assert.NotNull(result);
            Assert.NotNull(result.reestr);
            Assert.Equal(reestrId, result.reestr.id);
        }

        [Fact]
        public async Task GetSvodnaya_ReturnsOkResponse()
        {
            // Arrange
            var year = 2024;
            var month = 4;
            var reestrId = CreateTestReestr(year, month);
            var applicationId = CreateTestApplication();

            CreateApplicationInReestr(reestrId, applicationId);

            // Set up customer and arch_object for application
            SetupCustomerAndObjectForApplication(applicationId);

            // Act
            var response = await _client.GetAsync($"/application_in_reestr/GetSvodnaya?year={year}&month={month}&status=accepted");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ReestrOtchetData>(content);

            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetTaxReport_ReturnsOkResponse()
        {
            // Arrange
            var year = 2024;
            var month = 4;
            var reestrId = CreateTestReestr(year, month);
            var applicationId = CreateTestApplication();

            CreateApplicationInReestr(reestrId, applicationId);

            // Setup application payment for tax calculations
            SetupApplicationPayment(applicationId);

            // Act
            var response = await _client.GetAsync($"/application_in_reestr/GetTaxReport?year={year}&month={month}&status=accepted");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<TaxOtchetData>>(content);

            Assert.NotNull(result);
            // Should contain at least nds and nsp reports
            Assert.True(result.Count >= 2);
        }

        // Helper methods to set up test data

        private int CreateTestReestr(int year = 2024, int month = 4)
        {
            // Create reestr_status first
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                CREATE TABLE IF NOT EXISTS reestr_status (
                    id SERIAL PRIMARY KEY,
                    name TEXT,
                    description TEXT,
                    code TEXT,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP,
                    created_by INTEGER,
                    updated_by INTEGER
                );
                
                INSERT INTO reestr_status (name, code) 
                VALUES ('Active', 'active')
                ON CONFLICT DO NOTHING;
            ");

            var statusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT id FROM reestr_status WHERE code = 'active';");

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO reestr (name, year, month, status_id, created_at) 
                VALUES (@name, @year, @month, @status_id, @created_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = $"Test Reestr {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@year"] = year,
                    ["@month"] = month,
                    ["@status_id"] = statusId,
                    ["@created_at"] = DateTime.Now
                });
        }

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

        private int CreateApplicationInReestr(int reestrId, int applicationId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_in_reestr (reestr_id, application_id, created_at) 
                VALUES (@reestr_id, @application_id, @created_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@reestr_id"] = reestrId,
                    ["@application_id"] = applicationId,
                    ["@created_at"] = DateTime.Now
                });
        }

        private void SetupCustomerAndObjectForApplication(int applicationId)
        {
            // Create customer
            var customerId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO customer (pin, full_name, is_organization) 
                VALUES ('123456789', 'Test Customer', false) 
                RETURNING id;");

            // Create district
            var districtId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT id FROM district ORDER BY id LIMIT 1;");

            // Create arch_object
            var archObjectId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO arch_object (name, address, district_id) 
                VALUES ('Test Object', 'Test Address', @district_id) 
                RETURNING id;",
                new Dictionary<string, object> { ["@district_id"] = districtId });

            // Update application with customer and arch_object
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                UPDATE application SET 
                    customer_id = @customer_id, 
                    arch_object_id = @arch_object_id,
                    customer_fullname = 'Test Customer',
                    customer_pin = '123456789',
                    customer_is_organisation = false,
                    old_sum = 1000
                WHERE id = @id",
                new Dictionary<string, object>
                {
                    ["@id"] = applicationId,
                    ["@customer_id"] = customerId,
                    ["@arch_object_id"] = archObjectId
                });
        }

        private void SetupApplicationPayment(int applicationId)
        {
            // Create a structure
            var structureId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, is_active) 
                VALUES ('Test Structure', true) 
                RETURNING id;");

            // Create application payment
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_payment (
                    application_id, 
                    structure_id, 
                    description, 
                    sum, 
                    created_at,
                    sum_wo_discount,
                    nds,
                    nsp
                ) 
                VALUES (
                    @application_id, 
                    @structure_id, 
                    'Test Payment', 
                    1000.00, 
                    @created_at,
                    1000.00,
                    12.00,
                    2.00
                )",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@structure_id"] = structureId,
                    ["@created_at"] = DateTime.Now
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }

    // DTO classes needed for testing
    public class Createapplication_in_reestrRequest
    {
        public int reestr_id { get; set; }
        public int application_id { get; set; }
    }

    public class Updateapplication_in_reestrRequest
    {
        public int id { get; set; }
        public int reestr_id { get; set; }
        public int application_id { get; set; }
    }
}