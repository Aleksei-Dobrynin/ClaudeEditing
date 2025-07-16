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
    public class step_required_documentRepository : Istep_required_documentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public step_required_documentRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<step_required_document>> GetAll()
        {
            try
            {
                var sql = @"SELECT srd.*, ad.name as document_type_name 
                           FROM ""step_required_document"" srd
                           LEFT JOIN ""application_document"" ad ON srd.document_type_id = ad.id";
                var models = await _dbConnection.QueryAsync<step_required_document>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_required_document", ex);
            }
        }

        public async Task<int> Add(step_required_document domain)
        {
            try
            {
                var model = new step_required_documentModel
                {
                    
                    id = domain.id,
                    step_id = domain.step_id,
                    document_type_id = domain.document_type_id,
                    is_required = domain.is_required,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                };
                var sql = @"INSERT INTO ""step_required_document""(""step_id"", ""document_type_id"", ""is_required"", ""created_at"", ""updated_at"") 
                VALUES (@step_id, @document_type_id, @is_required, @created_at, @updated_at) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add step_required_document", ex);
            }
        }

        public async Task Update(step_required_document domain)
        {
            try
            {
                var model = new step_required_documentModel
                {
                    
                    id = domain.id,
                    step_id = domain.step_id,
                    document_type_id = domain.document_type_id,
                    is_required = domain.is_required,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                };
                var sql = @"UPDATE ""step_required_document"" SET ""id"" = @id, ""step_id"" = @step_id, ""document_type_id"" = @document_type_id, ""is_required"" = @is_required, ""created_at"" = @created_at, ""updated_at"" = @updated_at WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update step_required_document", ex);
            }
        }

        public async Task<PaginatedList<step_required_document>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT srd.*, ad.name as document_type_name 
                           FROM ""step_required_document"" srd
                           LEFT JOIN ""application_document"" ad ON srd.document_type_id = ad.id
                           OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<step_required_document>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""step_required_document""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<step_required_document>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_required_documents", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""step_required_document"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update step_required_document", ex);
            }
        }
        public async Task<step_required_document> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT srd.*, ad.name as document_type_name 
                           FROM ""step_required_document"" srd
                           LEFT JOIN ""application_document"" ad ON srd.document_type_id = ad.id
                           WHERE srd.id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<step_required_document>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_required_document", ex);
            }
        }

        
        public async Task<List<step_required_document>> GetBystep_id(int step_id)
        {
            try
            {
                var sql = @"SELECT srd.*, ad.name as document_type_name 
                           FROM ""step_required_document"" srd
                           LEFT JOIN ""application_document"" ad ON srd.document_type_id = ad.id
                           WHERE srd.step_id = @step_id";
                var models = await _dbConnection.QueryAsync<step_required_document>(sql, new { step_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_required_document", ex);
            }
        }
        
        public async Task<List<step_required_document>> GetBydocument_type_id(int document_type_id)
        {
            try
            {
                var sql = @"SELECT srd.*, ad.name as document_type_name 
                           FROM ""step_required_document"" srd
                           LEFT JOIN ""application_document"" ad ON srd.document_type_id = ad.id
                           WHERE srd.document_type_id = @document_type_id";
                var models = await _dbConnection.QueryAsync<step_required_document>(sql, new { document_type_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_required_document", ex);
            }
        }
        
        
        public async Task<List<step_required_document>> GetByPathIds(int[] path_ids)
        {
            try
            {
                var sql = @"
SELECT doc.*, ad.name doc_name FROM step_required_document doc 
    left join application_document ad on ad.id = doc.document_type_id
WHERE doc.step_id = ANY(@path_ids)";
                var models = await _dbConnection.QueryAsync<step_required_document>(sql, new { path_ids }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_required_document", ex);
            }
        }
        
    }
}