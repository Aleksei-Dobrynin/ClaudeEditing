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
    public class application_duty_objectRepository : Iapplication_duty_objectRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public application_duty_objectRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<application_duty_object>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""application_duty_object""";
                var models = await _dbConnection.QueryAsync<application_duty_object>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_duty_object", ex);
            }
        }

        public async Task<int> Add(application_duty_object domain)
        {
            try
            {
                await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new application_duty_objectModel
                {
                    
                    id = domain.id,
                    dutyplan_object_id = domain.dutyplan_object_id,
                    application_id = domain.application_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"INSERT INTO ""application_duty_object""(""dutyplan_object_id"", ""application_id"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@dutyplan_object_id, @application_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_duty_object", ex);
            }
        }

        public async Task Update(application_duty_object domain)
        {
            try
            {
                await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new application_duty_objectModel
                {
                    
                    id = domain.id,
                    dutyplan_object_id = domain.dutyplan_object_id,
                    application_id = domain.application_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"UPDATE ""application_duty_object"" SET ""id"" = @id, ""dutyplan_object_id"" = @dutyplan_object_id, ""application_id"" = @application_id, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_duty_object", ex);
            }
        }

        public async Task<PaginatedList<application_duty_object>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_duty_object"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<application_duty_object>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""application_duty_object""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<application_duty_object>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_duty_objects", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new { id = id };
                var sql = @"DELETE FROM ""application_duty_object"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_duty_object", ex);
            }
        }
        public async Task<application_duty_object> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_duty_object"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<application_duty_object>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_duty_object", ex);
            }
        }

        
        public async Task<List<application_duty_object>> GetBydutyplan_object_id(int dutyplan_object_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_duty_object\" WHERE \"dutyplan_object_id\" = @dutyplan_object_id";
                var models = await _dbConnection.QueryAsync<application_duty_object>(sql, new { dutyplan_object_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_duty_object", ex);
            }
        }
        
        public async Task<List<application_duty_object>> GetByapplication_id(int application_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_duty_object\" WHERE \"application_id\" = @application_id";
                var models = await _dbConnection.QueryAsync<application_duty_object>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_duty_object", ex);
            }
        }
        
    }
}
