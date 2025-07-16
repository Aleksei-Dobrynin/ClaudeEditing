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
    public class application_taskRepository : Iapplication_taskRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public application_taskRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<application_task>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"application_task\"";
                var models = await _dbConnection.QueryAsync<application_task>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }

        public async Task<int> Add(application_task domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new application_taskModel
                {
                    structure_id = domain.structure_id,
                    id = domain.id,
                    application_id = domain.application_id,
                    task_template_id = domain.task_template_id,
                    comment = domain.comment,
                    name = domain.name,
                    is_required = domain.is_required,
                    order = domain.order,
                    status_id = domain.status_id,
                    progress = domain.progress,
                    type_id = domain.type_id,
                    task_deadline = domain.task_deadline,
                    is_main = domain.is_main
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO \"application_task\"(\"created_at\", \"updated_at\", \"created_by\", \"updated_by\", \"structure_id\", \"application_id\", \"task_template_id\", \"comment\", \"name\", \"is_required\", \"order\", \"status_id\", \"progress\", \"type_id\",\"task_deadline\",\"is_main\") " +
                    "VALUES (@created_at, @updated_at, @created_by, @updated_by, @structure_id, @application_id, @task_template_id, @comment, @name, @is_required, @order, @status_id, @progress, @type_id, @task_deadline, @is_main) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_task", ex);
            }
        }

        public async Task Update(application_task domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new application_taskModel
                {
                    structure_id = domain.structure_id,
                    id = domain.id,
                    application_id = domain.application_id,
                    task_template_id = domain.task_template_id,
                    comment = domain.comment,
                    name = domain.name,
                    is_required = domain.is_required,
                    order = domain.order,
                    status_id = domain.status_id,
                    progress = domain.progress,
                    type_id = domain.type_id,
                    task_deadline = domain.task_deadline,
                    is_main = domain.is_main
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE \"application_task\" SET \"updated_at\" = @updated_at, \"updated_by\" = @updated_by, \"structure_id\" = @structure_id, \"id\" = @id, \"application_id\" = @application_id, \"task_template_id\" = @task_template_id, \"comment\" = @comment, \"name\" = @name, \"is_required\" = @is_required, \"order\" = @order, \"status_id\" = @status_id, \"progress\" = @progress, \"type_id\" = @type_id, \"is_main\" = @is_main, \"task_deadline\" = @task_deadline WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_task", ex);
            }
        }

        public async Task<PaginatedList<application_task>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"application_task\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<application_task>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"application_task\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<application_task>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_tasks", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var setUserQuery = $"SET LOCAL \"bga.current_user\" TO '{await _userRepository.GetUserID()}'";
                _dbConnection.Execute(setUserQuery, transaction: _dbTransaction);
                
                var model = new { id = id };
                var sql = "DELETE FROM \"application_task\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_task", ex);
            }
        }
        public async Task<application_task> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT task.*, app.number application_number, org.name structure_idNavName, st.textcolor status_text_color, st.code status_code, st.name status_name FROM ""application_task"" task 
left join application app on app.id = task.application_id 
left join org_structure org on org.id = task.structure_id
left join task_status st on st.id = task.status_id
WHERE task.id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<application_task>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }


        public async Task<List<application_task>> GetByapplication_id(int application_id)
        {
            
            try
            {
                var sql = @"SELECT string_agg(concat(e.last_name, ' ', e.first_name), ', ') assignees, task.*, st.name status_idNavName, CONCAT(org.name, CASE WHEN org.short_name IS NOT NULL THEN CONCAT(' (', org.short_name, ')') ELSE '' END) AS structure_idNavName,
                                   org.short_name structure_idNavShortName, st.code status_code,
                                   typ.name type_name, st.textcolor status_text_color, st.backcolor status_back_color,
                                    ap.service_id
                            FROM application_task task
                                left join task_status st on st.id = task.status_id
                                left join task_type typ on typ.id = task.type_id
                                left join org_structure org on org.id = task.structure_id
                            left join application_task_assignee on task.id = application_task_assignee.application_task_id
                            left join employee_in_structure eis on application_task_assignee.structure_employee_id = eis.id
                            left join employee e on eis.employee_id = e.id
                            left join application ap on ap.id = task.application_id
                            WHERE task.application_id = @application_id
                    group by task.id, st.id, org.id, typ.id, ap.service_id
";
                var models = await _dbConnection.QueryAsync<application_task>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }
        public async Task<List<application_task>> GetOtherTaskByTaskId(int task_id)
        {
            try
            {
                var sql = @"select task.*, st.name status_idNavName, org.name structure_idNavName, 
                                   typ.name type_name, st.textcolor status_text_color, st.backcolor status_back_color from application_task tt
	left join application_task task on tt.application_id = task.application_id
	left join task_status st on st.id = task.status_id
	left join org_structure org on org.id = task.structure_id
	left join task_type typ on typ.id = task.type_id
	where tt.id = @task_id and task.id != @task_id
";
                var models = await _dbConnection.QueryAsync<application_task>(sql, new { task_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }

        public async Task<List<application_task>> GetBytask_template_id(int task_template_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_task\" WHERE \"task_template_id\" = @task_template_id";
                var models = await _dbConnection.QueryAsync<application_task>(sql, new { task_template_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }

        public async Task<List<ApplicationTaskPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end, bool out_of_date)
        {
            try
            {
                var sql = @"
select concat(e.last_name, ' ', e.first_name) as employee, os.name structure, ts.name status, tt.name type,
	to_char(at.created_at, 'YYYY') as year,
	to_char(at.created_at, 'MONTH') as month,
	to_char(at.created_at, 'DAY') as day
from application_task at
left join application a on a.id = at.application_id
left join task_status ts on ts.id = at.status_id
left join application_task_assignee ata on ata.application_task_id = at.id
left join employee_in_structure eis on ata.structure_employee_id = eis.id 
left join org_structure os on os.id = eis.structure_id
left join task_type tt on tt.id = at.type_id
inner join employee e on e.id = eis.employee_id
where at.created_at > @date_start and at.created_at < @date_end
";
                if (out_of_date)
                {
                    sql += " and now() > a.deadline ";
                }
                sql += " order by at.created_at desc";

                var model = await _dbConnection.QueryAsync<ApplicationTaskPivot>(sql, new { date_end, date_start }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var res = model.ToList();
                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }        
        public async Task<List<ApplicationTaskPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end, bool out_of_date, string user_id)
        {
            try
            {
                var sql = @"
select concat(e.last_name, ' ', e.first_name) as employee, os.name structure, ts.name status, tt.name type,
	to_char(at.created_at, 'YYYY') as year,
	to_char(at.created_at, 'MONTH') as month,
	to_char(at.created_at, 'DAY') as day
from application_task at
left join application a on a.id = at.application_id
left join task_status ts on ts.id = at.status_id
left join application_task_assignee ata on ata.application_task_id = at.id
left join employee_in_structure eis on ata.structure_employee_id = eis.id 
left join org_structure os on os.id = eis.structure_id
left join task_type tt on tt.id = at.type_id
inner join employee e on e.id = eis.employee_id
LEFT JOIN employee e2 ON eis.employee_id = e2.id
where at.created_at > @date_start and at.created_at < @date_end and e2.user_id = @user_id
";
                if (out_of_date)
                {
                    sql += " and now() > a.deadline ";
                }
                sql += " order by at.created_at desc";

                var model = await _dbConnection.QueryAsync<ApplicationTaskPivot>(sql, new { date_end, date_start, user_id }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var res = model.ToList();
                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<List<ApplicationTaskPivot>> GetForPivotHeadDashboard(DateTime date_start, DateTime date_end, bool out_of_date, int[] structure_ids)
        {
            try
            {
                var sql = @"
select concat(e.last_name, ' ', e.first_name) as employee, os.name structure, ts.name status, tt.name type,
	to_char(at.created_at, 'YYYY') as year,
	to_char(at.created_at, 'MONTH') as month,
	to_char(at.created_at, 'DAY') as day,
    at.is_main
from application_task at
left join application a on a.id = at.application_id
left join task_status ts on ts.id = at.status_id
left join application_task_assignee ata on ata.application_task_id = at.id
left join employee_in_structure eis on ata.structure_employee_id = eis.id 
left join org_structure os on os.id = eis.structure_id
left join task_type tt on tt.id = at.type_id
inner join employee e on e.id = eis.employee_id
where at.created_at > @date_start and at.created_at < @date_end
and os.id = any(@structure_ids)
";
                if (out_of_date)
                {
                    sql += " and now() > a.deadline ";
                }
                sql += " order by at.created_at desc";

                var model = await _dbConnection.QueryAsync<ApplicationTaskPivot>(sql, new { date_end, date_start, structure_ids }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var res = model.ToList();
                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<List<application_task>> GetBystatus_id(int status_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_task\" WHERE \"status_id\" = @status_id";
                var models = await _dbConnection.QueryAsync<application_task>(sql, new { status_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }

        public async Task<List<application_task>> GetTasksByUserId(int userId, string search, DateTime? date_start, DateTime? date_end, bool? isExpiredTasks)
        {
            try
            {
                var sql = @"
select task.*, st.name status_idNavName, cus.full_name, cus.pin,  string_agg(DISTINCT obj.address, '; ') as address, app.deadline app_deadline,
	string_agg(DISTINCT dis.name, '; ') as district, string_agg(distinct concat(emp.last_name, ' ', emp.first_name), ', ') assignees,
	string_agg(DISTINCT cc.value, ', ') as contact,
	s.name service_name, st.textcolor status_text_color, st.backcolor status_back_color, 
	org.name structure_idNavName, typ.name type_name,
	case when app.is_electronic_only then app.number || ' (Электронная Выдача)' else app.number end as application_number, count(sub.id) subtasks, sum(case when sst.code = 'done' then 1 else 0 end) done_subtasks,
    app.status_id as application_status_id,
    st1.code as application_status_code
from application_task task 
	left join application_task_assignee sign on sign.application_task_id = task.id
	left join employee_in_structure estr on estr.id = sign.structure_employee_id
	left join employee emp on emp.id = estr.employee_id
	left join ""User"" on ""User"".""userId"" = emp.user_id
	left join org_structure org on org.id = task.structure_id
	left join task_status st on st.id = task.status_id
	left join application app on task.application_id = app.id
    left join application_status st1 on st1.id = app.status_id
	left join customer cus on cus.id = app.customer_id
	left join customer_contact cc on cc.customer_id = cus.id
	left join service s on s.id = app.service_id
	left join application_object ao on ao.application_id = app.id
	left join arch_object obj on obj.id = ao.arch_object_id
	left join district dis on dis.id = obj.district_id
	left join application_subtask sub on sub.application_task_id = task.id
	left join task_status sst on sst.id = sub.status_id
	left join task_type typ on typ.id = task.type_id

	where ""User"".""id"" = @userId AND estr.date_end > Now()
";
                if (date_start != null)
                {
                    sql += @$"
        AND app.registration_date >= @date_start";
                }
                if (date_end != null)
                {
                    sql += @$"
        AND app.registration_date <= @date_end";
                }

                if (isExpiredTasks != null && isExpiredTasks.Value)
                {
                    sql += @$" AND task.task_deadline::date <= now()::date";
                }

                sql += @"
		and (@search = '' 
		or app.number like @search
        or LOWER(concat(emp.last_name, ' ', emp.first_name)) like @search
        or LOWER(cus.full_name) like @search
        or LOWER(cus.pin) like @search
        or LOWER(obj.address) like @search
        or LOWER(s.name) like @search
        or LOWER(cc.value) like @search
        or LOWER(task.name) like @search
        or LOWER(app.work_description) like @search)
	group by task.id, st.name, st1.code, org.name, app.id, typ.name, st.textcolor, st.backcolor, cus.full_name, cus.pin, s.name, obj.address
    order by task.created_at desc
";

                var models = await _dbConnection.QueryAsync<application_task>(sql, new { userId, search, date_start, date_end }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }

        public async Task<application_task> GetOneWithAppInfo(int task_id)
        {
            try
            {
                var sql = @"
select task.*, string_agg(distinct concat(e.last_name, ' ', e.first_name), ', ') assignees, st.name status_idNavName, cus.full_name, cus.pin,
    obj.address, s.name service_name, st.textcolor status_text_color, st.backcolor status_back_color, typ.name type_name, app.deadline app_deadline,
	app.number application_number, app.work_description, string_agg(distinct cc.value, ', ') contact
from application_task task 

    left join application_task_assignee ats on ats.application_task_id = task.id
	left join employee_in_structure eis on ats.structure_employee_id = eis.id
	left join employee e on e.id = eis.employee_id

	left join task_status st on st.id = task.status_id
	left join application app on task.application_id = app.id
	left join application_status apst on apst.id = app.status_id
	left join customer cus on cus.id = app.customer_id
	left join customer_contact cc on cc.customer_id = cus.id
	left join service s on s.id = app.service_id
	left join arch_object obj on obj.id = app.arch_object_id
	left join task_type typ on typ.id = task.type_id
	where task.id = @task_id
	group by task.id, st.name, typ.name, st.textcolor, st.backcolor, cus.id, obj.address, s.name, app.id
";
                var models = await _dbConnection.QueryAsync<application_task>(sql, new { task_id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }
        public async Task<List<application_task>> GetMyStructuresTasks(int userId, string search, DateTime? date_start, DateTime? date_end, bool? isExpiredTasks)
        {
            search = search == null ? "" : "%" + search.ToLower() + "%";
            try
            {
                var sql = @"
select task.*, string_agg(distinct concat(e.last_name, ' ', e.first_name), ', ') assignees, st.name status_idNavName, cus.full_name, cus.pin, app.deadline app_deadline,
    obj.address, s.name service_name, st.textcolor status_text_color, st.backcolor status_back_color, str.name structure_idNavName, typ.name type_name,
	case when app.is_electronic_only then app.number || ' (Электронная Выдача)' else app.number end as application_number, app.work_description, string_agg(distinct cc.value, ', ') contact,
    app.status_id as application_status_id,
    apst.code as application_status_code
from application_task task 
	left join org_structure str on str.id = task.structure_id
	left join employee_in_structure estr on estr.structure_id = str.id
	left join employee emp on emp.id = estr.employee_id
	left join ""User"" on ""User"".""userId"" = emp.user_id
    
    left join application_task_assignee ats on ats.application_task_id = task.id
	left join employee_in_structure eis on ats.structure_employee_id = eis.id
	left join employee e on e.id = eis.employee_id

	left join task_status st on st.id = task.status_id
	left join application app on task.application_id = app.id
	left join application_status apst on apst.id = app.status_id
	left join customer cus on cus.id = app.customer_id
	left join customer_contact cc on cus.id = cc.customer_id
	left join service s on s.id = app.service_id
	left join arch_object obj on obj.id = app.arch_object_id
	-- left join application_subtask sub on sub.application_task_id = task.id
	-- left join task_status sst on sst.id = sub.status_id
	left join task_type typ on typ.id = task.type_id
	where ""User"".""id"" = @userId  AND estr.date_end > Now()";
                

                if (date_start != null)
                {
                    sql += @$"
        AND app.registration_date >= @date_start";
                }
                if (date_end != null)
                {
                    sql += @$"
        AND app.registration_date <= @date_end";
                }
                if (isExpiredTasks != null && isExpiredTasks.Value)
                {
                    sql += @$" AND task.task_deadline::date <= now()::date";
                }


                sql += @"
		and (@search = '' 
		or app.number like @search
        or LOWER(concat(e.last_name, ' ', e.first_name)) like @search
        or LOWER(cus.full_name) like @search
        or LOWER(cus.pin) like @search
        or LOWER(obj.address) like @search
        or LOWER(s.name) like @search
        or LOWER(cc.value) like @search
        or LOWER(task.name) like @search
        or LOWER(app.work_description) like @search)
	group by task.id, st.name, str.name, typ.name, st.textcolor, st.backcolor, cus.id, obj.address, s.name, app.id, apst.code
    order by app.registration_date desc
";
                var models = await _dbConnection.QueryAsync<application_task>(sql, new { userId, search, date_start, date_end, isExpiredTasks }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }
        
        public async Task<PaginatedList<application_task>> GetAllTasks(string search, DateTime? date_start, DateTime? date_end, int page, int pageSize)
        {
            search = search == null ? "" : "%" + search.ToLower() + "%";
            try
            {
                var sql = @"
select task.*, string_agg(distinct concat(e.last_name, ' ', e.first_name), ', ') assignees, st.name status_idNavName, cus.full_name, cus.pin, app.deadline app_deadline,
    obj.address, s.name service_name, st.textcolor status_text_color, st.backcolor status_back_color, str.name structure_idNavName, typ.name type_name,
	case when app.is_electronic_only then app.number || ' (Электронная Выдача)' else app.number end as application_number, app.work_description, string_agg(distinct cc.value, ', ') contact,
    app.status_id as application_status_id,
    apst.code as application_status_code
from application_task task 
	left join org_structure str on str.id = task.structure_id
    
    left join application_task_assignee ats on ats.application_task_id = task.id
	left join employee_in_structure eis on ats.structure_employee_id = eis.id
	left join employee e on e.id = eis.employee_id

	left join task_status st on st.id = task.status_id
	left join application app on task.application_id = app.id
	left join application_status apst on apst.id = app.status_id
	left join customer cus on cus.id = app.customer_id
	left join customer_contact cc on cus.id = cc.customer_id
	left join service s on s.id = app.service_id
	left join arch_object obj on obj.id = app.arch_object_id
	left join task_type typ on typ.id = task.type_id
	where 1=1 ";

                if (date_start != null)
                {
                    sql += @$"
        AND app.registration_date >= @date_start";
                }
                if (date_end != null)
                {
                    sql += @$"
        AND app.registration_date <= @date_end";
                }

                sql += @"
		and (@search = '' 
		or app.number like @search
        or LOWER(concat(e.last_name, ' ', e.first_name)) like @search
        or LOWER(cus.full_name) like @search
        or LOWER(cus.pin) like @search
        or LOWER(obj.address) like @search
        or LOWER(s.name) like @search
        or LOWER(cc.value) like @search
        or LOWER(task.name) like @search
        or LOWER(app.work_description) like @search)
	group by task.id, st.name, str.name, typ.name, st.textcolor, st.backcolor, cus.id, obj.address, s.name, app.id, apst.code
    order by app.registration_date desc
    
";
                // pagesize
                var sqlWithPagination = sql + @"
        OFFSET @page Limit @pageSize;
        ";
                var models = await _dbConnection.QueryAsync<application_task>(sqlWithPagination, new { search, date_start, date_end, page, pageSize }, transaction: _dbTransaction);
                var counts = await _dbConnection.QueryAsync<application_task>(sql, new { search, date_start, date_end, page, pageSize }, transaction: _dbTransaction);

                return new PaginatedList<Domain.Entities.application_task>(models.ToList(), counts.Count(), page,
                    pageSize);

            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }

        public async Task<int> ChangeStatus(int task_id, int status_id)
        {
            var sql = @"UPDATE  ""application_task"" SET status_id = @status_id WHERE id = @task_id";

            await _dbConnection.ExecuteAsync(sql, new { task_id, status_id }, transaction: _dbTransaction);

            return task_id;
        }

        public async Task<List<ArchiveLogPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end)
        {
            try
            {
                //TODO
                var sql = @"
select 
	to_char(al.date_take, 'YYYY') as year,
	to_char(al.date_take, 'MONTH') as month,
	to_char(al.date_take, 'DAY') as day,
	    CASE
        WHEN CURRENT_DATE - date_take::date <= 3 THEN '1-3 дней'
        WHEN CURRENT_DATE - date_take::date between 4 and 7 THEN '4-7 дней'
		WHEN CURRENT_DATE - date_take::date between 8 and 14 THEN '8-14 дней'
		WHEN CURRENT_DATE - date_take::date > 14 THEN 'более 14 дней'
    END AS gradation,
os.name as structure, st.name as status, concat(e.last_name, ' ', e.first_name) as employee
from archive_log al
left join archive_log_status st on st.id = al.status_id
inner join org_structure os on os.id = al.take_structure_id
inner join employee e on e.id = take_employee_id
where take_structure_id > 0 and date_return is null and al.date_take is not null 
and st.id = 2


";
            

                var model = await _dbConnection.QueryAsync<ArchiveLogPivot>(sql, new { date_end, date_start }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var res = model.ToList();
                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }        
        
        public async Task<List<ArchiveLogPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end, string user_id)
        {
            try
            {
                //TODO
                var sql = @"
select 
	to_char(al.date_take, 'YYYY') as year,
	to_char(al.date_take, 'MONTH') as month,
	to_char(al.date_take, 'DAY') as day,
	    CASE
        WHEN CURRENT_DATE - date_take::date <= 3 THEN '1-3 дней'
        WHEN CURRENT_DATE - date_take::date between 4 and 7 THEN '4-7 дней'
		WHEN CURRENT_DATE - date_take::date between 8 and 14 THEN '8-14 дней'
		WHEN CURRENT_DATE - date_take::date > 14 THEN 'более 14 дней'
    END AS gradation,
os.name as structure, st.name as status, concat(e.last_name, ' ', e.first_name) as employee
from archive_log al
left join archive_log_status st on st.id = al.status_id
inner join org_structure os on os.id = al.take_structure_id
inner join employee e on e.id = take_employee_id
                 LEFT JOIN employee_in_structure ON os.id = employee_in_structure.structure_id
         LEFT JOIN employee e2 ON employee_in_structure.employee_id = e2.id
where take_structure_id > 0 and date_return is null and al.date_take is not null and e2.user_id = @user_id
and st.id = 2


";
            

                var model = await _dbConnection.QueryAsync<ArchiveLogPivot>(sql, new { date_end, date_start, user_id }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var res = model.ToList();
                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

    }
}
