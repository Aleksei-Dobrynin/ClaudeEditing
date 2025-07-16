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
    public class legal_record_objectRepository : Ilegal_record_objectRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public legal_record_objectRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<legal_record_object>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_record_object""";
                var models = await _dbConnection.QueryAsync<legal_record_object>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_record_object", ex);
            }
        }

        public async Task<int> Add(legal_record_object domain)
        {
            try
            {
                var model = new legal_record_objectModel
                {
                    
                    id = domain.id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    id_record = domain.id_record,
                    id_object = domain.id_object,
                };
                var sql = @"INSERT INTO ""legal_record_object""(""created_at"", ""updated_at"", ""created_by"", ""updated_by"", ""id_record"", ""id_object"") 
                VALUES (@created_at, @updated_at, @created_by, @updated_by, @id_record, @id_object) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add legal_record_object", ex);
            }
        }

        public async Task Update(legal_record_object domain)
        {
            try
            {
                var model = new legal_record_objectModel
                {
                    
                    id = domain.id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    id_record = domain.id_record,
                    id_object = domain.id_object,
                };
                var sql = @"UPDATE ""legal_record_object"" SET ""id"" = @id, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""id_record"" = @id_record, ""id_object"" = @id_object WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_record_object", ex);
            }
        }

        public async Task<PaginatedList<legal_record_object>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_record_object"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<legal_record_object>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""legal_record_object""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<legal_record_object>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_record_objects", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""legal_record_object"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_record_object", ex);
            }
        }
        public async Task<legal_record_object> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_record_object"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<legal_record_object>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_record_object", ex);
            }
        }

        
        public async Task<List<legal_record_object>> GetByid_record(int id_record)
        {
            try
            {
                var sql = "SELECT * FROM \"legal_record_object\" WHERE \"id_record\" = @id_record";
                var models = await _dbConnection.QueryAsync<legal_record_object>(sql, new { id_record }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_record_object", ex);
            }
        }
        
        public async Task<List<legal_record_object>> GetByid_object(int id_object)
        {
            try
            {
                var sql = "SELECT * FROM \"legal_record_object\" WHERE \"id_object\" = @id_object";
                var models = await _dbConnection.QueryAsync<legal_record_object>(sql, new { id_object }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_record_object", ex);
            }
        }
        
    }
}
