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
    public class WorkScheduleExceptionRepository : IWorkScheduleExceptionRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public WorkScheduleExceptionRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<WorkScheduleException>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM work_schedule_exception";
                var models = await _dbConnection.QueryAsync<WorkScheduleException>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkScheduleException", ex);
            }
        }

        public async Task<int> Add(WorkScheduleException domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new WorkScheduleExceptionModel
                {
                    id = domain.id,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    name = domain.name,
                    schedule_id = domain.schedule_id,
                    is_holiday = domain.is_holiday,
                    time_end = domain.time_end,
                    time_start = domain.time_start,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO work_schedule_exception(date_start, date_end, name, schedule_id, is_holiday, time_end, time_start, created_at, created_by, updated_at, updated_by) VALUES (@date_start, @date_end, @name, @schedule_id, @is_holiday, @time_end, @time_start, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add WorkScheduleException", ex);
            }
        }

        public async Task Update(WorkScheduleException domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new WorkScheduleExceptionModel
                {
                    id = domain.id,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    name = domain.name,
                    schedule_id = domain.schedule_id,
                    is_holiday = domain.is_holiday,
                    time_end = domain.time_end,
                    time_start = domain.time_start,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE work_schedule_exception SET date_start = @date_start, date_end = @date_end, name = @name, schedule_id = @schedule_id, is_holiday = @is_holiday, time_end = @time_end, time_start = @time_start, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update WorkScheduleException", ex);
            }
        }

        public async Task<PaginatedList<WorkScheduleException>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM work_schedule_exception OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<WorkScheduleException>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM work_schedule_exception";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<WorkScheduleException>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkScheduleExceptions", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM work_schedule_exception WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { id }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update WorkScheduleException", ex);
            }
        }
        public async Task<WorkScheduleException> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM work_schedule_exception WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<WorkScheduleException>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkScheduleException", ex);
            }
        }
        public async Task<List<WorkScheduleException>> GetByschedule_id(int schedule_id)
        {
            try
            {
                var sql = "SELECT * FROM work_schedule_exception WHERE schedule_id = @schedule_id";
                var models = await _dbConnection.QueryAsync<WorkScheduleException>(sql, new { schedule_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkScheduleException", ex);
            }
        }
        
    }
}
