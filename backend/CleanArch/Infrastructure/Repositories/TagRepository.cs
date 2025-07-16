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
    public class TagRepository : ITagRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;


        public TagRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<Tag>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"tag\"";
                var models = await _dbConnection.QueryAsync<Tag>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get tag", ex);
            }
        }

        public async Task<int> Add(Tag domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new TagModel
                {
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO \"tag\"(\"name\", \"description\", \"code\", created_at, created_by, updated_at, updated_by) " +
                    "VALUES (@name, @description, @code, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add Tag", ex);
            }
        }

        public async Task Update(Tag domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new TagModel
                {
                    
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE \"tag\" SET \"id\" = @id, \"name\" = @name, \"description\" = @description, \"code\" = @code, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Tag", ex);
            }
        }

        public async Task<PaginatedList<Tag>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"tag\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<Tag>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"tag\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<Tag>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Tags", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"tag\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Tag", ex);
            }
        }
        public async Task<Tag> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"tag\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<Tag>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Tag", ex);
            }
        }
        public async Task<Tag> GetOneByCode(string code)
        {
            try
            {
                var sql = "SELECT * FROM \"tag\" WHERE code = @code LIMIT 1";
                var models = await _dbConnection.QueryAsync<Tag>(sql, new { code }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Tag", ex);
            }
        }


    }
}
