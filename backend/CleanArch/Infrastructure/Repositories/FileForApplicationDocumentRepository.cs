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
    public class FileForApplicationDocumentRepository : IFileForApplicationDocumentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public FileForApplicationDocumentRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<FileForApplicationDocument>> GetAll()
        {
            try
            {
                var sql = "SELECT id, file_id, document_id, type_id, name FROM file_for_application_document";
                var models = await _dbConnection.QueryAsync<FileForApplicationDocument>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get FileForApplicationDocument", ex);
            }
        }
        
        public async Task<List<FileForApplicationDocument>> GetByidDocument(int idDocument)
        {
            try
            {
                var sql = @"SELECT file_for_application_document.id, file_id, document_id, type_id, file_for_application_document.name,
                                   file.name as file_name, file_type_for_application_document.name as type_name
                            FROM file_for_application_document
                                     LEFT JOIN file ON file.id = file_for_application_document.file_id
                                     LEFT JOIN file_type_for_application_document
                                               ON file_for_application_document.type_id = file_type_for_application_document.id
                            WHERE document_id = @IdDocument";
                var models = await _dbConnection.QueryAsync<FileForApplicationDocument>(sql, new { IdDocument = idDocument }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get FileForApplicationDocument", ex);
            }
        }

        public async Task<FileForApplicationDocument> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT file_for_application_document.id, file_id, document_id, type_id, file_for_application_document.name, file.name as file_name FROM file_for_application_document LEFT JOIN file ON file.id = file_for_application_document.file_id WHERE file_for_application_document.id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<FileForApplicationDocument>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"FileForApplicationDocument with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get FileForApplicationDocument", ex);
            }
        }

        public async Task<int> Add(FileForApplicationDocument domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new FileForApplicationDocument
                {
                    file_id = domain.file_id,
                    document_id = domain.document_id,
                    type_id = domain.type_id,
                    name = domain.name
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO file_for_application_document(file_id, document_id, type_id, name, created_at, updated_at, created_by, updated_by) VALUES (@file_id, @document_id, @type_id, @name, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add FileForApplicationDocument", ex);
            }
        }

        public async Task Update(FileForApplicationDocument domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new FileForApplicationDocument
                {
                    id = domain.id,
                    file_id = domain.file_id,
                    document_id = domain.document_id,
                    type_id = domain.type_id,
                    name = domain.name
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE file_for_application_document SET file_id = @file_id, document_id = @document_id, type_id = @type_id, name = @name, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update FileForApplicationDocument", ex);
            }
        }

        public async Task<PaginatedList<FileForApplicationDocument>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM file_for_application_document OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<FileForApplicationDocument>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM file_for_application_document";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<FileForApplicationDocument>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get FileForApplicationDocument", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM file_for_application_document WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("FileForApplicationDocument not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete FileForApplicationDocument", ex);
            }
        }
    }
}
