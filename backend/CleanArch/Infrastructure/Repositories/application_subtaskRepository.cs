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
    public class application_subtaskRepository : Iapplication_subtaskRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public application_subtaskRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<application_subtask>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"application_subtask\"";
                var models = await _dbConnection.QueryAsync<application_subtask>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_subtask", ex);
            }
        }

        public async Task<int> Add(application_subtask domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new application_subtaskModel
                {
                    
                    id = domain.id,
                    application_id = domain.application_id,
                    subtask_template_id = domain.subtask_template_id,
                    name = domain.name,
                    status_id = domain.status_id,
                    progress = domain.progress,
                    application_task_id = domain.application_task_id,
                    description = domain.description,
                    type_id = domain.type_id,
                    subtask_deadline = domain.subtask_deadline,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO \"application_subtask\"(\"updated_at\", \"created_by\", \"updated_by\", \"application_id\", \"subtask_template_id\", \"name\", \"status_id\", \"progress\", \"application_task_id\", \"description\", \"created_at\", \"type_id\",\"subtask_deadline\") " +
                    "VALUES (@updated_at, @created_by, @updated_by, @application_id, @subtask_template_id, @name, @status_id, @progress, @application_task_id, @description, @created_at, @type_id, @subtask_deadline) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_subtask", ex);
            }
        }

        public async Task Update(application_subtask domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                
                var model = new application_subtaskModel
                {
                    
                    id = domain.id,
                    application_id = domain.application_id,
                    subtask_template_id = domain.subtask_template_id,
                    name = domain.name,
                    status_id = domain.status_id,
                    progress = domain.progress,
                    application_task_id = domain.application_task_id,
                    description = domain.description,
                    type_id = domain.type_id,
                    subtask_deadline = domain.subtask_deadline,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE \"application_subtask\" SET \"id\" = @id, \"updated_at\" = @updated_at, \"updated_by\" = @updated_by, \"application_id\" = @application_id, \"subtask_template_id\" = @subtask_template_id, \"name\" = @name, \"status_id\" = @status_id, \"progress\" = @progress, \"application_task_id\" = @application_task_id, \"description\" = @description, \"type_id\" = @type_id,\"subtask_deadline\" = @subtask_deadline WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_subtask", ex);
            }
        }

        public async Task<PaginatedList<application_subtask>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"application_subtask\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<application_subtask>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"application_subtask\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<application_subtask>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_subtasks", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"application_subtask\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_subtask", ex);
            }
        }
        public async Task<application_subtask> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT sub.*, task.name application_task_name, task.structure_id application_task_structure_id, app.number application_number FROM ""application_subtask"" sub left join application_task task on task.id = sub.application_task_id left join application app on app.id = task.application_id WHERE sub.id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<application_subtask>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_subtask", ex);
            }
        }

        
        public async Task<List<application_subtask>> GetBysubtask_template_id(int subtask_template_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_subtask\" WHERE \"subtask_template_id\" = @subtask_template_id";
                var models = await _dbConnection.QueryAsync<application_subtask>(sql, new { subtask_template_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_subtask", ex);
            }
        }
        
        public async Task<List<application_subtask>> GetBystatus_id(int status_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_subtask\" WHERE \"status_id\" = @status_id";
                var models = await _dbConnection.QueryAsync<application_subtask>(sql, new { status_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_subtask", ex);
            }
        }

        public async Task<List<application_subtask>> GetByapplication_task_id(int application_task_id)
        {
            try
            {
                var sql = @"
SELECT sub.*, st.name as status_name, st.backcolor status_back_color, st.textcolor status_text_color, typ.name type_name, string_agg(concat(e.last_name, ' ', e.first_name, ' ', e.second_name, ' - ', sp.name), ', ') employees
FROM ""application_subtask"" sub
left join task_status st on sub.status_id = st.id
left join task_type typ on typ.id = sub.type_id
left join application_subtask_assignee assig on assig.application_subtask_id = sub.id
left join employee_in_structure eis on eis.id = assig.structure_employee_id
left join structure_post sp on sp.id = eis.post_id
left join employee e on e.id = eis.employee_id
WHERE ""application_task_id"" = @application_task_id
group by sub.id, st.name, st.backcolor, st.textcolor, typ.name
order by sub.created_at
";
                var models = await _dbConnection.QueryAsync<application_subtask>(sql, new { application_task_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_subtask", ex);
            }
        }

        public async Task<int> ChangeStatus(int subtask_id, int status_id)
        {
            var sql = @"UPDATE ""application_subtask"" SET status_id = @status_id WHERE id = @subtask_id";

            await _dbConnection.ExecuteAsync(sql, new { subtask_id, status_id }, transaction: _dbTransaction);

            return subtask_id;
        }
        public async Task<List<application_subtask>> GetSubtasksByUserId(int userId)
        {
            try
            {
                var sql = @"
select sub.*, st.name status_name, st.code status_code, typ.name type_name, st.textcolor status_text_color, st.backcolor status_back_color from application_subtask sub

left join application_subtask_assignee sign on sign.application_subtask_id = sub.id
left join employee_in_structure estr on estr.id = sign.structure_employee_id
left join employee emp on emp.id = estr.employee_id
left join ""User"" us on us.""userId"" = emp.user_id
	left join task_status st on st.id = sub.status_id
	left join task_type typ on typ.id = sub.type_id

	where us.""id"" = @userId and st.code != 'done' AND estr.date_end > Now()
	group by sub.id, st.name, typ.name, st.code, st.textcolor, st.backcolor
";
                var models = await _dbConnection.QueryAsync<application_subtask>(sql, new { userId }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }
        public async Task<List<application_subtask>> GetMyStructureSubtasks(int userId)
        {
            try
            {
                var sql = @"
select sub.*, st.name status_name, st.code status_code, typ.name type_name, st.textcolor status_text_color, st.backcolor status_back_color from application_subtask sub

left join application_task task on sub.application_task_id = task.id
	left join org_structure str on str.id = task.structure_id
	left join employee_in_structure estr on estr.structure_id = str.id
left join employee emp on emp.id = estr.employee_id
left join ""User"" us on us.""userId"" = emp.user_id
	left join task_status st on st.id = sub.status_id
	left join task_type typ on typ.id = sub.type_id

	where us.""id"" = @userId
	group by sub.id, st.name, typ.name, st.code, st.textcolor, st.backcolor
";
                var models = await _dbConnection.QueryAsync<application_subtask>(sql, new { userId }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }


    }
}
