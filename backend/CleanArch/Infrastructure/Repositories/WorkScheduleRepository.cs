using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Infrastructure.FillLogData;
using Npgsql;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class WorkScheduleRepository : IWorkScheduleRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;


        public WorkScheduleRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<WorkSchedule>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM work_schedule";
                var models = await _dbConnection.QueryAsync<WorkSchedule>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkSchedule", ex);
            }
        }

        public async Task<int> Add(WorkSchedule domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                
                var model = new WorkScheduleModel
                {
                    id = domain.id,
                    name = domain.name,
                    is_active = domain.is_active,
                    year = domain.year
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO work_schedule(name, is_active, year, created_at, created_by, updated_at, updated_by) VALUES (@name, @is_active, @year, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add WorkSchedule", ex);
            }
        }
  
        public async Task Update(WorkSchedule domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new WorkScheduleModel
                {
                    id = domain.id,
                    name = domain.name,
                    is_active = domain.is_active,
                    year = domain.year
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE work_schedule SET name = @name, is_active = @is_active, year = @year, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";


                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update WorkSchedule", ex);
            }
        }

        public async Task<PaginatedList<WorkSchedule>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM work_schedule OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<WorkSchedule>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM work_schedule";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<WorkSchedule>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkSchedules", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM work_schedule WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update WorkSchedule", ex);
            }
        }
        public async Task<WorkSchedule> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM work_schedule WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<WorkSchedule>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkSchedule", ex);
            }
        }
    }
}
