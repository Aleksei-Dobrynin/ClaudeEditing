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
    public class legal_act_objectRepository : Ilegal_act_objectRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public legal_act_objectRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<legal_act_object>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_act_object""";
                var models = await _dbConnection.QueryAsync<legal_act_object>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_object", ex);
            }
        }

        public async Task<int> Add(legal_act_object domain)
        {
            try
            {
                var model = new legal_act_objectModel
                {
                    
                    id = domain.id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    id_act = domain.id_act,
                    id_object = domain.id_object,
                };
                var sql = @"INSERT INTO ""legal_act_object""(""created_at"", ""updated_at"", ""created_by"", ""updated_by"", ""id_act"", ""id_object"") 
                VALUES (@created_at, @updated_at, @created_by, @updated_by, @id_act, @id_object) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add legal_act_object", ex);
            }
        }

        public async Task Update(legal_act_object domain)
        {
            try
            {
                var model = new legal_act_objectModel
                {
                    
                    id = domain.id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    id_act = domain.id_act,
                    id_object = domain.id_object,
                };
                var sql = @"UPDATE ""legal_act_object"" SET ""id"" = @id, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""id_act"" = @id_act, ""id_object"" = @id_object WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_act_object", ex);
            }
        }

        public async Task<PaginatedList<legal_act_object>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_act_object"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<legal_act_object>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""legal_act_object""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<legal_act_object>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_objects", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""legal_act_object"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_act_object", ex);
            }
        }
        public async Task<legal_act_object> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_act_object"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<legal_act_object>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_object", ex);
            }
        }

        
        public async Task<List<legal_act_object>> GetByid_act(int id_act)
        {
            try
            {
                var sql = "SELECT * FROM \"legal_act_object\" WHERE \"id_act\" = @id_act";
                var models = await _dbConnection.QueryAsync<legal_act_object>(sql, new { id_act }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_object", ex);
            }
        }
        
        public async Task<List<legal_act_object>> GetByid_object(int id_object)
        {
            try
            {
                var sql = "SELECT * FROM \"legal_act_object\" WHERE \"id_object\" = @id_object";
                var models = await _dbConnection.QueryAsync<legal_act_object>(sql, new { id_object }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_object", ex);
            }
        }

    }
}
