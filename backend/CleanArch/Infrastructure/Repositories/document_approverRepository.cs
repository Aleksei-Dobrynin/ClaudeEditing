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
    public class document_approverRepository : Idocument_approverRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public document_approverRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<document_approver>> GetAll()
        {
            try
            {
                var sql = @"SELECT da.*, os.name AS department_name, sp.name AS position_name FROM ""document_approver"" da 
LEFT JOIN org_structure os ON da.department_id = os.id
LEFT JOIN structure_post sp ON da.position_id = sp.id";
                var models = await _dbConnection.QueryAsync<document_approver>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approver", ex);
            }
        }

        public async Task<int> Add(document_approver domain)
        {
            try
            {
                var model = new document_approverModel
                {

                    id = domain.id,
                    step_doc_id = domain.step_doc_id,
                    department_id = domain.department_id,
                    position_id = domain.position_id,
                    is_required = domain.is_required,
                    approval_order = domain.approval_order,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                };
                var sql = @"INSERT INTO ""document_approver""(""step_doc_id"", ""department_id"", ""position_id"", ""is_required"", ""approval_order"", ""created_at"", ""updated_at"") 
                VALUES (@step_doc_id, @department_id, @position_id, @is_required, @approval_order, @created_at, @updated_at) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add document_approver", ex);
            }
        }

        public async Task Update(document_approver domain)
        {
            try
            {
                var model = new document_approverModel
                {

                    id = domain.id,
                    step_doc_id = domain.step_doc_id,
                    department_id = domain.department_id,
                    position_id = domain.position_id,
                    is_required = domain.is_required,
                    approval_order = domain.approval_order,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                };
                var sql = @"UPDATE ""document_approver"" SET ""id"" = @id, ""step_doc_id"" = @step_doc_id, ""department_id"" = @department_id, ""position_id"" = @position_id, ""is_required"" = @is_required, ""approval_order"" = @approval_order, ""created_at"" = @created_at, ""updated_at"" = @updated_at WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update document_approver", ex);
            }
        }

        public async Task<PaginatedList<document_approver>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""document_approver"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<document_approver>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""document_approver""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<document_approver>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approvers", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""document_approver"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update document_approver", ex);
            }
        }
        public async Task<document_approver> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""document_approver"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<document_approver>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approver", ex);
            }
        }


        public async Task<List<document_approver>> GetBystep_doc_id(int step_doc_id)
        {
            try
            {
                var sql = @"SELECT da.*, os.name AS department_name, sp.name AS position_name FROM ""document_approver"" AS da 
                LEFT JOIN org_structure os ON da.department_id = os.id
                LEFT JOIN structure_post sp ON da.position_id = sp.id WHERE step_doc_id = @step_doc_id";
                var models = await _dbConnection.QueryAsync<document_approver>(sql, new { step_doc_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approver", ex);
            }
        }
        public async Task<List<document_approver>> GetBystep_doc_ids(int[] step_docs_ids)
        {
            try
            {
                var sql = @"
SELECT ver.*, org.name department_name, post.name position_name FROM document_approver ver
    left join org_structure org on org.id = ver.department_id
    left join structure_post post on post.id = ver.position_id
WHERE ver.step_doc_id = ANY(@step_docs_ids)";
                var models = await _dbConnection.QueryAsync<document_approver>(sql, new { step_docs_ids }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approver", ex);
            }
        }

        public async Task<List<document_approver>> GetBydepartment_id(int department_id)
        {
            try
            {
                var sql = "SELECT * FROM \"document_approver\" WHERE \"department_id\" = @department_id";
                var models = await _dbConnection.QueryAsync<document_approver>(sql, new { department_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approver", ex);
            }
        }

        public async Task<List<document_approver>> GetByposition_id(int position_id)
        {
            try
            {
                var sql = "SELECT * FROM \"document_approver\" WHERE \"position_id\" = @position_id";
                var models = await _dbConnection.QueryAsync<document_approver>(sql, new { position_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approver", ex);
            }
        }

        public async Task<List<document_approver>> GetByPathId(int path_id)
        {
            try
            {
                var sql = @"SELECT 
    da.*
FROM 
    document_approver da
JOIN 
    step_required_document srd ON da.step_doc_id = srd.id
JOIN 
    path_step ps ON srd.step_id = ps.id
WHERE 
    ps.path_id = @path_id
ORDER BY 
    ps.order_number,
    da.approval_order;";
                var models = await _dbConnection.QueryAsync<document_approver>(sql, new { path_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approver", ex);
            }
        }

    }
}
