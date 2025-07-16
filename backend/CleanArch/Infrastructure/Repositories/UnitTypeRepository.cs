using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Xml.Linq;

namespace Infrastructure.Repositories
{
    public class UnitTypeRepository : IUnitTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public UnitTypeRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<UnitType>> GetAll()
        {
            try
            {
                var sql = "SELECT id, \"name\", \"description\", \"code\", \"type\", \"updated_at\", \"updated_by\", \"created_at\", \"created_by\" FROM \"unit_type\"";
                var models = await _dbConnection.QueryAsync<UnitType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UnitType", ex);
            }
        }

        public async Task<int> Add(UnitType domain)
        {
            try
            {
                var model = new
                {
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    type = domain.type,
                    updatedAt = domain.updatedAt,
                    updatedBy = domain.updatedBy,
                    createdAt = domain.createdAt,
                    createdBy = domain.createdBy
                };
                var sql = "INSERT INTO \"unit_type\" (\"name\", \"description\", \"code\", \"type\", \"updated_at\", \"updated_by\", \"created_at\", \"created_by\") " +
                          "VALUES (@name, @description, @code, @type, @updatedAt, @updatedBy, @createdAt, @createdBy) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add UnitType", ex);
            }
        }

        public async Task Update(UnitType domain)
        {
            try
            {
                var model = new
                {
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    type = domain.type,
                    updatedAt = domain.updatedAt,
                    updatedBy = domain.updatedBy,
                    //createdAt = domain.createdAt,
                    //createdBy = domain.createdBy
                };
                var sql = "UPDATE \"unit_type\" SET \"name\" = @name, \"description\" = @description, \"code\" = @code, \"type\" = @type, " +
                          "\"updated_at\" = @updatedAt, \"updated_by\" = @updatedBy " +
                          "WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update UnitType", ex);
            }
        }

        public async Task<PaginatedList<UnitType>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT \"id\", \"name\", \"description\", \"code\", \"type\", \"updated_at\", \"updated_by\", \"created_at\", \"created_by\" " +
                          "FROM \"unit_type\" OFFSET @pageSize * (@pageNumber - 1) LIMIT @pageSize";
                var models = await _dbConnection.QueryAsync<UnitType>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM \"unit_type\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<UnitType>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UnitTypes", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var model = new { id };
                var sql = "DELETE FROM \"unit_type\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete UnitType", ex);
            }
        }

        public async Task<UnitType> GetOne(int id)
        {
            try
            {
                var sql = "SELECT \"id\", \"name\", \"description\", \"code\", \"type\", \"updated_at\", \"updated_by\", \"created_at\", \"created_by\" " +
                          "FROM \"unit_type\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<UnitType>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UnitType", ex);
            }
        }

        public async Task<UnitType> GetOneByCode(string code)
        {
            try
            {
                var sql = "SELECT \"id\", \"name\", \"description\", \"code\", \"type\", \"updatedAt\", \"updatedBy\", \"createdAt\", \"createdBy\" " +
                          "FROM \"unit_type\" WHERE code = @code LIMIT 1";
                var models = await _dbConnection.QueryAsync<UnitType>(sql, new { code }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UnitType", ex);
            }
        }
    }
}
