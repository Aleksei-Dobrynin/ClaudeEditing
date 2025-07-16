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
    public class StepStatusLogRepository : IStepStatusLogRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public StepStatusLogRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        private string GetBaseSelectQuery()
        {
            return @"
                SELECT 
                    ssl.*,
                    CONCAT(ce.last_name, ' ', ce.first_name, ' ', COALESCE(ce.second_name, '')) as created_user_name,
                    CONCAT(ue.last_name, ' ', ue.first_name, ' ', COALESCE(ue.second_name, '')) as updated_user_name
                FROM step_status_log ssl
                LEFT JOIN ""User"" cu ON ssl.created_by = cu.id
                LEFT JOIN employee ce ON cu.""userId"" = ce.user_id
                LEFT JOIN ""User"" uu ON ssl.updated_by = uu.id
                LEFT JOIN employee ue ON uu.""userId"" = ue.user_id";
        }

        public async Task<List<StepStatusLog>> GetAll()
        {
            try
            {
                var sql = GetBaseSelectQuery();
                var models = await _dbConnection.QueryAsync<StepStatusLog>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StepStatusLog", ex);
            }
        }

        public async Task<StepStatusLog> GetOneByID(int id)
        {
            try
            {
                var sql = GetBaseSelectQuery() + " WHERE ssl.id = @Id LIMIT 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<StepStatusLog>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"StepStatusLog with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StepStatusLog", ex);
            }
        }

        public async Task<int> Add(StepStatusLog domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new StepStatusLog
                {
                    app_step_id = domain.app_step_id,
                    old_status = domain.old_status,
                    new_status = domain.new_status,
                    change_date = domain.change_date,
                    comments = domain.comments,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO step_status_log(app_step_id,old_status,new_status,change_date,comments,created_at,updated_at,created_by,updated_by) 
                           VALUES (@app_step_id,@old_status,@new_status,@change_date,@comments,@created_at,@updated_at,@created_by,@updated_by) 
                           RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add StepStatusLog", ex);
            }
        }

        public async Task Update(StepStatusLog domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new StepStatusLog
                {
                    id = domain.id,
                    app_step_id = domain.app_step_id,
                    old_status = domain.old_status,
                    new_status = domain.new_status,
                    change_date = domain.change_date,
                    comments = domain.comments,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE step_status_log SET 
                           app_step_id = @app_step_id,
                           old_status = @old_status,
                           new_status = @new_status,
                           change_date = @change_date,
                           comments = @comments,
                           created_at = @created_at,
                           updated_at = @updated_at,
                           created_by = @created_by,
                           updated_by = @updated_by 
                           WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update StepStatusLog", ex);
            }
        }

        public async Task<PaginatedList<StepStatusLog>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = GetBaseSelectQuery() + " ORDER BY ssl.id OFFSET @Offset LIMIT @PageSize";
                var models = await _dbConnection.QueryAsync<StepStatusLog>(sql,
                    new
                    {
                        Offset = pageSize * (pageNumber - 1),
                        PageSize = pageSize
                    },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM step_status_log";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<StepStatusLog>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StepStatusLog", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM step_status_log WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("StepStatusLog not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete StepStatusLog", ex);
            }
        }

        public async Task<List<StepStatusLog>> GetByAplicationStep(int idAplication)
        {
            try
            {
                var sql = GetBaseSelectQuery() + " WHERE ssl.app_step_id = @idAplication";
                var model = await _dbConnection.QueryAsync<StepStatusLog>(sql, new { idAplication = idAplication }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"StepStatusLog with ID {idAplication} not found.", null);
                }

                return model.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StepStatusLog", ex);
            }
        }
    }
}