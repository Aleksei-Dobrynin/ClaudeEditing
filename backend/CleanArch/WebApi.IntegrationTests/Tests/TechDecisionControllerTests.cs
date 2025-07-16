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
    public class tech_decisionControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public tech_decisionControllerTests()
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
            DatabaseHelper.RunQuery<int>(_schemaName, @"DELETE FROM tech_decision WHERE id > 0;");
            CreateTechDecision("Test Decision 1", "test_code_1", "Test Description 1", "Test Name KG 1", "Test Description KG 1", "#000000", "#FFFFFF");
            CreateTechDecision("Test Decision 2", "test_code_2", "Test Description 2", "Test Name KG 2", "Test Description KG 2", "#FFFFFF", "#000000");

            // Act
            var response = await _client.GetAsync("/tech_decision/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<tech_decision>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, d => d.name == "Test Decision 1" && d.code == "test_code_1");
            Assert.Contains(result, d => d.name == "Test Decision 2" && d.code == "test_code_2");
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test decision
            var id = CreateTechDecision("Single Decision", "single_code", "Single Description", "Single Name KG", "Single Description KG", "#123456", "#654321");

            // Act
            var response = await _client.GetAsync($"/tech_decision/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<tech_decision>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Single Decision", result.name);
            Assert.Equal("single_code", result.code);
            Assert.Equal("Single Description", result.description);
            Assert.Equal("Single Name KG", result.name_kg);
            Assert.Equal("Single Description KG", result.description_kg);
            Assert.Equal("#123456", result.text_color);
            Assert.Equal("#654321", result.background_color);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var now = DateTime.Now;
            var request = new Createtech_decisionRequest
            {
                name = "Created Decision",
                code = "created_code",
                description = "Created Description",
                name_kg = "Created Name KG",
                description_kg = "Created Description KG",
                text_color = "#ABCDEF",
                background_color = "#FEDCBA",
                created_at = now,
                updated_at = now,
                created_by = 1,
                updated_by = 1
            };

            // Act
            var response = await _client.PostAsJsonAsync("/tech_decision", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<tech_decision>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("Created Decision", result.name);
            Assert.Equal("created_code", result.code);
            Assert.Equal("Created Description", result.description);
            Assert.Equal("Created Name KG", result.name_kg);
            Assert.Equal("Created Description KG", result.description_kg);
            Assert.Equal("#ABCDEF", result.text_color);
            Assert.Equal("#FEDCBA", result.background_color);

            // Verify in database
            var techDecision = GetTechDecisionById(result.id);
            Assert.Equal("Created Decision", techDecision.name);
            Assert.Equal("created_code", techDecision.code);
            Assert.Equal("Created Description", techDecision.description);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateTechDecision(
                "Decision To Update",
                "update_code",
                "Update Description",
                "Update Name KG",
                "Update Description KG",
                "#111111",
                "#222222"
            );

            var now = DateTime.Now;
            var request = new Updatetech_decisionRequest
            {
                id = id,
                name = "Updated Decision",
                code = "updated_code",
                description = "Updated Description",
                name_kg = "Updated Name KG",
                description_kg = "Updated Description KG",
                text_color = "#333333",
                background_color = "#444444",
                updated_at = now,
                updated_by = 2
            };

            // Act
            var response = await _client.PutAsync($"/tech_decision/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<tech_decision>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Decision", result.name);
            Assert.Equal("updated_code", result.code);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("Updated Name KG", result.name_kg);
            Assert.Equal("Updated Description KG", result.description_kg);
            Assert.Equal("#333333", result.text_color);
            Assert.Equal("#444444", result.background_color);

            // Verify in database
            var techDecision = GetTechDecisionById(id);
            Assert.Equal("Updated Decision", techDecision.name);
            Assert.Equal("updated_code", techDecision.code);
            Assert.Equal("Updated Description", techDecision.description);
            Assert.Equal("Updated Name KG", techDecision.name_kg);
            Assert.Equal("Updated Description KG", techDecision.description_kg);
            Assert.Equal("#333333", techDecision.text_color);
            Assert.Equal("#444444", techDecision.background_color);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateTechDecision("Decision To Delete", "delete_code", "Delete Description");

            // Act
            var response = await _client.DeleteAsync($"/tech_decision/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = JsonConvert.DeserializeObject<int>(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var exists = DoesIdExistInTable("tech_decision", id);
            Assert.False(exists);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test decisions
            for (int i = 1; i <= 5; i++)
            {
                CreateTechDecision(
                    $"Paginated Decision {i}",
                    $"paginated_code_{i}",
                    $"Paginated Description {i}"
                );
            }

            // Act
            var response = await _client.GetAsync("/tech_decision/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<tech_decision>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
        }

        [Fact]
        public async Task TechDecision_UsedByApplication_CanBeRetrieved()
        {
            // Arrange
            // Create tech decision
            var techDecisionId = CreateTechDecision("App Tech Decision", "app_tech_code", "App Tech Description");

            // Create application using this tech decision
            var applicationId = CreateApplication(techDecisionId);

            // Act - Retrieve the tech decision
            var response = await _client.GetAsync($"/tech_decision/{techDecisionId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<tech_decision>(content);

            Assert.NotNull(result);
            Assert.Equal(techDecisionId, result.id);
            Assert.Equal("App Tech Decision", result.name);

            // Verify application uses this tech decision
            var application = GetApplicationById(applicationId);
            Assert.Equal(techDecisionId, application.tech_decision_id);
        }

        #region Helper Methods

        private int CreateTechDecision(
            string name,
            string code,
            string description,
            string nameKg = null,
            string descriptionKg = null,
            string textColor = null,
            string backgroundColor = null
        )
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO tech_decision (
                    name, 
                    code, 
                    description, 
                    name_kg, 
                    description_kg, 
                    text_color, 
                    background_color, 
                    created_at, 
                    updated_at
                ) 
                VALUES (
                    @name, 
                    @code, 
                    @description, 
                    @nameKg, 
                    @descriptionKg, 
                    @textColor, 
                    @backgroundColor, 
                    @createdAt, 
                    @updatedAt
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@nameKg"] = nameKg as object ?? DBNull.Value,
                    ["@descriptionKg"] = descriptionKg as object ?? DBNull.Value,
                    ["@textColor"] = textColor as object ?? DBNull.Value,
                    ["@backgroundColor"] = backgroundColor as object ?? DBNull.Value,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now
                });
        }

        private int CreateApplication(int? techDecisionId = null)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application (
                    registration_date, 
                    tech_decision_id,
                    created_at, 
                    updated_at, 
                    number
                ) 
                VALUES (
                    @registrationDate, 
                    @techDecisionId,
                    @createdAt, 
                    @updatedAt, 
                    @number
                ) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@registrationDate"] = DateTime.Now,
                    ["@techDecisionId"] = techDecisionId as object ?? DBNull.Value,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now,
                    ["@number"] = $"APP-{Guid.NewGuid().ToString().Substring(0, 8)}"
                });
        }

        private tech_decision GetTechDecisionById(int id)
        {
            return DatabaseHelper.RunQueryList<tech_decision>(_schemaName, @"
                SELECT id, name, code, description, name_kg, description_kg, text_color, background_color
                FROM tech_decision 
                WHERE id = @id",
                reader => new tech_decision
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    description = reader.IsDBNull(3) ? null : reader.GetString(3),
                    name_kg = reader.IsDBNull(4) ? null : reader.GetString(4),
                    description_kg = reader.IsDBNull(5) ? null : reader.GetString(5),
                    text_color = reader.IsDBNull(6) ? null : reader.GetString(6),
                    background_color = reader.IsDBNull(7) ? null : reader.GetString(7)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        private dynamic GetApplicationById(int id)
        {
            return DatabaseHelper.RunQueryList<dynamic>(_schemaName, @"
                SELECT id, tech_decision_id
                FROM application 
                WHERE id = @id",
                reader => new
                {
                    id = reader.GetInt32(0),
                    tech_decision_id = reader.IsDBNull(1) ? null : (int?)reader.GetInt32(1)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();
        }

        private bool DoesIdExistInTable(string tableName, int id)
        {
            var count = DatabaseHelper.RunQuery<int>(_schemaName, $@"
                SELECT COUNT(*) FROM ""{tableName}"" WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            return count > 0;
        }

        #endregion

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}