using System.Data;
using Microsoft.Extensions.Configuration;
using Npgsql;
using MySql.Data.MySqlClient;

namespace Infrastructure.Data
{
    public class MariaDbContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
    private MySqlConnection _dbConnection;

        public MariaDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("MariaDbConnection")!;
            Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
        }

        public IDbConnection CreateConnection()
        {
            _dbConnection = new MySqlConnection(_connectionString);
            return _dbConnection;
        }
        public bool CheckHasMariaDbConnection()
        {
            try
            {
                //_dbConnection.Open();
                return true;
            }
            catch
            {
                return false;
            }
            //var temp = _dbConnection.State.ToString();
            //if (_dbConnection.State == ConnectionState.Open && temp == "Open")
            //{
            //    return true;
            //}
            //else
            //{
            //    return false;
            //}
            //if (_connectionString == null)
            //    return false;
            //return true;
        }
    }
}
