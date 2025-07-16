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
    public class WorkDayRepository : IWorkDayRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;


        public WorkDayRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<WorkDay>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM work_day";
                var models = await _dbConnection.QueryAsync<WorkDay>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkDay", ex);
            }
        }

        public async Task<int> Add(WorkDay domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new WorkDayModel
                {
                    id = domain.id,
                    week_number = domain.week_number,
                    time_start = domain.time_start,
                    time_end = domain.time_end,
                    schedule_id = domain.schedule_id,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO work_day(week_number, time_start, time_end, schedule_id, created_at, created_by, updated_at, updated_by) VALUES (@week_number, @time_start, @time_end, @schedule_id, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add WorkDay", ex);
            }
        }

        public async Task Update(WorkDay domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new WorkDayModel
                {
                    id = domain.id,
                    week_number = domain.week_number,
                    time_start = domain.time_start,
                    time_end = domain.time_end,
                    schedule_id = domain.schedule_id,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "UPDATE work_day SET week_number = @week_number, time_start = @time_start, time_end = @time_end, schedule_id = @schedule_id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update WorkDay", ex);
            }
        }

        public async Task<PaginatedList<WorkDay>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM work_day OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<WorkDay>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM work_day";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<WorkDay>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkDays", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM work_day WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { id }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update WorkDay", ex);
            }
        }
        public async Task<WorkDay> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM work_day WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<WorkDay>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkDay", ex);
            }
        }
        public async Task<List<WorkDay>> GetByschedule_id(int schedule_id)
        {
            try
            {
                var sql = "SELECT * FROM work_day WHERE schedule_id = @schedule_id";
                var models = await _dbConnection.QueryAsync<WorkDay>(sql, new { schedule_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkDay", ex);
            }
        }
        
    }
}
