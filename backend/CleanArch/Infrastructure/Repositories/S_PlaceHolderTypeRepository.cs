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
    public class S_PlaceHolderTypeRepository : IS_PlaceHolderTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public S_PlaceHolderTypeRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<S_PlaceHolderType>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"S_PlaceHolderType\"";
                var models = await _dbConnection.QueryAsync<S_PlaceHolderType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_PlaceHolderType", ex);
            }
        }

        public async Task<int> Add(S_PlaceHolderType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_PlaceHolderTypeModel
                {

                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    queueNumber = domain.queueNumber,
                    id = domain.id,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO \"S_PlaceHolderType\"(\"name\", \"description\", \"code\", \"queueNumber\", \"created_at\", \"updated_at\", \"created_by\", \"updated_by\") " +
          "VALUES (@name, @description, @code, @queueNumber, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add S_PlaceHolderType", ex);
            }
        }

        public async Task Update(S_PlaceHolderType domain)
        {
            try
            {

                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_PlaceHolderTypeModel
                {

                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    queueNumber = domain.queueNumber,
                    id = domain.id,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"S_PlaceHolderType\" SET \"name\" = @name, \"description\" = @description, \"code\" = @code, \"queueNumber\" = @queueNumber, \"id\" = @id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_PlaceHolderType", ex);
            }
        }

        public async Task<PaginatedList<S_PlaceHolderType>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"S_PlaceHolderType\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<S_PlaceHolderType>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"S_PlaceHolderType\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<S_PlaceHolderType>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_PlaceHolderTypes", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"S_PlaceHolderType\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_PlaceHolderType", ex);
            }
        }
        public async Task<S_PlaceHolderType> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"S_PlaceHolderType\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<S_PlaceHolderType>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_PlaceHolderType", ex);
            }
        }


    }
}
