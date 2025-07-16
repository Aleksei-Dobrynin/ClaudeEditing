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
    public class ArchiveFolderTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ArchiveFolderTests()
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
            var dutyplanObjectId1 = CreateDutyplanObject("DOC-001", "Address 1");
            var dutyplanObjectId2 = CreateDutyplanObject("DOC-002", "Address 2");

            CreateArchiveFolder("Folder 1", dutyplanObjectId1, "Location 1");
            CreateArchiveFolder("Folder 2", dutyplanObjectId2, "Location 2");

            // Act
            var response = await _client.GetAsync("/archive_folder/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<archive_folder>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            // Check that object_number and object_address fields were populated from dutyplan_object
            Assert.Contains(result, folder => folder.object_number == "DOC-001" && folder.object_address == "Address 1");
            Assert.Contains(result, folder => folder.object_number == "DOC-002" && folder.object_address == "Address 2");
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var dutyplanObjectId = CreateDutyplanObject("DOC-003", "Address 3");
            var id = CreateArchiveFolder("Single Folder", dutyplanObjectId, "Single Location");

            // Act
            var response = await _client.GetAsync($"/archive_folder/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<archive_folder>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Folder", result.archive_folder_name);
            Assert.Equal(dutyplanObjectId, result.dutyplan_object_id);
            Assert.Equal("Single Location", result.folder_location);
            Assert.Equal("DOC-003", result.object_number);
            Assert.Equal("Address 3", result.object_address);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var dutyplanObjectId = CreateDutyplanObject("DOC-004", "Address 4");

            var request = new Createarchive_folderRequest
            {
                archive_folder_name = "Created Folder",
                dutyplan_object_id = dutyplanObjectId,
                folder_location = "Created Location",
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PostAsJsonAsync("/archive_folder", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<archive_folder>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Folder", result.archive_folder_name);
            Assert.Equal(dutyplanObjectId, result.dutyplan_object_id);
            Assert.Equal("Created Location", result.folder_location);

            // Verify in database
            var folder = DatabaseHelper.RunQueryList<archive_folder>(_schemaName, @"
                SELECT id, archive_folder_name, dutyplan_object_id, folder_location 
                FROM archive_folder WHERE id = @id",
                reader => new archive_folder
                {
                    id = reader.GetInt32(0),
                    archive_folder_name = reader.GetString(1),
                    dutyplan_object_id = reader.GetInt32(2),
                    folder_location = reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(folder);
            Assert.Equal(result.id, folder.id);
            Assert.Equal("Created Folder", folder.archive_folder_name);
            Assert.Equal(dutyplanObjectId, folder.dutyplan_object_id);
            Assert.Equal("Created Location", folder.folder_location);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalDutyplanObjectId = CreateDutyplanObject("DOC-005", "Address 5");
            var newDutyplanObjectId = CreateDutyplanObject("DOC-006", "Address 6");

            var id = CreateArchiveFolder("Original Folder", originalDutyplanObjectId, "Original Location");

            var request = new Updatearchive_folderRequest
            {
                id = id,
                archive_folder_name = "Updated Folder",
                dutyplan_object_id = newDutyplanObjectId,
                folder_location = "Updated Location",
                created_at = DateTime.Now,
                updated_at = DateTime.Now
            };

            // Act
            var response = await _client.PutAsync($"/archive_folder/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<archive_folder>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Folder", result.archive_folder_name);
            Assert.Equal(newDutyplanObjectId, result.dutyplan_object_id);
            Assert.Equal("Updated Location", result.folder_location);

            // Verify in database
            var folder = DatabaseHelper.RunQueryList<archive_folder>(_schemaName, @"
                SELECT archive_folder_name, dutyplan_object_id, folder_location 
                FROM archive_folder WHERE id = @id",
                reader => new archive_folder
                {
                    archive_folder_name = reader.GetString(0),
                    dutyplan_object_id = reader.GetInt32(1),
                    folder_location = reader.GetString(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(folder);
            Assert.Equal("Updated Folder", folder.archive_folder_name);
            Assert.Equal(newDutyplanObjectId, folder.dutyplan_object_id);
            Assert.Equal("Updated Location", folder.folder_location);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var dutyplanObjectId = CreateDutyplanObject("DOC-007", "Address 7");
            var id = CreateArchiveFolder("Folder to Delete", dutyplanObjectId, "Delete Location");

            // Act
            var response = await _client.DeleteAsync($"/archive_folder/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            int deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM archive_folder WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test folders
            var dutyplanObjectId = CreateDutyplanObject("DOC-008", "Address 8");

            for (int i = 1; i <= 5; i++)
            {
                CreateArchiveFolder($"Paginated Folder {i}", dutyplanObjectId, $"Location {i}");
            }

            // Act
            var response = await _client.GetAsync("/archive_folder/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<archive_folder>>(content);

            JObject jObject = JObject.Parse(content);

            int pageNumber = jObject["pageNumber"]?.Value<int>() ?? 0;
            int totalPages = jObject["totalPages"]?.Value<int>() ?? 0;
            int totalCount = jObject["totalCount"]?.Value<int>() ?? 0;

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, totalCount);
            Assert.Equal(1, pageNumber);
            Assert.Equal(2, totalPages);
        }

        [Fact]
        public async Task GetByDutyplanObjectId_ReturnsOkResponse()
        {
            // Arrange
            var dutyplanObjectId1 = CreateDutyplanObject("DOC-009", "Address 9");
            var dutyplanObjectId2 = CreateDutyplanObject("DOC-010", "Address 10");

            // Create folders for different duty plan objects
            CreateArchiveFolder("Folder 1 for Object 1", dutyplanObjectId1, "Location 1");
            CreateArchiveFolder("Folder 2 for Object 1", dutyplanObjectId1, "Location 2");
            CreateArchiveFolder("Folder 1 for Object 2", dutyplanObjectId2, "Location 3");

            // Act
            var response = await _client.GetAsync($"/archive_folder/GetBydutyplan_object_id?dutyplan_object_id={dutyplanObjectId1}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<archive_folder>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, folder => Assert.Equal(dutyplanObjectId1, folder.dutyplan_object_id));
            Assert.Contains(result, folder => folder.archive_folder_name == "Folder 1 for Object 1");
            Assert.Contains(result, folder => folder.archive_folder_name == "Folder 2 for Object 1");

            // Also check that object_number and object_address are included
            Assert.All(result, folder =>
            {
                Assert.Equal("DOC-009", folder.object_number);
                Assert.Equal("Address 9", folder.object_address);
            });
        }

        // Helper methods to create test data
        private int CreateStatusDutyplanObject(string name, string code)
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

        private int CreateDutyplanObject(string docNumber, string address)
        {
            // Ensure status exists first
            var statusId = CreateStatusDutyplanObject("Active", "active");

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO dutyplan_object (doc_number, address, status_dutyplan_object_id, created_at, updated_at) 
                VALUES (@docNumber, @address, @statusId, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@docNumber"] = docNumber,
                    ["@address"] = address,
                    ["@statusId"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateArchiveFolder(string name, int dutyplanObjectId, string location)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_folder (archive_folder_name, dutyplan_object_id, folder_location, created_at, updated_at) 
                VALUES (@name, @dutyplanObjectId, @location, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@dutyplanObjectId"] = dutyplanObjectId,
                    ["@location"] = location,
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