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
    public class service_pathRepository : Iservice_pathRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public service_pathRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<service_path>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""service_path""";
                var models = await _dbConnection.QueryAsync<service_path>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get service_path", ex);
            }
        }

        public async Task<int> Add(service_path domain)
        {
            try
            {
                var model = new service_pathModel
                {
                    
                    id = domain.id,
                    updated_by = domain.updated_by,
                    service_id = domain.service_id,
                    name = domain.name,
                    description = domain.description,
                    is_default = domain.is_default,
                    is_active = domain.is_active,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                };
                var sql = @"INSERT INTO ""service_path""(""updated_by"", ""service_id"", ""name"", ""description"", ""is_default"", ""is_active"", ""created_at"", ""updated_at"", ""created_by"") 
                VALUES (@updated_by, @service_id, @name, @description, @is_default, @is_active, @created_at, @updated_at, @created_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add service_path", ex);
            }
        }

        public async Task Update(service_path domain)
        {
            try
            {
                var model = new service_pathModel
                {
                    
                    id = domain.id,
                    updated_by = domain.updated_by,
                    service_id = domain.service_id,
                    name = domain.name,
                    description = domain.description,
                    is_default = domain.is_default,
                    is_active = domain.is_active,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                };
                var sql = @"UPDATE ""service_path"" SET ""id"" = @id, ""updated_by"" = @updated_by, ""service_id"" = @service_id, ""name"" = @name, ""description"" = @description, ""is_default"" = @is_default, ""is_active"" = @is_active, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update service_path", ex);
            }
        }

        public async Task<PaginatedList<service_path>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""service_path"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<service_path>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""service_path""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<service_path>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get service_paths", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""service_path"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update service_path", ex);
            }
        }
        public async Task<service_path> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""service_path"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<service_path>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get service_path", ex);
            }
        }

        
        public async Task<List<service_path>> GetByservice_id(int service_id)
        {
            try
            {
                var sql = "SELECT * FROM \"service_path\" WHERE \"service_id\" = @service_id";
                var models = await _dbConnection.QueryAsync<service_path>(sql, new { service_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get service_path", ex);
            }
        }
        
    }
}
