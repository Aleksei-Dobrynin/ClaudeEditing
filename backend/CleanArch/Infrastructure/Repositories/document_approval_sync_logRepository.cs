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
    public class document_approval_sync_logRepository : Idocument_approval_sync_logRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public document_approval_sync_logRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<document_approval_sync_log>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""document_approval_sync_log"" ORDER BY synced_at DESC";
                var models = await _dbConnection.QueryAsync<document_approval_sync_log>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval_sync_log", ex);
            }
        }

        public async Task<int> Add(document_approval_sync_log domain)
        {
            try
            {
                var model = new document_approval_sync_logModel
                {
                    document_approval_id = domain.document_approval_id,
                    old_department_id = domain.old_department_id,
                    new_department_id = domain.new_department_id,
                    old_position_id = domain.old_position_id,
                    new_position_id = domain.new_position_id,
                    sync_reason = domain.sync_reason,
                    synced_at = domain.synced_at,
                    synced_by = domain.synced_by,
                    operation_type = domain.operation_type
                };

                var sql = @"INSERT INTO ""document_approval_sync_log""
                    (""document_approval_id"", ""old_department_id"", ""new_department_id"", 
                     ""old_position_id"", ""new_position_id"", ""sync_reason"", 
                     ""synced_at"", ""synced_by"", ""operation_type"") 
                VALUES 
                    (@document_approval_id, @old_department_id, @new_department_id, 
                     @old_position_id, @new_position_id, @sync_reason, 
                     @synced_at, @synced_by, @operation_type) 
                RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add document_approval_sync_log", ex);
            }
        }

        public async Task Update(document_approval_sync_log domain)
        {
            try
            {
                var model = new document_approval_sync_logModel
                {
                    id = domain.id,
                    document_approval_id = domain.document_approval_id,
                    old_department_id = domain.old_department_id,
                    new_department_id = domain.new_department_id,
                    old_position_id = domain.old_position_id,
                    new_position_id = domain.new_position_id,
                    sync_reason = domain.sync_reason,
                    synced_at = domain.synced_at,
                    synced_by = domain.synced_by,
                    operation_type = domain.operation_type
                };

                var sql = @"UPDATE ""document_approval_sync_log"" 
                SET 
                    ""document_approval_id"" = @document_approval_id,
                    ""old_department_id"" = @old_department_id,
                    ""new_department_id"" = @new_department_id,
                    ""old_position_id"" = @old_position_id,
                    ""new_position_id"" = @new_position_id,
                    ""sync_reason"" = @sync_reason,
                    ""synced_at"" = @synced_at,
                    ""synced_by"" = @synced_by,
                    ""operation_type"" = @operation_type
                WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update document_approval_sync_log", ex);
            }
        }

        public async Task<PaginatedList<document_approval_sync_log>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"
                    SELECT 
                        log.*,
                        old_dept.name as old_department_name,
                        new_dept.name as new_department_name,
                        old_pos.name as old_position_name,
                        new_pos.name as new_position_name,
                        u.username as synced_by_username
                    FROM ""document_approval_sync_log"" log
                    LEFT JOIN org_structure old_dept ON old_dept.id = log.old_department_id
                    LEFT JOIN org_structure new_dept ON new_dept.id = log.new_department_id
                    LEFT JOIN structure_post old_pos ON old_pos.id = log.old_position_id
                    LEFT JOIN structure_post new_pos ON new_pos.id = log.new_position_id
                    LEFT JOIN ""User"" u ON u.id = log.synced_by
                    ORDER BY log.synced_at DESC
                    OFFSET @pageSize * (@pageNumber - 1) 
                    LIMIT @pageSize";

                var models = await _dbConnection.QueryAsync<document_approval_sync_log>(
                    sql,
                    new { pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""document_approval_sync_log""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<document_approval_sync_log>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval_sync_logs", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""document_approval_sync_log"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete document_approval_sync_log", ex);
            }
        }

        public async Task<document_approval_sync_log> GetOne(int id)
        {
            try
            {
                var sql = @"
                    SELECT 
                        log.*,
                        old_dept.name as old_department_name,
                        new_dept.name as new_department_name,
                        old_pos.name as old_position_name,
                        new_pos.name as new_position_name,
                        u.username as synced_by_username
                    FROM ""document_approval_sync_log"" log
                    LEFT JOIN org_structure old_dept ON old_dept.id = log.old_department_id
                    LEFT JOIN org_structure new_dept ON new_dept.id = log.new_department_id
                    LEFT JOIN structure_post old_pos ON old_pos.id = log.old_position_id
                    LEFT JOIN structure_post new_pos ON new_pos.id = log.new_position_id
                    LEFT JOIN ""User"" u ON u.id = log.synced_by
                    WHERE log.id = @id 
                    LIMIT 1";

                var models = await _dbConnection.QueryAsync<document_approval_sync_log>(
                    sql,
                    new { id },
                    transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval_sync_log", ex);
            }
        }

        public async Task<List<document_approval_sync_log>> GetBydocument_approval_id(int document_approval_id)
        {
            try
            {
                var sql = @"
                    SELECT 
                        log.*,
                        old_dept.name as old_department_name,
                        new_dept.name as new_department_name,
                        old_pos.name as old_position_name,
                        new_pos.name as new_position_name,
                        u.username as synced_by_username
                    FROM ""document_approval_sync_log"" log
                    LEFT JOIN org_structure old_dept ON old_dept.id = log.old_department_id
                    LEFT JOIN org_structure new_dept ON new_dept.id = log.new_department_id
                    LEFT JOIN structure_post old_pos ON old_pos.id = log.old_position_id
                    LEFT JOIN structure_post new_pos ON new_pos.id = log.new_position_id
                    LEFT JOIN ""User"" u ON u.id = log.synced_by
                    WHERE log.""document_approval_id"" = @document_approval_id
                    ORDER BY log.synced_at DESC";

                var models = await _dbConnection.QueryAsync<document_approval_sync_log>(
                    sql,
                    new { document_approval_id },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval_sync_log", ex);
            }
        }

        public async Task<List<document_approval_sync_log>> GetBysynced_by(int synced_by)
        {
            try
            {
                var sql = @"
                    SELECT 
                        log.*,
                        old_dept.name as old_department_name,
                        new_dept.name as new_department_name,
                        old_pos.name as old_position_name,
                        new_pos.name as new_position_name,
                        u.username as synced_by_username
                    FROM ""document_approval_sync_log"" log
                    LEFT JOIN org_structure old_dept ON old_dept.id = log.old_department_id
                    LEFT JOIN org_structure new_dept ON new_dept.id = log.new_department_id
                    LEFT JOIN structure_post old_pos ON old_pos.id = log.old_position_id
                    LEFT JOIN structure_post new_pos ON new_pos.id = log.new_position_id
                    LEFT JOIN ""User"" u ON u.id = log.synced_by
                    WHERE log.""synced_by"" = @synced_by
                    ORDER BY log.synced_at DESC";

                var models = await _dbConnection.QueryAsync<document_approval_sync_log>(
                    sql,
                    new { synced_by },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval_sync_log", ex);
            }
        }

        public async Task<List<document_approval_sync_log>> GetBysync_reason(string sync_reason)
        {
            try
            {
                var sql = @"
                    SELECT 
                        log.*,
                        old_dept.name as old_department_name,
                        new_dept.name as new_department_name,
                        old_pos.name as old_position_name,
                        new_pos.name as new_position_name,
                        u.username as synced_by_username
                    FROM ""document_approval_sync_log"" log
                    LEFT JOIN org_structure old_dept ON old_dept.id = log.old_department_id
                    LEFT JOIN org_structure new_dept ON new_dept.id = log.new_department_id
                    LEFT JOIN structure_post old_pos ON old_pos.id = log.old_position_id
                    LEFT JOIN structure_post new_pos ON new_pos.id = log.new_position_id
                    LEFT JOIN ""User"" u ON u.id = log.synced_by
                    WHERE log.""sync_reason"" = @sync_reason
                    ORDER BY log.synced_at DESC";

                var models = await _dbConnection.QueryAsync<document_approval_sync_log>(
                    sql,
                    new { sync_reason },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval_sync_log", ex);
            }
        }

        public async Task<List<document_approval_sync_log>> GetByoperation_type(string operation_type)
        {
            try
            {
                var sql = @"
                    SELECT 
                        log.*,
                        old_dept.name as old_department_name,
                        new_dept.name as new_department_name,
                        old_pos.name as old_position_name,
                        new_pos.name as new_position_name,
                        u.username as synced_by_username
                    FROM ""document_approval_sync_log"" log
                    LEFT JOIN org_structure old_dept ON old_dept.id = log.old_department_id
                    LEFT JOIN org_structure new_dept ON new_dept.id = log.new_department_id
                    LEFT JOIN structure_post old_pos ON old_pos.id = log.old_position_id
                    LEFT JOIN structure_post new_pos ON new_pos.id = log.new_position_id
                    LEFT JOIN ""User"" u ON u.id = log.synced_by
                    WHERE log.""operation_type"" = @operation_type
                    ORDER BY log.synced_at DESC";

                var models = await _dbConnection.QueryAsync<document_approval_sync_log>(
                    sql,
                    new { operation_type },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval_sync_log", ex);
            }
        }

        public async Task<List<document_approval_sync_log>> GetByDateRange(DateTime startDate, DateTime endDate)
        {
            try
            {
                var sql = @"
                    SELECT 
                        log.*,
                        old_dept.name as old_department_name,
                        new_dept.name as new_department_name,
                        old_pos.name as old_position_name,
                        new_pos.name as new_position_name,
                        u.username as synced_by_username
                    FROM ""document_approval_sync_log"" log
                    LEFT JOIN org_structure old_dept ON old_dept.id = log.old_department_id
                    LEFT JOIN org_structure new_dept ON new_dept.id = log.new_department_id
                    LEFT JOIN structure_post old_pos ON old_pos.id = log.old_position_id
                    LEFT JOIN structure_post new_pos ON new_pos.id = log.new_position_id
                    LEFT JOIN ""User"" u ON u.id = log.synced_by
                    WHERE log.""synced_at"" BETWEEN @startDate AND @endDate
                    ORDER BY log.synced_at DESC";

                var models = await _dbConnection.QueryAsync<document_approval_sync_log>(
                    sql,
                    new { startDate, endDate },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval_sync_log", ex);
            }
        }
    }
}