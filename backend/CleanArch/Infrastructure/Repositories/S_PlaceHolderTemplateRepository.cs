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
    public class S_PlaceHolderTemplateRepository : IS_PlaceHolderTemplateRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public S_PlaceHolderTemplateRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<S_PlaceHolderTemplate>> GetAll()
        {
            try
            {
                var sql = @"
SELECT
	place.""id"",
	place.""name"",
	place.""value"",
	place.""code"",
	place.""idQuery"",
	place.""idPlaceholderType"",
	
	typ.""id"" as S_PlaceHolderTypeId,
	typ.""name"",
	typ.""code"",
	typ.""description"",
	typ.""queueNumber""
	
FROM ""S_PlaceHolderTemplate"" place
LEFT JOIN ""S_PlaceHolderType"" typ on typ.id = place.""idPlaceholderType""
";
                var models = await _dbConnection.QueryAsync<S_PlaceHolderTemplate, S_PlaceHolderType, S_PlaceHolderTemplate>(sql, 
                    (placeholder, placeholderType) =>
                    {
                        placeholder.S_PlaceHolderType = placeholderType;
                        return placeholder;
                    },
                    splitOn: "S_PlaceHolderTypeId");
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_PlaceHolderTemplate", ex);
            }
        }
        public async Task<List<S_PlaceHolderTemplate>> GetByNames(List<string> placeholderNames)
        {
            try
            {
                var sql = "SELECT * FROM \"S_PlaceHolderTemplate\" plac WHERE plac.\"name\" in @placeholderNames";
                var models = await _dbConnection.QueryAsync<S_PlaceHolderTemplate>(sql, new { placeholderNames }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_PlaceHolderTemplate", ex);
            }
        }

        
        public async Task<int> Add(S_PlaceHolderTemplate domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_PlaceHolderTemplateModel
                {

                    id = domain.id,
                    name = domain.name,
                    value = domain.value,
                    code = domain.code,
                    idQuery = domain.idQuery,
                    idPlaceholderType = domain.idPlaceholderType,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO \"S_PlaceHolderTemplate\"(\"name\", \"value\", \"code\", \"idQuery\", \"idPlaceholderType\", created_at, updated_at, created_by, updated_by) " +
                    "VALUES (@name, @value, @code, @idQuery, @idPlaceholderType, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add S_PlaceHolderTemplate", ex);
            }
        }

        public async Task Update(S_PlaceHolderTemplate domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_PlaceHolderTemplateModel
                {

                    id = domain.id,
                    name = domain.name,
                    value = domain.value,
                    code = domain.code,
                    idQuery = domain.idQuery,
                    idPlaceholderType = domain.idPlaceholderType,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"S_PlaceHolderTemplate\" SET \"id\" = @id, \"name\" = @name, \"value\" = @value, \"code\" = @code, \"idQuery\" = @idQuery, \"idPlaceholderType\" = @idPlaceholderType, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_PlaceHolderTemplate", ex);
            }
        }

        public async Task<PaginatedList<S_PlaceHolderTemplate>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"S_PlaceHolderTemplate\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<S_PlaceHolderTemplate>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"S_PlaceHolderTemplate\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<S_PlaceHolderTemplate>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_PlaceHolderTemplates", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"S_PlaceHolderTemplate\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_PlaceHolderTemplate", ex);
            }
        }
        public async Task<S_PlaceHolderTemplate> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"S_PlaceHolderTemplate\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<S_PlaceHolderTemplate>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_PlaceHolderTemplate", ex);
            }
        }


        public async Task<List<S_PlaceHolderTemplate>> GetByidQuery(int idQuery)
        {
            try
            {
                var sql = "SELECT * FROM \"S_PlaceHolderTemplate\" WHERE \"idQuery\" = @idQuery";
                var models = await _dbConnection.QueryAsync<S_PlaceHolderTemplate>(sql, new { idQuery }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_PlaceHolderTemplate", ex);
            }
        }

        public async Task<List<S_PlaceHolderTemplate>> GetByidPlaceholderType(int idPlaceholderType)
        {
            try
            {
                var sql = "SELECT * FROM \"S_PlaceHolderTemplate\" WHERE \"idPlaceholderType\" = @idPlaceholderType";
                var models = await _dbConnection.QueryAsync<S_PlaceHolderTemplate>(sql, new { idPlaceholderType }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_PlaceHolderTemplate", ex);
            }
        }

    }
}
