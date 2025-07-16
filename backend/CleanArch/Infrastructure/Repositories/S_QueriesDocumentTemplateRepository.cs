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
    public class S_QueriesDocumentTemplateRepository : IS_QueriesDocumentTemplateRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public S_QueriesDocumentTemplateRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<S_QueriesDocumentTemplate>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"S_QueriesDocumentTemplate\"";
                var models = await _dbConnection.QueryAsync<S_QueriesDocumentTemplate>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_QueriesDocumentTemplate", ex);
            }
        }

        public async Task<int> Add(S_QueriesDocumentTemplate domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_QueriesDocumentTemplateModel
                {

                    id = domain.id,
                    idDocumentTemplate = domain.idDocumentTemplate,
                    idQuery = domain.idQuery,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO \"S_QueriesDocumentTemplate\"(\"idDocumentTemplate\", \"idQuery\", created_at, updated_at, created_by, updated_by) " +
                    "VALUES (@idDocumentTemplate, @idQuery, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add S_QueriesDocumentTemplate", ex);
            }
        }

        public async Task Update(S_QueriesDocumentTemplate domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_QueriesDocumentTemplateModel
                {

                    id = domain.id,
                    idDocumentTemplate = domain.idDocumentTemplate,
                    idQuery = domain.idQuery,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"S_QueriesDocumentTemplate\" SET \"id\" = @id, \"idDocumentTemplate\" = @idDocumentTemplate, \"idQuery\" = @idQuery, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_QueriesDocumentTemplate", ex);
            }
        }

        public async Task<PaginatedList<S_QueriesDocumentTemplate>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"S_QueriesDocumentTemplate\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<S_QueriesDocumentTemplate>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"S_QueriesDocumentTemplate\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<S_QueriesDocumentTemplate>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_QueriesDocumentTemplates", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"S_QueriesDocumentTemplate\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_QueriesDocumentTemplate", ex);
            }
        }
        public async Task<S_QueriesDocumentTemplate> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"S_QueriesDocumentTemplate\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<S_QueriesDocumentTemplate>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_QueriesDocumentTemplate", ex);
            }
        }


        public async Task<List<S_QueriesDocumentTemplate>> GetByidDocumentTemplate(int idDocumentTemplate)
        {
            try
            {
                var sql = "SELECT * FROM \"S_QueriesDocumentTemplate\" WHERE \"idDocumentTemplate\" = @idDocumentTemplate";
                var models = await _dbConnection.QueryAsync<S_QueriesDocumentTemplate>(sql, new { idDocumentTemplate }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_QueriesDocumentTemplate", ex);
            }
        }

        public async Task<List<S_QueriesDocumentTemplate>> GetByidQuery(int idQuery)
        {
            try
            {
                var sql = "SELECT * FROM \"S_QueriesDocumentTemplate\" WHERE \"idQuery\" = @idQuery";
                var models = await _dbConnection.QueryAsync<S_QueriesDocumentTemplate>(sql, new { idQuery }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_QueriesDocumentTemplate", ex);
            }
        }

    }
}
