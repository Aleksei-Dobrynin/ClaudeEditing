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
    public class legal_objectRepository : Ilegal_objectRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public legal_objectRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<legal_object>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM legal_object order by id desc";
                var models = await _dbConnection.QueryAsync<legal_object>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_object", ex);
            }
        }

        public async Task<int> Add(legal_object domain)
        {
            try
            {
                var model = new
                {
                    id = domain.id,
                    description = domain.description,
                    address = domain.address,
                    geojson = string.IsNullOrEmpty(domain.geojson) ? null : (object)domain.geojson,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };

                var sql = @"INSERT INTO ""legal_object""(""description"", ""address"", ""geojson"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                    VALUES (@description, @address, CAST(@geojson AS jsonb), @created_at, @updated_at, @created_by, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add legal_object", ex);
            }
        }

        public async Task Update(legal_object domain)
        {
            try
            {
                var model = new
                {
                    id = domain.id,
                    description = domain.description,
                    address = domain.address,
                    geojson = string.IsNullOrEmpty(domain.geojson) ? null : (object)domain.geojson,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };

                var sql = @"UPDATE ""legal_object"" 
                    SET ""description"" = @description, ""address"" = @address, ""geojson"" = CAST(@geojson AS jsonb), 
                        ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by 
                    WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_object", ex);
            }
        }

        public async Task<PaginatedList<legal_object>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_object"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<legal_object>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""legal_object""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<legal_object>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_objects", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""legal_object"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_object", ex);
            }
        }
        public async Task<legal_object> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_object"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<legal_object>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_object", ex);
            }
        }

        
    }
}
