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
    public class SmProjectTypeControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public SmProjectTypeControllerTests()
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
            CreateSmProjectTypeTable();
            CreateSmProjectType("Type 1", "type-code-1", "Type Description 1");
            CreateSmProjectType("Type 2", "type-code-2", "Type Description 2");

            // Act
            var response = await _client.GetAsync("/SmProjectType/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<SmProjectType>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, t => t.name == "Type 1" && t.code == "type-code-1");
            Assert.Contains(result, t => t.name == "Type 2" && t.code == "type-code-2");
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            CreateSmProjectTypeTable();

            var request = new CreateSmProjectTypeRequest
            {
                name = "New Type",
                code = "new-type-code",
                description = "New Type Description"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/SmProjectType/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<SmProjectType>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Type", result.name);
            Assert.Equal("new-type-code", result.code);
            Assert.Equal("New Type Description", result.description);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            CreateSmProjectTypeTable();
            var id = CreateSmProjectType("Original Type", "original-code", "Original Description");

            var request = new UpdateSmProjectTypeRequest
            {
                id = id,
                name = "Updated Type",
                code = "updated-code",
                description = "Updated Description"
            };

            // Act
            var response = await _client.PutAsync("/SmProjectType/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<SmProjectType>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Type", result.name);
            Assert.Equal("updated-code", result.code);
            Assert.Equal("Updated Description", result.description);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple test project types
            CreateSmProjectTypeTable();

            for (int i = 1; i <= 5; i++)
            {
                CreateSmProjectType($"Paginated Type {i}", $"page-code-{i}", $"Paginated Description {i}");
            }

            // Act
            var response = await _client.GetAsync("/SmProjectType/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<SmProjectType>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task VerifyProjectTypeRelationship_ReturnsOkResponse()
        {
            // Arrange - Create project type and project that references it
            CreateSmProjectTypeTable();

            var typeId = CreateSmProjectType("Related Type", "related-code", "Related Description");
            var projectId = CreateSmProject("Project With Type", typeId);

            // Act - Get the project
            var response = await _client.GetAsync($"/SmProject/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var projects = JsonConvert.DeserializeObject<List<SmProject>>(content);

            Assert.NotNull(projects);
            Assert.Single(projects);

            var project = projects[0];
            Assert.Equal(projectId, project.id);
            Assert.Equal(typeId, project.projecttype_id);
        }

        // Helper methods to create required tables and test data
        private void CreateSmProjectTypeTable()
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                CREATE TABLE IF NOT EXISTS sm_project_type (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255),
                    code VARCHAR(255),
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP,
                    created_by INTEGER,
                    updated_by INTEGER
                );");
        }

        private int CreateSmProjectType(string name, string code, string description)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
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
        

        private int CreateSmProject(string name, int projectTypeId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO sm_project (name, projecttype_id) 
                VALUES (@name, @projectTypeId) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@projectTypeId"] = projectTypeId
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}