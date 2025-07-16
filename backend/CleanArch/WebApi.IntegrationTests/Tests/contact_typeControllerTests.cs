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
    public class contact_typeControllerTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public contact_typeControllerTests()
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
            // Arrange - Create test contact types
            CreateContactType("SMS", "sms", "SMS description", "Additional SMS info");
            CreateContactType("Email", "email", "Email description", "Additional Email info");
            CreateContactType("Phone", "phone", "Phone description", "Additional Phone info");

            // Act
            var response = await _client.GetAsync("/contact_type/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<contact_type>>(content);

            Assert.NotNull(result);
            Assert.Contains(result, c => c.name == "SMS" && c.code == "sms");
            Assert.Contains(result, c => c.name == "Email" && c.code == "email");
            Assert.Contains(result, c => c.name == "Phone" && c.code == "phone");
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test contact type
            var id = CreateContactType("Telegram", "telegram", "Telegram description", "Additional Telegram info");

            // Act
            var response = await _client.GetAsync($"/contact_type/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<contact_type>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Telegram", result.name);
            Assert.Equal("telegram", result.code);
            Assert.Equal("Telegram description", result.description);
            Assert.Equal("Additional Telegram info", result.additional);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var request = new Createcontact_typeRequest
            {
                name = "WhatsApp",
                code = "whatsapp",
                description = "WhatsApp messaging",
                additional = "Additional WhatsApp info"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/contact_type", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<contact_type>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal("WhatsApp", result.name);
            Assert.Equal("whatsapp", result.code);
            Assert.Equal("WhatsApp messaging", result.description);
            Assert.Equal("Additional WhatsApp info", result.additional);

            // Verify in database
            var contactType = DatabaseHelper.RunQueryList<contact_type>(_schemaName, @"
                SELECT id, name, code, description, additional 
                FROM contact_type WHERE id = @id",
                reader => new contact_type
                {
                    id = reader.GetInt32(0),
                    name = reader.GetString(1),
                    code = reader.GetString(2),
                    description = reader.IsDBNull(3) ? null : reader.GetString(3),
                    additional = reader.IsDBNull(4) ? null : reader.GetString(4)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(contactType);
            Assert.Equal(result.id, contactType.id);
            Assert.Equal("WhatsApp", contactType.name);
            Assert.Equal("whatsapp", contactType.code);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateContactType("Original Type", "originaltype", "Original Description", "Original Additional");

            var request = new Updatecontact_typeRequest
            {
                id = id,
                name = "Updated Type",
                code = "updatedtype",
                description = "Updated Description",
                additional = "Updated Additional"
            };

            // Act
            var response = await _client.PutAsync($"/contact_type/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<contact_type>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal("Updated Type", result.name);
            Assert.Equal("updatedtype", result.code);
            Assert.Equal("Updated Description", result.description);
            Assert.Equal("Updated Additional", result.additional);

            // Verify in database
            var contactType = DatabaseHelper.RunQueryList<contact_type>(_schemaName, @"
                SELECT name, code, description, additional 
                FROM contact_type WHERE id = @id",
                reader => new contact_type
                {
                    name = reader.GetString(0),
                    code = reader.GetString(1),
                    description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    additional = reader.IsDBNull(3) ? null : reader.GetString(3)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(contactType);
            Assert.Equal("Updated Type", contactType.name);
            Assert.Equal("updatedtype", contactType.code);
            Assert.Equal("Updated Description", contactType.description);
            Assert.Equal("Updated Additional", contactType.additional);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var id = CreateContactType("Type to Delete", "typetodelete", "Delete Description", "Delete Additional");

            // Act
            var response = await _client.DeleteAsync($"/contact_type/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            int deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM contact_type WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test contact types
            for (int i = 1; i <= 5; i++)
            {
                CreateContactType($"Type {i}", $"type{i}", $"Description {i}", $"Additional {i}");
            }

            // Act
            var response = await _client.GetAsync("/contact_type/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<contact_type>>(content);

            JObject jObject = JObject.Parse(content);

            int pageNumber = jObject["pageNumber"]?.Value<int>() ?? 0;
            int totalPages = jObject["totalPages"]?.Value<int>() ?? 0;
            int totalCount = jObject["totalCount"]?.Value<int>() ?? 0;

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(1, pageNumber);
        }

        [Fact]
        public async Task GetPaginated_WithInvalidParams_HandlesGracefully()
        {
            // Arrange - Create some contact types
            for (int i = 1; i <= 3; i++)
            {
                CreateContactType($"Type {i}", $"type{i}", $"Description {i}", $"Additional {i}");
            }

            // Act
            var response = await _client.GetAsync("/contact_type/GetPaginated?pageSize=0&pageNumber=0");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<contact_type>>(content);

            // According to the UseCases, if pageSize < 1, it should set to 1, same for pageNumber
            Assert.NotNull(result);
            Assert.NotEmpty(result.items);
        }

        // Helper methods to create test data
        private int CreateContactType(string name, string code, string description, string additional)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO contact_type (name, code, description, additional, created_at, updated_at) 
                VALUES (@name, @code, @description, @additional, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@description"] = description,
                    ["@additional"] = additional,
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