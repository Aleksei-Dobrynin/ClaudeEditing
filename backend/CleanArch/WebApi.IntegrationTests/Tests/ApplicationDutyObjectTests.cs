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
    public class ApplicationDutyObjectTests : IDisposable
    {
        private readonly string _schemaName;
        private readonly HttpClient _client;

        public ApplicationDutyObjectTests()
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
            // Arrange - Create test application_duty_objects
            var architectureProcessId = CreateTestArchitectureProcess();
            var dutyplanObjectId = CreateTestDutyPlanObject();

            CreateApplicationDutyObject(architectureProcessId, dutyplanObjectId);
            CreateApplicationDutyObject(architectureProcessId, dutyplanObjectId);

            // Act
            var response = await _client.GetAsync("/application_duty_object/GetAll");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_duty_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetOne_ReturnsOkResponse()
        {
            // Arrange - Create test application_duty_object
            var architectureProcessId = CreateTestArchitectureProcess();
            var dutyplanObjectId = CreateTestDutyPlanObject();

            var id = CreateApplicationDutyObject(architectureProcessId, dutyplanObjectId);

            // Act
            var response = await _client.GetAsync($"/application_duty_object/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_duty_object>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(architectureProcessId, result.application_id);
            Assert.Equal(dutyplanObjectId, result.dutyplan_object_id);
        }

        [Fact]
        public async Task Create_ReturnsOkResponse()
        {
            // Arrange
            var architectureProcessId = CreateTestArchitectureProcess();
            var dutyplanObjectId = CreateTestDutyPlanObject();

            var request = new Createapplication_duty_objectRequest
            {
                application_id = architectureProcessId,
                dutyplan_object_id = dutyplanObjectId
            };

            // Act
            var response = await _client.PostAsJsonAsync("/application_duty_object", request);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_duty_object>(content);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.id);
            Assert.Equal(architectureProcessId, result.application_id);
            Assert.Equal(dutyplanObjectId, result.dutyplan_object_id);
        }

        [Fact]
        public async Task Update_ReturnsOkResponse()
        {
            // Arrange
            var architectureProcessId = CreateTestArchitectureProcess();
            var dutyplanObjectId = CreateTestDutyPlanObject();
            var newDutyplanObjectId = CreateTestDutyPlanObject();

            var id = CreateApplicationDutyObject(architectureProcessId, dutyplanObjectId);

            var request = new Updateapplication_duty_objectRequest
            {
                id = id,
                application_id = architectureProcessId,
                dutyplan_object_id = newDutyplanObjectId
            };

            // Act
            var response = await _client.PutAsync($"/application_duty_object/{id}", JsonContent.Create(request));

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<application_duty_object>(content);

            Assert.NotNull(result);
            Assert.Equal(id, result.id);
            Assert.Equal(architectureProcessId, result.application_id);
            Assert.Equal(newDutyplanObjectId, result.dutyplan_object_id);

            // Verify in database
            var updated = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT dutyplan_object_id FROM application_duty_object WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(newDutyplanObjectId, updated);
        }

        [Fact]
        public async Task Delete_ReturnsOkResponse()
        {
            // Arrange
            var architectureProcessId = CreateTestArchitectureProcess();
            var dutyplanObjectId = CreateTestDutyPlanObject();

            var id = CreateApplicationDutyObject(architectureProcessId, dutyplanObjectId);

            // Act
            var response = await _client.DeleteAsync($"/application_duty_object/{id}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            int deletedId = int.Parse(content);

            Assert.Equal(id, deletedId);

            // Verify in database
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) FROM application_duty_object WHERE id = @id",
                new Dictionary<string, object> { ["@id"] = id });

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResponse()
        {
            // Arrange - Create several test application_duty_objects
            var architectureProcessId = CreateTestArchitectureProcess();
            var dutyplanObjectId = CreateTestDutyPlanObject();

            for (int i = 0; i < 5; i++)
            {
                CreateApplicationDutyObject(architectureProcessId, dutyplanObjectId);
            }

            // Act
            var response = await _client.GetAsync("/application_duty_object/GetPaginated?pageSize=3&pageNumber=1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PaginatedResponse<application_duty_object>>(content);

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
        public async Task GetBydutyplan_object_id_ReturnsOkResponse()
        {
            // Arrange
            var architectureProcessId1 = CreateTestArchitectureProcess();
            var architectureProcessId2 = CreateTestArchitectureProcess();
            var dutyplanObjectId = CreateTestDutyPlanObject();
            var otherDutyplanObjectId = CreateTestDutyPlanObject();

            CreateApplicationDutyObject(architectureProcessId1, dutyplanObjectId);
            CreateApplicationDutyObject(architectureProcessId2, dutyplanObjectId);
            CreateApplicationDutyObject(architectureProcessId1, otherDutyplanObjectId);

            // Act
            var response = await _client.GetAsync($"/application_duty_object/GetBydutyplan_object_id?dutyplan_object_id={dutyplanObjectId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_duty_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(dutyplanObjectId, item.dutyplan_object_id));
        }

        [Fact]
        public async Task GetByapplication_id_ReturnsOkResponse()
        {
            // Arrange
            var architectureProcessId = CreateTestArchitectureProcess();
            var otherArchitectureProcessId = CreateTestArchitectureProcess();
            var dutyplanObjectId1 = CreateTestDutyPlanObject();
            var dutyplanObjectId2 = CreateTestDutyPlanObject();

            CreateApplicationDutyObject(architectureProcessId, dutyplanObjectId1);
            CreateApplicationDutyObject(architectureProcessId, dutyplanObjectId2);
            CreateApplicationDutyObject(otherArchitectureProcessId, dutyplanObjectId1);

            // Act
            var response = await _client.GetAsync($"/application_duty_object/GetByapplication_id?application_id={architectureProcessId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<application_duty_object>>(content);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, item => Assert.Equal(architectureProcessId, item.application_id));
        }

        // Helper methods to set up test data

        private int CreateTestArchitectureStatus()
        {
            // Create architecture_status table if it doesn't exist
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                CREATE TABLE IF NOT EXISTS architecture_status (
                    id SERIAL PRIMARY KEY,
                    name TEXT,
                    description TEXT,
                    code TEXT,
                    name_kg TEXT,
                    description_kg TEXT,
                    text_color TEXT,
                    background_color TEXT,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP,
                    created_by INTEGER,
                    updated_by INTEGER
                );
                
                -- Insert a default status if none exists
                INSERT INTO architecture_status (name, code, description)
                SELECT 'Active', 'active', 'Active architecture status'
                WHERE NOT EXISTS (SELECT 1 FROM architecture_status LIMIT 1);
            ");

            // Get or create a status
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT id FROM architecture_status LIMIT 1;");
        }

        private int CreateTestArchitectureProcess()
        {
            // Get architecture status
            var statusId = CreateTestArchitectureStatus();

            // Create architecture_process table if it doesn't exist
            DatabaseHelper.RunQuery<int>(_schemaName, @"
        CREATE TABLE IF NOT EXISTS architecture_process (
            id INTEGER NOT NULL PRIMARY KEY,
            status_id INTEGER,
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            created_by INTEGER,
            updated_by INTEGER
        );");

            // Check if index exists and create if not
            var indexExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT COUNT(*) FROM pg_indexes 
        WHERE indexname = 'idx_architecture_process_id';");

            if (indexExists == 0)
            {
                DatabaseHelper.RunQuery<int>(_schemaName, @"
            CREATE INDEX idx_architecture_process_id ON architecture_process (id);");
            }

            // Check if status index exists and create if not
            var statusIndexExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT COUNT(*) FROM pg_indexes 
        WHERE indexname = 'idx_architecture_process_status';");

            if (statusIndexExists == 0)
            {
                DatabaseHelper.RunQuery<int>(_schemaName, @"
            CREATE INDEX idx_architecture_process_status ON architecture_process (status_id);");
            }

            // Generate a unique ID for architecture_process
            var id = new Random().Next(1, 1000000);

            // Insert new architecture_process
            DatabaseHelper.RunQuery<int>(_schemaName, @"
        INSERT INTO architecture_process (id, status_id, created_at, updated_at) 
        VALUES (@id, @status_id, @created_at, @updated_at);",
                new Dictionary<string, object>
                {
                    ["@id"] = id,
                    ["@status_id"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });

            return id;
        }
        private int CreateTestDutyPlanObject()
        {
            // First, create the status_dutyplan_object table if it doesn't exist (since it's a foreign key)
            DatabaseHelper.RunQuery<int>(_schemaName, @"
        CREATE TABLE IF NOT EXISTS status_dutyplan_object (
            id SERIAL PRIMARY KEY,
            name TEXT,
            description TEXT,
            code TEXT,
            name_kg TEXT,
            description_kg TEXT,
            text_color TEXT,
            background_color TEXT,
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            created_by INTEGER,
            updated_by INTEGER
        );
        
        -- Insert a default status if none exists
        INSERT INTO status_dutyplan_object (name, code, description)
        SELECT 'Active', 'active', 'Active duty plan object'
        WHERE NOT EXISTS (SELECT 1 FROM status_dutyplan_object LIMIT 1);
    ");

            // Get the default status id
            var statusId = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT id FROM status_dutyplan_object LIMIT 1;");

            // Create dutyplan_object table if it doesn't exist
            DatabaseHelper.RunQuery<int>(_schemaName, @"
        CREATE TABLE IF NOT EXISTS dutyplan_object (
            id SERIAL PRIMARY KEY,
            doc_number VARCHAR,
            address VARCHAR,
            latitude DOUBLE PRECISION,
            longitude DOUBLE PRECISION,
            layer JSONB,
            customer TEXT,
            description TEXT,
            created_at TIMESTAMP,
            created_by INTEGER,
            updated_at TIMESTAMP,
            updated_by INTEGER,
            date_setplan TIMESTAMP,
            quantity_folder INTEGER,
            status_dutyplan_object_id INTEGER
        );");

            // Check if index exists and create if not
            var indexExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT COUNT(*) FROM pg_indexes 
        WHERE indexname = 'idx_dutyplan_object_id';");

            if (indexExists == 0)
            {
                DatabaseHelper.RunQuery<int>(_schemaName, @"
            CREATE INDEX idx_dutyplan_object_id ON dutyplan_object (id);");
            }

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
        INSERT INTO dutyplan_object (
            doc_number, 
            address, 
            latitude, 
            longitude, 
            layer, 
            customer, 
            description, 
            created_at,
            status_dutyplan_object_id
        ) 
        VALUES (
            @doc_number, 
            @address, 
            @latitude, 
            @longitude, 
            @layer::jsonb, 
            @customer, 
            @description, 
            @created_at,
            @status_dutyplan_object_id
        ) 
        RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@doc_number"] = $"DOC-{Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@address"] = $"Test Address {Guid.NewGuid().ToString().Substring(0, 8)}",
                    ["@latitude"] = 42.8746,
                    ["@longitude"] = 74.5698,
                    ["@layer"] = "{}",
                    ["@customer"] = "Test Customer",
                    ["@description"] = "Test Description",
                    ["@created_at"] = DateTime.Now,
                    ["@status_dutyplan_object_id"] = statusId
                });
        }
        private int CreateApplicationDutyObject(int architectureProcessId, int dutyplanObjectId)
        {
            // Create application_duty_object table if it doesn't exist
            DatabaseHelper.RunQuery<int>(_schemaName, @"
        CREATE TABLE IF NOT EXISTS application_duty_object (
            id SERIAL PRIMARY KEY,
            dutyplan_object_id INTEGER,
            application_id INTEGER,
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            created_by INTEGER,
            updated_by INTEGER
        );");

            // Check if app_id index exists and create if not
            var appIdIndexExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT COUNT(*) FROM pg_indexes 
        WHERE indexname = 'idx_application_duty_object_app_id';");

            if (appIdIndexExists == 0)
            {
                DatabaseHelper.RunQuery<int>(_schemaName, @"
            CREATE INDEX idx_application_duty_object_app_id ON application_duty_object (application_id);");
            }

            // Check if duty_object_id index exists and create if not
            var objIdIndexExists = DatabaseHelper.RunQuery<int>(_schemaName, @"
        SELECT COUNT(*) FROM pg_indexes 
        WHERE indexname = 'idx_application_duty_object_id';");

            if (objIdIndexExists == 0)
            {
                DatabaseHelper.RunQuery<int>(_schemaName, @"
            CREATE INDEX idx_application_duty_object_id ON application_duty_object (dutyplan_object_id);");
            }

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
        INSERT INTO application_duty_object (dutyplan_object_id, application_id, created_at) 
        VALUES (@dutyplan_object_id, @application_id, @created_at) 
        RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@dutyplan_object_id"] = dutyplanObjectId,
                    ["@application_id"] = architectureProcessId,
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