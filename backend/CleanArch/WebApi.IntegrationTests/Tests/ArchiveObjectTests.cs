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
using WebApi.Controllers;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ArchiveObjectTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ArchiveObjectTests()
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
            // Arrange - Create test archive objects
            CreateArchiveObject("DOC-001", "Test Address 1", "Test Customer 1");
            CreateArchiveObject("DOC-002", "Test Address 2", "Test Customer 2");

            // Act
            var response = await _client.GetAsync("/ArchiveObject/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ArchiveObject>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, ao => ao.doc_number == "DOC-001" && ao.address == "Test Address 1");
            Assert.Contains(result, ao => ao.doc_number == "DOC-002" && ao.address == "Test Address 2");
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test archive object
            var id = CreateArchiveObject("DOC-123", "Test Address", "Test Customer");

            // Act
            var response = await _client.GetAsync($"/ArchiveObject/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveObject>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("DOC-123", result.doc_number);
            Assert.Equal("Test Address", result.address);
            Assert.Equal("Test Customer", result.customer);
        }

        [Fact]
        public async Task SearchByNumber_ReturnsOkResponse()
        {
            // Arrange - Create test archive objects
            CreateArchiveObject("ABC-123", "Test Address 1", "Test Customer 1");
            CreateArchiveObject("ABC-456", "Test Address 2", "Test Customer 2");
            CreateArchiveObject("XYZ-789", "Test Address 3", "Test Customer 3");

            // Act
            var response = await _client.GetAsync("/ArchiveObject/SearchByNumber?number=ABC");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ArchiveObject>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, ao => ao.doc_number == "ABC-123");
            Assert.Contains(result, ao => ao.doc_number == "ABC-456");
            Assert.DoesNotContain(result, ao => ao.doc_number == "XYZ-789");
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test archive objects
            for (int i = 1; i <= 5; i++)
            {
                CreateArchiveObject($"DOC-{i}", $"Address {i}", $"Customer {i}");
            }

            var filter = new ArchiveObjectFilter
            {
                pageSize = 2,
                pageNumber = 1
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ArchiveObject/GetPaginated", filter);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<ArchiveObject>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.items.Count);

        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            // Create status for dutyplan object first
            var statusId = CreateStatus("Archive", "archive");

            var createRequest = new CreateArchiveObjectRequest
            {
                doc_number = "NEW-DOC-001",
                address = "New Test Address",
                customer = "New Test Customer",
                latitude = 42.87,
                longitude = 74.59,
                layer = "{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[74.59,42.87]}}",
                description = "Test description",
                date_setplan = DateTime.Now,
                quantity_folder = 3,
                status_dutyplan_object_id = statusId,
                customers_for_archive_object = new List<WebApi.Dtos.Updatecustomers_for_archive_objectRequest>
                {
                    new WebApi.Dtos.Updatecustomers_for_archive_objectRequest
                    {
                        id = 0,
                        full_name = "Test Customer Name",
                        pin = "12345678",
                        address = "Customer Address",
                        is_organization = true,
                        description = "Customer description"
                    }
                }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ArchiveObject/Create", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveObject>(content);

            Assert.NotNull(result);
            Assert.Equal("NEW-DOC-001", result.doc_number);
            Assert.Equal("New Test Address", result.address);
            Assert.Equal("New Test Customer", result.customer);
            Assert.Equal(42.87, result.latitude);
            Assert.Equal(74.59, result.longitude);
            Assert.Equal("Test description", result.description);
            Assert.Equal(3, result.quantity_folder);

            // Verify in database
            var archiveObject = GetArchiveObjectById(result.id);
            Assert.NotNull(archiveObject);
            Assert.Equal("NEW-DOC-001", archiveObject.doc_number);
            Assert.Equal(statusId, archiveObject.status_dutyplan_object_id);

            // Verify customer association
            var customers = GetCustomersForArchiveObject(result.id);
            Assert.NotEmpty(customers);
            Assert.Contains(customers, c => c.full_name == "Test Customer Name" && c.pin == "12345678");
        }

        [Fact]
        public async Task CreateWithFolder_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateStatus("Archive", "archive");

            var createRequest = new CreateArchiveObjectRequest
            {
                doc_number = "FOLDER-DOC-001",
                address = "Folder Test Address",
                customer = "Folder Test Customer",
                latitude = 42.87,
                longitude = 74.59,
                layer = "{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[74.59,42.87]}}",
                description = "Folder test description",
                date_setplan = DateTime.Now,
                quantity_folder = 1,
                status_dutyplan_object_id = statusId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ArchiveObject/CreateWithFolder", createRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            int folderId = JsonConvert.DeserializeObject<int>(content);

            Assert.True(folderId > 0);

            // Verify folder was created
            var folder = GetArchiveFolderById(folderId);
            Assert.NotNull(folder);
            Assert.Equal("FOLDER-DOC-001", folder.archive_folder_name);

            // Verify archive object was created and linked to folder
            Assert.NotNull(folder.dutyplan_object_id);
            var archiveObject = GetArchiveObjectById(folder.dutyplan_object_id.Value);
            Assert.NotNull(archiveObject);
            Assert.Equal("FOLDER-DOC-001", archiveObject.doc_number);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var statusId = CreateStatus("Archive", "archive");
            var id = CreateArchiveObject("UPDATE-DOC-001", "Original Address", "Original Customer", statusId);

            // Create a customer for this archive object
            var customerId = CreateCustomerForArchiveObject("Original Customer Name", "11111111", false);
            LinkCustomerToArchiveObject(id, customerId);

            var updateRequest = new UpdateArchiveObjectRequest
            {
                id = id,
                doc_number = "UPDATE-DOC-001-MODIFIED",
                address = "Updated Address",
                customer = "Updated Customer",
                latitude = 42.90,
                longitude = 74.60,
                layer = "{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[74.60,42.90]}}",
                description = "Updated description",
                date_setplan = DateTime.Now.AddDays(1),
                quantity_folder = 5,
                status_dutyplan_object_id = statusId,
                customers_for_archive_object = new List<WebApi.Dtos.Updatecustomers_for_archive_objectRequest>
                {
                    new WebApi.Dtos.Updatecustomers_for_archive_objectRequest
                    {
                        id = customerId, // Update existing customer
                        full_name = "Updated Customer Name",
                        pin = "22222222",
                        address = "Updated Customer Address",
                        is_organization = true,
                        description = "Updated customer description"
                    },
                    new WebApi.Dtos.Updatecustomers_for_archive_objectRequest
                    {
                        id = 0, // Add new customer
                        full_name = "New Additional Customer",
                        pin = "33333333",
                        address = "New Customer Address",
                        is_organization = false,
                        description = "New customer description"
                    }
                }
            };

            // Act
            var response = await _client.PutAsync("/ArchiveObject/Update", JsonContent.Create(updateRequest));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveObject>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("UPDATE-DOC-001-MODIFIED", result.doc_number);
            Assert.Equal("Updated Address", result.address);
            Assert.Equal("Updated Customer", result.customer);

            // Verify in database
            var archiveObject = GetArchiveObjectById(id);
            Assert.NotNull(archiveObject);
            Assert.Equal("UPDATE-DOC-001-MODIFIED", archiveObject.doc_number);
            Assert.Equal("Updated description", archiveObject.description);

            // Verify customers were updated
            var customers = GetCustomersForArchiveObject(id);
            Assert.Equal(2, customers.Count);
            Assert.Contains(customers, c => c.full_name == "Updated Customer Name" && c.pin == "22222222");
            Assert.Contains(customers, c => c.full_name == "New Additional Customer" && c.pin == "33333333");
        }

        [Fact]
        public async Task SetDutyNumberToDuty_ReturnsOkResponse()
        {
            // Arrange - Create two archive objects
            var statusId = CreateStatus("Archive", "archive");
            var fromDutyId = CreateArchiveObject("FROM-DOC-001", "From Address", "From Customer", statusId);
            var toDutyId = CreateArchiveObject("TO-DOC-001", "To Address", "To Customer", statusId);

            // Create architecture process and link it to fromDutyId
            var processId = CreateArchitectureProcess();
            LinkDutyObjectToProcess(fromDutyId, processId);

            // Create file for fromDutyId
            var fileId = CreateFile("test-file.txt");
            var archiveFileId = CreateArchiveObjectFile(fromDutyId, fileId, "Test File");

            var request = new ArchiveObjectController.SetDutyNumberToDutyReq
            {
                from_duty_id = fromDutyId,
                to_duty_id = toDutyId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ArchiveObject/SetDutyNumberToDuty", request);

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify the process is now linked to toDutyId
            var dutyObject = GetApplicationDutyObject(processId);
            Assert.Equal(toDutyId, dutyObject.dutyplan_object_id);

            // Verify the file is now linked to toDutyId
            var archiveFile = GetArchiveObjectFile(archiveFileId);
            Assert.Equal(toDutyId, archiveFile.archive_object_id);

            // Verify fromDutyId no longer exists
            Assert.Null(GetArchiveObjectById(fromDutyId));
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateArchiveObject("DELETE-DOC-001", "Delete Address", "Delete Customer");

            // Act
            var response = await _client.DeleteAsync($"/ArchiveObject/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify deletion
            Assert.Null(GetArchiveObjectById(id));
        }

        #region Helper Methods

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

        private int CreateArchiveObject(string docNumber, string address, string customer, int? statusId = null)
        {
            var status = statusId ?? CreateStatus("Archive", "archive");

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO dutyplan_object (doc_number, address, customer, created_at, updated_at, status_dutyplan_object_id) 
                VALUES (@doc_number, @address, @customer, @created_at, @updated_at, @status_dutyplan_object_id) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@doc_number"] = docNumber,
                    ["@address"] = address,
                    ["@customer"] = customer,
                    ["@status_dutyplan_object_id"] = status,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateArchiveObjectWithCoordinates(string docNumber, string address, double latitude, double longitude, string layer)
        {
            var status = CreateStatus("Archive", "archive");

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO dutyplan_object (doc_number, address, customer, latitude, longitude, layer, created_at, updated_at, status_dutyplan_object_id) 
                VALUES (@doc_number, @address, @customer, @latitude, @longitude, @layer::jsonb, @created_at, @updated_at, @status_dutyplan_object_id) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@doc_number"] = docNumber,
                    ["@address"] = address,
                    ["@customer"] = "Test Customer",
                    ["@latitude"] = latitude,
                    ["@longitude"] = longitude,
                    ["@layer"] = layer,
                    ["@status_dutyplan_object_id"] = status,
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

        private void LinkCustomerToArchiveObject(int archiveObjectId, int customerId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_object_customer (archive_object_id, customer_id, created_at, updated_at) 
                VALUES (@archive_object_id, @customer_id, @created_at, @updated_at);",
                new Dictionary<string, object>
                {
                    ["@archive_object_id"] = archiveObjectId,
                    ["@customer_id"] = customerId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateArchitectureProcess()
        {
            // First create a status
            var statusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO architecture_status (name, code, created_at, updated_at) 
                VALUES (@name, @code, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = "Test Status",
                    ["@code"] = "test_status",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO architecture_process (status_id, created_at, updated_at) 
                VALUES (@status_id, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@status_id"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private void LinkDutyObjectToProcess(int dutyplanObjectId, int processId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_duty_object (dutyplan_object_id, application_id, created_at, updated_at) 
                VALUES (@dutyplan_object_id, @application_id, @created_at, @updated_at);",
                new Dictionary<string, object>
                {
                    ["@dutyplan_object_id"] = dutyplanObjectId,
                    ["@application_id"] = processId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateFile(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO file (name, created_at, updated_at) 
                VALUES (@name, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateArchiveObjectFile(int archiveObjectId, int fileId, string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_object_file (archive_object_id, file_id, name, created_at, updated_at) 
                VALUES (@archive_object_id, @file_id, @name, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@archive_object_id"] = archiveObjectId,
                    ["@file_id"] = fileId,
                    ["@name"] = name,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private ArchiveObject GetArchiveObjectById(int id)
        {
            return DatabaseHelper.RunQueryList<ArchiveObject>(_schemaName, @"
                SELECT id, doc_number, address, customer, latitude, longitude, layer, description, date_setplan, status_dutyplan_object_id, quantity_folder
                FROM dutyplan_object 
                WHERE id = @id",
                reader => new ArchiveObject
                {
                    id = reader.GetInt32(0),
                    doc_number = reader.IsDBNull(1) ? null : reader.GetString(1),
                    address = reader.IsDBNull(2) ? null : reader.GetString(2),
                    customer = reader.IsDBNull(3) ? null : reader.GetString(3),
                    latitude = reader.IsDBNull(4) ? null : reader.GetDouble(4),
                    longitude = reader.IsDBNull(5) ? null : reader.GetDouble(5),
                    layer = reader.IsDBNull(6) ? null : reader.GetString(6),
                    description = reader.IsDBNull(7) ? null : reader.GetString(7),
                    date_setplan = reader.IsDBNull(8) ? null : reader.GetDateTime(8),
                    status_dutyplan_object_id = reader.IsDBNull(9) ? null : reader.GetInt32(9),
                    quantity_folder = reader.IsDBNull(10) ? null : reader.GetInt32(10)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        private archive_folder GetArchiveFolderById(int id)
        {
            return DatabaseHelper.RunQueryList<archive_folder>(_schemaName, @"
                SELECT id, archive_folder_name, dutyplan_object_id, folder_location
                FROM archive_folder 
                WHERE id = @id",
                reader => new archive_folder
                {
                    id = reader.GetInt32(0),
                    archive_folder_name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    dutyplan_object_id = reader.IsDBNull(2) ? null : reader.GetInt32(2),
                    folder_location = reader.IsDBNull(3) ? null : reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        private List<customers_for_archive_object> GetCustomersForArchiveObject(int archiveObjectId)
        {
            return DatabaseHelper.RunQueryList<customers_for_archive_object>(_schemaName, @"
                SELECT c.id, c.full_name, c.pin, c.address, c.is_organization, c.description
                FROM customers_for_archive_object c
                JOIN archive_object_customer aoc ON c.id = aoc.customer_id
                WHERE aoc.archive_object_id = @archive_object_id",
                reader => new customers_for_archive_object
                {
                    id = reader.GetInt32(0),
                    full_name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    pin = reader.IsDBNull(2) ? null : reader.GetString(2),
                    address = reader.IsDBNull(3) ? null : reader.GetString(3),
                    is_organization = reader.IsDBNull(4) ? false : reader.GetBoolean(4),
                    description = reader.IsDBNull(5) ? null : reader.GetString(5)
                },
                new Dictionary<string, object> { ["@archive_object_id"] = archiveObjectId }
            );
        }

        private application_duty_object GetApplicationDutyObject(int processId)
        {
            return DatabaseHelper.RunQueryList<application_duty_object>(_schemaName, @"
                SELECT id, dutyplan_object_id, application_id
                FROM application_duty_object 
                WHERE application_id = @application_id",
                reader => new application_duty_object
                {
                    id = reader.GetInt32(0),
                    dutyplan_object_id = reader.GetInt32(1),
                    application_id = reader.GetInt32(2)
                },
                new Dictionary<string, object> { ["@application_id"] = processId }
            ).FirstOrDefault();
        }

        private ArchiveObjectFile GetArchiveObjectFile(int id)
        {
            return DatabaseHelper.RunQueryList<ArchiveObjectFile>(_schemaName, @"
                SELECT id, archive_object_id, file_id, name
                FROM archive_object_file 
                WHERE id = @id",
                reader => new ArchiveObjectFile
                {
                    id = reader.GetInt32(0),
                    archive_object_id = reader.GetInt32(1),
                    file_id = reader.GetInt32(2),
                    name = reader.IsDBNull(3) ? null : reader.GetString(3)
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

    // Helper class for ArchiveObjectFilter if not available
    public class ArchiveObjectFilter
    {
        public string? search { get; set; }
        public int pageSize { get; set; }
        public int pageNumber { get; set; }
        public int status_id { get; set; }
    }

    // Helper class for customers requests if not available
    public class Updatecustomers_for_archive_objectRequest
    {
        public int id { get; set; }
        public string? full_name { get; set; }
        public string? pin { get; set; }
        public string? address { get; set; }
        public bool is_organization { get; set; }
        public string? description { get; set; }
        public string? dp_outgoing_number { get; set; }
    }
}