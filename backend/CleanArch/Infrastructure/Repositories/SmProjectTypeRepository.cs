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
    public class SmProjectTypeRepository : ISmProjectTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public SmProjectTypeRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<SmProjectType>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM sm_project_type";
                var models = await _dbConnection.QueryAsync<SmProjectType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SmProjectTypes", ex);
            }
        }

        public async Task<int> Add(SmProjectType domain)
        {
            try
            {
                var model = new SmProjectTypeModel
                {
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                    created_at = domain.created_at,
                    created_by = domain.created_by,
                    updated_at = domain.updated_at,
                    updated_by = domain.updated_by,
                };
                var sql = "INSERT INTO sm_project_type(name, code, description) VALUES (@name, @code, @description) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add SmProjectType", ex);
            }
        }

        public async Task Update(SmProjectType domain)
        {
            try
            {
                var model = new SmProjectTypeModel
                {
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                    created_at = domain.created_at,
                    created_by = domain.created_by,
                    updated_at = domain.updated_at,
                    updated_by = domain.updated_by,
                };
                var sql = "UPDATE sm_project_type SET name = @name, code = @code, description = @description WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update SmProjectType", ex);
            }
        }

        public async Task<PaginatedList<SmProjectType>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM sm_project_type OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<SmProjectType>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM sm_project_type";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<SmProjectType>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SmProjectTypes", ex);
            }
        }
    }
}
