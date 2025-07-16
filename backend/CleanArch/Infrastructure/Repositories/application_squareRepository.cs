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
    public class application_squareRepository : Iapplication_squareRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public application_squareRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<application_square>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""application_square""";
                var models = await _dbConnection.QueryAsync<application_square>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_square", ex);
            }
        }

        public async Task<int> Add(application_square domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new application_squareModel
                {
                    
                    id = domain.id,
                    application_id = domain.application_id,
                    structure_id = domain.structure_id,
                    unit_type_id = domain.unit_type_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    value = domain.value,
                };
                var sql = @"INSERT INTO ""application_square""(""application_id"", ""structure_id"", ""unit_type_id"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"", ""value"") 
                VALUES (@application_id, @structure_id, @unit_type_id, @created_at, @updated_at, @created_by, @updated_by, @value) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_square", ex);
            }
        }

        public async Task Update(application_square domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new application_squareModel
                {
                    
                    id = domain.id,
                    application_id = domain.application_id,
                    structure_id = domain.structure_id,
                    unit_type_id = domain.unit_type_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    value = domain.value,
                };
                var sql = @"UPDATE ""application_square"" SET ""id"" = @id, ""application_id"" = @application_id, ""structure_id"" = @structure_id, ""unit_type_id"" = @unit_type_id, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""value"" = @value WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_square", ex);
            }
        }

        public async Task<PaginatedList<application_square>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_square"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<application_square>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""application_square""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<application_square>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_squares", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new { id = id };
                var sql = @"DELETE FROM ""application_square"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_square", ex);
            }
        }
        public async Task<application_square> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_square"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<application_square>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_square", ex);
            }
        }

        
        public async Task<List<application_square>> GetByapplication_id(int application_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_square\" WHERE \"application_id\" = @application_id";
                var models = await _dbConnection.QueryAsync<application_square>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_square", ex);
            }
        }
        
        public async Task<List<application_square>> GetBystructure_id(int structure_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_square\" WHERE \"structure_id\" = @structure_id";
                var models = await _dbConnection.QueryAsync<application_square>(sql, new { structure_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_square", ex);
            }
        }
        
        public async Task<List<application_square>> GetByunit_type_id(int unit_type_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_square\" WHERE \"unit_type_id\" = @unit_type_id";
                var models = await _dbConnection.QueryAsync<application_square>(sql, new { unit_type_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_square", ex);
            }
        }
        
    }
}
