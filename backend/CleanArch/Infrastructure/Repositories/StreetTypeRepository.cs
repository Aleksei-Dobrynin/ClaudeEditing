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
    public class StreetTypeRepository : IStreetTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public StreetTypeRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<StreetType>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM street_type";
                var models = await _dbConnection.QueryAsync<StreetType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StreetType", ex);
            }
        }

        public async Task<StreetType> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT * FROM street_type WHERE id = @Id LIMIT 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<StreetType>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"StreetType with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StreetType", ex);
            }
        }

        public async Task<int> Add(StreetType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new StreetType
                {
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    name_kg = domain.name_kg,
                    description_kg = domain.description_kg,
                    name_short = domain.name_short,
                    name_kg_short = domain.name_kg_short,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO street_type(name,description,code,created_at,updated_at,created_by,updated_by,name_kg,description_kg,name_short,name_kg_short) 
                           VALUES (@name,@description,@code,@created_at,@updated_at,@created_by,@updated_by,@name_kg,@description_kg,@name_short,@name_kg_short) 
                           RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add StreetType", ex);
            }
        }

        public async Task Update(StreetType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new StreetType
                {
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    name_kg = domain.name_kg,
                    description_kg = domain.description_kg,
                    name_short = domain.name_short,
                    name_kg_short = domain.name_kg_short,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE street_type SETname = @name,description = @description,code = @code,created_at = @created_at,updated_at = @updated_at,created_by = @created_by,updated_by = @updated_by,name_kg = @name_kg,description_kg = @description_kg,name_short = @name_short,name_kg_short = @name_kg_short WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update StreetType", ex);
            }
        }

        public async Task<PaginatedList<StreetType>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM street_type OFFSET @pageSize * (@pageNumber - 1) LIMIT @pageSize";
                var models = await _dbConnection.QueryAsync<StreetType>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM street_type";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<StreetType>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StreetType", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM street_type WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("StreetType not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete StreetType", ex);
            }
        }
    }
}