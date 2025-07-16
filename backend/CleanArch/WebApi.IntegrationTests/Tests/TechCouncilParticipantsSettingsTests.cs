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
    public class TechCouncilParticipantsSettingsTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public TechCouncilParticipantsSettingsTests()
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
            var structureId1 = CreateOrgStructure("Structure 1", true);
            var structureId2 = CreateOrgStructure("Structure 2", true);
            var serviceId1 = CreateService("Service 1");
            var serviceId2 = CreateService("Service 2");

            CreateTechCouncilParticipantsSetting(structureId1, serviceId1, true);
            CreateTechCouncilParticipantsSetting(structureId2, serviceId2, false);

            // Act
            var response = await _client.GetAsync("/TechCouncilParticipantsSettings/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<TechCouncilParticipantsSettings>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            // Check structure names are included
            Assert.Contains(result, s => s.structure_id == structureId1 && s.structure_name == "Structure 1");
            Assert.Contains(result, s => s.structure_id == structureId2 && s.structure_name == "Structure 2");
        }

        [Fact]
        public async Task GetByServiceId_ReturnsOkResponse()
        {
            // Arrange
            var structureId1 = CreateOrgStructure("Service Structure 1", true);
            var structureId2 = CreateOrgStructure("Service Structure 2", true);
            var serviceId = CreateService("Shared Service");
            var otherServiceId = CreateService("Other Service");

            CreateTechCouncilParticipantsSetting(structureId1, serviceId, true);
            CreateTechCouncilParticipantsSetting(structureId2, serviceId, false);
            CreateTechCouncilParticipantsSetting(structureId1, otherServiceId, true); // Should not be returned

            // Act
            var response = await _client.GetAsync($"/TechCouncilParticipantsSettings/GetByServiceId?service_id={serviceId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<TechCouncilParticipantsSettings>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, s => Assert.Equal(serviceId, s.service_id));
            Assert.Contains(result, s => s.structure_id == structureId1 && s.is_active);
            Assert.Contains(result, s => s.structure_id == structureId2 && !s.is_active);
        }

        [Fact]
        public async Task GetActiveParticipantsByServiceId_ReturnsOkResponse()
        {
            // Arrange
            var structureId1 = CreateOrgStructure("Active Structure", true);
            var structureId2 = CreateOrgStructure("Inactive Structure", true);
            var serviceId = CreateService("Test Service");

            CreateTechCouncilParticipantsSetting(structureId1, serviceId, true); // Active
            CreateTechCouncilParticipantsSetting(structureId2, serviceId, false); // Inactive

            // Act
            var response = await _client.GetAsync($"/TechCouncilParticipantsSettings/GetActiveParticipantsByServiceId?service_id={serviceId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<TechCouncilParticipantsSettings>>(content);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(structureId1, result[0].structure_id);
            Assert.Equal(serviceId, result[0].service_id);
            Assert.True(result[0].is_active);
        }

        [Fact]
        public async Task GetOneById_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Single Structure", true);
            var serviceId = CreateService("Single Service");
            var id = CreateTechCouncilParticipantsSetting(structureId, serviceId, true);

            // Act
            var response = await _client.GetAsync($"/TechCouncilParticipantsSettings/GetOneById?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<TechCouncilParticipantsSettings>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(serviceId, result.service_id);
            Assert.True(result.is_active);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("New Structure", true);
            var serviceId = CreateService("New Service");

            var request = new CreateTechCouncilParticipantsSettingsRequest
            {
                structure_id = structureId,
                service_id = serviceId,
                is_active = true
            };

            // Act
            var response = await _client.PostAsJsonAsync("/TechCouncilParticipantsSettings/Create", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<TechCouncilParticipantsSettings>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(serviceId, result.service_id);
            Assert.True(result.is_active);

            // Verify in database
            var setting = DatabaseHelper.RunQueryList<TechCouncilParticipantsSettings>(_schemaName, @"
                SELECT id, structure_id, service_id, is_active FROM tech_council_participants_settings WHERE id = @id",
                reader => new TechCouncilParticipantsSettings
                {
                    id = reader.GetInt32(0),
                    structure_id = reader.GetInt32(1),
                    service_id = reader.GetInt32(2),
                    is_active = reader.GetBoolean(3)
                },
                new Dictionary<string, object> { ["@id"] = result.id }
            ).FirstOrDefault();

            Assert.NotNull(setting);
            Assert.Equal(result.id, setting.id);
            Assert.Equal(structureId, setting.structure_id);
            Assert.Equal(serviceId, setting.service_id);
            Assert.True(setting.is_active);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var originalStructureId = CreateOrgStructure("Original Structure", true);
            var originalServiceId = CreateService("Original Service");
            var id = CreateTechCouncilParticipantsSetting(originalStructureId, originalServiceId, true);

            var newStructureId = CreateOrgStructure("New Structure", true);
            var newServiceId = CreateService("New Service");

            var request = new UpdateTechCouncilParticipantsSettingsRequest
            {
                id = id,
                structure_id = newStructureId,
                service_id = newServiceId,
                is_active = false
            };

            // Act
            var response = await _client.PutAsync("/TechCouncilParticipantsSettings/Update", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<TechCouncilParticipantsSettings>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(newStructureId, result.structure_id);
            Assert.Equal(newServiceId, result.service_id);
            Assert.False(result.is_active);

            // Verify in database
            var setting = DatabaseHelper.RunQueryList<TechCouncilParticipantsSettings>(_schemaName, @"
                SELECT structure_id, service_id, is_active FROM tech_council_participants_settings WHERE id = @id",
                reader => new TechCouncilParticipantsSettings
                {
                    structure_id = reader.GetInt32(0),
                    service_id = reader.GetInt32(1),
                    is_active = reader.GetBoolean(2)
                },
                new Dictionary<string, object> { ["@id"] = id }
            ).FirstOrDefault();

            Assert.NotNull(setting);
            Assert.Equal(newStructureId, setting.structure_id);
            Assert.Equal(newServiceId, setting.service_id);
            Assert.False(setting.is_active);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var structureId = CreateOrgStructure("Delete Structure", true);
            var serviceId = CreateService("Delete Service");
            var id = CreateTechCouncilParticipantsSetting(structureId, serviceId, true);

            // Act
            var response = await _client.DeleteAsync($"/TechCouncilParticipantsSettings/Delete?id={id}");

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM tech_council_participants_settings WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create multiple settings
            var structureId = CreateOrgStructure("Paginated Structure", true);
            var serviceId = CreateService("Paginated Service");

            for (int i = 1; i <= 5; i++)
            {
                CreateTechCouncilParticipantsSetting(structureId, serviceId, i % 2 == 0);
            }

            // Act
            var response = await _client.GetAsync("/TechCouncilParticipantsSettings/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<TechCouncilParticipantsSettings>>(content);

            Assert.NotNull(result);
            Assert.Equal(3, result.items.Count);
            Assert.Equal(5, result.totalCount);
            Assert.Equal(1, result.pageNumber);
            Assert.Equal(2, result.totalPages);
        }

        // Helper methods to create test data
        private int CreateOrgStructure(string name, bool isActive)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, is_active, date_start, created_at, updated_at) 
                VALUES (@name, @is_active, @date_start, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@is_active"] = isActive,
                    ["@date_start"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateService(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO service (name, created_at, updated_at) 
                VALUES (@name, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateTechCouncilParticipantsSetting(int structureId, int serviceId, bool isActive)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO tech_council_participants_settings (structure_id, service_id, is_active, created_at, updated_at) 
                VALUES (@structure_id, @service_id, @is_active, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@structure_id"] = structureId,
                    ["@service_id"] = serviceId,
                    ["@is_active"] = isActive,
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