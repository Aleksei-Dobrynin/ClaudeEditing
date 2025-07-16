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
    public class application_pauseRepository : Iapplication_pauseRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public application_pauseRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<application_pause>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""application_pause""";
                var models = await _dbConnection.QueryAsync<application_pause>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_pause", ex);
            }
        }

        public async Task<int> Add(application_pause domain)
        {
            try
            {
                var model = new application_pauseModel
                {
                    
                    id = domain.id,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    application_id = domain.application_id,
                    app_step_id = domain.app_step_id,
                    pause_reason = domain.pause_reason,
                    pause_start = domain.pause_start,
                    pause_end = domain.pause_end,
                    comments = domain.comments,
                    is_excluded_from_sla = domain.is_excluded_from_sla,
                    created_at = domain.created_at,
                };
                var sql = @"INSERT INTO ""application_pause""(""updated_at"", ""created_by"", ""updated_by"", ""application_id"", ""app_step_id"", ""pause_reason"", ""pause_start"", ""pause_end"", ""comments"", ""is_excluded_from_sla"", ""created_at"") 
                VALUES (@updated_at, @created_by, @updated_by, @application_id, @app_step_id, @pause_reason, @pause_start, @pause_end, @comments, @is_excluded_from_sla, @created_at) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_pause", ex);
            }
        }

        public async Task Update(application_pause domain)
        {
            try
            {
                var model = new application_pauseModel
                {
                    
                    id = domain.id,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    application_id = domain.application_id,
                    app_step_id = domain.app_step_id,
                    pause_reason = domain.pause_reason,
                    pause_start = domain.pause_start,
                    pause_end = domain.pause_end,
                    comments = domain.comments,
                    is_excluded_from_sla = domain.is_excluded_from_sla,
                    created_at = domain.created_at,
                };
                var sql = @"UPDATE ""application_pause"" SET ""id"" = @id, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""application_id"" = @application_id, ""app_step_id"" = @app_step_id, ""pause_reason"" = @pause_reason, ""pause_start"" = @pause_start, ""pause_end"" = @pause_end, ""comments"" = @comments, ""is_excluded_from_sla"" = @is_excluded_from_sla, ""created_at"" = @created_at WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_pause", ex);
            }
        }

        public async Task<PaginatedList<application_pause>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_pause"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<application_pause>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""application_pause""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<application_pause>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_pauses", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""application_pause"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_pause", ex);
            }
        }
        public async Task<application_pause> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_pause"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<application_pause>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_pause", ex);
            }
        }

        
        public async Task<List<application_pause>> GetByapplication_id(int application_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_pause\" WHERE \"application_id\" = @application_id";
                var models = await _dbConnection.QueryAsync<application_pause>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_pause", ex);
            }
        }

        public async Task<List<application_pause>> GetByapp_step_id(int app_step_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_pause\" WHERE \"app_step_id\" = @app_step_id";
                var models = await _dbConnection.QueryAsync<application_pause>(sql, new { app_step_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_pause", ex);
            }
        }
        public async Task<application_pause> GetByapp_step_idAndCurrent(int app_step_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_pause\" WHERE \"app_step_id\" = @app_step_id AND pause_end is null LIMIT 1";
                var models = await _dbConnection.QueryAsync<application_pause>(sql, new { app_step_id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_pause", ex);
            }
        }

    }
}
