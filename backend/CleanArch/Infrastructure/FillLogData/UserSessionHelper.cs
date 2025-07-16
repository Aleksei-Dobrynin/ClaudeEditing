using Application.Repositories;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FillLogData
{
    public static class UserSessionHelper
    {
        public static async Task<int> SetCurrentUserAsync(
        IUserRepository userRepository,
        IDbConnection dbConnection,
        IDbTransaction dbTransaction)
        {
            string databaseType = GetDatabaseType(dbConnection);
            
            var userId = await userRepository.GetUserID();
            
            if (databaseType == "PostgreSQL")
            {
                var setUserQuery = $"SET LOCAL \"bga.current_user\" TO '{userId}'";
                dbConnection.Execute(setUserQuery, transaction: dbTransaction);
            }

            return userId;
        }
        
        private static string GetDatabaseType(IDbConnection dbConnection)
        {
            var connectionType = dbConnection.GetType().Name;

            if (connectionType.Contains("Npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return "PostgreSQL";
            }
            return $"Unknown";
        }

    }
}



