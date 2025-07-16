using System;
using WebApi.IntegrationTests.Helpers;
using Xunit;

namespace WebApi.IntegrationTests.Fixtures
{
    // Collection definition for sequential test execution
    [CollectionDefinition("Database collection")]
    public class DatabaseCollection : ICollectionFixture<DatabaseFixture>
    {
    }
    
    public class DatabaseFixture : IDisposable
    {
        // This could contain shared resources needed across all tests
        
        public DatabaseFixture()
        {
            // This runs once before any tests in the collection
            // You could put global setup here if needed
        }
        
        public void Dispose()
        {
            // This runs once after all tests in the collection
            // Any global cleanup could go here
        }
    }
}