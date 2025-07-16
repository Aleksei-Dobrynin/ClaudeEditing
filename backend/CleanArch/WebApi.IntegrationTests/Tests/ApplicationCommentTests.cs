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

namespace WebApi.IntegrationTests.Tests
{
    [Collection("Database collection")]
    public class ApplicationCommentTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationCommentTests()
        {
            // Create a schema for this test
            _schemaName = DatabaseHelper.CreateTestSchema();

            // Create a client with the schema configured
            var factory = new TestWebApplicationFactory<Program>(_schemaName);
            _client = factory.CreateClient();
        }

        //[Fact]
        //public async Task GetAll_ReturnsOkResponse()
        //{
        //    // Arrange - Create test application comments
        //    var applicationId = CreateTestApplication();
        //    CreateApplicationComment(applicationId, "Test Comment 1");
        //    CreateApplicationComment(applicationId, "Test Comment 2");

        //    // Act
        //    var response = await _client.GetAsync("/application_comment/GetAll");

        //    // Assert
        //    response.EnsureSuccessStatusCode();
        //    var content = await response.Content.ReadAsStringAsync();
        //    var result = JsonConvert.DeserializeObject<List<application_comment>>(content);

        //    Assert.NotNull(result);
        //    Assert.Equal(2, result.Count);
        //}

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test application comment
            var applicationId = CreateTestApplication();
            var id = CreateApplicationComment(applicationId, "Test Comment");

            // Act
            var response = await _client.GetAsync($"/application_comment/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_comment>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Test Comment", result.comment);
            Assert.Equal(applicationId, result.application_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var request = new Createapplication_commentRequest
            {
                application_id = applicationId,
                comment = "New Comment"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/application_comment/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_comment>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Comment", result.comment);
            Assert.Equal(applicationId, result.application_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var id = CreateApplicationComment(applicationId, "Original Comment");

            var request = new UpdateApplication_commentRequest
            {
                id = id,
                application_id = applicationId,
                comment = "Updated Comment"
            };

            // Act
            var response = await _client.PutAsync($"/application_comment/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_comment>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Comment", result.comment);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var id = CreateApplicationComment(applicationId, "Comment to Delete");

            // Act
            var response = await _client.DeleteAsync($"/application_comment/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_comment WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetByapplication_id_ReturnsOkResponse()
        {
            // Arrange
            DatabaseHelper.RunQuery<int>(_schemaName, @"INSERT INTO employee 
    (last_name, first_name, second_name, user_id) VALUES ('Test', 'Test', 'Test', '1') 
            RETURNING id;");
            
            var applicationId = CreateTestApplication();
            CreateApplicationComment(applicationId, "Comment 1 for App");
            CreateApplicationComment(applicationId, "Comment 2 for App");

            // Create another application with comments to confirm filtering
            var otherAppId = CreateTestApplication();
            CreateApplicationComment(otherAppId, "Comment for Other App");

            // Act
            var response = await _client.GetAsync($"/application_comment/GetByapplication_id?application_id={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_comment>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(applicationId, item.application_id));
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

        private int CreateApplicationComment(int applicationId, string comment)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_comment (application_id, comment, created_at, created_by) 
                VALUES (@application_id, @comment, @created_at, 1) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@comment"] = comment,
                    ["@created_at"] = DateTime.Now
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}