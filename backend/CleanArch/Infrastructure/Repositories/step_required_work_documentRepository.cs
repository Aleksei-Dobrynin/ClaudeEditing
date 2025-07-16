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
    public class step_required_work_documentRepository : Istep_required_work_documentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public step_required_work_documentRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<step_required_work_document>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""step_required_work_document""";
                var models = await _dbConnection.QueryAsync<step_required_work_document>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_required_work_document", ex);
            }
        }

        public async Task<int> Add(step_required_work_document domain)
        {
            try
            {
                var model = new step_required_work_documentModel
                {
                    
                    id = domain.id,
                    step_id = domain.step_id,
                    work_document_type_id = domain.work_document_type_id,
                    is_required = domain.is_required,
                    description = domain.description,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"INSERT INTO ""step_required_work_document""(""step_id"", ""work_document_type_id"", ""is_required"", ""description"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@step_id, @work_document_type_id, @is_required, @description, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add step_required_work_document", ex);
            }
        }

        public async Task Update(step_required_work_document domain)
        {
            try
            {
                var model = new step_required_work_documentModel
                {
                    
                    id = domain.id,
                    step_id = domain.step_id,
                    work_document_type_id = domain.work_document_type_id,
                    is_required = domain.is_required,
                    description = domain.description,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"UPDATE ""step_required_work_document"" SET ""id"" = @id, ""step_id"" = @step_id, ""work_document_type_id"" = @work_document_type_id, ""is_required"" = @is_required, ""description"" = @description, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update step_required_work_document", ex);
            }
        }

        public async Task<PaginatedList<step_required_work_document>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""step_required_work_document"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<step_required_work_document>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""step_required_work_document""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<step_required_work_document>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_required_work_documents", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""step_required_work_document"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update step_required_work_document", ex);
            }
        }
        public async Task<step_required_work_document> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""step_required_work_document"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<step_required_work_document>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_required_work_document", ex);
            }
        }

        
        public async Task<List<step_required_work_document>> GetBystep_id(int step_id)
        {
            try
            {
                var sql = "SELECT * FROM \"step_required_work_document\" WHERE \"step_id\" = @step_id";
                var models = await _dbConnection.QueryAsync<step_required_work_document>(sql, new { step_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_required_work_document", ex);
            }
        }
        
        public async Task<List<step_required_work_document>> GetBywork_document_type_id(int work_document_type_id)
        {
            try
            {
                var sql = "SELECT * FROM \"step_required_work_document\" WHERE \"work_document_type_id\" = @work_document_type_id";
                var models = await _dbConnection.QueryAsync<step_required_work_document>(sql, new { work_document_type_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_required_work_document", ex);
            }
        }
        
    }
}
