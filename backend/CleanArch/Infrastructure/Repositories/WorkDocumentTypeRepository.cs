using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;

namespace Infrastructure.Repositories
{
    public class WorkDocumentTypeRepository : IWorkDocumentTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public WorkDocumentTypeRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<WorkDocumentType>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, description, code, metadata FROM work_document_type";
                var models = await _dbConnection.QueryAsync<WorkDocumentType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkDocumentType", ex);
            }
        }

        public async Task<WorkDocumentType> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, description, code, metadata FROM work_document_type WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<WorkDocumentType>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"WorkDocumentType with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkDocumentType", ex);
            }
        }
        
        public async Task<WorkDocumentType> GetOneByCode(string code)
        {
            try
            {
                var sql = "SELECT id, name, description, code, metadata FROM work_document_type WHERE code=@code";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<WorkDocumentType>(sql, new { code = code }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"WorkDocumentType with Code {code} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkDocumentType", ex);
            }
        }

        public async Task<int> Add(WorkDocumentType domain)
        {
            try
            {
                var model = new WorkDocumentType
                {
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                    metadata = domain.metadata
                };
                var sql = "INSERT INTO work_document_type(name, code, description, metadata) VALUES (@name, @code, @description, @metadata::jsonb) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add WorkDocumentType", ex);
            }
        }

        public async Task Update(WorkDocumentType domain)
        {
            try
            {
                var model = new WorkDocumentType
                {
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                    metadata = domain.metadata
                };
                var sql = "UPDATE work_document_type SET name = @name, code = @code, description = @description, metadata = @metadata::jsonb WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update WorkDocumentType", ex);
            }
        }

        public async Task<PaginatedList<WorkDocumentType>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM work_document_type OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<WorkDocumentType>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM work_document_type";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<WorkDocumentType>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkDocumentType", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM work_document_type WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("WorkDocumentType not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete WorkDocumentType", ex);
            }
        }
    }
}
