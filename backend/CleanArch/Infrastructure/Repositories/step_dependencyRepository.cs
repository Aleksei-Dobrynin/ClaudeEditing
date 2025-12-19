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
    public class step_dependencyRepository : Istep_dependencyRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public step_dependencyRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<step_dependency>> GetAll()
        {
            try
            {
                var sql = @"SELECT sd.*, 
                           ds.name as dependent_step_name,
                           ps.name as prerequisite_step_name
                           FROM ""step_dependency"" sd
                           LEFT JOIN ""path_step"" ds ON sd.dependent_step_id = ds.id
                           LEFT JOIN ""path_step"" ps ON sd.prerequisite_step_id = ps.id";
                var models = await _dbConnection.QueryAsync<step_dependency>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_dependency", ex);
            }
        }

        public async Task<List<step_dependency>> GetByServicePathId(int service_path_id)
        {
            try
            {
                var sql = @"SELECT sd.*, 
                           ds.name as dependent_step_name,
                           ps.name as prerequisite_step_name
                           FROM ""step_dependency"" sd
                           LEFT JOIN ""path_step"" ds ON sd.dependent_step_id = ds.id
                           LEFT JOIN ""path_step"" ps ON sd.prerequisite_step_id = ps.id
                           WHERE ds.path_id = @service_path_id AND ps.path_id = @service_path_id";
                var models = await _dbConnection.QueryAsync<step_dependency>(sql, new { service_path_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_dependency by service_path_id", ex);
            }
        }

        public async Task<int> Add(step_dependency domain)
        {
            try
            {
                var model = new step_dependencyModel
                {

                    id = domain.id,
                    dependent_step_id = domain.dependent_step_id,
                    prerequisite_step_id = domain.prerequisite_step_id,
                    is_strict = domain.is_strict,
                };
                var sql = @"INSERT INTO ""step_dependency""(""dependent_step_id"", ""prerequisite_step_id"", ""is_strict"") 
                VALUES (@dependent_step_id, @prerequisite_step_id, @is_strict) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add step_dependency", ex);
            }
        }

        public async Task Update(step_dependency domain)
        {
            try
            {
                var model = new step_dependencyModel
                {

                    id = domain.id,
                    dependent_step_id = domain.dependent_step_id,
                    prerequisite_step_id = domain.prerequisite_step_id,
                    is_strict = domain.is_strict,
                };
                var sql = @"UPDATE ""step_dependency"" SET ""id"" = @id, ""dependent_step_id"" = @dependent_step_id, ""prerequisite_step_id"" = @prerequisite_step_id, ""is_strict"" = @is_strict WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update step_dependency", ex);
            }
        }

        public async Task<PaginatedList<step_dependency>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT sd.*, 
                           ds.name as dependent_step_name,
                           ps.name as prerequisite_step_name
                           FROM ""step_dependency"" sd
                           LEFT JOIN ""path_step"" ds ON sd.dependent_step_id = ds.id
                           LEFT JOIN ""path_step"" ps ON sd.prerequisite_step_id = ps.id
                           OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<step_dependency>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""step_dependency""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<step_dependency>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_dependencys", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""step_dependency"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update step_dependency", ex);
            }
        }
        public async Task<step_dependency> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT sd.*, 
                           ds.name as dependent_step_name,
                           ps.name as prerequisite_step_name
                           FROM ""step_dependency"" sd
                           LEFT JOIN ""path_step"" ds ON sd.dependent_step_id = ds.id
                           LEFT JOIN ""path_step"" ps ON sd.prerequisite_step_id = ps.id
                           WHERE sd.id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<step_dependency>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_dependency", ex);
            }
        }


        public async Task<List<step_dependency>> GetBydependent_step_id(int dependent_step_id)
        {
            try
            {
                var sql = @"SELECT sd.*, 
                           ds.name as dependent_step_name,
                           ps.name as prerequisite_step_name
                           FROM ""step_dependency"" sd
                           LEFT JOIN ""path_step"" ds ON sd.dependent_step_id = ds.id
                           LEFT JOIN ""path_step"" ps ON sd.prerequisite_step_id = ps.id
                           WHERE sd.dependent_step_id = @dependent_step_id";
                var models = await _dbConnection.QueryAsync<step_dependency>(sql, new { dependent_step_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_dependency", ex);
            }
        }

        public async Task<List<step_dependency>> GetByprerequisite_step_id(int prerequisite_step_id)
        {
            try
            {
                var sql = @"SELECT sd.*, 
                           ds.name as dependent_step_name,
                           ps.name as prerequisite_step_name
                           FROM ""step_dependency"" sd
                           LEFT JOIN ""path_step"" ds ON sd.dependent_step_id = ds.id
                           LEFT JOIN ""path_step"" ps ON sd.prerequisite_step_id = ps.id
                           WHERE sd.prerequisite_step_id = @prerequisite_step_id";
                var models = await _dbConnection.QueryAsync<step_dependency>(sql, new { prerequisite_step_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_dependency", ex);
            }
        }

        public async Task<List<step_dependency>> GetByservice_path_id(int servicePathId)
        {
            try
            {
                // Получаем все шаги для service_path
                var stepsQuery = @"SELECT id FROM ""path_step"" WHERE ""path_id"" = @servicePathId";
                var stepIds = await _dbConnection.QueryAsync<int>(stepsQuery, new { servicePathId }, transaction: _dbTransaction);

                if (!stepIds.Any())
                    return new List<step_dependency>();

                // Получаем все зависимости для этих шагов
                var sql = @"SELECT * FROM ""step_dependency"" 
                    WHERE ""dependent_step_id"" = ANY(@stepIds) 
                    OR ""prerequisite_step_id"" = ANY(@stepIds)";
                var models = await _dbConnection.QueryAsync<step_dependency>(sql, new { stepIds = stepIds.ToArray() }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_dependencies by service_path_id", ex);
            }
        }

    }
}