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
    public class task_statusRepository : Itask_statusRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public task_statusRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<task_status>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"task_status\"";
                var models = await _dbConnection.QueryAsync<task_status>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get task_status", ex);
            }
        }

        public async Task<int> Add(task_status domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new task_statusModel
                {
                    
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    textcolor = domain.textcolor,
                    backcolor = domain.backcolor,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO \"task_status\"(\"name\", \"description\", \"code\", \"textcolor\", \"backcolor\", created_at, created_by, updated_at, updated_by) " +
                    "VALUES (@name, @description, @code, @textcolor, @backcolor, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add task_status", ex);
            }
        }

        public async Task Update(task_status domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new task_statusModel
                {
                    
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    textcolor = domain.textcolor,
                    backcolor = domain.backcolor,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"task_status\" SET \"id\" = @id, \"name\" = @name, \"description\" = @description, \"code\" = @code, \"textcolor\" = @textcolor, \"backcolor\" = @backcolor, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update task_status", ex);
            }
        }

        public async Task<PaginatedList<task_status>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"task_status\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<task_status>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"task_status\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<task_status>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get task_statuss", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"task_status\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update task_status", ex);
            }
        }
        public async Task<task_status> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"task_status\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<task_status>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get task_status", ex);
            }
        }
        public async Task<task_status> GetOneByCode(string code)
        {
            try
            {
                var sql = "SELECT * FROM \"task_status\" WHERE code = @code LIMIT 1";
                var models = await _dbConnection.QueryAsync<task_status>(sql, new { code }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get task_status", ex);
            }
        }


    }
}
