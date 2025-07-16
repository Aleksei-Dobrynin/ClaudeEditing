using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class QueryFiltersRepository : IQueryFiltersRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public QueryFiltersRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<QueryFilters>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, name_kg, code, description, target_table, query, created_at, updated_at, created_by, updated_by FROM query_filters";
                var models = await _dbConnection.QueryAsync<QueryFilters>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get QueryFilters", ex);
            }
        }
        
        public async Task<List<QueryFilters>> GetByTargetTable(string targetTable)
        {
            try
            {
                var sql = "SELECT id, name, name_kg, code, description, target_table, query, created_at, updated_at, created_by, updated_by FROM query_filters where target_table = @table ";
                var models = await _dbConnection.QueryAsync<QueryFilters>(sql, new { table = targetTable }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get QueryFilters", ex);
            }
        }

        public async Task<QueryFilters> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, name_kg, code, description, target_table, query, created_at, updated_at, created_by, updated_by FROM query_filters WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<QueryFilters>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"QueryFilters with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get QueryFilters", ex);
            }
        }        
        
        public async Task<string> GetSqlByCode(string target_table, string code)
        {
            try
            {
                var sql = @"SELECT query
                            FROM query_filters WHERE target_table=@table and code=@code";
                var query = await _dbConnection.QuerySingleOrDefaultAsync<string>(sql, new { table = target_table, code = code }, transaction: _dbTransaction);

                if (query == null)
                {
                    throw new RepositoryException($"QueryFilters not found.", null);
                }

                return query;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get QueryFilters", ex);
            }
        }

        public async Task<int> Add(QueryFilters domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO query_filters (name, name_kg, code, description, target_table, query, created_at, updated_at, created_by, updated_by) 
                            VALUES (@name, @name_kg, @code, @description, @target_table, @query, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add QueryFilters", ex);
            }
        }

        public async Task Update(QueryFilters domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE query_filters SET name = @name, name_kg = @name_kg, code = @code, description = @description, target_table = @target_table, query = @query, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update QueryFilters", ex);
            }
        }

        public async Task<PaginatedList<QueryFilters>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM query_filters OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<QueryFilters>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM query_filters";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<QueryFilters>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get QueryFilters", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM query_filters WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("QueryFilters not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete QueryFilters", ex);
            }
        }
    }
}
