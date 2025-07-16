using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace WebApi.IntegrationTests.Helpers
{
    public class DatabaseHelper
    {
        private static readonly string _connectionString;
        
        static DatabaseHelper()
        {
            _connectionString = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .Build()
                .GetConnectionString("TestConnection");
        }
        
        /// <summary>
        /// Creates a new schema and initializes it with tables and test data
        /// </summary>
        /// <returns>The name of the created schema</returns>
        public static string CreateTestSchema()
        {
            var schemaName = $"test_{Guid.NewGuid().ToString("N").Substring(0, 10)}";
            
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                connection.Open();
                
                // Create schema
                ExecuteCommand(connection, $"CREATE SCHEMA {schemaName};");
                
                // Set search path to new schema
                ExecuteCommand(connection, $"SET search_path TO {schemaName}, public;");
                
                // Run creation script
                ExecuteScript(connection, "CreateTables.sql");
                
                // Run seed script
                ExecuteScript(connection, "SeedData.sql");
                
                return schemaName;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating test schema: {ex.Message}");
                // Try to clean up if schema was created but setup failed
                try
                {
                    DropTestSchema(schemaName);
                }
                catch
                {
                    // Ignore cleanup errors
                }
                throw;
            }
        }
        
        /// <summary>
        /// Drops a test schema
        /// </summary>
        public static void DropTestSchema(string schemaName)
        {
            if (string.IsNullOrEmpty(schemaName))
                return;
                
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();
            
            ExecuteCommand(connection, $"DROP SCHEMA IF EXISTS {schemaName} CASCADE;");
        }
        
        /// <summary>
        /// Executes a SQL command on the given connection
        /// </summary>
        private static void ExecuteCommand(NpgsqlConnection connection, string sql)
        {
            using var command = new NpgsqlCommand(sql, connection);
            command.ExecuteNonQuery();
        }

        /// <summary>
        /// Executes a SQL script file on the given connection
        /// </summary>
        private static void ExecuteScript(NpgsqlConnection connection, string scriptName)
        {
            var scriptPath = Path.Combine(Directory.GetCurrentDirectory(), "Scripts", scriptName);
            var script = File.ReadAllText(scriptPath);

            Console.WriteLine($"Executing script: {scriptName}");

            using var command = new NpgsqlCommand(script, connection);

            // Increase command timeout to 5 minutes (or adjust as needed)
            command.CommandTimeout = 300;

            try
            {
                command.ExecuteNonQuery();
                Console.WriteLine("Script executed successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error executing script: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Runs a query and returns the first column of the first row
        /// </summary>
        public static T RunQuery<T>(string schemaName, string sql, Dictionary<string, object> parameters = null)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();
            
            // Set search path to test schema
            ExecuteCommand(connection, $"SET search_path TO {schemaName}, public;");
            
            using var command = new NpgsqlCommand(sql, connection);
            
            if (parameters != null)
            {
                foreach (var param in parameters)
                {
                    command.Parameters.AddWithValue(param.Key, param.Value ?? DBNull.Value);
                }
            }
            
            var result = command.ExecuteScalar();
            
            if (result == null || result == DBNull.Value)
                return default;
                
            return (T)Convert.ChangeType(result, typeof(T));
        }
        
        /// <summary>
        /// Runs a query and maps the results to a list of objects
        /// </summary>
        public static List<T> RunQueryList<T>(string schemaName, string sql, Func<IDataReader, T> mapper, Dictionary<string, object> parameters = null)
        {
            var results = new List<T>();
            
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();
            
            // Set search path to test schema
            ExecuteCommand(connection, $"SET search_path TO {schemaName}, public;");
            
            using var command = new NpgsqlCommand(sql, connection);
            
            if (parameters != null)
            {
                foreach (var param in parameters)
                {
                    command.Parameters.AddWithValue(param.Key, param.Value ?? DBNull.Value);
                }
            }
            
            using var reader = command.ExecuteReader();
            
            while (reader.Read())
            {
                results.Add(mapper(reader));
            }
            
            return results;
        }
        
        /// <summary>
        /// Gets a connection string with the specified schema set as search path
        /// </summary>
        public static string GetConnectionStringWithSchema(string schemaName)
        {
            var builder = new NpgsqlConnectionStringBuilder(_connectionString)
            {
                SearchPath = $"{schemaName}, public"
            };
            
            return builder.ConnectionString;
        }
    }
}