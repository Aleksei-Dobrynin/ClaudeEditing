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
    public class CustomSvgIconTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public CustomSvgIconTests()
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
            CreateCustomSvgIcon("Icon 1", "icon1");
            CreateCustomSvgIcon("Icon 2", "icon2");

            // Act
            var response = await _client.GetAsync("/CustomSvgIcon/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<CustomSvgIcon>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, i => i.name == "Icon 1" );
            Assert.Contains(result, i => i.name == "Icon 2" );
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create test data
            for (int i = 1; i <= 5; i++)
            {
                CreateCustomSvgIcon($"Icon {i}", $"icon{i}");
            }

            // Act
            var response = await _client.GetAsync("/CustomSvgIcon/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<CustomSvgIcon>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);

        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new CreateCustomSvgIconRequest
            {
                name = "New Icon",
                code = "new_icon",
                description = "New Icon Description"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/CustomSvgIcon/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomSvgIcon>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("New Icon", result.name);
            Assert.Equal("new_icon", result.svgPath);

            // Verify in database
            var createdIcon = await GetCustomSvgIconById(result.id);
            Assert.NotNull(createdIcon);
            Assert.Equal("New Icon", createdIcon.name);
            Assert.Equal("new_icon", createdIcon.svgPath);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange - Create test data
            var id = CreateCustomSvgIcon("Original Icon", "original_icon");

            var request = new UpdateCustomSvgIconRequest
            {
                id = id,
                name = "Updated Icon",
                code = "updated_icon",
                description = "Updated Description"
            };

            // Act
            var response = await _client.PutAsync("/CustomSvgIcon/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CustomSvgIcon>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Icon", result.name);

        }

        // Helper methods to create test data
        private int CreateCustomSvgIcon(string name, string svgPath)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO ""CustomSvgIcon"" (
                    name, ""svgPath"", 
                    created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @name, @svgPath, 
                    @createdAt, @updatedAt, @createdBy, @updatedBy
                ) RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@svgPath"] = svgPath,
                    ["@createdAt"] = DateTime.Now,
                    ["@updatedAt"] = DateTime.Now,
                    ["@createdBy"] = 1,
                    ["@updatedBy"] = 1
                });
        }

        private async Task<CustomSvgIcon> GetCustomSvgIconById(int id)
        {
            var icons = DatabaseHelper.RunQueryList<CustomSvgIcon>(_schemaName, @"
                SELECT id, name, ""svgPath"" 
                FROM ""CustomSvgIcon""
                WHERE id = @Id",
                reader => new CustomSvgIcon
                {
                    id = reader.GetInt32(0),
                    name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    svgPath = reader.IsDBNull(2) ? null : reader.GetString(2),
                },
                new Dictionary<string, object> { ["@Id"] = id });

            return icons.FirstOrDefault();
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }
}