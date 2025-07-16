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
using System.Net.Http.Headers;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Http;
using WebApi.Dtos;
using System.Net.Http.Json;
using WebApi.Controllers;

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ArchiveObjectFileTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ArchiveObjectFileTests()
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
            var (archiveObjectId1, fileId1) = CreateTestPrerequisites();
            var (archiveObjectId2, fileId2) = CreateTestPrerequisites();

            CreateArchiveObjectFile(archiveObjectId1, fileId1, "File 1");
            CreateArchiveObjectFile(archiveObjectId2, fileId2, "File 2");

            // Act
            var response = await _client.GetAsync("/ArchiveObjectFile/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ArchiveObjectFile>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, aof => aof.archive_object_id == archiveObjectId1 && aof.file_id == fileId1 && aof.name == "File 1");
            Assert.Contains(result, aof => aof.archive_object_id == archiveObjectId2 && aof.file_id == fileId2 && aof.name == "File 2");
        }

        [Fact]
        public async Task GetNotInFolder_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (archiveObjectId1, fileId1) = CreateTestPrerequisites();
            var (archiveObjectId2, fileId2) = CreateTestPrerequisites();

            // Create a folder
            var folderId = CreateArchiveFolder(archiveObjectId1);

            // Create files - one in folder, one not in folder
            var file1Id = CreateArchiveObjectFile(archiveObjectId1, fileId1, "File In Folder", folderId);
            var file2Id = CreateArchiveObjectFile(archiveObjectId2, fileId2, "File Not In Folder");

            // Act
            var response = await _client.GetAsync("/ArchiveObjectFile/GetNotInFolder");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ArchiveObjectFile>>(content);

            Assert.NotNull(result);
            // Should only include files not in folders
            Assert.Single(result);
            Assert.Contains(result, aof => aof.id == file2Id && aof.name == "File Not In Folder");
            Assert.DoesNotContain(result, aof => aof.id == file1Id);
        }

        [Fact]
        public async Task GetByidArchiveObject_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (archiveObjectId, fileId1) = CreateTestPrerequisites();
            var fileId2 = CreateFile("second-file.txt");
            var fileId3 = CreateFile("third-file.txt");

            CreateArchiveObjectFile(archiveObjectId, fileId1, "File 1");
            CreateArchiveObjectFile(archiveObjectId, fileId2, "File 2");
            CreateArchiveObjectFile(archiveObjectId, fileId3, "File 3");

            // Create another archive object with its own files (shouldn't be returned)
            var (otherArchiveObjectId, otherFileId) = CreateTestPrerequisites();
            CreateArchiveObjectFile(otherArchiveObjectId, otherFileId, "Other File");

            // Act
            var response = await _client.GetAsync($"/ArchiveObjectFile/GetByidArchiveObject?idArchiveObject={archiveObjectId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ArchiveObjectFile>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.All(result, aof => Assert.Equal(archiveObjectId, aof.archive_object_id));
            Assert.Contains(result, aof => aof.name == "File 1");
            Assert.Contains(result, aof => aof.name == "File 2");
            Assert.Contains(result, aof => aof.name == "File 3");
            Assert.DoesNotContain(result, aof => aof.name == "Other File");
        }

        [Fact]
        public async Task GetByidArchiveFolder_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (archiveObjectId, fileId1) = CreateTestPrerequisites();
            var fileId2 = CreateFile("second-file.txt");

            // Create a folder
            var folderId = CreateArchiveFolder(archiveObjectId);

            // Create files - one in folder, one not in folder
            var file1Id = CreateArchiveObjectFile(archiveObjectId, fileId1, "File In Folder", folderId);
            var file2Id = CreateArchiveObjectFile(archiveObjectId, fileId2, "File Not In Folder");

            // Act
            var response = await _client.GetAsync($"/ArchiveObjectFile/GetByidArchiveFolder?idArchiveFolder={folderId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<ArchiveObjectFile>>(content);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Contains(result, aof => aof.id == file1Id && aof.name == "File In Folder");
            Assert.DoesNotContain(result, aof => aof.id == file2Id);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (archiveObjectId, fileId) = CreateTestPrerequisites();
            var id = CreateArchiveObjectFile(archiveObjectId, fileId, "Test File");

            // Act
            var response = await _client.GetAsync($"/ArchiveObjectFile/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ArchiveObjectFile>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(archiveObjectId, result.archive_object_id);
            Assert.Equal(fileId, result.file_id);
            Assert.Equal("Test File", result.name);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var (archiveObjectId, _) = CreateTestPrerequisites();

            var formContent = new MultipartFormDataContent();

            // Примитивы верхнего уровня
            formContent.Add(new StringContent(archiveObjectId.ToString()), "archive_object_id");
            formContent.Add(new StringContent("Test Document"), "name");

            // Добавим поля, соответствующие вложенному FileModel
            formContent.Add(new StringContent("Test File"), "document.name");

            var fileBytes = Encoding.UTF8.GetBytes("This is a test file content");
            var fileContent = new ByteArrayContent(fileBytes);
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/octet-stream");

            // ⚠️ имя поля должно быть "document.file" — для байндинга в FileModel.file
            formContent.Add(fileContent, "document.file", "test-file.txt");

            // Act
            var response = await _client.PostAsync("/ArchiveObjectFile/Create", formContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Error creating archive object file: {errorContent}");
            }

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();

            if (content.Contains("isSuccess"))
            {
                var resultWrapper = JsonConvert.DeserializeObject<ResultWrapper<ArchiveObjectFile>>(content);
                Assert.True(resultWrapper.isSuccess);
                Assert.NotNull(resultWrapper.value);
                Assert.Equal(archiveObjectId, resultWrapper.value.archive_object_id);
                Assert.Equal("Test Document", resultWrapper.value.name);
            }
            else
            {
                var result = JsonConvert.DeserializeObject<ArchiveObjectFile>(content);
                Assert.NotNull(result);
                Assert.Equal(archiveObjectId, result.archive_object_id);
                Assert.Equal("Test Document", result.name);
            }

            // Verify in database
            var files = GetArchiveObjectFilesByArchiveObjectId(archiveObjectId);
            Assert.Contains(files, f => f.name == "Test Document");
        }


        [Fact]
        public async Task SetTagsToFile_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (archiveObjectId, fileId) = CreateTestPrerequisites();
            var archiveFileId = CreateArchiveObjectFile(archiveObjectId, fileId, "File With Tags");

            // Create tags
            var tag1Id = CreateArchiveDocTag("Tag 1");
            var tag2Id = CreateArchiveDocTag("Tag 2");

            var request = new ArchiveObjectFileController.SetTagsToFileRequest
            {
                file_id = archiveFileId,
                tag_ids = new List<int> { tag1Id, tag2Id }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ArchiveObjectFile/SetTagsToFile", request);

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify tags were added in database
            var tags = GetArchiveFileTags(archiveFileId);
            Assert.Equal(2, tags.Count);
            Assert.Contains(tags, t => t.tag_id == tag1Id);
            Assert.Contains(tags, t => t.tag_id == tag2Id);
        }

        [Fact]
        public async Task SendFilesToFolder_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (archiveObjectId, fileId1) = CreateTestPrerequisites();
            var fileId2 = CreateFile("second-file.txt");

            // Create files
            var file1Id = CreateArchiveObjectFile(archiveObjectId, fileId1, "File 1");
            var file2Id = CreateArchiveObjectFile(archiveObjectId, fileId2, "File 2");

            // Create folder
            var folderId = CreateArchiveFolder(archiveObjectId);

            var request = new ArchiveObjectFileController.SendFilesToFolderReq
            {
                folder_id = folderId,
                file_ids = new List<int> { file1Id, file2Id }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/ArchiveObjectFile/SendFilesToFolder", request);

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify files were moved to folder
            var file1 = GetArchiveObjectFileById(file1Id);
            var file2 = GetArchiveObjectFileById(file2Id);

            Assert.Equal(folderId, file1.archive_folder_id);
            Assert.Equal(folderId, file2.archive_folder_id);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var (archiveObjectId, fileId) = CreateTestPrerequisites();
            var id = CreateArchiveObjectFile(archiveObjectId, fileId, "File To Delete");

            // Act
            var response = await _client.DeleteAsync($"/ArchiveObjectFile/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify file was deleted
            var file = GetArchiveObjectFileById(id);
            Assert.Null(file);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test files
            var (archiveObjectId, _) = CreateTestPrerequisites();

            for (int i = 1; i <= 5; i++)
            {
                var fileId = CreateFile($"file-{i}.txt");
                CreateArchiveObjectFile(archiveObjectId, fileId, $"File {i}");
            }

            // Act
            var response = await _client.GetAsync("/ArchiveObjectFile/GetPaginated?pageSize=2&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<ArchiveObjectFile>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.items.Count);

        }

        #region Helper Methods

        private (int archiveObjectId, int fileId) CreateTestPrerequisites()
        {
            // Create archive object
            var statusId = CreateStatus("Archive", "archive");
            var archiveObjectId = CreateArchiveObject($"DOC-{Guid.NewGuid().ToString().Substring(0, 8)}",
                                                     "Test Address",
                                                     "Test Customer",
                                                     statusId);

            // Create file
            var fileId = CreateFile($"test-{Guid.NewGuid().ToString().Substring(0, 8)}.txt");

            return (archiveObjectId, fileId);
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

        private int CreateArchiveFolder(int dutyplanObjectId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_folder (dutyplan_object_id, archive_folder_name, created_at, updated_at) 
                VALUES (@dutyplan_object_id, @archive_folder_name, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@dutyplan_object_id"] = dutyplanObjectId,
                    ["@archive_folder_name"] = $"Folder-{Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateArchiveObjectFile(int archiveObjectId, int fileId, string name, int? folderIdParam = null)
        {
            var sql = folderIdParam.HasValue
                ? @"INSERT INTO archive_object_file (archive_object_id, file_id, name, archive_folder_id, created_at, updated_at) 
                    VALUES (@archive_object_id, @file_id, @name, @archive_folder_id, @created_at, @updated_at) 
                    RETURNING id;"
                : @"INSERT INTO archive_object_file (archive_object_id, file_id, name, created_at, updated_at) 
                    VALUES (@archive_object_id, @file_id, @name, @created_at, @updated_at) 
                    RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@archive_object_id"] = archiveObjectId,
                ["@file_id"] = fileId,
                ["@name"] = name,
                ["@created_at"] = DateTime.Now,
                ["@updated_at"] = DateTime.Now
            };

            if (folderIdParam.HasValue)
            {
                parameters["@archive_folder_id"] = folderIdParam.Value;
            }

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        private int CreateArchiveDocTag(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO archive_doc_tag (name, created_at, updated_at) 
                VALUES (@name, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
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

        private ArchiveObjectFile GetArchiveObjectFileById(int id)
        {
            return DatabaseHelper.RunQueryList<ArchiveObjectFile>(_schemaName, @"
                SELECT id, archive_object_id, file_id, name, archive_folder_id
                FROM archive_object_file 
                WHERE id = @id",
                reader => new ArchiveObjectFile
                {
                    id = reader.GetInt32(0),
                    archive_object_id = reader.GetInt32(1),
                    file_id = reader.GetInt32(2),
                    name = reader.IsDBNull(3) ? null : reader.GetString(3),
                    archive_folder_id = reader.IsDBNull(4) ? null : reader.GetInt32(4)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        private List<ArchiveObjectFile> GetArchiveObjectFilesByArchiveObjectId(int archiveObjectId)
        {
            return DatabaseHelper.RunQueryList<ArchiveObjectFile>(_schemaName, @"
                SELECT id, archive_object_id, file_id, name, archive_folder_id
                FROM archive_object_file 
                WHERE archive_object_id = @archive_object_id",
                reader => new ArchiveObjectFile
                {
                    id = reader.GetInt32(0),
                    archive_object_id = reader.GetInt32(1),
                    file_id = reader.GetInt32(2),
                    name = reader.IsDBNull(3) ? null : reader.GetString(3),
                    archive_folder_id = reader.IsDBNull(4) ? null : reader.GetInt32(4)
                },
                new Dictionary<string, object> { ["@archive_object_id"] = archiveObjectId }
            );
        }

        private List<archive_file_tags> GetArchiveFileTags(int fileId)
        {
            return DatabaseHelper.RunQueryList<archive_file_tags>(_schemaName, @"
                SELECT id, file_id, tag_id
                FROM archive_file_tags 
                WHERE file_id = @file_id",
                reader => new archive_file_tags
                {
                    id = reader.GetInt32(0),
                    file_id = reader.GetInt32(1),
                    tag_id = reader.IsDBNull(2) ? null : reader.GetInt32(2)
                },
                new Dictionary<string, object> { ["@file_id"] = fileId }
            );
        }

        #endregion

        // Helper class for Result wrapper handling
        private class ResultWrapper<T>
        {
            public bool isSuccess { get; set; }
            public T value { get; set; }
            public List<string> errors { get; set; }
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}