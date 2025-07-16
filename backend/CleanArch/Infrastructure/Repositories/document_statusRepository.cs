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
    public class document_statusRepository : Idocument_statusRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public document_statusRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<document_status>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"document_status\"";
                var models = await _dbConnection.QueryAsync<document_status>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_status", ex);
            }
        }

        public async Task<int> Add(document_status domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new document_statusModel
                {
                    
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    name_kg = domain.name_kg,
                    description_kg = domain.description_kg,
                    text_color = domain.text_color,
                    background_color = domain.background_color,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO \"document_status\"(\"name\", \"description\", \"code\", \"text_color\", \"background_color\", created_at, created_by, updated_at, updated_by) " +
                    "VALUES (@name, @description, @code, @text_color, @background_color, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add document_status", ex);
            }
        }

        public async Task Update(document_status domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new document_statusModel
                {
                    
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    text_color = domain.text_color,
                    background_color = domain.background_color,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"document_status\" SET \"id\" = @id, \"name\" = @name, \"description\" = @description, \"code\" = @code, \"text_color\" = @text_color, \"background_color\" = @background_color, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update document_status", ex);
            }
        }

        public async Task<PaginatedList<document_status>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"document_status\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<document_status>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"document_status\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<document_status>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_statuss", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"document_status\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update document_status", ex);
            }
        }
        public async Task<document_status> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"document_status\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<document_status>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_status", ex);
            }
        }
        public async Task<document_status> GetOneByCode(string code)
        {
            try
            {
                var sql = "SELECT * FROM \"document_status\" WHERE code = @code LIMIT 1";
                var models = await _dbConnection.QueryAsync<document_status>(sql, new { code }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_status", ex);
            }
        }


    }
}
