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
    public class HistoryTableRepository : IHistoryTableRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public HistoryTableRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<HistoryTable>> GetAll()
        {
            try
            {
                var sql =
                    @"SELECT
                            application_history.id,
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_history.created_at,
                            application_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'Application' AS entity_type
                        FROM application_history
                        left join ""User"" uc on uc.id = application_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""

                        UNION ALL

                        SELECT
                            application_payment_history.id,
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_payment_history.created_at,
                            application_payment_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'ApplicationPayment' AS entity_type
                        FROM application_payment_history
                        left join ""User"" uc on uc.id = application_payment_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""

                        UNION ALL

                        SELECT
                            uploaded_application_document_history.id,
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            uploaded_application_document_history.created_at,
                            uploaded_application_document_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'UploadedApplicationDocument' AS entity_type
                        FROM uploaded_application_document_history
                        left join ""User"" uc on uc.id = uploaded_application_document_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        
                        UNION ALL

                        SELECT
                            application_comment_history.id,
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_comment_history.created_at,
                            application_comment_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'ApplicationComments' AS entity_type
                        FROM application_comment_history
                        left join ""User"" uc on uc.id = application_comment_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId"";";
                var models = await _dbConnection.QueryAsync<HistoryTable>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get HistoryTable", ex);
            }
        }

        public async Task<List<HistoryTable>> GetByApplication(int application_id)
        {
            try
            {
                var sql =
                    @"SELECT ROW_NUMBER() OVER (ORDER BY created_at DESC) AS id, * FROM (
                        SELECT
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_history.created_at,
                            application_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'Application' AS entity_type
                        FROM application_history
                        left join ""User"" uc on uc.id = application_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_id = @IDApplication

                        UNION ALL

                        SELECT
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_payment_history.created_at,
                            application_payment_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'ApplicationPayment' AS entity_type
                        FROM application_payment_history
                        left join ""User"" uc on uc.id = application_payment_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_id = @IDApplication

                        UNION ALL

                        SELECT
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            uploaded_application_document_history.created_at,
                            uploaded_application_document_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'UploadedApplicationDocument' AS entity_type
                        FROM uploaded_application_document_history
                        left join ""User"" uc on uc.id = uploaded_application_document_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_id = @IDApplication
                        
                        UNION ALL

                        SELECT
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_comment_history.created_at,
                            application_comment_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'ApplicationComments' AS entity_type
                        FROM application_comment_history
                        left join ""User"" uc on uc.id = application_comment_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_id = @IDApplication
                        
                        UNION ALL

                        SELECT
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_task_history.created_at,
                            application_task_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'ApplicationTask' AS entity_type
                        FROM application_task_history
                        left join ""User"" uc on uc.id = application_task_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_id = @IDApplication

                        UNION ALL

                        SELECT
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_task_assignee_history.created_at,
                            application_task_assignee_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'application_task_assignee' AS entity_type
                        FROM application_task_assignee_history
                        left join ""User"" uc on uc.id = application_task_assignee_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_id = @IDApplication

                        UNION ALL

                        SELECT
                            @IDApplication AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            customer_history.created_at,
                            customer_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'Customer' AS entity_type
                        FROM customer_history
                        left join ""User"" uc on uc.id = customer_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        join application app on app.customer_id = customer_history.customer_id
                        WHERE app.id = @IDApplication

                        UNION ALL

                        SELECT
                            @IDApplication AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            arch_object_history.created_at,
                            arch_object_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'ArchObject' AS entity_type
                        FROM arch_object_history
                        left join ""User"" uc on uc.id = arch_object_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        join application app on app.arch_object_id = arch_object_history.arch_object_id
                        WHERE app.id = @IDApplication

                        UNION ALL

                        SELECT
                            @IDApplication AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            arch_object_tag_history.created_at,
                            arch_object_tag_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'ArchObjectTag' AS entity_type
                        FROM arch_object_tag_history
                        left join ""User"" uc on uc.id = arch_object_tag_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        join arch_object ao on ao.id = arch_object_tag_history.arch_object_id
                        join application app on app.arch_object_id = ao.id
                        WHERE app.id = @IDApplication
                        
                        UNION ALL

                        SELECT
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            saved_application_document_history.created_at,
                            saved_application_document_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'saved_application_document' AS entity_type
                        FROM saved_application_document_history
                        left join ""User"" uc on uc.id = saved_application_document_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_id = @IDApplication
                        
                        UNION ALL

                        SELECT
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_work_document_history.created_at,
                            application_work_document_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'ApplicationWorkDocument' AS entity_type
                        FROM application_work_document_history
                        left join ""User"" uc on uc.id = application_work_document_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_id = @IDApplication
                        
                        UNION ALL

                        SELECT
                            @IDApplication AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            architecture_process_history.created_at,
                            architecture_process_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'architecture_process' AS entity_type
                        FROM architecture_process_history
                        left join ""User"" uc on uc.id = architecture_process_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE architecture_process_history.architecture_process_id = @IDApplication
                        
                        UNION ALL

                        SELECT
                            @IDApplication AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_duty_object_history.created_at,
                            application_duty_object_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'application_duty_object' AS entity_type
                        FROM application_duty_object_history
                        left join ""User"" uc on uc.id = application_duty_object_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_duty_object_history.architecture_process_id = @IDApplication

                        UNION ALL

                        SELECT
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_square_history.created_at,
                            application_square_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'application_square' AS entity_type
                        FROM application_square_history
                        left join ""User"" uc on uc.id = application_square_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_id = @IDApplication

                        UNION ALL

                        SELECT
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            structure_tag_application_history.created_at,
                            structure_tag_application_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'structure_tag_application' AS entity_type
                        FROM structure_tag_application_history
                        left join ""User"" uc on uc.id = structure_tag_application_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_id = @IDApplication

                        UNION ALL

                        SELECT
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_subtask_history.created_at,
                            application_subtask_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'application_subtask' AS entity_type
                        FROM application_subtask_history
                        left join ""User"" uc on uc.id = application_subtask_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_id = @IDApplication

                        UNION ALL

                        SELECT
                            application_id AS entity_id,
                            operation,
                            old_value,
                            new_value,
                            action_description,
                            field,
                            application_subtask_assignee_history.created_at,
                            application_subtask_assignee_history.created_by,
                            CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                            'application_subtask_assignee' AS entity_type
                        FROM application_subtask_assignee_history
                        left join ""User"" uc on uc.id = application_subtask_assignee_history.created_by
                        left join employee emp_c on emp_c.user_id = uc.""userId""
                        WHERE application_id = @IDApplication


                        ) AS combined_history ORDER BY created_at DESC;";
                var models = await _dbConnection.QueryAsync<HistoryTable>(sql,
                    new { IDApplication = application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get HistoryTable", ex);
            }
        }

        public async Task<HistoryTable> GetOneByID(int id)
        {
            try
            {
                var sql =
                    @"SELECT id, application_id, operation, old_value, new_value, action_description, field, created_at, created_by
                                    FROM application_history
                             WHERE id = @Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<HistoryTable>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"HistoryTable with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get HistoryTable", ex);
            }
        }

        public async Task<PaginatedList<HistoryTable>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM application_history OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<HistoryTable>(sql, new { pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM application_history";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<HistoryTable>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get HistoryTable", ex);
            }
        }
    }
}