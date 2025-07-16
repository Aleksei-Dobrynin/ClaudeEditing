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
    public class S_DocumentTemplateTypeRepository : IS_DocumentTemplateTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public S_DocumentTemplateTypeRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<S_DocumentTemplateType>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"S_DocumentTemplateType\"";
                var models = await _dbConnection.QueryAsync<S_DocumentTemplateType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplateType", ex);
            }
        }

        public async Task<int> Add(S_DocumentTemplateType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_DocumentTemplateTypeModel
                {

                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    queueNumber = domain.queueNumber,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO \"S_DocumentTemplateType\"(\"name\", \"description\", \"code\", \"queueNumber\", created_at, updated_at, created_by, updated_by) " +
                    "VALUES (@name, @description, @code, @queueNumber, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add S_DocumentTemplateType", ex);
            }
        }

        public async Task Update(S_DocumentTemplateType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_DocumentTemplateTypeModel
                {

                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    queueNumber = domain.queueNumber,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"S_DocumentTemplateType\" SET \"id\" = @id, \"name\" = @name, \"description\" = @description, \"code\" = @code, \"queueNumber\" = @queueNumber, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_DocumentTemplateType", ex);
            }
        }

        public async Task<PaginatedList<S_DocumentTemplateType>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"S_DocumentTemplateType\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<S_DocumentTemplateType>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"S_DocumentTemplateType\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<S_DocumentTemplateType>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplateTypes", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"S_DocumentTemplateType\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_DocumentTemplateType", ex);
            }
        }
        public async Task<S_DocumentTemplateType> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"S_DocumentTemplateType\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<S_DocumentTemplateType>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplateType", ex);
            }
        }
        public async Task<S_DocumentTemplateType> GetOneByCode(string code)
        {
            try
            {
                var sql = "SELECT * FROM \"S_DocumentTemplateType\" WHERE code = @code LIMIT 1";
                var models = await _dbConnection.QueryAsync<S_DocumentTemplateType>(sql, new { code }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplateType", ex);
            }
        }


    }
}
