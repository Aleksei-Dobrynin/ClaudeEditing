using Application.Exceptions;
using Application.Models;
using Application.Repositories;
using Dapper;
using Domain.Entities;
using Infrastructure.Data.Models;
using Infrastructure.FillLogData;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Data.Common;

namespace Infrastructure.Repositories
{
    public class document_approvalRepository : Idocument_approvalRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public document_approvalRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
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
                    is_final = domain.is_final,
                    source_approver_id = domain.source_approver_id,
                    is_manually_modified = domain.is_manually_modified,
                    last_sync_at = domain.last_sync_at,
                    order_number = domain.order_number
                };

                var sql = @"INSERT INTO ""document_approval""
                    (""updated_at"", ""created_by"", ""updated_by"", ""app_document_id"", 
                     ""file_sign_id"", ""department_id"", ""position_id"", ""status"", 
                     ""approval_date"", ""comments"", ""created_at"", ""app_step_id"", 
                     ""document_type_id"", ""is_required_approver"", ""is_required_doc"",
                     ""is_final"", ""source_approver_id"", ""is_manually_modified"", ""last_sync_at"", ""order_number"") 
                VALUES 
                    (@updated_at, @created_by, @updated_by, @app_document_id, 
                     @file_sign_id, @department_id, @position_id, @status, 
                     @approval_date, @comments, @created_at, @app_step_id, 
                     @document_type_id, @is_required_approver, @is_required_doc,
                     @is_final, @source_approver_id, @is_manually_modified, @last_sync_at, @order_number) 
                RETURNING id";

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
                    is_required_doc = domain.is_required_doc,
                    is_required_approver = domain.is_required_approver,
                    is_final = domain.is_final,
                    source_approver_id = domain.source_approver_id,
                    is_manually_modified = domain.is_manually_modified,
                    last_sync_at = domain.last_sync_at,
                    order_number = domain.order_number
                };

                var sql = @"UPDATE ""document_approval"" 
                SET 
                    ""is_required_approver"" = @is_required_approver, 
                    ""is_required_doc"" = @is_required_doc,  
                    ""id"" = @id, 
                    ""updated_at"" = @updated_at, 
                    ""updated_by"" = @updated_by, 
                    ""app_document_id"" = @app_document_id, 
                    ""file_sign_id"" = @file_sign_id, 
                    ""department_id"" = @department_id, 
                    ""position_id"" = @position_id, 
                    ""status"" = @status, 
                    ""approval_date"" = @approval_date, 
                    ""comments"" = @comments, 
                    ""document_type_id"" = @document_type_id, 
                    ""app_step_id"" = @app_step_id,
                    ""is_final"" = @is_final,
                    ""source_approver_id"" = @source_approver_id,
                    ""is_manually_modified"" = @is_manually_modified,
                    ""last_sync_at"" = @last_sync_at,
                    ""order_number"" = @order_number
                WHERE id = @id";

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
                var sql = @"SELECT * FROM document_approval WHERE app_document_id = ANY(@ids)";
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
                    SELECT 
                        vals.*, 
                        post.name position_name, 
                        org.name department_name, 
                        ad.name as document_name 
                    FROM document_approval vals
                    LEFT JOIN org_structure org ON org.id = vals.department_id
                    LEFT JOIN structure_post post ON post.id = vals.position_id
                    LEFT JOIN application_document ad ON ad.id = vals.document_type_id
                    WHERE app_step_id = ANY(@ids)";

                var models = await _dbConnection.QueryAsync<document_approval>(sql, new { ids }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval", ex);
            }
        }

        /// <summary>
        /// �������� ��� ������������ ��� ����������� application_step
        /// </summary>
        public async Task<List<document_approval>> GetByapp_step_id(int app_step_id)
        {
            try
            {
                var sql = @"SELECT * FROM ""document_approval"" WHERE ""app_step_id"" = @app_step_id";
                var models = await _dbConnection.QueryAsync<document_approval>(sql, new { app_step_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get document_approval by app_step_id", ex);
            }
        }

        public async Task ResetByUploadedDocumentId(int uplId)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var sql = @"UPDATE document_approval SET app_document_id = NULL, file_sign_id = NULL, status = 'waiting', approval_date = NULL 
                            WHERE app_document_id = @uplId";

                await _dbConnection.ExecuteAsync(sql, new { uplId }, transaction: _dbTransaction);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to reset document_approval by uploaded document id", ex);
            }
        }


        public async Task<List<document_approval>> GetByApplicationId(
            int applicationId,
            int? stepId = null)
        {
            try
            {
                var sql = @"
WITH approval_employees AS (
    SELECT DISTINCT
        da.id as approval_id,
        e.id as employee_id,
        CONCAT(e.last_name, ' ', LEFT(e.first_name, 1), '.', 
               CASE WHEN e.second_name IS NOT NULL 
                    THEN LEFT(e.second_name, 1) || '.' 
                    ELSE '' END) as employee_name,
        CONCAT(e.last_name, ' ', e.first_name, ' ', 
               COALESCE(e.second_name, '')) as employee_fullname,
        sp.name as post_name,
        sp.code as post_code,
        os.name as structure_name,
        os.code as structure_code,
        eis.id as structure_employee_id
    FROM document_approval da
    INNER JOIN application_step aps ON aps.id = da.app_step_id
    INNER JOIN employee_in_structure eis ON eis.structure_id = da.department_id 
        AND eis.post_id = da.position_id
    INNER JOIN employee e ON e.id = eis.employee_id
    LEFT JOIN structure_post sp ON sp.id = eis.post_id
    LEFT JOIN org_structure os ON os.id = eis.structure_id
    WHERE aps.application_id = @ApplicationId
        AND (eis.date_end IS NULL OR eis.date_end >= CURRENT_DATE)
        AND eis.date_start <= CURRENT_DATE
        AND (@StepId IS NULL OR da.app_step_id = @StepId)
)
SELECT 
    da.id,
    da.updated_at,
    da.created_by,
    da.updated_by,
    da.app_document_id,
    da.file_sign_id,
    da.department_id,
    da.position_id,
    da.status,
    da.approval_date,
    da.comments,
    da.created_at,
    da.app_step_id,
    da.document_type_id,
    da.is_required_doc,
    da.is_required_approver,
    da.is_final,
    da.source_approver_id,
    da.is_manually_modified,
    da.last_sync_at,
    da.order_number,
    os.name as department_name,
    sp.name as position_name,
    ad.name as document_name,
    
    COALESCE(
        (SELECT json_agg(json_build_object(
            'employee_id', ae.employee_id,
            'employee_name', ae.employee_name,
            'employee_fullname', ae.employee_fullname,
            'post_name', ae.post_name,
            'structure_name', ae.structure_name,
            'structure_employee_id', ae.structure_employee_id
        ))
        FROM approval_employees ae
        WHERE ae.approval_id = da.id
        ),
        '[]'::json
    ) as assigned_approvers_json

FROM document_approval da
INNER JOIN application_step aps ON aps.id = da.app_step_id
LEFT JOIN org_structure os ON os.id = da.department_id
LEFT JOIN structure_post sp ON sp.id = da.position_id
LEFT JOIN application_document ad ON ad.id = da.document_type_id

WHERE aps.application_id = @ApplicationId
    AND (@StepId IS NULL OR da.app_step_id = @StepId)

ORDER BY 
    da.order_number NULLS LAST,
    da.id ASC";

                var result = await _dbConnection.QueryAsync<dynamic>(
                    sql,
                    new { ApplicationId = applicationId, StepId = stepId },
                    transaction: _dbTransaction
                );

                var approvals = result.Select(r => new document_approval
                {
                    id = r.id,
                    updated_at = r.updated_at,
                    created_by = r.created_by,
                    updated_by = r.updated_by,
                    app_document_id = r.app_document_id,
                    file_sign_id = r.file_sign_id,
                    department_id = r.department_id,
                    position_id = r.position_id,
                    status = r.status,
                    approval_date = r.approval_date,
                    comments = r.comments,
                    created_at = r.created_at,
                    app_step_id = r.app_step_id,
                    document_type_id = r.document_type_id,
                    is_required_doc = r.is_required_doc,
                    is_required_approver = r.is_required_approver,
                    is_final = r.is_final,
                    source_approver_id = r.source_approver_id,
                    is_manually_modified = r.is_manually_modified,
                    last_sync_at = r.last_sync_at,
                    order_number = r.order_number,
                    department_name = r.department_name,
                    position_name = r.position_name,
                    document_name = r.document_name,

                    assigned_approvers = JsonConvert.DeserializeObject<List<AssignedApprover>>(
                        r.assigned_approvers_json?.ToString() ?? "[]"
                    ) ?? new List<AssignedApprover>()

                }).ToList();

                return approvals;
            }
            catch (Exception ex)
            {
                throw new RepositoryException(
                    $"Failed to get document_approval by application_id: {applicationId}",
                    ex
                );
            }
        }
    }
}

