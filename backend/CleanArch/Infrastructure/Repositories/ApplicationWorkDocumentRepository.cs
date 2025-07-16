using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class ApplicationWorkDocumentRepository : IApplicationWorkDocumentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ApplicationWorkDocumentRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationWorkDocument>> GetAll()
        {
            try
            {
                var sql = @"SELECT application_work_document.id, 
                                   file_id, 
                                   task_id,
                                   application_work_document.comment, 
                                   application_work_document.app_step_id, 
                                   structure_employee_id,
                                   file.name as file_name,
                                   CONCAT(employee.last_name, ' ', employee.first_name, ' ', employee.second_name) as employee_name,
                                   application_task.name as task_name
                            FROM application_work_document
                            left join file on application_work_document.file_id = file.id
                            left join application_task on application_work_document.task_id = application_task.id
                            left join employee_in_structure on application_work_document.structure_employee_id = employee_in_structure.id
                            left join employee on employee_in_structure.employee_id = employee.id
                            where (is_active is null or is_active)";
                var models = await _dbConnection.QueryAsync<ApplicationWorkDocument>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        }
        
        public async Task<List<ApplicationWorkDocument>> GetByAppStepIds(int[] app_step_ids)
        {
            try
            {
                var sql = @"
SELECT doc.*, typ.name id_type_name, file.name file_name FROM application_work_document doc
    left join work_document_type typ on typ.id = doc.id_type
    left join file on file.id = doc.file_id
WHERE doc.app_step_id = ANY(@app_step_ids)
";
                var models = await _dbConnection.QueryAsync<ApplicationWorkDocument>(sql, new { app_step_ids }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        }

        public async Task<ApplicationWorkDocument> GetOneByID(int id)
        {
            try
            {
                var sql =
                    "SELECT id, file_id, app_step_id, id_type, task_id, comment, structure_employee_id FROM application_work_document WHERE id=@Id and (is_active is null or is_active)";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationWorkDocument>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationWorkDocument with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        }
        
        public async Task<List<uploaded_application_document>> GetByStepID(int app_step_id)
        {
            try
            {
                var sql = @"select fhl.id,
       file.id                                                                as file_id,
       file.name                                                              as file_name,
       fhl.created_at,
       CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) as created_by_name,
       os.name                                                                as structure_name
from application_work_document awd
         left join file_history_log fhl on fhl.entity_id = awd.id
         left join file on file.id = fhl.file_id
         left join ""User"" uc on uc.id = fhl.created_by
         left join employee emp_c on emp_c.user_id = uc.""userId""
         left join employee_in_structure eis on emp_c.id = eis.employee_id
         left join org_structure os on eis.structure_id = os.id
where app_step_id = @app_step_id;";
                var models = await _dbConnection.QueryAsync<uploaded_application_document>(sql, new { app_step_id },
                    transaction: _dbTransaction);

                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        } 

        public async Task<ApplicationWorkDocument> GetOneByPath(string guid)
        {
            try
            {
                var sql =
                    @"
SELECT file.id, file.id as file_id, file.name as file_name, st.name status_name FROM file
left join uploaded_application_document upl on upl.file_id = file.id
left join document_status st on st.id = upl.status_id
WHERE path = @guid
limit 1
";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationWorkDocument>(sql, new { guid },
                    transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        }        
        
        public async Task<ApplicationWorkDocument> GetOneByFileID(int fileId)
        {
            try
            {
                var sql = @"SELECT id, file_id FROM application_work_document WHERE file_id=@fileId";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationWorkDocument>(sql, new { fileId },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationWorkDocument with FileId {fileId} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        }
        
        public async Task DeactivateDocument (ApplicationWorkDocument domain)
        {
            try
            {
                var sql = @"UPDATE application_work_document SET deactivated_at = @deactivated_at, 
                                     deactivated_by = @deactivated_by, is_active = @is_active, 
                                     reason_deactivated = @reason_deactivated WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to deactivated ApplicationWorkDocument", ex);
            }
        }

        public async Task<List<ApplicationWorkDocument>> GetByIDTask(int idTask)
        {
            try
            {
                var sql = @"SELECT application_work_document.id, 
                                   file_id, 
                                   task_id,
                                   application_work_document.comment, 
                                   structure_employee_id,
                                   file.name as file_name,
                                   CONCAT(employee.last_name, ' ', employee.first_name, ' ', employee.second_name) as employee_name,
                                   application_task.name as task_name
                            FROM application_work_document
                            left join file on application_work_document.file_id = file.id
                            left join application_task on application_work_document.task_id = application_task.id
                            left join employee_in_structure on application_work_document.structure_employee_id = employee_in_structure.id
                            left join employee on employee_in_structure.employee_id = employee.id
                            WHERE task_id=@IDTask and (is_active is null or is_active)";
                var models = await _dbConnection.QueryAsync<ApplicationWorkDocument>(sql,
                    new { IDTask = idTask },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        }

        public async Task<List<ApplicationWorkDocument>> GetByIDApplication(int idApplication)
        {
            try
            {
                var sql = @"SELECT application_work_document.id, 
application_work_document.id_type,
                                   file_id, 
                                   task_id,
                                   application_work_document.comment, 
                                   structure_employee_id,
                                   file.name as file_name,
                                   CONCAT(employee.last_name, ' ', employee.first_name, ' ', employee.second_name) as employee_name,
                                   application_task.name as task_name,
application_work_document.created_by, application_work_document.created_at, application_work_document.updated_by, application_work_document.updated_at, 
typ.name id_type_name,
typ.code id_type_code,
                                   org.id as structure_id
                            FROM application_work_document
                            left join file on application_work_document.file_id = file.id
                            left join application_task on application_work_document.task_id = application_task.id
                            left join employee_in_structure on application_work_document.structure_employee_id = employee_in_structure.id
                            left join employee on employee_in_structure.employee_id = employee.id
                            left join org_structure org on employee_in_structure.structure_id = org.id
                            left join work_document_type typ on typ.id = application_work_document.id_type
                            WHERE application_task.application_id=@IDApplication and (application_work_document.is_active is null or application_work_document.is_active)";
                var models = await _dbConnection.QueryAsync<ApplicationWorkDocument>(sql,
                    new { IDApplication = idApplication },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        }
        
        public async Task<List<ApplicationWorkDocument>> GetByGuid(string guid)
        {
            try
            {
                var sql = @"SELECT application_work_document.id, 
application_work_document.id_type,
                                   file_id, 
                                   task_id,
                                   application_work_document.comment, 
                                   structure_employee_id,
                                   file.name as file_name,
                                   CONCAT(employee.last_name, ' ', employee.first_name, ' ', employee.second_name) as employee_name,
                                   application_task.name as task_name,
typ.name id_type_name,
typ.code id_type_code,
                                   org.id as structure_id
                            FROM application_work_document
                            left join file on application_work_document.file_id = file.id
                            left join application_task on application_work_document.task_id = application_task.id
                            left join application app on app.id = application_task.application_id
                            left join employee_in_structure on application_work_document.structure_employee_id = employee_in_structure.id
                            left join employee on employee_in_structure.employee_id = employee.id
                            left join org_structure org on employee_in_structure.structure_id = org.id
                            left join work_document_type typ on typ.id = application_work_document.id_type
                            WHERE app.app_cabinet_uuid = @guid and (application_work_document.is_active is null or application_work_document.is_active)";
                var models = await _dbConnection.QueryAsync<ApplicationWorkDocument>(sql,
                    new { guid },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        }

        public async Task<int> Add(ApplicationWorkDocument domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationWorkDocument
                {
                    file_id = domain.file_id,
                    task_id = domain.task_id,
                    id_type = domain.id_type,
                    app_step_id = domain.app_step_id,
                    comment = domain.comment,
                    structure_employee_id = domain.structure_employee_id,
                    metadata = domain.metadata,
                    is_required = domain.is_required
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO application_work_document(file_id, task_id, id_type, comment, 
                                structure_employee_id, created_at, updated_at, created_by, updated_by, metadata, app_step_id, is_required) VALUES 
                                (@file_id, @task_id, @id_type, @comment, @structure_employee_id, @created_at, 
                                 @updated_at, @created_by, @updated_by, @metadata::jsonb, @app_step_id, @is_required) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationWorkDocument", ex);
            }
        }

        public async Task Update(ApplicationWorkDocument domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new ApplicationWorkDocument
                {
                    id = domain.id,
                    file_id = domain.file_id,
                    task_id = domain.task_id,
                    comment = domain.comment,
                    structure_employee_id = domain.structure_employee_id,
                    app_step_id = domain.app_step_id
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql =
                    "UPDATE application_work_document SET file_id = @file_id, task_id = @task_id, app_step_id = @app_step_id, comment = @comment, structure_employee_id = @structure_employee_id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationWorkDocument", ex);
            }
        }

        public async Task<PaginatedList<ApplicationWorkDocument>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql =
                    "SELECT * FROM application_work_document OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ApplicationWorkDocument>(sql, new { pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM application_work_document";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ApplicationWorkDocument>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM application_work_document WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationWorkDocument not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationWorkDocument", ex);
            }
        }
    }
}