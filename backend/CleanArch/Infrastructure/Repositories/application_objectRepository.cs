using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class application_objectRepository : Iapplication_objectRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public application_objectRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<application_object>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""application_object""";
                var models = await _dbConnection.QueryAsync<application_object>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_object", ex);
            }
        }

        public async Task<int> Add(application_object domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new application_objectModel
                {
                    
                    id = domain.id,
                    application_id = domain.application_id,
                    arch_object_id = domain.arch_object_id,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO ""application_object""(""application_id"", ""arch_object_id"", created_at, updated_at, created_by, updated_by) 
                VALUES (@application_id, @arch_object_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_object", ex);
            }
        }

        public async Task Update(application_object domain)
        {
            try
            {
                var userId = await _userRepository.GetUserID();

                var model = new application_objectModel
                {
                    
                    id = domain.id,
                    application_id = domain.application_id,
                    arch_object_id = domain.arch_object_id,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE ""application_object"" SET ""id"" = @id, ""application_id"" = @application_id, ""arch_object_id"" = @arch_object_id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_object", ex);
            }
        }

        public async Task<PaginatedList<application_object>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_object"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<application_object>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""application_object""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<application_object>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_objects", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""application_object"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_object", ex);
            }
        }
        public async Task<application_object> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_object"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<application_object>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_object", ex);
            }
        }

        
        public async Task<List<application_object>> GetByapplication_id(int application_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_object\" WHERE \"application_id\" = @application_id";
                var models = await _dbConnection.QueryAsync<application_object>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_object", ex);
            }
        }
        
        public async Task<List<application_object>> GetByarch_object_id(int arch_object_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_object\" WHERE \"arch_object_id\" = @arch_object_id";
                var models = await _dbConnection.QueryAsync<application_object>(sql, new { arch_object_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_object", ex);
            }
        }
        
    }
}
