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
    public class ApplicationPaidInvoiceTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationPaidInvoiceTests()
        {
            // Create a schema for this test
            _schemaName = DatabaseHelper.CreateTestSchema();

            // Create a client with the schema configured
            var factory = new TestWebApplicationFactory<Program>(_schemaName);
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetOneByIDApplication_ReturnsOkResponse()
        {
            // Arrange - Create test application and paid invoices
            var applicationId = CreateTestApplication();
            CreateApplicationPaidInvoice(applicationId, DateTime.Now, "Payment123", 100m, "Bank123");
            CreateApplicationPaidInvoice(applicationId, DateTime.Now.AddDays(-1), "Payment456", 200m, "Bank456");

            // Act
            var response = await _client.GetAsync($"/ApplicationPaidInvoice/GetOneByIDApplication?idApplication={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ApplicationPaidInvoice>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, invoice => Assert.Equal(applicationId, invoice.application_id));
        }

        [Fact]
        public async Task GetApplicationWithTaxAndDateRange_ReturnsOkResponse()
        {
            // Arrange - Create test applications and paid invoices with different dates
            var applicationId1 = CreateTestApplication();
            var applicationId2 = CreateTestApplication();

            var startDate = DateTime.Now.AddDays(-10);
            var endDate = DateTime.Now.AddDays(1);

            // Create invoices within the date range
            CreateApplicationPaidInvoice(applicationId1, startDate.AddDays(1), "Payment123", 100m, "Bank123");
            CreateApplicationPaidInvoice(applicationId2, startDate.AddDays(5), "Payment456", 200m, "Bank456");

            // Create an invoice outside the date range (should not be returned)
            CreateApplicationPaidInvoice(applicationId1, startDate.AddDays(-5), "Payment789", 300m, "Bank789");

            // Act
            var response = await _client.GetAsync($"/ApplicationPaidInvoice/GetApplicationWithTaxAndDateRange?startDate={startDate:yyyy-MM-dd}&endDate={endDate:yyyy-MM-dd}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ApplicationPaidInvoice>>(content);

            Assert.NotNull(result);

            // Should only include invoices within the date range
            Assert.Equal(2, result.Count);

            // Verify all returned invoices are within the date range
            Assert.All(result, invoice =>
                Assert.True(invoice.date >= startDate && invoice.date <= endDate));
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();

            var request = new Createapplication_paid_invoiceRequest
            {
                date = DateTime.Now,
                payment_identifier = "NewPayment123",
                sum = 150.75m,
                application_id = applicationId,
                bank_identifier = "NewBank123"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ApplicationPaidInvoice", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationPaidInvoice>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(request.payment_identifier, result.payment_identifier);
            Assert.Equal(request.sum, result.sum);
            Assert.Equal(request.application_id, result.application_id);
            Assert.Equal(request.bank_identifier, result.bank_identifier);

            // Verify in database
            var invoice = DatabaseHelper.RunQueryList<ApplicationPaidInvoice>(_schemaName, @"
                SELECT id, payment_identifier, sum, application_id, bank_identifier 
                FROM application_paid_invoice WHERE id = @id",
                reader => new ApplicationPaidInvoice
                {
                    id = reader.GetInt32(0),
                    payment_identifier = reader.GetString(1),
                    sum = Convert.ToDecimal(reader.GetDouble(2)),
                    application_id = reader.GetInt32(3),
                    bank_identifier = reader.GetString(4)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(invoice);
            Assert.Equal(request.payment_identifier, invoice.payment_identifier);
            Assert.Equal(request.sum, invoice.sum);
            Assert.Equal(request.application_id, invoice.application_id);

            // Verify application total_payed is updated
            // Use string for safe reading, then convert to decimal
            var totalPaidStr = DatabaseHelper.RunQuery<string>(_schemaName, @"
                SELECT CAST(total_payed AS VARCHAR) FROM application WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = applicationId });

            decimal? totalPaid = !string.IsNullOrEmpty(totalPaidStr) ?
                decimal.Parse(totalPaidStr, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture) :
                (decimal?)null;

            Assert.NotNull(totalPaid);
            Assert.Equal(request.sum, totalPaid);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var paidInvoiceId = CreateApplicationPaidInvoice(applicationId, DateTime.Now, "OriginalPayment", 100m, "OriginalBank");

            var request = new Updateapplication_paid_invoiceRequest
            {
                id = paidInvoiceId,
                date = DateTime.Now.AddDays(1),
                payment_identifier = "UpdatedPayment",
                sum = 200m,
                application_id = applicationId,
                bank_identifier = "UpdatedBank"
            };

            // Act
            var response = await _client.PutAsync($"/ApplicationPaidInvoice/{paidInvoiceId}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationPaidInvoice>(content);

            Assert.NotNull(result);
            Assert.Equal(paidInvoiceId, result.id);
            Assert.Equal(request.payment_identifier, result.payment_identifier);
            Assert.Equal(request.sum, result.sum);
            Assert.Equal(request.bank_identifier, result.bank_identifier);

            // Verify in database
            var invoice = DatabaseHelper.RunQueryList<ApplicationPaidInvoice>(_schemaName, @"
                SELECT payment_identifier, sum, bank_identifier 
                FROM application_paid_invoice WHERE id = @id",
                reader => new ApplicationPaidInvoice
                {
                    payment_identifier = reader.GetString(0),
                    sum = Convert.ToDecimal(reader.GetDouble(1)),
                    bank_identifier = reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = paidInvoiceId }
            ).FirstOrDefault();

            Assert.NotNull(invoice);
            Assert.Equal("UpdatedPayment", invoice.payment_identifier);
            Assert.Equal(200m, invoice.sum);
            Assert.Equal("UpdatedBank", invoice.bank_identifier);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var paidInvoiceId = CreateApplicationPaidInvoice(applicationId, DateTime.Now, "DeletePayment", 100m, "DeleteBank");

            // Act
            var response = await _client.DeleteAsync($"/ApplicationPaidInvoice/{paidInvoiceId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(paidInvoiceId, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_paid_invoice WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = paidInvoiceId });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var paidInvoiceId = CreateApplicationPaidInvoice(applicationId, DateTime.Now, "GetOnePayment", 100m, "GetOneBank");

            // Act
            var response = await _client.GetAsync($"/ApplicationPaidInvoice/{paidInvoiceId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ApplicationPaidInvoice>(content);

            Assert.NotNull(result);
            Assert.Equal(paidInvoiceId, result.id);
            Assert.Equal("GetOnePayment", result.payment_identifier);
            Assert.Equal(100m, result.sum);
            Assert.Equal("GetOneBank", result.bank_identifier);
            Assert.Equal(applicationId, result.application_id);
        }

        [Fact]
        public async Task MultipleInvoicesSummedCorrectly()
        {
            // Arrange - Create application and multiple invoices to test total_payed calculation
            var applicationId = CreateTestApplication();
            CreateApplicationPaidInvoice(applicationId, DateTime.Now, "Payment1", 100.50m, "Bank1");
            CreateApplicationPaidInvoice(applicationId, DateTime.Now, "Payment2", 200.75m, "Bank2");

            // Add another invoice via API to trigger the calculation
            var request = new Createapplication_paid_invoiceRequest
            {
                date = DateTime.Now,
                payment_identifier = "Payment3",
                sum = 50.25m,
                application_id = applicationId,
                bank_identifier = "Bank3"
            };

            await _client.PostAsJsonAsync("/ApplicationPaidInvoice", request);

            // Act - Get the application to check its total_payed value
            // Use string for safe reading, then convert to decimal
            var totalPaidStr = DatabaseHelper.RunQuery<string>(_schemaName, @"
                SELECT CAST(total_payed AS VARCHAR) FROM application WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = applicationId });

            decimal? totalPaid = !string.IsNullOrEmpty(totalPaidStr) ?
                decimal.Parse(totalPaidStr, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture) :
                (decimal?)null;

            // Assert - The total should be the sum of all three payments
            Assert.NotNull(totalPaid);
            Assert.Equal(100.50m + 200.75m + 50.25m, totalPaid);
        }

        // Helper methods to set up test data
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

        private int CreateApplicationPaidInvoice(int applicationId, DateTime date, string paymentIdentifier, decimal sum, string bankIdentifier)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_paid_invoice (application_id, date, payment_identifier, sum, bank_identifier, created_at, updated_at) 
                VALUES (@application_id, @date, @payment_identifier, @sum, @bank_identifier, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@date"] = date,
                    ["@payment_identifier"] = paymentIdentifier,
                    ["@sum"] = Convert.ToDouble(sum), // Convert to double since the DB column is double precision
                    ["@bank_identifier"] = bankIdentifier,
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