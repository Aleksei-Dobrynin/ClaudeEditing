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
    public class document_approvalRepository : Idocument_approvalRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public document_approvalRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<document_approval>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""document_approval""";
                var models = await _dbConnection.QueryAsync<document_approval>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval", ex);
            }
        }

        public async Task<int> Add(document_approval domain)
        {
            try
            {
                var model = new document_approvalModel
                {
                    
                    id = domain.id,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    app_document_id = domain.app_document_id,
                    file_sign_id = domain.file_sign_id,
                    department_id = domain.department_id,
                    position_id = domain.position_id,
                    status = domain.status,
                    approval_date = domain.approval_date,
                    comments = domain.comments,
                    created_at = domain.created_at,
                    app_step_id = domain.app_step_id,
                    document_type_id = domain.document_type_id,
                    is_required_approver = domain.is_required_approver,
                    is_required_doc = domain.is_required_doc,
                };
                var sql = @"INSERT INTO ""document_approval""(""updated_at"", ""created_by"", ""updated_by"", ""app_document_id"", ""file_sign_id"", ""department_id"", ""position_id"", ""status"", ""approval_date"", ""comments"", ""created_at"", app_step_id, document_type_id, is_required_approver, is_required_doc) 
                VALUES (@updated_at, @created_by, @updated_by, @app_document_id, @file_sign_id, @department_id, @position_id, @status, @approval_date, @comments, @created_at, @app_step_id, @document_type_id, @is_required_approver, @is_required_doc) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add document_approval", ex);
            }
        }

        public async Task Update(document_approval domain)
        {
            try
            {
                var model = new document_approvalModel
                {
                    
                    id = domain.id,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    app_document_id = domain.app_document_id,
                    file_sign_id = domain.file_sign_id,
                    department_id = domain.department_id,
                    position_id = domain.position_id,
                    status = domain.status,
                    approval_date = domain.approval_date,
                    comments = domain.comments,
                    app_step_id = domain.app_step_id,
                    document_type_id = domain.document_type_id,
                    created_at = domain.created_at,
                    is_required_doc = domain.is_required_doc,
                    is_required_approver = domain.is_required_approver,
                };
                var sql = @"UPDATE ""document_approval"" SET  is_required_approver = @is_required_approver, is_required_doc = @is_required_doc,  ""id"" = @id, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""app_document_id"" = @app_document_id, ""file_sign_id"" = @file_sign_id, ""department_id"" = @department_id, ""position_id"" = @position_id, ""status"" = @status, ""approval_date"" = @approval_date, ""comments"" = @comments, ""created_at"" = @created_at, document_type_id = @document_type_id, app_step_id = @app_step_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update document_approval", ex);
            }
        }

        public async Task<PaginatedList<document_approval>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""document_approval"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<document_approval>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""document_approval""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<document_approval>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approvals", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""document_approval"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update document_approval", ex);
            }
        }
        public async Task<document_approval> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""document_approval"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<document_approval>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval", ex);
            }
        }

        
        public async Task<List<document_approval>> GetByapp_document_id(int app_document_id)
        {
            try
            {
                var sql = "SELECT * FROM \"document_approval\" WHERE \"app_document_id\" = @app_document_id";
                var models = await _dbConnection.QueryAsync<document_approval>(sql, new { app_document_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval", ex);
            }
        }
        
        public async Task<List<document_approval>> GetByfile_sign_id(int file_sign_id)
        {
            try
            {
                var sql = "SELECT * FROM \"document_approval\" WHERE \"file_sign_id\" = @file_sign_id";
                var models = await _dbConnection.QueryAsync<document_approval>(sql, new { file_sign_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval", ex);
            }
        }
        
        public async Task<List<document_approval>> GetBydepartment_id(int department_id)
        {
            try
            {
                var sql = "SELECT * FROM \"document_approval\" WHERE \"department_id\" = @department_id";
                var models = await _dbConnection.QueryAsync<document_approval>(sql, new { department_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval", ex);
            }
        }
        
        public async Task<List<document_approval>> GetByposition_id(int position_id)
        {
            try
            {
                var sql = "SELECT * FROM \"document_approval\" WHERE \"position_id\" = @position_id";
                var models = await _dbConnection.QueryAsync<document_approval>(sql, new { position_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval", ex);
            }
        }
        public async Task<List<document_approval>> GetByUplIds(int[] ids)
        {
            try
            {
                var sql = @"
SELECT * FROM document_approval WHERE app_document_id = ANY(@ids)
";
                var models = await _dbConnection.QueryAsync<document_approval>(sql, new { ids }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval", ex);
            }
        }


        public async Task<List<document_approval>> GetByAppStepIds(int[] ids)
        {
            try
            {
                var sql = @"
SELECT vals.*, post.name position_name, org.name department_name, ad.name as document_name FROM document_approval vals
    left join org_structure org on org.id = vals.department_id
    left join structure_post post on post.id = vals.position_id
    left join application_document ad on ad.id = vals.document_type_id
WHERE app_step_id = ANY(@ids)
";
                var models = await _dbConnection.QueryAsync<document_approval>(sql, new { ids }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval", ex);
            }
        }
    }
}
