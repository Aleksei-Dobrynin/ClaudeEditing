using Application.Exceptions;
using Application.Repositories;
using Dapper;
using Domain.Entities;
using Infrastructure.Data.Models;
using Infrastructure.FillLogData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class ScheduleTypeRepository : IScheduleTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ScheduleTypeRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<int> Add(ScheduleType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ScheduleTypeModel
                {

                    id = domain.id,
                    description = domain.description,
                    code = domain.code,
                    name = domain.name
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO \"ScheduleType\"(\"description\", \"code\", \"name\", created_at, updated_at, created_by, updated_by) " +
                    "VALUES (@description, @code, @name, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ScheduleType", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"ScheduleType\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ScheduleType", ex);
            }
        }

        public async Task<ScheduleType> GetOneById(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"ScheduleType\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<ScheduleType>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ScheduleType", ex);
            }
        }

        public async Task<List<ScheduleType>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"ScheduleType\"";
                var models = await _dbConnection.QueryAsync<ScheduleType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ScheduleType", ex);
            }
        }

        public async Task Update(ScheduleType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ScheduleTypeModel
                {

                    id = domain.id,
                    description = domain.description,
                    code = domain.code,
                    name = domain.name
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"ScheduleType\" SET \"id\" = @id, \"description\" = @description, \"code\" = @code, \"name\" = @name, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ScheduleType", ex);
            }
        }
    }
}
