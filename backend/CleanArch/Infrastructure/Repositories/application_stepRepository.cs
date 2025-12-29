using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Repositories
{
    public class application_stepRepository : Iapplication_stepRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public application_stepRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        /// <summary>
        /// ????????: ???????? ?????? is_deleted = false
        /// </summary>
        public async Task<List<application_step>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""application_step"" WHERE is_deleted = false OR is_deleted IS NULL";
                var models = await _dbConnection.QueryAsync<application_step>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_step", ex);
            }
        }

        /// <summary>
        /// ????????: ????????? ????? ???? ??? ???????????? ????? + is_deleted
        /// </summary>
        public async Task<int> Add(application_step domain)
        {
            try
            {
                var sql = @"
                    INSERT INTO ""application_step""(
                        ""is_overdue"", 
                        ""overdue_days"", 
                        ""is_paused"", 
                        ""comments"", 
                        ""created_at"", 
                        ""created_by"", 
                        ""updated_at"", 
                        ""updated_by"", 
                        ""application_id"", 
                        ""step_id"", 
                        ""order_number"",
                        ""status"", 
                        ""start_date"", 
                        ""due_date"", 
                        ""completion_date"", 
                        ""planned_duration"", 
                        ""actual_duration"",
                        ""is_dynamically_added"",
                        ""additional_service_path_id"",
                        ""original_step_order"",
                        ""added_by_link_id"",
                        ""is_deleted""
                    ) 
                    VALUES (
                        @is_overdue, 
                        @overdue_days, 
                        @is_paused, 
                        @comments, 
                        @created_at, 
                        @created_by, 
                        @updated_at, 
                        @updated_by, 
                        @application_id, 
                        @step_id, 
                        @order_number,
                        @status, 
                        @start_date, 
                        @due_date, 
                        @completion_date, 
                        @planned_duration, 
                        @actual_duration,
                        @is_dynamically_added,
                        @additional_service_path_id,
                        @original_step_order,
                        @added_by_link_id,
                        COALESCE(@is_deleted, false)
                    ) 
                    RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_step", ex);
            }
        }

        /// <summary>
        /// ????????: ????????? ????? ???? ??? ???????????? ????? + is_deleted
        /// </summary>
        public async Task Update(application_step domain)
        {
            try
            {
                var sql = @"
                    UPDATE ""application_step"" 
                    SET 
                        ""is_overdue"" = @is_overdue, 
                        ""overdue_days"" = @overdue_days, 
                        ""is_paused"" = @is_paused, 
                        ""comments"" = @comments, 
                        ""created_at"" = @created_at, 
                        ""created_by"" = @created_by, 
                        ""updated_at"" = @updated_at, 
                        ""updated_by"" = @updated_by, 
                        ""application_id"" = @application_id, 
                        ""step_id"" = @step_id, 
                        ""order_number"" = @order_number,
                        ""status"" = @status, 
                        ""start_date"" = @start_date, 
                        ""due_date"" = @due_date, 
                        ""completion_date"" = @completion_date, 
                        ""planned_duration"" = @planned_duration, 
                        ""actual_duration"" = @actual_duration,
                        ""is_dynamically_added"" = @is_dynamically_added,
                        ""additional_service_path_id"" = @additional_service_path_id,
                        ""original_step_order"" = @original_step_order,
                        ""added_by_link_id"" = @added_by_link_id,
                        ""is_deleted"" = @is_deleted
                    WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_step", ex);
            }
        }

        /// <summary>
        /// ????????: ???????? ?????? is_deleted = false
        /// </summary>
        public async Task<PaginatedList<application_step>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"
                    SELECT * FROM ""application_step"" 
                    WHERE is_deleted = false OR is_deleted IS NULL
                    OFFSET @pageSize * (@pageNumber - 1) 
                    LIMIT @pageSize";

                var models = await _dbConnection.QueryAsync<application_step>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"
                    SELECT COUNT(*) FROM ""application_step"" 
                    WHERE is_deleted = false OR is_deleted IS NULL";

                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<application_step>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_steps", ex);
            }
        }

        /// <summary>
        /// ????????: ?????? ???????? - ????????????? is_deleted = true
        /// </summary>
        public async Task Delete(int id)
        {
            try
            {
                var sql = @"
                    UPDATE ""application_step"" 
                    SET is_deleted = true, 
                        updated_at = NOW()
                    WHERE id = @id 
                      AND (is_deleted = false OR is_deleted IS NULL)";

                var affected = await _dbConnection.ExecuteAsync(sql, new { id }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found or already deleted", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete application_step", ex);
            }
        }

        /// <summary>
        /// ????????: ???????? ?????? is_deleted = false
        /// </summary>
        public async Task<application_step> GetOne(int id)
        {
            try
            {
                var sql = @"
                    SELECT * FROM ""application_step"" 
                    WHERE id = @id 
                      AND (is_deleted = false OR is_deleted IS NULL)
                    LIMIT 1";

                var models = await _dbConnection.QueryAsync<application_step>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_step", ex);
            }
        }

        /// <summary>
        /// ????????: ???????? ?????? is_deleted = false
        /// </summary>
        public async Task<List<application_step>> GetByapplication_id(int application_id)
        {
            try
            {
                var sql = @"
                    SELECT 
                        st.*, 
                        ps.path_id, 
                        ps.name, 
                        COALESCE(st.order_number, ps.order_number) as order_number,
                        ps.responsible_org_id as responsible_department_id 
                    FROM application_step st
                    LEFT JOIN path_step ps ON ps.id = st.step_id
                    WHERE st.application_id = @application_id
                      AND (st.is_deleted = false OR st.is_deleted IS NULL)
                    ORDER BY COALESCE(st.order_number, ps.order_number)";

                var models = await _dbConnection.QueryAsync<application_step>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_step", ex);
            }
        }

        /// <summary>
        /// ????????: ???????? ?????? is_deleted = false
        /// </summary>
        public async Task<List<application_step>> GetBystep_id(int step_id)
        {
            try
            {
                var sql = @"
                    SELECT * FROM ""application_step"" 
                    WHERE ""step_id"" = @step_id 
                      AND (is_deleted = false OR is_deleted IS NULL)";

                var models = await _dbConnection.QueryAsync<application_step>(sql, new { step_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_step", ex);
            }
        }

        /// <summary>
        /// ????????: ???????? ?????? is_deleted = false ? WHERE ??? apps.status
        /// </summary>
        public async Task<List<UnsignedDocumentsModel>> GetUnsignedDocuments(List<int> post_ids, List<int> structure_ids, string search, bool isDeadline, string user_id)
        {
            try
            {
                var sql = @"
select distinct
    uad.id AS uploaded_document_id,
    ad.name AS document_name,
    app.id app_id,
    app.number app_number,
    app.work_description app_work_description,
    string_agg(DISTINCT obj.address, '; ') as arch_object_address,
    cl.full_name,
    cl.pin,
    srv.name service_name,
    val.app_step_id app_step_id,
    srv.day_count service_days,
    app.deadline,
    atask.id AS task_id
from document_approval val
    left join uploaded_application_document uad on uad.id = val.app_document_id
    left join application_document ad on ad.id = val.document_type_id
left join application_step apps on apps.id = val.app_step_id
left join application app on apps.application_id = app.id
        left join application_status ""as"" on app.status_id = ""as"".id
LEFT JOIN application_object ao on ao.application_id = app.id
LEFT JOIN arch_object obj on ao.arch_object_id = obj.id
left join service srv on srv.id = app.service_id
left join customer cl on cl.id = app.customer_id
LEFT JOIN application_task atask ON atask.application_id = app.id
left join application_task_assignee ata on ata.application_task_id = atask.id
left join employee_in_structure eis on eis.id = ata.structure_employee_id
left join employee e on e.id = eis.employee_id

WHERE
1=1
    and e.user_id = @user_id
    AND val.file_sign_id is null AND val.app_document_id is not null AND
    val.department_id = ANY(@structure_ids)
    AND val.position_id = ANY(@post_ids)
    AND (apps.status IS NULL OR apps.status != 'completed')
    AND (""as"".group_code != 'completed')
  AND (""as"".group_code != 'refusal')
    AND (apps.is_deleted = false OR apps.is_deleted IS NULL)
";
                if (isDeadline)
                {
                    sql += @"
    AND app.deadline < now()
";
                }
                if (!search.IsNullOrEmpty())
                {
                    sql += @"
    AND ((lower(app.number) like concat('%', @search, '%')) or (lower(cl.full_name) like concat('%', @search, '%')) or (lower(cl.pin) like concat('%', @search, '%')))
";
                }
                sql += @"
GROUP BY 
    uad.id, ad.id, app.id, cl.id, srv.id, val.id, atask.id, ""as"".group_code
ORDER BY
    app.deadline ASC, app.id, uad.id;
";
                var models = await _dbConnection.QueryAsync<UnsignedDocumentsModel>(sql, new
                {
                    user_id,
                    post_ids,
                    structure_ids,
                    search = search?.ToLower(),
                    is_deadline = isDeadline
                }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get unsigned documents", ex);
            }
        }

        /// <summary>
        /// ????????: ?????? ???????? ?????? ???????????
        /// </summary>
        public async Task DeleteByApplicationId(int application_id)
        {
            try
            {
                var sql = @"
                    UPDATE application_step 
                    SET is_deleted = true, 
                        updated_at = NOW()
                    WHERE application_id = @id 
                      AND (is_deleted = false OR is_deleted IS NULL)";

                await _dbConnection.ExecuteAsync(sql, new { id = application_id }, transaction: _dbTransaction);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete application_step by application_id", ex);
            }
        }

        /// <summary>
        /// ????????: ???????? ?????? is_deleted = false
        /// </summary>
        public async Task<List<application_step>> GetDynamicallyAddedSteps(int applicationId, int additionalServiceLinkId)
        {
            try
            {
                var sql = @"
                    SELECT 
                        st.*, 
                        ps.name, 
                        ps.order_number as path_order,
                        ps.responsible_org_id as responsible_department_id 
                    FROM ""application_step"" st
                    LEFT JOIN path_step ps ON ps.id = st.step_id
                    WHERE st.application_id = @applicationId
                      AND st.added_by_link_id = @additionalServiceLinkId
                      AND st.is_dynamically_added = true
                      AND (st.is_deleted = false OR st.is_deleted IS NULL)
                    ORDER BY st.order_number";

                var result = await _dbConnection.QueryAsync<application_step>(
                    sql,
                    new { applicationId, additionalServiceLinkId },
                    transaction: _dbTransaction
                );

                return result.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get dynamically added steps", ex);
            }
        }

        /// <summary>
        /// ????????: ???????? ?????? is_deleted = false
        /// </summary>
        public async Task<int> ShiftOrderNumbers(int applicationId, int afterOrderNumber, int shiftBy)
        {
            try
            {
                var sql = @"
                    UPDATE ""application_step"" 
                    SET order_number = order_number + @shiftBy,
                        updated_at = NOW()
                    WHERE application_id = @applicationId
                      AND order_number > @afterOrderNumber
                      AND (is_deleted = false OR is_deleted IS NULL)";

                var affected = await _dbConnection.ExecuteAsync(
                    sql,
                    new { applicationId, afterOrderNumber, shiftBy },
                    transaction: _dbTransaction
                );

                return affected;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to shift order numbers", ex);
            }
        }

        /// <summary>
        /// ????????: ???????? ?????? is_deleted = false
        /// </summary>
        public async Task ReorderSteps(int applicationId)
        {
            try
            {
                var sql = @"
                    WITH numbered AS (
                        SELECT id, 
                               ROW_NUMBER() OVER (ORDER BY order_number) as new_order
                        FROM ""application_step""
                        WHERE application_id = @applicationId
                          AND (is_deleted = false OR is_deleted IS NULL)
                    )
                    UPDATE ""application_step"" 
                    SET order_number = numbered.new_order,
                        updated_at = NOW()
                    FROM numbered
                    WHERE ""application_step"".id = numbered.id";

                await _dbConnection.ExecuteAsync(
                    sql,
                    new { applicationId },
                    transaction: _dbTransaction
                );
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to reorder steps", ex);
            }
        }

        /// <summary>
        /// ????????: ???????? ?????? is_deleted = false
        /// </summary>
        public async Task<bool> AreAllDynamicStepsCompleted(int additionalServiceLinkId)
        {
            try
            {
                var sql = @"
                    SELECT COUNT(*) 
                    FROM ""application_step""
                    WHERE added_by_link_id = @additionalServiceLinkId
                      AND is_dynamically_added = true
                      AND status != 'completed'
                      AND (is_deleted = false OR is_deleted IS NULL)";

                var incompleteCount = await _dbConnection.ExecuteScalarAsync<int>(
                    sql,
                    new { additionalServiceLinkId },
                    transaction: _dbTransaction
                );

                return incompleteCount == 0;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to check steps completion", ex);
            }
        }

        /// <summary>
        /// ????????: ???????? ?????? is_deleted = false
        /// </summary>
        public async Task<bool> AreAnyDynamicStepsStarted(int additionalServiceLinkId)
        {
            try
            {
                var sql = @"
                    SELECT COUNT(*) 
                    FROM ""application_step""
                    WHERE added_by_link_id = @additionalServiceLinkId
                      AND is_dynamically_added = true
                      AND status NOT IN ('waiting', 'pending')
                      AND (is_deleted = false OR is_deleted IS NULL)";

                var startedCount = await _dbConnection.ExecuteScalarAsync<int>(
                    sql,
                    new { additionalServiceLinkId },
                    transaction: _dbTransaction
                );

                return startedCount > 0;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to check if steps started", ex);
            }
        }

        /// <summary>
        /// ????????: ?????? ???????? ?????? ???????????
        /// </summary>
        public async Task DeleteDynamicSteps(int additionalServiceLinkId)
        {
            try
            {
                var sql = @"
                    UPDATE ""application_step""
                    SET is_deleted = true,
                        updated_at = NOW()
                    WHERE added_by_link_id = @additionalServiceLinkId
                      AND is_dynamically_added = true
                      AND (is_deleted = false OR is_deleted IS NULL)";

                await _dbConnection.ExecuteAsync(
                    sql,
                    new { additionalServiceLinkId },
                    transaction: _dbTransaction
                );
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete dynamic steps", ex);
            }
        }

        // ============ ?????? ??? ????????? ??????? ============

        /// <summary>
        /// ???????: ???????? ??? ????????? ??????
        /// </summary>
        public async Task<List<application_step>> GetAllDeleted()
        {
            try
            {
                var sql = @"SELECT * FROM ""application_step"" WHERE is_deleted = true ORDER BY id";
                var models = await _dbConnection.QueryAsync<application_step>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get deleted application_steps", ex);
            }
        }

        /// <summary>
        /// ???????: ???????? ??? ?????? ??????? ?????????
        /// </summary>
        public async Task<List<application_step>> GetAllIncludingDeleted()
        {
            try
            {
                var sql = @"SELECT * FROM ""application_step"" ORDER BY id";
                var models = await _dbConnection.QueryAsync<application_step>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get all application_steps including deleted", ex);
            }
        }

        /// <summary>
        /// ???????: ???????? ????????? ?????? ?? ID
        /// </summary>
        public async Task<application_step> GetDeletedById(int id)
        {
            try
            {
                var sql = @"
                    SELECT * FROM ""application_step"" 
                    WHERE id = @id 
                      AND is_deleted = true
                    LIMIT 1";

                var models = await _dbConnection.QueryAsync<application_step>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get deleted application_step by id", ex);
            }
        }
    }
}