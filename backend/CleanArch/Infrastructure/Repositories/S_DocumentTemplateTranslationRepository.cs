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
    public class S_DocumentTemplateTranslationRepository : IS_DocumentTemplateTranslationRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public S_DocumentTemplateTranslationRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<S_DocumentTemplateTranslation>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"S_DocumentTemplateTranslation\"";
                var models = await _dbConnection.QueryAsync<S_DocumentTemplateTranslation>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplateTranslation", ex);
            }
        }

        public async Task<int> Add(S_DocumentTemplateTranslation domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_DocumentTemplateTranslationModel
                {

                    id = domain.id,
                    template = domain.template,
                    idDocumentTemplate = domain.idDocumentTemplate,
                    idLanguage = domain.idLanguage,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO \"S_DocumentTemplateTranslation\"(\"template\", \"idDocumentTemplate\", \"idLanguage\", created_at, updated_at, created_by, updated_by) " +
                    "VALUES (@template, @idDocumentTemplate, @idLanguage, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add S_DocumentTemplateTranslation", ex);
            }
        }

        public async Task Update(S_DocumentTemplateTranslation domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_DocumentTemplateTranslationModel
                {

                    id = domain.id,
                    template = domain.template,
                    idDocumentTemplate = domain.idDocumentTemplate,
                    idLanguage = domain.idLanguage,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"S_DocumentTemplateTranslation\" SET \"id\" = @id, \"template\" = @template, \"idDocumentTemplate\" = @idDocumentTemplate, \"idLanguage\" = @idLanguage, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_DocumentTemplateTranslation", ex);
            }
        }

        public async Task<PaginatedList<S_DocumentTemplateTranslation>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"S_DocumentTemplateTranslation\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<S_DocumentTemplateTranslation>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"S_DocumentTemplateTranslation\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<S_DocumentTemplateTranslation>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplateTranslations", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"S_DocumentTemplateTranslation\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_DocumentTemplateTranslation", ex);
            }
        }
        public async Task DeleteByTemplate(int idDocumentTemplate)
        {
            try
            {
                var model = new { idDocumentTemplate };
                var sql = "DELETE FROM \"S_DocumentTemplateTranslation\" WHERE \"idDocumentTemplate\" = @idDocumentTemplate";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_DocumentTemplateTranslation", ex);
            }
        }
        public async Task<S_DocumentTemplateTranslation> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"S_DocumentTemplateTranslation\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<S_DocumentTemplateTranslation>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplateTranslation", ex);
            }
        }


        public async Task<List<S_DocumentTemplateTranslation>> GetByidDocumentTemplate(int idDocumentTemplate)
        {
            try
            {
                var sql = @"SELECT tr.*, l.name idLanguage_name FROM ""S_DocumentTemplateTranslation"" tr left join ""Language"" l on tr.""idLanguage"" = l.id WHERE ""idDocumentTemplate"" = @idDocumentTemplate order by l.name";
                var models = await _dbConnection.QueryAsync<S_DocumentTemplateTranslation>(sql, new { idDocumentTemplate }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplateTranslation", ex);
            }
        }

        public async Task<List<S_DocumentTemplateTranslation>> GetByidLanguage(int idLanguage)
        {
            try
            {
                var sql = "SELECT * FROM \"S_DocumentTemplateTranslation\" WHERE \"idLanguage\" = @idLanguage";
                var models = await _dbConnection.QueryAsync<S_DocumentTemplateTranslation>(sql, new { idLanguage }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplateTranslation", ex);
            }
        }

    }
}
