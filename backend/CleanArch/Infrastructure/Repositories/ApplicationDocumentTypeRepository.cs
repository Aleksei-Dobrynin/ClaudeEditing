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
    public class ApplicationDocumentTypeRepository : IApplicationDocumentTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ApplicationDocumentTypeRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationDocumentType>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, description, code FROM application_document_type";
                var models = await _dbConnection.QueryAsync<ApplicationDocumentType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocumentType", ex);
            }
        }

        public async Task<ApplicationDocumentType> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, description, code FROM application_document_type WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationDocumentType>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationDocumentType with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocumentType", ex);
            }
        }

        public async Task<int> Add(ApplicationDocumentType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationDocumentType
                {
                    name = domain.name,
                    code = domain.code,
                    description = domain.description
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO application_document_type(name, code, description, created_at, updated_at, created_by, updated_by) VALUES (@name, @code, @description, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationDocumentType", ex);
            }
        }

        public async Task Update(ApplicationDocumentType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationDocumentType
                {
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE application_document_type SET name = @name, code = @code, description = @description, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationDocumentType", ex);
            }
        }

        public async Task<PaginatedList<ApplicationDocumentType>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM application_document_type OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ApplicationDocumentType>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM application_document_type";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ApplicationDocumentType>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocumentType", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM application_document_type WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationDocumentType not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationDocumentType", ex);
            }
        }
    }
}
