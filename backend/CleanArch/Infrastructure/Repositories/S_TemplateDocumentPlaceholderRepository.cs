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
    public class S_TemplateDocumentPlaceholderRepository : IS_TemplateDocumentPlaceholderRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public S_TemplateDocumentPlaceholderRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<S_TemplateDocumentPlaceholder>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"S_TemplateDocumentPlaceholder\"";
                var models = await _dbConnection.QueryAsync<S_TemplateDocumentPlaceholder>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_TemplateDocumentPlaceholder", ex);
            }
        }

        public async Task<int> Add(S_TemplateDocumentPlaceholder domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_TemplateDocumentPlaceholderModel
                {

                    id = domain.id,
                    idTemplateDocument = domain.idTemplateDocument,
                    idPlaceholder = domain.idPlaceholder,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO \"S_TemplateDocumentPlaceholder\"(\"idTemplateDocument\", \"idPlaceholder\", created_at, updated_at, created_by, updated_by) " +
                    "VALUES (@idTemplateDocument, @idPlaceholder, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add S_TemplateDocumentPlaceholder", ex);
            }
        }

        public async Task Update(S_TemplateDocumentPlaceholder domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_TemplateDocumentPlaceholderModel
                {

                    id = domain.id,
                    idTemplateDocument = domain.idTemplateDocument,
                    idPlaceholder = domain.idPlaceholder,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"S_TemplateDocumentPlaceholder\" SET \"id\" = @id, \"idTemplateDocument\" = @idTemplateDocument, \"idPlaceholder\" = @idPlaceholder, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_TemplateDocumentPlaceholder", ex);
            }
        }

        public async Task<PaginatedList<S_TemplateDocumentPlaceholder>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"S_TemplateDocumentPlaceholder\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<S_TemplateDocumentPlaceholder>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"S_TemplateDocumentPlaceholder\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<S_TemplateDocumentPlaceholder>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_TemplateDocumentPlaceholders", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"S_TemplateDocumentPlaceholder\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_TemplateDocumentPlaceholder", ex);
            }
        }
        public async Task<S_TemplateDocumentPlaceholder> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"S_TemplateDocumentPlaceholder\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<S_TemplateDocumentPlaceholder>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_TemplateDocumentPlaceholder", ex);
            }
        }


        public async Task<List<S_TemplateDocumentPlaceholder>> GetByidTemplateDocument(int idTemplateDocument)
        {
            try
            {
                var sql = "SELECT * FROM \"S_TemplateDocumentPlaceholder\" WHERE \"idTemplateDocument\" = @idTemplateDocument";
                var models = await _dbConnection.QueryAsync<S_TemplateDocumentPlaceholder>(sql, new { idTemplateDocument }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_TemplateDocumentPlaceholder", ex);
            }
        }

        public async Task<List<S_TemplateDocumentPlaceholder>> GetByidPlaceholder(int idPlaceholder)
        {
            try
            {
                var sql = "SELECT * FROM \"S_TemplateDocumentPlaceholder\" WHERE \"idPlaceholder\" = @idPlaceholder";
                var models = await _dbConnection.QueryAsync<S_TemplateDocumentPlaceholder>(sql, new { idPlaceholder }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_TemplateDocumentPlaceholder", ex);
            }
        }

    }
}
