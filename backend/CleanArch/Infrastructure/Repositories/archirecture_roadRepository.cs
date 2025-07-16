using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;

namespace Infrastructure.Repositories
{
    public class archirecture_roadRepository : Iarchirecture_roadRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public archirecture_roadRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<archirecture_road>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""archirecture_road""";
                var models = await _dbConnection.QueryAsync<archirecture_road>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archirecture_road", ex);
            }
        }

        public async Task<int> Add(archirecture_road domain)
        {
            try
            {
                var model = new archirecture_roadModel
                {
                    
                    id = domain.id,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    rule_expression = domain.rule_expression,
                    description = domain.description,
                    validation_url = domain.validation_url,
                    post_function_url = domain.post_function_url,
                    is_active = domain.is_active,
                    from_status_id = domain.from_status_id,
                    to_status_id = domain.to_status_id,
                    created_at = domain.created_at,
                };
                var sql = @"INSERT INTO ""archirecture_road""(""updated_at"", ""created_by"", ""updated_by"", ""rule_expression"", ""description"", ""validation_url"", ""post_function_url"", ""is_active"", ""from_status_id"", ""to_status_id"", ""created_at"") 
                VALUES (@updated_at, @created_by, @updated_by, @rule_expression, @description, @validation_url, @post_function_url, @is_active, @from_status_id, @to_status_id, @created_at) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add archirecture_road", ex);
            }
        }

        public async Task Update(archirecture_road domain)
        {
            try
            {
                var model = new archirecture_roadModel
                {
                    
                    id = domain.id,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    rule_expression = domain.rule_expression,
                    description = domain.description,
                    validation_url = domain.validation_url,
                    post_function_url = domain.post_function_url,
                    is_active = domain.is_active,
                    from_status_id = domain.from_status_id,
                    to_status_id = domain.to_status_id,
                    created_at = domain.created_at,
                };
                var sql = @"UPDATE ""archirecture_road"" SET ""id"" = @id, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""rule_expression"" = @rule_expression, ""description"" = @description, ""validation_url"" = @validation_url, ""post_function_url"" = @post_function_url, ""is_active"" = @is_active, ""from_status_id"" = @from_status_id, ""to_status_id"" = @to_status_id, ""created_at"" = @created_at WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update archirecture_road", ex);
            }
        }

        public async Task<PaginatedList<archirecture_road>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""archirecture_road"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<archirecture_road>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""archirecture_road""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<archirecture_road>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archirecture_roads", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""archirecture_road"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update archirecture_road", ex);
            }
        }
        public async Task<archirecture_road> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""archirecture_road"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<archirecture_road>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archirecture_road", ex);
            }
        }

        
        public async Task<List<archirecture_road>> GetByfrom_status_id(int from_status_id)
        {
            try
            {
                var sql = "SELECT * FROM \"archirecture_road\" WHERE \"from_status_id\" = @from_status_id";
                var models = await _dbConnection.QueryAsync<archirecture_road>(sql, new { from_status_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archirecture_road", ex);
            }
        }
        
        public async Task<List<archirecture_road>> GetByto_status_id(int to_status_id)
        {
            try
            {
                var sql = "SELECT * FROM \"archirecture_road\" WHERE \"to_status_id\" = @to_status_id";
                var models = await _dbConnection.QueryAsync<archirecture_road>(sql, new { to_status_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archirecture_road", ex);
            }
        }
        
    }
}
