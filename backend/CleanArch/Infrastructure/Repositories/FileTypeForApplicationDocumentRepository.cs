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
    public class FileTypeForApplicationDocumentRepository : IFileTypeForApplicationDocumentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public FileTypeForApplicationDocumentRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<FileTypeForApplicationDocument>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, description, code FROM file_type_for_application_document";
                var models = await _dbConnection.QueryAsync<FileTypeForApplicationDocument>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get FileTypeForApplicationDocument", ex);
            }
        }

        public async Task<FileTypeForApplicationDocument> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, description, code FROM file_type_for_application_document WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<FileTypeForApplicationDocument>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"FileTypeForApplicationDocument with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get FileTypeForApplicationDocument", ex);
            }
        }

        public async Task<int> Add(FileTypeForApplicationDocument domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new FileTypeForApplicationDocument
                {
                    name = domain.name,
                    code = domain.code,
                    description = domain.description
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO file_type_for_application_document(name, code, description, created_at, updated_at, created_by, updated_by) VALUES (@name, @code, @description, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add FileTypeForApplicationDocument", ex);
            }
        }

        public async Task Update(FileTypeForApplicationDocument domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new FileTypeForApplicationDocument
                {
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE file_type_for_application_document SET name = @name, code = @code, description = @description, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update FileTypeForApplicationDocument", ex);
            }
        }

        public async Task<PaginatedList<FileTypeForApplicationDocument>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM file_type_for_application_document OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<FileTypeForApplicationDocument>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM file_type_for_application_document";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<FileTypeForApplicationDocument>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get FileTypeForApplicationDocument", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM file_type_for_application_document WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("FileTypeForApplicationDocument not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete FileTypeForApplicationDocument", ex);
            }
        }
    }
}
