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
    public class ApplicationFilterRepository : IApplicationFilterRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public ApplicationFilterRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationFilter>> GetAll()
        {
            try
            {
                var sql = @"SELECT id, name, code, description, type_id, query_id, post_id, parameters FROM application_filter";
                var models = await _dbConnection.QueryAsync<ApplicationFilter>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationFilter", ex);
            }
        }

        public async Task<List<ApplicationFilter>> GetByFilter(ApplicationFilterGetRequest filter)
        {
            try
            {
                var sql = @"SELECT af.id, 
                                   af.name, 
                                   af.code, 
                                   af.description, 
                                   af.type_id, 
                                   af.query_id, 
                                   af.post_id,
                                   af.parameters,
                                   aft.name as type_name,
                                   aft.code as type_code,
                                   q.query as query_sql
                            FROM application_filter af 
                            LEFT JOIN application_filter_type aft on af.type_id = aft.id
                            LEFT JOIN ""S_Query"" q ON af.query_id = q.id
                            WHERE (af.post_id IS NULL OR af.post_id = ANY(@Posts)) 
                              AND (aft.post_id IS NULL OR aft.post_id = ANY(@Posts))
                              AND (aft.structure_id IS NULL OR aft.structure_id = ANY(@Structure))
                            ";
                var parameters = new 
                {
                    Posts = filter.Posts,
                    Structure = filter.Structure
                };
                var models = await _dbConnection.QueryAsync<ApplicationFilter>(sql, parameters, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationFilter", ex);
            }
        }

        public async Task<ApplicationFilter> GetOneByID(int id)
        {
            try
            {
                var sql =
                    "SELECT id, name, code, description, type_id, query_id, post_id, parameters FROM application_filter WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationFilter>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationFilter with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationFilter", ex);
            }
        }

        public async Task<int> Add(ApplicationFilter domain)
        {
            try
            {
                var model = new ApplicationFilter
                {
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                    type_id = domain.type_id,
                    query_id = domain.query_id,
                    post_id = domain.post_id,
                    parameters = domain.parameters
                };
                var sql = @"INSERT INTO application_filter(name, code, description, type_id, query_id, post_id, parameters) 
                            VALUES (@name, @code, @description, @type_id, @query_id, @post_id, @parameters::jsonb) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationFilter", ex);
            }
        }

        public async Task Update(ApplicationFilter domain)
        {
            try
            {
                var model = new ApplicationFilter
                {
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                    type_id = domain.type_id,
                    query_id = domain.query_id,
                    post_id = domain.post_id,
                    parameters = domain.parameters
                };
                var sql = @"UPDATE application_filter SET name = @name, code = @code, description = @description, 
                            type_id = @type_id, query_id = @query_id, post_id = @post_id, parameters = @parameters::jsonb
                            WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationFilter", ex);
            }
        }

        public async Task<PaginatedList<ApplicationFilter>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM application_filter OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ApplicationFilter>(sql, new { pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM application_filter";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ApplicationFilter>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationFilter", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM application_filter WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationFilter not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationFilter", ex);
            }
        }
    }
}