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
    public class ApplicationFilterTypeRepository : IApplicationFilterTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public ApplicationFilterTypeRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationFilterType>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, code, description, post_id, structure_id FROM application_filter_type";
                var models = await _dbConnection.QueryAsync<ApplicationFilterType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationFilterType", ex);
            }
        }

        public async Task<ApplicationFilterType> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, code, description, post_id, structure_id FROM application_filter_type WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationFilterType>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationFilterType with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationFilterType", ex);
            }
        }

        public async Task<int> Add(ApplicationFilterType domain)
        {
            try
            {
                var model = new ApplicationFilterType
                {
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                    post_id = domain.post_id,
                    structure_id = domain.structure_id
                };
                var sql = "INSERT INTO application_filter_type(name, code, description, post_id, structure_id) VALUES (@name, @code, @description, @post_id, @structure_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationFilterType", ex);
            }
        }

        public async Task Update(ApplicationFilterType domain)
        {
            try
            {
                var model = new ApplicationFilterType
                {
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                    post_id = domain.post_id,
                    structure_id = domain.structure_id
                };
                var sql = "UPDATE application_filter_type SET name = @name, code = @code, description = @description, post_id = @post_id, structure_id = @structure_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationFilterType", ex);
            }
        }

        public async Task<PaginatedList<ApplicationFilterType>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM application_filter_type OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ApplicationFilterType>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM application_filter_type";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ApplicationFilterType>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationFilterType", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM application_filter_type WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationFilterType not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationFilterType", ex);
            }
        }
    }
}
