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
    public class SmProjectTagsControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public SmProjectTagsControllerTests()
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
            // Arrange - Create required tables and test data
            CreateRequiredTables();

            var projectTypeId = CreateSmProjectType("Tags Test Type", "tags-test-type", "Tags Test Type Description");
            var projectId = CreateSmProject("Project With Tags", projectTypeId, true, 50, "tags-link");

            var customSvgIconId = CreateCustomSvgIcon("Test Icon", "test-icon-path");
            var surveyTagId = CreateSurveyTag("Test Tag", "test-tag", "Test Tag Description", customSvgIconId);

            // Create project tags
            CreateSmProjectTag(projectId, surveyTagId);

            // Act
            var response = await _client.GetAsync("/SmProjectTags/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<SmProjectTags>>(content);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(projectId, result[0].project_id);
            Assert.Equal(surveyTagId, result[0].tag_id);

            // Verify SurveyTags relationship
            Assert.NotNull(result[0].surveyTags);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange - Create required tables and test data
            CreateRequiredTables();

            var projectTypeId = CreateSmProjectType("Create Tags Type", "create-tags-type", "Create Tags Type Description");
            var projectId = CreateSmProject("Project For Create", projectTypeId, false, 25, "create-tags-link");

            var customSvgIconId = CreateCustomSvgIcon("Create Icon", "create-icon-path");
            var surveyTagId = CreateSurveyTag("Create Tag", "create-tag", "Create Tag Description", customSvgIconId);

            var request = new CreateSmProjectTagsRequest
            {
                project_id = projectId,
                tag_id = surveyTagId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/SmProjectTags/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<SmProjectTags>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(projectId, result.project_id);
            Assert.Equal(surveyTagId, result.tag_id);

            // Verify in database
            var exists = DatabaseHelper.RunQuery<bool>(_schemaName, @"
                SELECT EXISTS(SELECT 1 FROM sm_project_tags WHERE id = @id)",
                new Dictionary<string, object> { ["@id"] = result.id });

            Assert.True(exists);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create required tables and test data
            CreateRequiredTables();

            var projectTypeId = CreateSmProjectType("Update Tags Type", "update-tags-type", "Update Tags Type Description");
            var originalProjectId = CreateSmProject("Original Project", projectTypeId, true, 30, "original-tags-link");
            var newProjectId = CreateSmProject("New Project", projectTypeId, false, 20, "new-tags-link");

            var customSvgIconId = CreateCustomSvgIcon("Update Icon", "update-icon-path");
            var originalTagId = CreateSurveyTag("Original Tag", "original-tag", "Original Tag Description", customSvgIconId);
            var newTagId = CreateSurveyTag("New Tag", "new-tag", "New Tag Description", customSvgIconId);

            var id = CreateSmProjectTag(originalProjectId, originalTagId);

            var request = new UpdateSmProjectTagsRequest
            {
                id = id,
                project_id = newProjectId,
                tag_id = newTagId
            };

            // Act
            var response = await _client.PutAsync("/SmProjectTags/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<SmProjectTags>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newProjectId, result.project_id);
            Assert.Equal(newTagId, result.tag_id);

            // Verify in database
            var updated = DatabaseHelper.RunQueryList<SmProjectTags>(_schemaName, @"
                SELECT project_id, tag_id FROM sm_project_tags WHERE id = @id",
                reader => new SmProjectTags
                {
                    project_id = reader.GetInt32(0),
                    tag_id = reader.GetInt32(1)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(updated);
            Assert.Equal(newProjectId, updated.project_id);
            Assert.Equal(newTagId, updated.tag_id);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create required tables and test data
            CreateRequiredTables();

            var projectTypeId = CreateSmProjectType("Paginated Tags Type", "paginated-tags-type", "Paginated Tags Type Description");
            var projectId = CreateSmProject("Project For Pagination", projectTypeId, true, 40, "paginated-tags-link");

            var customSvgIconId = CreateCustomSvgIcon("Paginated Icon", "paginated-icon-path");

            // Create multiple survey tags and project tags
            for (int i = 1; i <= 5; i++)
            {
                var surveyTagId = CreateSurveyTag($"Tag {i}", $"tag-{i}", $"Tag Description {i}", customSvgIconId);
                CreateSmProjectTag(projectId, surveyTagId);
            }

            // Act
            var response = await _client.GetAsync("/SmProjectTags/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<SmProjectTags>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

            // Verify that SurveyTags and CustomSvgIcon are loaded
            foreach (var projectTag in result.items)
            {
                Assert.NotNull(projectTag.surveyTags);
                Assert.NotNull(projectTag.surveyTags.customSvgIcon);
            }
        }

        // Helper methods to create required tables and test data
        private void CreateRequiredTables()
        {
            // Create sm_project_type table
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

            // Create sm_project table
            DatabaseHelper.RunQuery<int>(_schemaName, @"
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
                );");

            // Create custom_svg_icons table
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                CREATE TABLE IF NOT EXISTS custom_svg_icons (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255),
                    svgPath VARCHAR(255),
                    code VARCHAR(255),
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP,
                    created_by INTEGER,
                    updated_by INTEGER
                );");

            // Create survey_tags table
            DatabaseHelper.RunQuery<int>(_schemaName, @"
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

            // Create sm_project_tags table
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                CREATE TABLE IF NOT EXISTS sm_project_tags (
                    id SERIAL PRIMARY KEY,
                    project_id INTEGER,
                    tag_id INTEGER,
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

        private int CreateSmProject(string name, int projectTypeId, bool? test, int? minResponses, string accessLink)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
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

        private int CreateCustomSvgIcon(string name, string svgPath)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO custom_svg_icons (name, svgPath) 
                VALUES (@name, @svgPath) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@svgPath"] = svgPath
                });
        }

        private int CreateSurveyTag(string name, string code, string description, int customSvgIconId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO survey_tags (name, code, description, idCustomSvgIcon) 
                VALUES (@name, @code, @description, @customSvgIconId) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@customSvgIconId"] = customSvgIconId
                });
        }

        private int CreateSmProjectTag(int projectId, int tagId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO sm_project_tags (project_id, tag_id) 
                VALUES (@projectId, @tagId) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@projectId"] = projectId,
                    ["@tagId"] = tagId
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}