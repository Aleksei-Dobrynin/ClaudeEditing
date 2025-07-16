using Application.Exceptions;
using Application.Repositories;
using Dapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class CountryRepository : ICountryRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public CountryRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<Country>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"country\"";
                var models = await _dbConnection.QueryAsync<Country>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get country", ex);
            }
        }

        public async Task<Country> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"country\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<Country>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get country", ex);
            }
        }
    }
}
