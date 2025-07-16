using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Infrastructure.FillLogData;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories
{
    public class S_QueryRepository : IS_QueryRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;
        private readonly ILogger<S_QueryRepository> _logger;

        public S_QueryRepository(IDbConnection dbConnection, IUserRepository? userRepository, ILogger<S_QueryRepository> logger)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
            _logger = logger;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<S_Query>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"S_Query\" order by id desc";
                var models = await _dbConnection.QueryAsync<S_Query>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_Query", ex);
            }
        }

        public async Task<int> Add(S_Query domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_QueryModel
                {

                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    query = domain.query,
                    id = domain.id,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO \"S_Query\"(\"name\", \"description\", \"code\", \"query\", created_at, updated_at, created_by, updated_by) " +
                    "VALUES (@name, @description, @code, @query, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add S_Query", ex);
            }
        }

        public async Task Update(S_Query domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_QueryModel
                {

                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    query = domain.query,
                    id = domain.id,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"S_Query\" SET \"name\" = @name, \"description\" = @description, \"code\" = @code, \"query\" = @query, \"id\" = @id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_Query", ex);
            }
        }

        public async Task<PaginatedList<S_Query>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"S_Query\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<S_Query>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"S_Query\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<S_Query>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_Querys", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"S_Query\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_Query", ex);
            }
        }
        public async Task<S_Query> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"S_Query\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<S_Query>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_Query", ex);
            }
        }


        public async Task<List<object>> CallQuery(int idQuery, Dictionary<string, object> parameters)
        {
            try
            {
                var par = new Dictionary<string, object>();
                par.Add("id", 1);
                par.Add("idWorkSchedule", 1);
                var query = await GetOne(idQuery);
                object obj = parameters;
                //var sql = "SELECT * FROM \"S_Query\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<dynamic>(query.query, parameters, transaction: _dbTransaction);
                //var models = await _dbConnection.QueryAsync<dynamic>(query.query, parameters, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get query: {ex}");
                return new List<object>();
            }
        }


    }
}
