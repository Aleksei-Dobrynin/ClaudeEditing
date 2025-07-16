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
    public class RepeatTypeRepository : IRepeatTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public RepeatTypeRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<int> Add(RepeatType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new RepeatTypeModel
                {
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    repeatIntervalMinutes = domain.repeatIntervalMinutes,
                    isPeriod = domain.isPeriod,

                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO \"RepeatType\"(\"name\", \"description\", \"code\",\"repeatIntervalMinutes\",\"isPeriod\",  created_at, updated_at, created_by, updated_by) " +
                    "VALUES (@name, @description, @code, @repeatIntervalMinutes, @isPeriod, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add RepeatType", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"RepeatType\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update RepeatType", ex);
            }
        }

        public async Task<RepeatType> GetOneById(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"RepeatType\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<RepeatType>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get RepeatType", ex);
            }
        }

        public async Task<List<RepeatType>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"RepeatType\"";
                var models = await _dbConnection.QueryAsync<RepeatType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get RepeatType", ex);
            }
        }

        public async Task Update(RepeatType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new RepeatTypeModel
                {

                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    repeatIntervalMinutes = domain.repeatIntervalMinutes,
                    isPeriod = domain.isPeriod,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"RepeatType\" SET \"id\" = @id, \"description\" = @description, \"code\" = @code, \"name\" = @name, \"repeatIntervalMinutes\" = @repeatIntervalMinutes, \"isPeriod\" = @isPeriod, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update RepeatType", ex);
            }
        }
    }
}
