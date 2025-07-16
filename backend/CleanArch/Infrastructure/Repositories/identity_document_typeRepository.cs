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
    public class identity_document_typeRepository : Iidentity_document_typeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public identity_document_typeRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<identity_document_type>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""identity_document_type""";
                var models = await _dbConnection.QueryAsync<identity_document_type>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get identity_document_type", ex);
            }
        }

        public async Task<int> Add(identity_document_type domain)
        {
            try
            {

                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new identity_document_typeModel
                {
                    
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO ""identity_document_type""(""name"", ""code"", ""description"", created_at, updated_at, created_by, updated_by) 
                VALUES (@name, @code, @description, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add identity_document_type", ex);
            }
        }

        public async Task Update(identity_document_type domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new identity_document_typeModel
                {
                    
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE ""identity_document_type"" SET ""id"" = @id, ""name"" = @name, ""code"" = @code, ""description"" = @description, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update identity_document_type", ex);
            }
        }

        public async Task<PaginatedList<identity_document_type>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""identity_document_type"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<identity_document_type>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""identity_document_type""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<identity_document_type>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get identity_document_types", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""identity_document_type"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update identity_document_type", ex);
            }
        }
        public async Task<identity_document_type> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""identity_document_type"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<identity_document_type>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get identity_document_type", ex);
            }
        }
        
        public async Task<identity_document_type> GetOneByCode(string code)
        {
            try
            {
                var sql = "SELECT * FROM \"identity_document_type\" WHERE code = @code LIMIT 1";
                var models = await _dbConnection.QueryAsync<identity_document_type>(sql, new { code }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contact_type", ex);
            }
        }

        
    }
}
