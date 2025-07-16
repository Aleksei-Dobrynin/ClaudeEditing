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
    public class SmProjectControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public SmProjectControllerTests()
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
            var projectTypeId = CreateSmProjectType("Test Project Type", "test-type", "Test Project Type Description");
            CreateSmProject("Test Project 1", projectTypeId, true, null, "link1");
            CreateSmProject("Test Project 2", projectTypeId, false, 100, "link2");

            // Act
            var response = await _client.GetAsync("/SmProject/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<SmProject>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, p => p.name == "Test Project 1");
            Assert.Contains(result, p => p.name == "Test Project 2");
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var projectTypeId = CreateSmProjectType("Create Project Type", "create-type", "Create Project Type Description");

            var request = new CreateSmProjectRequest
            {
                name = "New Project",
                projecttype_id = projectTypeId,
                test = true,
                status_id = 1,
                min_responses = 75,
                access_link = "new-project-link",
                entity_id = 1
            };

            // Act
            var response = await _client.PostAsJsonAsync("/SmProject/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<SmProject>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Project", result.name);
            Assert.Equal(projectTypeId, result.projecttype_id);
            Assert.True(result.test);
            Assert.Equal(75, result.min_responses);
            Assert.Equal("new-project-link", result.access_link);

            // Verify in database
            var projectExists = DatabaseHelper.RunQuery<bool>(_schemaName, @"
                SELECT EXISTS(SELECT 1 FROM sm_project WHERE id = @id)",
                new Dictionary<string, object> { ["@id"] = result.id });

            Assert.True(projectExists);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalTypeId = CreateSmProjectType("Original Type", "original-type", "Original Type Description");
            var newTypeId = CreateSmProjectType("New Type", "new-type", "New Type Description");

            var id = CreateSmProject("Original Project", originalTypeId, false, 10, "original-link");

            var request = new UpdateSmProjectRequest
            {
                id = id,
                name = "Updated Project",
                projecttype_id = newTypeId,
                test = true,
                status_id = 2,
                min_responses = 100,
                access_link = "updated-link",
                entity_id = 1
            };

            // Act
            var response = await _client.PutAsync("/SmProject/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<SmProject>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Project", result.name);
            Assert.Equal(newTypeId, result.projecttype_id);
            Assert.True(result.test);
            Assert.Equal(100, result.min_responses);
            Assert.Equal("updated-link", result.access_link);

            // Verify in database
            var updatedProject = DatabaseHelper.RunQueryList<SmProject>(_schemaName, @"
                SELECT name, projecttype_id, test, min_responses, access_link 
                FROM sm_project 
                WHERE id = @id",
                reader => new SmProject
                {
                    name = reader.GetString(0),
                    projecttype_id = reader.GetInt32(1),
                    test = reader.GetBoolean(2),
                    min_responses = reader.GetInt32(3),
                    access_link = reader.GetString(4)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(updatedProject);
            Assert.Equal("Updated Project", updatedProject.name);
            Assert.Equal(newTypeId, updatedProject.projecttype_id);
            Assert.True(updatedProject.test);
            Assert.Equal(100, updatedProject.min_responses);
            Assert.Equal("updated-link", updatedProject.access_link);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple test projects
            var projectTypeId = CreateSmProjectType("Paginated Type", "paginated-type", "Paginated Type Description");

            for (int i = 1; i <= 5; i++)
            {
                CreateSmProject($"Paginated Project {i}", projectTypeId, i % 2 == 0, i * 10, $"link-{i}");
            }

            // Act
            var response = await _client.GetAsync("/SmProject/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<SmProject>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        // Helper methods to create test data
        private int CreateSmProjectType(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                CREATE TABLE IF NOT EXISTS sm_project_type (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255),
                    code VARCHAR(255),
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP,
                    created_by INTEGER,
                    updated_by INTEGER
                );
                
                INSERT INTO sm_project_type (name, code, description) 
                VALUES (@name, @code, @description) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description
                });
        }

        private int CreateSmProject(string name, int projectTypeId, bool? test, int? minResponses, string accessLink)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                CREATE TABLE IF NOT EXISTS sm_project (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255),
                    projecttype_id INTEGER,
                    test BOOLEAN,
                    status_id INTEGER,
                    min_responses INTEGER,
                    date_end TIMESTAMP,
                    access_link VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP,
                    created_by INTEGER,
                    updated_by INTEGER,
                    entity_id INTEGER,
                    frequency_id INTEGER,
                    is_triggers_required BOOLEAN,
                    date_attribute_milestone_id INTEGER
                );
                
                INSERT INTO sm_project (name, projecttype_id, test, min_responses, access_link) 
                VALUES (@name, @projectTypeId, @test, @minResponses, @accessLink) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@projectTypeId"] = projectTypeId,
                    ["@test"] = test as object ?? DBNull.Value,
                    ["@minResponses"] = minResponses as object ?? DBNull.Value,
                    ["@accessLink"] = accessLink
                });
        }

        private void CreateSurveyTagsTable()
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                CREATE TABLE IF NOT EXISTS custom_svg_icons (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255),
                    code VARCHAR(255),
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP,
                    created_by INTEGER,
                    updated_by INTEGER
                );
                
                CREATE TABLE IF NOT EXISTS survey_tags (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255),
                    code VARCHAR(255),
                    description TEXT,
                    queueNumber INTEGER,
                    iconColor VARCHAR(255),
                    idCustomSvgIcon INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP,
                    created_by INTEGER,
                    updated_by INTEGER
                );");
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}