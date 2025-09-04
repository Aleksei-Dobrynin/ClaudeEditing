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

        public async Task<List<application_step>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""application_step""";
                var models = await _dbConnection.QueryAsync<application_step>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_step", ex);
            }
        }

        public async Task<int> Add(application_step domain)
        {
            try
            {
                var model = new application_stepModel
                {

                    id = domain.id,
                    is_overdue = domain.is_overdue,
                    overdue_days = domain.overdue_days,
                    is_paused = domain.is_paused,
                    comments = domain.comments,
                    created_at = domain.created_at,
                    created_by = domain.created_by,
                    updated_at = domain.updated_at,
                    updated_by = domain.updated_by,
                    application_id = domain.application_id,
                    step_id = domain.step_id,
                    status = domain.status,
                    start_date = domain.start_date,
                    due_date = domain.due_date,
                    completion_date = domain.completion_date,
                    planned_duration = domain.planned_duration,
                    actual_duration = domain.actual_duration,
                };
                var sql = @"INSERT INTO ""application_step""(""is_overdue"", ""overdue_days"", ""is_paused"", ""comments"", ""created_at"", ""created_by"", ""updated_at"", ""updated_by"", ""application_id"", ""step_id"", ""status"", ""start_date"", ""due_date"", ""completion_date"", ""planned_duration"", ""actual_duration"") 
                VALUES (@is_overdue, @overdue_days, @is_paused, @comments, @created_at, @created_by, @updated_at, @updated_by, @application_id, @step_id, @status, @start_date, @due_date, @completion_date, @planned_duration, @actual_duration) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_step", ex);
            }
        }

        public async Task Update(application_step domain)
        {
            try
            {
                var model = new application_stepModel
                {

                    id = domain.id,
                    is_overdue = domain.is_overdue,
                    overdue_days = domain.overdue_days,
                    is_paused = domain.is_paused,
                    comments = domain.comments,
                    created_at = domain.created_at,
                    created_by = domain.created_by,
                    updated_at = domain.updated_at,
                    updated_by = domain.updated_by,
                    application_id = domain.application_id,
                    step_id = domain.step_id,
                    status = domain.status,
                    start_date = domain.start_date,
                    due_date = domain.due_date,
                    completion_date = domain.completion_date,
                    planned_duration = domain.planned_duration,
                    actual_duration = domain.actual_duration,
                };
                var sql = @"UPDATE ""application_step"" SET ""id"" = @id, ""is_overdue"" = @is_overdue, ""overdue_days"" = @overdue_days, ""is_paused"" = @is_paused, ""comments"" = @comments, ""created_at"" = @created_at, ""created_by"" = @created_by, ""updated_at"" = @updated_at, ""updated_by"" = @updated_by, ""application_id"" = @application_id, ""step_id"" = @step_id, ""status"" = @status, ""start_date"" = @start_date, ""due_date"" = @due_date, ""completion_date"" = @completion_date, ""planned_duration"" = @planned_duration, ""actual_duration"" = @actual_duration WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
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

        public async Task<PaginatedList<application_step>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_step"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<application_step>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""application_step""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<application_step>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_steps", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""application_step"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
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
        public async Task<application_step> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_step"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<application_step>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_step", ex);
            }
        }


        public async Task<List<application_step>> GetByapplication_id(int application_id)
        {
            try
            {
                var sql = @"SELECT st.*, ps.path_id, ps.name, ps.order_number, ps.responsible_org_id as responsible_department_id 
FROM application_step st
left join path_step ps on ps.id = st.step_id
WHERE application_id = @application_id
order by ps.order_number";
                var models = await _dbConnection.QueryAsync<application_step>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_step", ex);
            }
        }

        public async Task<List<application_step>> GetBystep_id(int step_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_step\" WHERE \"step_id\" = @step_id";
                var models = await _dbConnection.QueryAsync<application_step>(sql, new { step_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_step", ex);
            }
        }
        public async Task<List<UnsignedDocumentsModel>> GetUnsignedDocuments(int post_id, int structure_id, string search, bool isDeadline)
        {
            try
            {
                var sql = @"
select
    uad.id AS uploaded_document_id,
    ad.name AS document_name,
    app.id app_id,
    app.number app_number,
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
left join service srv on srv.id = app.service_id
left join customer cl on cl.id = app.customer_id
LEFT JOIN LATERAL (
    SELECT at.*
    FROM application_task at
    WHERE at.application_id = app.id
    ORDER BY at.created_at ASC -- или at.id ASC
    LIMIT 1
) atask ON true
WHERE
1=1
    AND val.file_sign_id is null AND val.app_document_id is not null AND
    val.department_id = @structure_id
    AND val.position_id = @post_id
    AND (apps.status IS NULL OR apps.status != 'completed')
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
ORDER BY
    app.deadline ASC, app.id, uad.id;
";
                var models = await _dbConnection.QueryAsync<UnsignedDocumentsModel>(sql, new
                {
                    post_id,
                    structure_id,
                    search = search?.ToLower(),
                    is_deadline = isDeadline
                }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_step", ex);
            }
        }
    }
}
