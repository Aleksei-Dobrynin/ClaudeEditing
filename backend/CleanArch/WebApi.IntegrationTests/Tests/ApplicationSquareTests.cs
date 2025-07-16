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
    public class ApplicationSquareTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationSquareTests()
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
            // Arrange - Create test application_squares
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();
            var unitTypeId = GetUnitTypeId();

            CreateApplicationSquare(applicationId, structureId, unitTypeId, 100.5);
            CreateApplicationSquare(applicationId, structureId, unitTypeId, 200.75);

            // Act
            var response = await _client.GetAsync("/application_square/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_square>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test application_square
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();
            var unitTypeId = GetUnitTypeId();

            var id = CreateApplicationSquare(applicationId, structureId, unitTypeId, 123.45);

            // Act
            var response = await _client.GetAsync($"/application_square/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_square>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(unitTypeId, result.unit_type_id);
            Assert.Equal(123.45, result.value);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();
            var unitTypeId = GetUnitTypeId();

            var request = new Createapplication_squareRequest
            {
                application_id = applicationId,
                structure_id = structureId,
                unit_type_id = unitTypeId,
                value = 150.25
            };

            // Act
            var response = await _client.PostAsJsonAsync("/application_square", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_square>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(unitTypeId, result.unit_type_id);
            Assert.Equal(150.25, result.value);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();
            var unitTypeId = GetUnitTypeId();

            var id = CreateApplicationSquare(applicationId, structureId, unitTypeId, 100.0);

            var request = new Updateapplication_squareRequest
            {
                id = id,
                application_id = applicationId,
                structure_id = structureId,
                unit_type_id = unitTypeId,
                value = 200.50
            };

            // Act
            var response = await _client.PutAsync($"/application_square/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_square>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(applicationId, result.application_id);
            Assert.Equal(structureId, result.structure_id);
            Assert.Equal(unitTypeId, result.unit_type_id);
            Assert.Equal(200.50, result.value);

            // Verify in database
            var updatedValue = DatabaseHelper.RunQuery<double>(_schemaName, @"
                SELECT value FROM application_square WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(200.50, updatedValue);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();
            var unitTypeId = GetUnitTypeId();

            var id = CreateApplicationSquare(applicationId, structureId, unitTypeId, 100.0);

            // Act
            var response = await _client.DeleteAsync($"/application_square/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_square WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test application_squares
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();
            var unitTypeId = GetUnitTypeId();

            for (int i = 0; i < 5; i++)
            {
                CreateApplicationSquare(applicationId, structureId, unitTypeId, 100.00 + i);
            }

            // Act
            var response = await _client.GetAsync("/application_square/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<application_square>>(content);

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
        public async Task GetByapplication_id_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var otherApplicationId = CreateTestApplication();
            var structureId = CreateTestStructure();
            var unitTypeId = GetUnitTypeId();

            CreateApplicationSquare(applicationId, structureId, unitTypeId, 100.0);
            CreateApplicationSquare(applicationId, structureId, unitTypeId, 200.0);
            CreateApplicationSquare(otherApplicationId, structureId, unitTypeId, 300.0);

            // Act
            var response = await _client.GetAsync($"/application_square/GetByapplication_id?application_id={applicationId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_square>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(applicationId, item.application_id));
        }

        [Fact]
        public async Task GetBystructure_id_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();
            var otherStructureId = CreateTestStructure();
            var unitTypeId = GetUnitTypeId();

            CreateApplicationSquare(applicationId, structureId, unitTypeId, 100.0);
            CreateApplicationSquare(applicationId, structureId, unitTypeId, 200.0);
            CreateApplicationSquare(applicationId, otherStructureId, unitTypeId, 300.0);

            // Act
            var response = await _client.GetAsync($"/application_square/GetBystructure_id?structure_id={structureId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_square>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(structureId, item.structure_id));
        }

        [Fact]
        public async Task GetByunit_type_id_ReturnsOkResponse()
        {
            // Arrange
            var applicationId = CreateTestApplication();
            var structureId = CreateTestStructure();
            var unitTypeId = GetUnitTypeId();
            var otherUnitTypeId = GetOrCreateUnitTypeId("ga", "Land Area");

            CreateApplicationSquare(applicationId, structureId, unitTypeId, 100.0);
            CreateApplicationSquare(applicationId, structureId, unitTypeId, 200.0);
            CreateApplicationSquare(applicationId, structureId, otherUnitTypeId, 300.0);

            // Act
            var response = await _client.GetAsync($"/application_square/GetByunit_type_id?unit_type_id={unitTypeId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_square>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(unitTypeId, item.unit_type_id));
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

        private int CreateTestStructure()
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO org_structure (name, is_active, date_start) 
                VALUES (@name, true, @date_start) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = $"Test Structure {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@date_start"] = DateTime.Now
                });
        }

        private int GetUnitTypeId()
        {
            // Исправление: сначала создаем запрос, чтобы проверить наличие записей
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM unit_type WHERE code = 'kvmetr';");

            if (count > 0)
            {
                // Получаем существующий ID
                return DatabaseHelper.RunQuery<int>(_schemaName, @"
                    SELECT id FROM unit_type WHERE code = 'kvmetr' LIMIT 1;");
            }

            // Если нет записей, создаем новую
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO unit_type (name, code, type, created_at) 
                VALUES ('кв.м', 'kvmetr', 'square', @created_at) 
                RETURNING id;",
                new Dictionary<string, object> { ["@created_at"] = DateTime.Now });
        }

        private int GetOrCreateUnitTypeId(string code, string name)
        {
            // Исправление: проверяем наличие записи
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM unit_type WHERE code = @code;",
                new Dictionary<string, object> { ["@code"] = code });

            if (count > 0)
            {
                // Получаем существующий ID
                return DatabaseHelper.RunQuery<int>(_schemaName, @"
                    SELECT id FROM unit_type WHERE code = @code LIMIT 1;",
                    new Dictionary<string, object> { ["@code"] = code });
            }

            // Создаем новую запись
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO unit_type (name, code, type, created_at) 
                VALUES (@name, @code, 'square', @created_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@created_at"] = DateTime.Now
                });
        }

        private int CreateApplicationSquare(int applicationId, int structureId, int unitTypeId, double value)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_square (application_id, structure_id, unit_type_id, value, created_at) 
                VALUES (@application_id, @structure_id, @unit_type_id, @value, @created_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@application_id"] = applicationId,
                    ["@structure_id"] = structureId,
                    ["@unit_type_id"] = unitTypeId,
                    ["@value"] = value,
                    ["@created_at"] = DateTime.Now
                });
        }

        public void Dispose()
        {
            // Clean up after this test
            DatabaseHelper.DropTestSchema(_schemaName);
        }
    }

    // Классы для запросов - добавлены для удобства
    public class Createapplication_squareRequest
    {
        public int application_id { get; set; }
        public int structure_id { get; set; }
        public int unit_type_id { get; set; }
        public double value { get; set; }
    }

    public class Updateapplication_squareRequest
    {
        public int id { get; set; }
        public int application_id { get; set; }
        public int structure_id { get; set; }
        public int unit_type_id { get; set; }
        public double value { get; set; }
    }
}