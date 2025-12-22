using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using System.Xml.Linq;
using System.Globalization;
using Google.Protobuf.WellKnownTypes;
using Mysqlx.Crud;
using Infrastructure.FillLogData;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;

namespace Infrastructure.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public ApplicationRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<Domain.Entities.Application>> GetAll()
        {
            try
            {
                var sql = @"SELECT application.id, application.object_tag_id, registration_date, customer_id, customer.full_name as customer_name, maria_db_statement_id,
                                    status_id, workflow_id, service_id, deadline, arch_object_id, work_description, arch_object.name as arch_object_name,
                                    CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name, is_paid, number
                                    FROM application
                                    left join customer on customer.id = application.customer_id
                                    left join arch_object on arch_object.id = application.arch_object_id
                                    left join ""User"" uc on uc.id = application.created_by
                                    left join employee emp_c on emp_c.user_id = uc.""userId"";";
                var models =
                    await _dbConnection.QueryAsync<Domain.Entities.Application>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }
        public async Task<List<Domain.Entities.Application>> GetFromCabinet()
        {
            try
            {
                var sql = @"SELECT app.id, registration_date, customer_id, cus.full_name as customer_name,  st.name status_name, st.code status_code, st.status_color status_color,
                                    status_id, app.workflow_id, service_id, deadline, arch_object_id, work_description, obj.name as arch_object_name, s.name service_name, s.day_count,
                                     is_paid, number, string_agg(DISTINCT obj.address, '; ') as arch_object_address, string_agg(DISTINCT dis.name, '; ') as arch_object_district,
       app.status_id as application_status_id,
       st.code as application_status_code,
       st.group_code as application_status_group_code
                                    FROM application app
    left join application_status st on st.id = app.status_id
                                    left join service s on s.id = app.service_id
                                    left join customer cus on cus.id = app.customer_id
                                    left join arch_object obj on obj.id = app.arch_object_id
                                    left join district dis on dis.id = obj.district_id
where st.code = 'from_cabinet' or st.code = 'rejected_cabinet'
group by app.id, cus.id, st.id, obj.id, s.id
order by app.registration_date desc
limit 100
";
                var models =
                    await _dbConnection.QueryAsync<Domain.Entities.Application>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }

        public async Task<List<Domain.Entities.Application>> GetByFilterFromCabinet(PaginationFields filter, bool onlyCount)
        {
            try
            {
                var countSql = @"
SELECT count(distinct app.id)
FROM application app
        LEFT JOIN customer cus on cus.id = app.customer_id 
        LEFT JOIN service on service.id = app.service_id
        LEFT JOIN application_object ao on ao.application_id = app.id
        LEFT JOIN arch_object obj on ao.arch_object_id = obj.id
        LEFT JOIN district dis on obj.district_id = dis.id
        LEFT JOIN application_status st on app.status_id = st.id
        LEFT JOIN application_task task on task.application_id = app.id
        LEFT JOIN application_task_assignee ats on ats.application_task_id = task.id
        LEFT JOIN employee_in_structure eis on eis.id = ats.structure_employee_id
        LEFT JOIN structure_post sp on sp.id = eis.post_id
        LEFT JOIN employee eee on eee.id = eis.employee_id
        LEFT JOIN customer_contact cc on cus.id = cc.customer_id 
        left join ""User"" uc on uc.id = app.created_by
        left join employee emp_c on emp_c.user_id = uc.""userId""
        left join workflow w on service.workflow_id = w.id
        LEFT JOIN architecture_process proc on proc.id = app.id
        LEFT JOIN ""User"" u_proc on u_proc.id = proc.created_by
        LEFT JOIN employee e_proc on e_proc.user_id = u_proc.""userId""
        ";

                var mainSql = @"
SELECT app.id, app.done_date, app.object_tag_id, registration_date, app.customer_id, 
       cus.full_name as customer_name, cus.pin as customer_pin, app.status_id, 
       app.workflow_id, st.name status_name, st.code status_code, 
       st.status_color status_color, maria_db_statement_id,
       service_id, service.name as service_name, deadline, work_description, 
       string_agg(DISTINCT obj.name, '; ') as arch_object_name, 
       string_agg(DISTINCT obj.address, '; ') as arch_object_address, 
       string_agg(DISTINCT dis.name, '; ') as arch_object_district,
       CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
       is_paid, number, app.total_sum, app.total_payed, service.day_count,
       string_agg(DISTINCT CONCAT(COALESCE(eee.last_name, ''), ' ', COALESCE(eee.first_name, '')), ', ') AS assigned_employees_names,
       string_agg(DISTINCT coalesce(cc.value), ', ') AS customer_contacts
FROM application app
        LEFT JOIN customer cus on cus.id = app.customer_id 
        LEFT JOIN service on service.id = app.service_id
        LEFT JOIN application_object ao on ao.application_id = app.id
        LEFT JOIN arch_object obj on ao.arch_object_id = obj.id
        LEFT JOIN district dis on obj.district_id = dis.id
        LEFT JOIN application_status st on app.status_id = st.id
        LEFT JOIN application_task task on task.application_id = app.id
        LEFT JOIN application_task_assignee ats on ats.application_task_id = task.id
        LEFT JOIN employee_in_structure eis on eis.id = ats.structure_employee_id
        LEFT JOIN structure_post sp on sp.id = eis.post_id
        LEFT JOIN employee eee on eee.id = eis.employee_id
        LEFT JOIN customer_contact cc on cus.id = cc.customer_id 
        left join ""User"" uc on uc.id = app.created_by
        left join employee emp_c on emp_c.user_id = uc.""userId""
        left join workflow w on service.workflow_id = w.id
        LEFT JOIN architecture_process proc on proc.id = app.id
        LEFT JOIN ""User"" u_proc on u_proc.id = proc.created_by
        LEFT JOIN employee e_proc on e_proc.user_id = u_proc.""userId""
        ";

                var sql = "";

                // Check if only_cabinet filter is true
                if (filter.only_cabinet == true)
                {
                    sql += " WHERE (st.code = 'from_cabinet' OR st.code = 'rejected_cabinet') ";

                    // Add other filters if needed
                    if (filter.useCommon && !string.IsNullOrWhiteSpace(filter.common_filter))
                    {
                        sql += @" AND (lower(app.number) LIKE lower (CONCAT('%', @common_filter, '%'))
or lower(cus.full_name) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(cus.pin) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(obj.address) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(cc.value) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(app.work_description) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(app.incoming_numbers) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(app.outgoing_numbers) LIKE lower(CONCAT('%', @common_filter, '%')))";
                    }
                }
                else if (filter.useCommon)
                {
                    if (string.IsNullOrWhiteSpace(filter.common_filter))
                    {
                        sql += "WHERE 1=1 ";
                        if (filter.isExpired != null && filter.isExpired.Value)
                        {
                            if ((filter.deadline_day ?? 0) == 0)
                            {
                                sql += @$" AND (deadline::date < CURRENT_DATE and (st.group_code in ('in_progress')))";
                            }
                            else if (filter.deadline_day == -1)
                            {
                                sql += @$" AND (deadline::date = CURRENT_DATE and (st.group_code in ('in_progress')))";
                            }
                            else if (filter.deadline_day == 7)
                            {
                                sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '4 days' AND CURRENT_DATE + INTERVAL '7 days' AND (st.group_code in ('in_progress')))";
                            }
                            else if (filter.deadline_day == 3)
                            {
                                sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '1 days' AND CURRENT_DATE + INTERVAL '3 days' AND (st.group_code in ('in_progress')))";
                            }
                            else if (filter.deadline_day == 1)
                            {
                                sql += @$" and (deadline::DATE = CURRENT_DATE + INTERVAL '1 day' and  (st.group_code in ('in_progress')))";
                            }
                        }
                    }
                    else
                    {
                        sql += @"WHERE (lower(app.number) LIKE lower (CONCAT('%', @common_filter, '%'))
or lower(cus.full_name) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(cus.pin) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(obj.address) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(cc.value) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(app.work_description) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(app.incoming_numbers) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(app.outgoing_numbers) LIKE lower(CONCAT('%', @common_filter, '%')))";
                    }
                }
                else
                {
                    sql = "where 1=1 ";
                    if (filter.withoutAssignedEmployee == true)
                    {
                        sql += " and sp.code != 'employee' ";
                    }
                    if (!string.IsNullOrEmpty(filter.pin))
                    {
                        sql += " and LOWER(cus.pin) like concat('%', @pin, '%') ";
                    }
                    if (!string.IsNullOrEmpty(filter.number))
                    {
                        sql += " and LOWER(app.number) like concat('%', @number, '%') ";
                    }
                    if (!string.IsNullOrEmpty(filter.address))
                    {
                        sql += @$"
        AND LOWER(obj.address) like '%{filter.address.ToLower()}%'";
                    }
                    if (!string.IsNullOrEmpty(filter.customerName))
                    {
                        sql += @$"
        AND LOWER(cus.full_name) LIKE concat('%',@customer_name,'%') ";
                    }

                    if (filter.service_ids.Count() > 0)
                    {
                        sql += @$"
        AND service_id in ({string.Join(',', filter.service_ids)})";
                    }
                    if (filter.status_ids.Count() > 0)
                    {
                        sql += @$"
        AND app.status_id in ({string.Join(',', filter.status_ids)})";
                    }

                    if (filter.district_id != null && filter.district_id != 0)
                    {
                        sql += @$"
        AND obj.district_id = {filter.district_id}";
                    }

                    // NEW: Tunduk address unit filtering
                    if (filter.tunduk_address_unit_id != null && filter.tunduk_address_unit_id != 0)
                    {
                        sql += @$"
        AND obj.tunduk_address_unit_id = {filter.tunduk_address_unit_id}";
                    }

                    // NEW: Tunduk street filtering
                    if (filter.tunduk_street_id != null && filter.tunduk_street_id != 0)
                    {
                        sql += @$"
        AND obj.tunduk_street_id = {filter.tunduk_street_id}";
                    }

                    if (filter.employee_arch_id != null && filter.employee_arch_id != 0)
                    {
                        sql += @$"
        AND e_proc.id = {filter.employee_arch_id}";
                        if (filter.dashboard_date_start != null)
                        {
                            sql += @$"
            AND proc.created_at >= @dashboard_date_start";
                        }
                        if (filter.dashboard_date_end != null)
                        {
                            sql += @$"
            AND proc.created_at <= @dashboard_date_end";
                        }
                    }

                    if (filter.employee_id != null && filter.employee_id != 0)
                    {
                        sql += @$" AND eee.id = {filter.employee_id}";
                    }

                    if (!string.IsNullOrEmpty(filter.incoming_numbers))
                    {
                        sql += " and LOWER(app.incoming_numbers) like concat('%', @incomingNumbers, '%') ";
                    }

                    if (!string.IsNullOrEmpty(filter.outgoing_numbers))
                    {
                        sql += " and LOWER(app.outgoing_numbers) like concat('%', @outgoingNumbers, '%') ";
                    }

                    if (filter.isExpired != null && filter.isExpired.Value)
                    {
                        if ((filter.deadline_day ?? 0) == 0)
                        {
                            sql += @$" AND (deadline::date < CURRENT_DATE and (st.group_code in ('in_progress')))";
                        }
                        else if (filter.deadline_day == -1)
                        {
                            sql += @$" AND (deadline::date = CURRENT_DATE and (st.group_code in ('in_progress')))";
                        }
                        else if (filter.deadline_day == 7)
                        {
                            sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '4 days' AND CURRENT_DATE + INTERVAL '7 days' AND (st.group_code in ('in_progress')))";
                        }
                        else if (filter.deadline_day == 3)
                        {
                            sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '1 days' AND CURRENT_DATE + INTERVAL '3 days' AND (st.group_code in ('in_progress')))";
                        }
                        else if (filter.deadline_day == 1)
                        {
                            sql += @$" and (deadline::DATE = CURRENT_DATE + INTERVAL '1 day' and  (st.group_code in ('in_progress')))";
                        }
                    }

                    if (filter.date_start != null)
                    {
                        sql += @$"
        AND registration_date >= @date_start";
                    }

                    if (filter.date_end != null)
                    {
                        sql += @$"
        AND registration_date <= @date_end";
                    }
                }

                if (filter.structure_ids != null && filter.structure_ids.Length > 0)
                {
                    sql += @$"
                        AND w.id in (select wtt.workflow_id from workflow_task_template wtt where wtt.type_id != 1 and wtt.structure_id in ({string.Join(',', filter.structure_ids)}))";
                }

                if (filter.is_paid != null)
                {
                    sql += $@"
           AND (
        (@is_paid = true AND (is_paid = true OR (is_paid = false AND total_payed >= total_sum AND total_payed > 0)))
        OR (@is_paid = false AND is_paid = false AND total_payed < total_sum)
    )";
                }

                countSql = countSql + sql;
                // group
                sql += @$" 
        group by app.id, cus.id, service.id, st.id, emp_c.id";

                // sort
                if (filter.sort_by != null && filter.sort_type != null)
                {
                    sql += @$"
        ORDER BY {filter.sort_by} {filter.sort_type}";
                }
                else
                {
                    sql += @$"
        ORDER BY app.id desc";
                }

                // pagesize
                var sqlWithPagination = sql + @"
        OFFSET @pageSize * @pageNumber Limit @pageSize;
        ";

                IEnumerable<Domain.Entities.Application> models = new List<Domain.Entities.Application>();
                if (!onlyCount)
                {
                    models = await _dbConnection.QueryAsync<Domain.Entities.Application>(mainSql + sqlWithPagination,
                    new
                    {
                        filter.pageSize,
                        filter.pageNumber,
                        pin = filter.pin?.ToLower(),
                        customer_name = filter.customerName?.ToLower(),
                        number = filter.number?.ToLower(),
                        filter.date_start,
                        filter.date_end,
                        filter.common_filter,
                        incomingNumbers = filter.incoming_numbers,
                        outgoingNumbers = filter.outgoing_numbers,
                        filter.dashboard_date_start,
                        filter.dashboard_date_end,
                        is_paid = filter.is_paid,
                    }, transaction: _dbTransaction);
                }

                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(countSql,
                  new
                  {
                      filter.pageSize,
                      filter.pageNumber,
                      pin = filter.pin?.ToLower(),
                      customer_name = filter.customerName?.ToLower(),
                      number = filter.number?.ToLower(),
                      filter.date_start,
                      filter.date_end,
                      filter.common_filter,
                      incomingNumbers = filter.incoming_numbers,
                      outgoingNumbers = filter.outgoing_numbers,
                      filter.dashboard_date_start,
                      filter.dashboard_date_end,
                      is_paid = filter.is_paid,
                  }, transaction: _dbTransaction);

                var domainItems = models.ToList();
                return domainItems;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }
        public async Task<int> GetCountAppsFromCabinet()
        {
            try
            {
                var sql = @"SELECT count(*) from application app 
left join application_status st on st.id = app.status_id where st.code = 'from_cabinet'
";
                var res =
                    await _dbConnection.QuerySingleOrDefaultAsync<int>(sql, transaction: _dbTransaction);
                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }


        public async Task<List<Domain.Entities.ApplicationTask>> GetApplicationsByUserId(string userID, string searchField, string orderBy, string orderType, int skipItem, int getCountItems, string? queryFilter)
        {
            searchField = searchField == null ? "" : searchField.ToLower();
            try
            {
                var sql = @"
WITH task_assignee_count AS (
    SELECT
        t.id AS task_id,
        ARRAY_AGG(ata.structure_employee_id) AS structure_employee_ids,
        COUNT(ata.id) AS assignee_count
    FROM application_task t
             LEFT JOIN application_task_assignee ata ON t.id = ata.application_task_id
    GROUP BY t.id
)
select app.id,
       app.object_tag_id,
       app.deadline app_deadline,
       app.number,
       app.registration_date,
       app.deadline,
       app.tech_decision_id,
       app.status_id as application_status_id,
       st.code as application_status_code,
       st.group_code as application_status_group_code,
       task.id task_id,
       s.name service_name,
       ts.name status_name,
       ts.textcolor status_text_color,
       ts.backcolor status_back_color
from application app
    left join application_status st on st.id = app.status_id
    left join service s on s.id = app.service_id
    left join application_task task on task.application_id = app.id
    left join task_status ts on ts.id = task.status_id
    left join application_subtask sub on sub.application_task_id = task.id
    left join application_task_assignee tas on tas.application_task_id = task.id
    left join application_subtask_assignee sas on sas.application_subtask_id = sub.id
    left join employee_in_structure eis on tas.structure_employee_id = eis.id
    left join employee_in_structure eiss on sas.structure_employee_id = eiss.id
    left join employee e on e.id = eis.employee_id
    left join employee es on es.id = eiss.employee_id
    left JOIN task_assignee_count tac ON task.id = tac.task_id and (eis.id = ANY(tac.structure_employee_ids))
    where st.group_code != 'completed' and st.group_code != 'refusal' and (e.user_id = @userID or es.user_id = @userID)
	and (LOWER(app.number) like concat('%', @searchField, '%') or LOWER(s.name) like concat('%', @searchField, '%') or LOWER(task.name) like concat('%', @searchField, '%'))
";

                if (!string.IsNullOrEmpty(queryFilter))
                {
                    sql += @$" AND {queryFilter}";
                }

                sql += @" GROUP BY
                            app.id, app.object_tag_id, app.deadline, app.number, app.registration_date,
                            task.id, s.name, ts.name, ts.textcolor, ts.backcolor, tas.id, eis.id, app.status_id, st.id";

                if (orderBy != null && orderType != null)
                {
                    sql += @$"
        ORDER BY {orderBy} {orderType}";
                }
                else
                {
                    sql += @$"
                    order by app.registration_date desc";
                }
                if (getCountItems > 0)
                {
                    sql += " OFFSET @skipItem LIMIT @getCountItems";
                }
                var models =
                    await _dbConnection.QueryAsync<Domain.Entities.ApplicationTask>(sql, new { userID, searchField, skipItem, getCountItems }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }

        public async Task<Domain.Entities.Application> GetOneByID(int id)
        {
            try
            {
                var sql =
                    @"SELECT application.id, application.cashed_info, application.app_cabinet_uuid, application.cabinet_html, application.object_tag_id, ot.name object_tag_name, registration_date, customer_id, application.status_id, application.workflow_id, service_id, maria_db_statement_id, work_description,
                                deadline, arch_object_id, is_paid, number, obj.name as arch_object_name, obj.address as arch_object_address, obj.district_id as district_id, dis.name as arch_object_district,
                                CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name, s.name service_name, st.name status_name, st.code status_code, st.status_color status_color,
                                application.created_at, application.updated_at, cus.full_name customer_name, cus.pin customer_pin, cus.is_organization customer_is_organization, cus.address customer_address, 
                                cus.okpo customer_okpo, orgtype.name customer_organization_type_name, cus.director customer_director, ap.id arch_process_id,
                                application.incoming_numbers,
                                application.outgoing_numbers,
                                application.tech_decision_id,
                                application.total_sum,
                                application.dp_outgoing_number,
                                application.is_electronic_only
                        FROM application 
                            left join ""User"" uc on uc.id = application.created_by
                            left join employee emp_c on emp_c.user_id = uc.""userId""
                            left join customer cus on application.customer_id = cus.id
                            left join service s on s.id = application.service_id
                            left join application_status st on st.id = application.status_id
                            left join arch_object obj on application.arch_object_id = obj.id
                            left join district dis on obj.district_id = dis.id
                            left join object_tag ot on ot.id = application.object_tag_id
                            left join organization_type orgtype on cus.organization_type_id = orgtype.id 
                            left join architecture_process ap on ap.id = application.id
                        WHERE application.id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Domain.Entities.Application>(sql,
                    new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Application with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }
        public async Task<Domain.Entities.Application> GetOneByGuid(string guid)
        {
            try
            {
                var sql =
                    @"SELECT application.id, application.total_payed, application.app_cabinet_uuid, application.cabinet_html, application.object_tag_id, ot.name object_tag_name, registration_date, customer_id, application.status_id, application.workflow_id, service_id, maria_db_statement_id, work_description,
                                deadline, arch_object_id, is_paid, number, obj.name as arch_object_name, obj.address as arch_object_address, obj.district_id as district_id, dis.name as arch_object_district,
                                CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name, s.name service_name, st.name status_name, st.code status_code, st.status_color status_color,
                                application.created_at, application.updated_at, cus.full_name customer_name, cus.pin customer_pin, cus.is_organization customer_is_organization, cus.address customer_address, 
                                cus.okpo customer_okpo, orgtype.name customer_organization_type_name, cus.director customer_director, ap.id arch_process_id,
                                application.incoming_numbers,
                                application.outgoing_numbers,
                                application.tech_decision_id,
                                application.total_sum,
                                application.dp_outgoing_number
                        FROM application 
                            left join ""User"" uc on uc.id = application.created_by
                            left join employee emp_c on emp_c.user_id = uc.""userId""
                            left join customer cus on application.customer_id = cus.id
                            left join service s on s.id = application.service_id
                            left join application_status st on st.id = application.status_id
                            left join arch_object obj on application.arch_object_id = obj.id
                            left join district dis on obj.district_id = dis.id
                            left join object_tag ot on ot.id = application.object_tag_id
                            left join organization_type orgtype on cus.organization_type_id = orgtype.id 
                            left join architecture_process ap on ap.id = application.id
                        WHERE application.app_cabinet_uuid=@guid
limit 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Domain.Entities.Application>(sql,
                    new { guid }, transaction: _dbTransaction);

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }

        public async Task<Domain.Entities.Application> GetOneByNumber(string number)
        {
            try
            {
                var sql =
                    @"SELECT application.id, application.object_tag_id, ot.name object_tag_name, registration_date, customer_id, application.status_id, application.workflow_id, service_id, maria_db_statement_id, work_description,
                                deadline, arch_object_id, is_paid, number, obj.name as arch_object_name, obj.address as arch_object_address, obj.district_id as district_id, dis.name as arch_object_district,
                                CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name, s.name service_name, st.name status_name, st.code status_code,
                                application.created_at, application.updated_at, cus.full_name customer_name, cus.pin customer_pin, cus.is_organization customer_is_organization, cus.address customer_address, 
                                cus.okpo customer_okpo, orgtype.name customer_organization_type_name, cus.director customer_director, ap.id arch_process_id,
                                application.incoming_numbers,
                                application.outgoing_numbers,
                                application.tech_decision_id,
                                application.total_sum,
                                application.dp_outgoing_number
                        FROM application 
                            left join ""User"" uc on uc.id = application.created_by
                            left join employee emp_c on emp_c.user_id = uc.""userId""
                            left join customer cus on application.customer_id = cus.id
                            left join service s on s.id = application.service_id
                            left join application_status st on st.id = application.status_id
                            left join arch_object obj on application.arch_object_id = obj.id
                            left join district dis on obj.district_id = dis.id
                            left join object_tag ot on ot.id = application.object_tag_id
                            left join organization_type orgtype on cus.organization_type_id = orgtype.id 
                            left join architecture_process ap on ap.id = application.id
                        WHERE application.number=@number
                        limit 1";
                var model = await _dbConnection.QueryFirstOrDefaultAsync<Domain.Entities.Application>(sql,
                    new { number }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Application with ID {number} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }

        public async Task<int> GetFileId(int id)
        {
            try
            {
                var sql =
                    "SELECT file_id FROM uploaded_application_document WHERE uploaded_application_document.application_document_id=@Id ORDER BY uploaded_application_document.created_at DESC LIMIT 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Domain.Entities.UploadedApplicationDocument>(
                    sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Application with ID {id} not found.", null);
                }

                return model.file_id;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }

        public async Task<int> GetLastNumber()
        {
            var getNumber = "select setval('application_number_sequence', nextval('application_number_sequence'));";
            return await _dbConnection.QuerySingleOrDefaultAsync<int?>(getNumber, transaction: _dbTransaction) ?? 0;
        }

        public async Task<int> Add(Domain.Entities.Application domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Domain.Entities.Application
                {
                    registration_date = DateTime.Now,
                    customer_id = domain.customer_id,
                    status_id = domain.status_id,
                    workflow_id = domain.workflow_id,
                    service_id = domain.service_id,
                    deadline = domain.deadline,
                    arch_object_id = domain.arch_object_id,
                    number = domain.number,
                    object_tag_id = domain.object_tag_id,
                    work_description = domain.work_description,
                    //customers_info = domain.customers_info,
                    incoming_numbers = domain.incoming_numbers,
                    outgoing_numbers = domain.outgoing_numbers,
                    application_code = domain.application_code,
                    app_cabinet_uuid = domain.app_cabinet_uuid
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql =
                    @"INSERT INTO application(registration_date, customer_id, status_id, workflow_id, service_id,
                        deadline, created_at, arch_object_id, created_by, number, updated_at, 
                        work_description, object_tag_id, incoming_numbers, outgoing_numbers, application_code,
                        app_cabinet_uuid) 
                                VALUES (@registration_date, @customer_id, @status_id, @workflow_id, @service_id,
                                        @deadline, @created_at, @arch_object_id, @created_by, @number, @updated_at, 
                                        @work_description, @object_tag_id, @incoming_numbers, @outgoing_numbers, 
                                        @application_code, @app_cabinet_uuid)
                                RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add Application", ex);
            }
        }

        public async Task UpdatePaid(Domain.Entities.Application domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                var setUserQuery = $"SET LOCAL \"bga.current_user\" TO '{domain.updated_by}'";
                _dbConnection.Execute(setUserQuery, transaction: _dbTransaction);

                var model = new Domain.Entities.Application
                {
                    id = domain.id,
                    is_paid = domain.is_paid,
                };
                var sql = @"UPDATE application SET is_paid = @is_paid WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Application", ex);
            }
        }

        public async Task UpdatePaidWithSum(int id, decimal sum)
        {
            try
            {
                var updated_by = await _userRepository.GetUserID();
                var updated_at = DateTime.Now;

                var sql = @"UPDATE application SET is_paid = true, total_payed = @sum, updated_by = @updated_by, updated_at = @updated_at   WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { sum, id, updated_at, updated_by }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Application", ex);
            }
        }


        public async Task UpdateTechDecision(Domain.Entities.Application domain)
        {
            try
            {
                //domain.updated_by = await _userRepository.GetUserID();
                //var setUserQuery = $"SET LOCAL \"bga.current_user\" TO '{domain.updated_by}'";
                //_dbConnection.Execute(setUserQuery, transaction: _dbTransaction);
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Domain.Entities.Application
                {
                    id = domain.id,
                    tech_decision_id = domain.tech_decision_id,
                    tech_decision_date = domain.tech_decision_date,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE application SET tech_decision_id = @tech_decision_id, tech_decision_date = @tech_decision_date WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Application", ex);
            }
        }

        public async Task Update(Domain.Entities.Application domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Domain.Entities.Application
                {
                    id = domain.id,
                    registration_date = domain.registration_date,
                    customer_id = domain.customer_id,
                    status_id = domain.status_id,
                    workflow_id = domain.workflow_id,
                    service_id = domain.service_id,
                    deadline = domain.deadline,
                    arch_object_id = domain.arch_object_id,
                    work_description = domain.work_description,
                    object_tag_id = domain.object_tag_id,
                    incoming_numbers = domain.incoming_numbers,
                    cashed_info = domain.cashed_info,
                    outgoing_numbers = domain.outgoing_numbers,
                    tech_decision_id = domain.tech_decision_id
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE application SET customer_id = @customer_id, 
                                status_id = @status_id, workflow_id = @workflow_id, service_id = @service_id, 
                                deadline = @deadline, updated_at = @updated_at, updated_by = @updated_by,
                                arch_object_id = @arch_object_id, work_description = @work_description, cashed_info = @cashed_info::jsonb,
                                object_tag_id = @object_tag_id, incoming_numbers = @incoming_numbers, outgoing_numbers = @outgoing_numbers, tech_decision_id = @tech_decision_id
                   WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Application", ex);
            }
        }
        public async Task UpdateObjectTag(int application_id, int object_tag_id, int user_id)
        {
            try
            {

                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var sql = @"UPDATE application SET updated_by = @updated_by, updated_at = @updated_at, object_tag_id = @object_tag_id WHERE id = @application_id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { application_id, object_tag_id, updated_by = user_id, updated_at = DateTime.Now }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Application", ex);
            }
        }


        private string BuildQuickWhereClause(PaginationFields filter)
        {
            var whereClause = "";

            if (filter.useCommon && !string.IsNullOrWhiteSpace(filter.common_filter))
            {
                whereClause += @"
    AND (app.number ILIKE CONCAT('%', @common_filter, '%')
      OR cus.full_name ILIKE CONCAT('%', @common_filter, '%')
      OR cus.pin ILIKE CONCAT('%', @common_filter, '%')
      OR obj.address ILIKE CONCAT('%', @common_filter, '%')
      OR cc.value ILIKE CONCAT('%', @common_filter, '%')
      OR app.work_description ILIKE CONCAT('%', @common_filter, '%')
      OR app.incoming_numbers ILIKE CONCAT('%', @common_filter, '%')
      OR app.outgoing_numbers ILIKE CONCAT('%', @common_filter, '%'))";
            }
            else if (!filter.useCommon)
            {
                // Основные фильтры для быстрой фильтрации
                if (!string.IsNullOrEmpty(filter.pin))
                {
                    whereClause += " AND cus.pin ILIKE CONCAT('%', @pin, '%')";
                }
                if (!string.IsNullOrEmpty(filter.number))
                {
                    whereClause += " AND app.number ILIKE CONCAT('%', @number, '%')";
                }
                if (!string.IsNullOrEmpty(filter.address))
                {
                    whereClause += $" AND obj.address ILIKE '%{filter.address.ToLower()}%'";
                }
                if (!string.IsNullOrEmpty(filter.customerName))
                {
                    whereClause += " AND cus.full_name ILIKE CONCAT('%', @customer_name, '%')";
                }
                if (!string.IsNullOrEmpty(filter.incoming_numbers))
                {
                    whereClause += " AND app.incoming_numbers ILIKE CONCAT('%', @incomingNumbers, '%')";
                }
                if (!string.IsNullOrEmpty(filter.outgoing_numbers))
                {
                    whereClause += " AND app.outgoing_numbers ILIKE CONCAT('%', @outgoingNumbers, '%')";
                }
                if (filter.date_start != null)
                {
                    whereClause += " AND app.registration_date >= @date_start";
                }
                if (filter.date_end != null)
                {
                    whereClause += " AND app.registration_date <= @date_end";
                }
            }

            return whereClause;
        }
        public async Task<PaginatedList<Domain.Entities.Application>> GetByFilterFromEO(PaginationFields filter, bool onlyCount)
        {
            try
            {
                var countSql = @"
SELECT count(distinct app.id)
FROM application app
        	LEFT JOIN customer cus on cus.id = app.customer_id 
        	LEFT JOIN service on service.id = app.service_id
        	LEFT JOIN application_object ao on ao.application_id = app.id
        	LEFT JOIN arch_object obj on ao.arch_object_id = obj.id
        	LEFT JOIN district dis on obj.district_id = dis.id
        	LEFT JOIN application_status st on app.status_id = st.id
        	LEFT JOIN application_task task on task.application_id = app.id
        	LEFT JOIN application_task_assignee ats on ats.application_task_id = task.id
        	LEFT JOIN employee_in_structure eis on eis.id = ats.structure_employee_id
            LEFT JOIN structure_post sp on sp.id = eis.post_id
        	LEFT JOIN employee eee on eee.id = eis.employee_id
        	LEFT JOIN customer_contact cc on cus.id = cc.customer_id 
                    left join ""User"" uc on uc.id = app.created_by
                    left join employee emp_c on emp_c.user_id = uc.""userId""
            left join workflow w on service.workflow_id = w.id

            LEFT JOIN architecture_process proc on proc.id = app.id
            LEFT JOIN ""User"" u_proc on u_proc.id = proc.created_by
            LEFT JOIN employee e_proc on e_proc.user_id = u_proc.""userId""
        ";

                var mainSql = @"
SELECT app.id, app.done_date, app.object_tag_id, registration_date, app.customer_id, cus.full_name as customer_name, cus.pin as customer_pin, app.status_id, app.workflow_id, st.name status_name, st.code status_code, st.status_color status_color, maria_db_statement_id,
                service_id, service.name as service_name, deadline,work_description, 
        		string_agg(DISTINCT obj.name, '; ') as arch_object_name, string_agg(DISTINCT obj.address, '; ') as arch_object_address, string_agg(DISTINCT dis.name, '; ') as arch_object_district,
                CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                is_paid, number, app.total_sum, app.total_payed, service.day_count,
        		string_agg(DISTINCT CONCAT(COALESCE(eee.last_name, ''), ' ', COALESCE(eee.first_name, '')), ', ') AS assigned_employees_names,
        		string_agg(DISTINCT coalesce(cc.value), ', ') AS customer_contacts,
       app.status_id as application_status_id,
       st.code as application_status_code,
       st.group_code as application_status_group_code
        FROM application app
        	LEFT JOIN customer cus on cus.id = app.customer_id 
        	LEFT JOIN service on service.id = app.service_id
        	LEFT JOIN application_object ao on ao.application_id = app.id
        	LEFT JOIN arch_object obj on ao.arch_object_id = obj.id
        	LEFT JOIN district dis on obj.district_id = dis.id
        	LEFT JOIN application_status st on app.status_id = st.id
        	LEFT JOIN application_task task on task.application_id = app.id
        	LEFT JOIN application_task_assignee ats on ats.application_task_id = task.id
        	LEFT JOIN employee_in_structure eis on eis.id = ats.structure_employee_id
            LEFT JOIN structure_post sp on sp.id = eis.post_id
        	LEFT JOIN employee eee on eee.id = eis.employee_id
        	LEFT JOIN customer_contact cc on cus.id = cc.customer_id 
                    left join ""User"" uc on uc.id = app.created_by
                    left join employee emp_c on emp_c.user_id = uc.""userId""
            left join workflow w on service.workflow_id = w.id

            LEFT JOIN architecture_process proc on proc.id = app.id
            LEFT JOIN ""User"" u_proc on u_proc.id = proc.created_by
            LEFT JOIN employee e_proc on e_proc.user_id = u_proc.""userId""

        ";

                // ГЛАВНОЕ УСЛОВИЕ: ВСЕГДА фильтруем только по EO статусам
                var sql = " WHERE (st.code = 'return_to_eo' OR st.code = 'rejection_ready' OR st.code = 'ready_for_eo' OR st.code = 'tech_rejection_to_eo' OR st.code = 'act_rejection_to_eo') ";

                // Добавляем дополнительные фильтры
                if (filter.useCommon && !string.IsNullOrWhiteSpace(filter.common_filter))
                {
                    sql += @" AND (lower(app.number) LIKE lower (CONCAT('%', @common_filter, '%'))
or lower(cus.full_name) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(cus.pin) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(obj.address) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(cc.value) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(app.work_description) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(app.incoming_numbers) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(app.outgoing_numbers) LIKE lower(CONCAT('%', @common_filter, '%')))";
                }

                // Фильтры истечения срока (только при useCommon без текста поиска)
                if (filter.useCommon && string.IsNullOrWhiteSpace(filter.common_filter) && filter.isExpired != null && filter.isExpired.Value)
                {
                    if ((filter.deadline_day ?? 0) == 0)
                    {
                        sql += @$" AND (deadline::date < CURRENT_DATE and (st.group_code in ('in_progress')))";
                    }
                    else if (filter.deadline_day == -1)
                    {
                        sql += @$" AND (deadline::date = CURRENT_DATE and (st.group_code in ('in_progress')))";
                    }
                    else if (filter.deadline_day == 7)
                    {
                        sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '4 days' AND CURRENT_DATE + INTERVAL '7 days' AND (st.group_code in ('in_progress')))";
                    }
                    else if (filter.deadline_day == 3)
                    {
                        sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '1 days' AND CURRENT_DATE + INTERVAL '3 days' AND (st.group_code in ('in_progress')))";
                    }
                    else if (filter.deadline_day == 1)
                    {
                        sql += @$" and (deadline::DATE = CURRENT_DATE + INTERVAL '1 day' and  (st.group_code in ('in_progress')))";
                    }
                }

                // Индивидуальные фильтры (когда НЕ используется общий поиск)
                if (!filter.useCommon)
                {
                    if (filter.withoutAssignedEmployee == true)
                    {
                        sql += " and sp.code != 'employee' ";
                    }
                    if (!string.IsNullOrEmpty(filter.pin))
                    {
                        sql += " and LOWER(cus.pin) like concat('%', @pin, '%') ";
                    }
                    if (!string.IsNullOrEmpty(filter.number))
                    {
                        sql += " and LOWER(app.number) like concat('%', @number, '%') ";
                    }
                    if (!string.IsNullOrEmpty(filter.address))
                    {
                        sql += @$"
        AND LOWER(obj.address) like '%{filter.address.ToLower()}%'";
                    }
                    if (!string.IsNullOrEmpty(filter.customerName))
                    {
                        sql += @$"
        AND LOWER(cus.full_name) LIKE concat('%',@customer_name,'%') ";
                    }

                    if (filter.service_ids.Count() > 0)
                    {
                        sql += @$"
        AND service_id in ({string.Join(',', filter.service_ids)})";
                    }
                    if (filter.status_ids.Count() > 0)
                    {
                        sql += @$"
        AND app.status_id in ({string.Join(',', filter.status_ids)})";
                    }

                    if (filter.district_id != null && filter.district_id != 0)
                    {
                        sql += @$"
        AND obj.district_id = {filter.district_id}";
                    }

                    if (filter.employee_arch_id != null && filter.employee_arch_id != 0)
                    {
                        sql += @$"
        AND e_proc.id = {filter.employee_arch_id}";
                        if (filter.dashboard_date_start != null)
                        {
                            sql += @$"
            AND proc.created_at >= @dashboard_date_start";
                        }
                        if (filter.dashboard_date_end != null)
                        {
                            sql += @$"
            AND proc.created_at <= @dashboard_date_end";
                        }
                    }

                    if (filter.employee_id != null && filter.employee_id != 0)
                    {
                        sql += @$" AND eee.id = {filter.employee_id}";
                    }

                    if (!string.IsNullOrEmpty(filter.incoming_numbers))
                    {
                        sql += " and LOWER(app.incoming_numbers) like concat('%', @incomingNumbers, '%') ";
                    }

                    if (!string.IsNullOrEmpty(filter.outgoing_numbers))
                    {
                        sql += " and LOWER(app.outgoing_numbers) like concat('%', @outgoingNumbers, '%') ";
                    }

                    if (filter.isExpired != null && filter.isExpired.Value)
                    {
                        if ((filter.deadline_day ?? 0) == 0)
                        {
                            sql += @$" AND (deadline::date < CURRENT_DATE and (st.group_code in ('in_progress')))";
                        }
                        else if (filter.deadline_day == -1)
                        {
                            sql += @$" AND (deadline::date = CURRENT_DATE and (st.group_code in ('in_progress')))";
                        }
                        else if (filter.deadline_day == 7)
                        {
                            sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '4 days' AND CURRENT_DATE + INTERVAL '7 days' AND (st.group_code in ('in_progress')))";
                        }
                        else if (filter.deadline_day == 3)
                        {
                            sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '1 days' AND CURRENT_DATE + INTERVAL '3 days' AND (st.group_code in ('in_progress')))";
                        }
                        else if (filter.deadline_day == 1)
                        {
                            sql += @$" and (deadline::DATE = CURRENT_DATE + INTERVAL '1 day' and  (st.group_code in ('in_progress')))";
                        }
                    }

                    if (filter.date_start != null)
                    {
                        sql += @$"
        AND registration_date >= @date_start";
                    }

                    if (filter.date_end != null)
                    {
                        sql += @$"
        AND registration_date <= @date_end";
                    }
                }

                if (filter.structure_ids != null && filter.structure_ids.Length > 0)
                {
                    sql += @$"
                        AND w.id in (select wtt.workflow_id from workflow_task_template wtt where wtt.type_id != 1 and wtt.structure_id in ({string.Join(',', filter.structure_ids)}))";
                }

                if (filter.is_paid != null)
                {
                    sql += $@"
           AND (
        (@is_paid = true AND (is_paid = true OR (is_paid = false AND total_payed >= total_sum AND total_payed > 0)))
        OR (@is_paid = false AND is_paid = false AND total_payed < total_sum)
    )";
                }

                countSql = countSql + sql;
                // group
                sql += @$" 
        group by app.id, cus.id, service.id, st.id, emp_c.id";

                // sort
                if (filter.sort_by != null && filter.sort_type != null)
                {
                    sql += @$"
        ORDER BY {filter.sort_by} {filter.sort_type}";
                }
                else
                {
                    sql += @$"
        ORDER BY app.id desc";
                }

                // pagesize
                var sqlWithPagination = sql + @"
        OFFSET @pageSize * @pageNumber Limit @pageSize;
        ";

                IEnumerable<Domain.Entities.Application> models = new List<Domain.Entities.Application>();
                if (!onlyCount)
                {
                    models = await _dbConnection.QueryAsync<Domain.Entities.Application>(mainSql + sqlWithPagination,
                    new
                    {
                        filter.pageSize,
                        filter.pageNumber,
                        pin = filter.pin?.ToLower(),
                        customer_name = filter.customerName?.ToLower(),
                        number = filter.number?.ToLower(),
                        filter.date_start,
                        filter.date_end,
                        filter.common_filter,
                        incomingNumbers = filter.incoming_numbers,
                        outgoingNumbers = filter.outgoing_numbers,
                        filter.dashboard_date_start,
                        filter.dashboard_date_end,
                        is_paid = filter.is_paid,
                    }, transaction: _dbTransaction);
                }

                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(countSql,
                  new
                  {
                      filter.pageSize,
                      filter.pageNumber,
                      pin = filter.pin?.ToLower(),
                      customer_name = filter.customerName?.ToLower(),
                      number = filter.number?.ToLower(),
                      filter.date_start,
                      filter.date_end,
                      filter.common_filter,
                      incomingNumbers = filter.incoming_numbers,
                      outgoingNumbers = filter.outgoing_numbers,
                      filter.dashboard_date_start,
                      filter.dashboard_date_end,
                      is_paid = filter.is_paid,
                  }, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<Domain.Entities.Application>(domainItems, totalItems, filter.pageNumber,
                    filter.pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application from EO", ex);
            }
        }
        
        public async Task<PaginatedList<Domain.Entities.Application>> GetByFilterRefusal(PaginationFields filter, bool onlyCount)
        {
            try
            {
                var countSql = @"
SELECT count(distinct app.id)
FROM application app
        	LEFT JOIN customer cus on cus.id = app.customer_id 
        	LEFT JOIN service on service.id = app.service_id
        	LEFT JOIN application_object ao on ao.application_id = app.id
        	LEFT JOIN arch_object obj on ao.arch_object_id = obj.id
        	LEFT JOIN district dis on obj.district_id = dis.id
        	LEFT JOIN application_status st on app.status_id = st.id
        	LEFT JOIN application_task task on task.application_id = app.id
        	LEFT JOIN application_task_assignee ats on ats.application_task_id = task.id
        	LEFT JOIN employee_in_structure eis on eis.id = ats.structure_employee_id
            LEFT JOIN structure_post sp on sp.id = eis.post_id
        	LEFT JOIN employee eee on eee.id = eis.employee_id
        	LEFT JOIN customer_contact cc on cus.id = cc.customer_id 
                    left join ""User"" uc on uc.id = app.created_by
                    left join employee emp_c on emp_c.user_id = uc.""userId""
            left join workflow w on service.workflow_id = w.id

            LEFT JOIN architecture_process proc on proc.id = app.id
            LEFT JOIN ""User"" u_proc on u_proc.id = proc.created_by
            LEFT JOIN employee e_proc on e_proc.user_id = u_proc.""userId""
        ";

                var mainSql = @"
SELECT app.id, app.done_date, app.object_tag_id, registration_date, app.customer_id, cus.full_name as customer_name, cus.pin as customer_pin, app.status_id, app.workflow_id, st.name status_name, st.code status_code, st.status_color status_color, maria_db_statement_id,
                service_id, service.name as service_name, deadline,work_description, 
        		string_agg(DISTINCT obj.name, '; ') as arch_object_name, string_agg(DISTINCT obj.address, '; ') as arch_object_address, string_agg(DISTINCT dis.name, '; ') as arch_object_district,
                CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                is_paid, number, app.total_sum, app.total_payed, service.day_count,
        		string_agg(DISTINCT CONCAT(COALESCE(eee.last_name, ''), ' ', COALESCE(eee.first_name, '')), ', ') AS assigned_employees_names,
        		string_agg(DISTINCT coalesce(cc.value), ', ') AS customer_contacts,
       app.status_id as application_status_id,
       st.code as application_status_code,
       st.group_code as application_status_group_code
        FROM application app
        	LEFT JOIN customer cus on cus.id = app.customer_id 
        	LEFT JOIN service on service.id = app.service_id
        	LEFT JOIN application_object ao on ao.application_id = app.id
        	LEFT JOIN arch_object obj on ao.arch_object_id = obj.id
        	LEFT JOIN district dis on obj.district_id = dis.id
        	LEFT JOIN application_status st on app.status_id = st.id
        	LEFT JOIN application_task task on task.application_id = app.id
        	LEFT JOIN application_task_assignee ats on ats.application_task_id = task.id
        	LEFT JOIN employee_in_structure eis on eis.id = ats.structure_employee_id
            LEFT JOIN structure_post sp on sp.id = eis.post_id
        	LEFT JOIN employee eee on eee.id = eis.employee_id
        	LEFT JOIN customer_contact cc on cus.id = cc.customer_id 
                    left join ""User"" uc on uc.id = app.created_by
                    left join employee emp_c on emp_c.user_id = uc.""userId""
            left join workflow w on service.workflow_id = w.id

            LEFT JOIN architecture_process proc on proc.id = app.id
            LEFT JOIN ""User"" u_proc on u_proc.id = proc.created_by
            LEFT JOIN employee e_proc on e_proc.user_id = u_proc.""userId""

        ";

                // ГЛАВНОЕ УСЛОВИЕ: ВСЕГДА фильтруем только по EO статусам
                var sql = " WHERE st.name ILIKE '%отказ%' ";

                // Добавляем дополнительные фильтры
                if (filter.useCommon && !string.IsNullOrWhiteSpace(filter.common_filter))
                {
                    sql += @" AND (lower(app.number) LIKE lower (CONCAT('%', @common_filter, '%'))
or lower(cus.full_name) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(cus.pin) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(obj.address) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(cc.value) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(app.work_description) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(app.incoming_numbers) LIKE lower(CONCAT('%', @common_filter, '%'))
or lower(app.outgoing_numbers) LIKE lower(CONCAT('%', @common_filter, '%')))";
                }

                // Фильтры истечения срока (только при useCommon без текста поиска)
                if (filter.useCommon && string.IsNullOrWhiteSpace(filter.common_filter) && filter.isExpired != null && filter.isExpired.Value)
                {
                    if ((filter.deadline_day ?? 0) == 0)
                    {
                        sql += @$" AND (deadline::date < CURRENT_DATE and (st.group_code in ('in_progress')))";
                    }
                    else if (filter.deadline_day == -1)
                    {
                        sql += @$" AND (deadline::date = CURRENT_DATE and (st.group_code in ('in_progress')))";
                    }
                    else if (filter.deadline_day == 7)
                    {
                        sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '4 days' AND CURRENT_DATE + INTERVAL '7 days' AND (st.group_code in ('in_progress')))";
                    }
                    else if (filter.deadline_day == 3)
                    {
                        sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '1 days' AND CURRENT_DATE + INTERVAL '3 days' AND (st.group_code in ('in_progress')))";
                    }
                    else if (filter.deadline_day == 1)
                    {
                        sql += @$" and (deadline::DATE = CURRENT_DATE + INTERVAL '1 day' and  (st.group_code in ('in_progress')))";
                    }
                }

                // Индивидуальные фильтры (когда НЕ используется общий поиск)
                if (!filter.useCommon)
                {
                    if (filter.withoutAssignedEmployee == true)
                    {
                        sql += " and sp.code != 'employee' ";
                    }
                    if (!string.IsNullOrEmpty(filter.pin))
                    {
                        sql += " and LOWER(cus.pin) like concat('%', @pin, '%') ";
                    }
                    if (!string.IsNullOrEmpty(filter.number))
                    {
                        sql += " and LOWER(app.number) like concat('%', @number, '%') ";
                    }
                    if (!string.IsNullOrEmpty(filter.address))
                    {
                        sql += @$"
        AND LOWER(obj.address) like '%{filter.address.ToLower()}%'";
                    }
                    if (!string.IsNullOrEmpty(filter.customerName))
                    {
                        sql += @$"
        AND LOWER(cus.full_name) LIKE concat('%',@customer_name,'%') ";
                    }

                    if (filter.service_ids.Count() > 0)
                    {
                        sql += @$"
        AND service_id in ({string.Join(',', filter.service_ids)})";
                    }
                    if (filter.status_ids.Count() > 0)
                    {
                        sql += @$"
        AND app.status_id in ({string.Join(',', filter.status_ids)})";
                    }

                    if (filter.district_id != null && filter.district_id != 0)
                    {
                        sql += @$"
        AND obj.district_id = {filter.district_id}";
                    }

                    if (filter.employee_arch_id != null && filter.employee_arch_id != 0)
                    {
                        sql += @$"
        AND e_proc.id = {filter.employee_arch_id}";
                        if (filter.dashboard_date_start != null)
                        {
                            sql += @$"
            AND proc.created_at >= @dashboard_date_start";
                        }
                        if (filter.dashboard_date_end != null)
                        {
                            sql += @$"
            AND proc.created_at <= @dashboard_date_end";
                        }
                    }

                    if (filter.employee_id != null && filter.employee_id != 0)
                    {
                        sql += @$" AND eee.id = {filter.employee_id}";
                    }

                    if (!string.IsNullOrEmpty(filter.incoming_numbers))
                    {
                        sql += " and LOWER(app.incoming_numbers) like concat('%', @incomingNumbers, '%') ";
                    }

                    if (!string.IsNullOrEmpty(filter.outgoing_numbers))
                    {
                        sql += " and LOWER(app.outgoing_numbers) like concat('%', @outgoingNumbers, '%') ";
                    }

                    if (filter.isExpired != null && filter.isExpired.Value)
                    {
                        if ((filter.deadline_day ?? 0) == 0)
                        {
                            sql += @$" AND (deadline::date < CURRENT_DATE and (st.group_code in ('in_progress')))";
                        }
                        else if (filter.deadline_day == -1)
                        {
                            sql += @$" AND (deadline::date = CURRENT_DATE and (st.group_code in ('in_progress')))";
                        }
                        else if (filter.deadline_day == 7)
                        {
                            sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '4 days' AND CURRENT_DATE + INTERVAL '7 days' AND (st.group_code in ('in_progress')))";
                        }
                        else if (filter.deadline_day == 3)
                        {
                            sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '1 days' AND CURRENT_DATE + INTERVAL '3 days' AND (st.group_code in ('in_progress')))";
                        }
                        else if (filter.deadline_day == 1)
                        {
                            sql += @$" and (deadline::DATE = CURRENT_DATE + INTERVAL '1 day' and  (st.group_code in ('in_progress')))";
                        }
                    }

                    if (filter.date_start != null)
                    {
                        sql += @$"
        AND registration_date >= @date_start";
                    }

                    if (filter.date_end != null)
                    {
                        sql += @$"
        AND registration_date <= @date_end";
                    }
                }

                if (filter.structure_ids != null && filter.structure_ids.Length > 0)
                {
                    sql += @$"
                        AND w.id in (select wtt.workflow_id from workflow_task_template wtt where wtt.type_id != 1 and wtt.structure_id in ({string.Join(',', filter.structure_ids)}))";
                }

                if (filter.is_paid != null)
                {
                    sql += $@"
           AND (
        (@is_paid = true AND (is_paid = true OR (is_paid = false AND total_payed >= total_sum AND total_payed > 0)))
        OR (@is_paid = false AND is_paid = false AND total_payed < total_sum)
    )";
                }

                countSql = countSql + sql;
                // group
                sql += @$" 
        group by app.id, cus.id, service.id, st.id, emp_c.id";

                // sort
                if (filter.sort_by != null && filter.sort_type != null)
                {
                    sql += @$"
        ORDER BY {filter.sort_by} {filter.sort_type}";
                }
                else
                {
                    sql += @$"
        ORDER BY app.id desc";
                }

                // pagesize
                var sqlWithPagination = sql + @"
        OFFSET @pageSize * @pageNumber Limit @pageSize;
        ";

                IEnumerable<Domain.Entities.Application> models = new List<Domain.Entities.Application>();
                if (!onlyCount)
                {
                    models = await _dbConnection.QueryAsync<Domain.Entities.Application>(mainSql + sqlWithPagination,
                    new
                    {
                        filter.pageSize,
                        filter.pageNumber,
                        pin = filter.pin?.ToLower(),
                        customer_name = filter.customerName?.ToLower(),
                        number = filter.number?.ToLower(),
                        filter.date_start,
                        filter.date_end,
                        filter.common_filter,
                        incomingNumbers = filter.incoming_numbers,
                        outgoingNumbers = filter.outgoing_numbers,
                        filter.dashboard_date_start,
                        filter.dashboard_date_end,
                        is_paid = filter.is_paid,
                    }, transaction: _dbTransaction);
                }

                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(countSql,
                  new
                  {
                      filter.pageSize,
                      filter.pageNumber,
                      pin = filter.pin?.ToLower(),
                      customer_name = filter.customerName?.ToLower(),
                      number = filter.number?.ToLower(),
                      filter.date_start,
                      filter.date_end,
                      filter.common_filter,
                      incomingNumbers = filter.incoming_numbers,
                      outgoingNumbers = filter.outgoing_numbers,
                      filter.dashboard_date_start,
                      filter.dashboard_date_end,
                      is_paid = filter.is_paid,
                  }, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<Domain.Entities.Application>(domainItems, totalItems, filter.pageNumber,
                    filter.pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application from EO", ex);
            }
        }
                
        private string BuildExtendedWhereClause(PaginationFields filter)
        {
            var whereClause = "";

            if (filter.useCommon && string.IsNullOrWhiteSpace(filter.common_filter))
            {
                whereClause += BuildExpirationFilter(filter);
            }
            else if (!filter.useCommon)
            {
                if (filter.withoutAssignedEmployee == true)
                {
                    whereClause += " AND sp.code != 'employee'";
                }
                if (filter.service_ids?.Count() > 0)
                {
                    whereClause += $" AND service.id IN ({string.Join(',', filter.service_ids)})";
                }
                if (filter.status_ids?.Count() > 0)
                {
                    whereClause += $" AND app.status_id IN ({string.Join(',', filter.status_ids)})";
                }
                if (filter.district_id != null && filter.district_id != 0)
                {
                    whereClause += $" AND EXISTS (SELECT 1 FROM application_object ao2 JOIN arch_object obj2 ON ao2.arch_object_id = obj2.id WHERE ao2.application_id = app.id AND obj2.district_id = {filter.district_id})";
                }
                if (filter.employee_arch_id != null && filter.employee_arch_id != 0)
                {
                    whereClause += $" AND e_proc.id = {filter.employee_arch_id}";
                    if (filter.dashboard_date_start != null)
                    {
                        whereClause += " AND proc.created_at >= @dashboard_date_start";
                    }
                    if (filter.dashboard_date_end != null)
                    {
                        whereClause += " AND proc.created_at <= @dashboard_date_end";
                    }
                }
                if (filter.employee_id != null && filter.employee_id != 0)
                {
                    whereClause += $" AND eee.id = {filter.employee_id}";
                }

                whereClause += BuildExpirationFilter(filter);
            }

            if (filter.structure_ids != null && filter.structure_ids.Length > 0)
            {
                whereClause += $@" AND w.id in (select wtt.workflow_id from workflow_task_template wtt where wtt.type_id != 1 and wtt.structure_id in ({string.Join(',', filter.structure_ids)}))";
            }

            if (filter.is_paid != null)
            {
                whereClause += @" AND (
        (@is_paid = true AND (app.is_paid = true OR (app.is_paid = false AND app.total_payed >= app.total_sum AND app.total_payed > 0)))
        OR (@is_paid = false AND app.is_paid = false AND app.total_payed < app.total_sum)
    )";
            }

            return whereClause;
        }


        public async Task<PaginatedList<Domain.Entities.Application>> GetPaginated2(PaginationFields filter, bool onlyCount)
        {
            try
            {
                // Более эффективный CTE - сначала быстрая фильтрация, затем дополнительные условия
                var baseFilterCte2 = @"
WITH quick_filter AS (
    -- Быстрая фильтрация только по основным таблицам
    SELECT DISTINCT app.id
    FROM application app
    LEFT JOIN customer cus ON cus.id = app.customer_id 
    LEFT JOIN application_object ao ON ao.application_id = app.id
    LEFT JOIN arch_object obj ON ao.arch_object_id = obj.id
    LEFT JOIN customer_contact cc ON cus.id = cc.customer_id 
    WHERE 1=1 ";

                var extendedFilterCte2 = @"
),
filtered_applications AS (
    SELECT qf.id, app.registration_date, app.deadline
    FROM quick_filter qf
    JOIN application app ON app.id = qf.id
    LEFT JOIN service service ON service.id = app.service_id
    LEFT JOIN application_status st ON app.status_id = st.id
    LEFT JOIN application_task task ON task.application_id = app.id
    LEFT JOIN application_task_assignee ats ON ats.application_task_id = task.id
    LEFT JOIN employee_in_structure eis ON eis.id = ats.structure_employee_id
    LEFT JOIN structure_post sp ON sp.id = eis.post_id
    LEFT JOIN employee eee ON eee.id = eis.employee_id
    LEFT JOIN ""User"" uc ON uc.id = app.created_by
    LEFT JOIN employee emp_c ON emp_c.user_id = uc.""userId""
    LEFT JOIN workflow w ON service.workflow_id = w.id
    LEFT JOIN architecture_process proc ON proc.id = app.id
    LEFT JOIN ""User"" u_proc ON u_proc.id = proc.created_by
    LEFT JOIN employee e_proc ON e_proc.user_id = u_proc.""userId""
    WHERE 1=1 ";

                var countSql2 = baseFilterCte2;
                var mainSql2 = baseFilterCte2;

                // Построение WHERE условий для быстрой фильтрации
                var quickWhereClause2 = BuildQuickWhereClause(filter);
                countSql2 += quickWhereClause2 + extendedFilterCte2;
                mainSql2 += quickWhereClause2 + extendedFilterCte2;

                // Построение дополнительных WHERE условий
                var extendedWhereClause = BuildExtendedWhereClause(filter);
                countSql2 += extendedWhereClause;
                mainSql2 += extendedWhereClause;

                // Завершение COUNT запроса
                countSql2 += @"
)
SELECT COUNT(*) FROM filtered_applications";

                // Основной запрос с JOIN'ами для получения данных
                mainSql2 += @"
),
paginated_apps AS (
    SELECT fa.id
    FROM filtered_applications fa";

                // Добавляем сортировку и пагинацию
                if (filter.sort_by != null && filter.sort_type != null)
                {
                    mainSql2 += $@"
    ORDER BY fa.{filter.sort_by} {filter.sort_type}";
                }
                else
                {
                    mainSql2 += @"
    ORDER BY fa.id DESC";
                }

                mainSql2 += @"
    OFFSET @pageSize * @pageNumber LIMIT @pageSize
)
SELECT app.id, app.done_date, app.object_tag_id, registration_date, app.customer_id, 
       cus.full_name as customer_name, cus.pin as customer_pin, 
       app.status_id, app.workflow_id, st.name status_name, st.code status_code, 
       st.status_color status_color, maria_db_statement_id,
       service_id, service.name as service_name, deadline, work_description, 
       string_agg(DISTINCT obj.name, '; ') as arch_object_name, 
       string_agg(DISTINCT obj.address, '; ') as arch_object_address, 
       string_agg(DISTINCT dis.name, '; ') as arch_object_district,
       CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
       is_paid, number, app.total_sum, app.total_payed, service.day_count,
       string_agg(DISTINCT CONCAT(COALESCE(eee.last_name, ''), ' ', COALESCE(eee.first_name, '')), ', ') AS assigned_employees_names,
       string_agg(DISTINCT coalesce(cc.value), ', ') AS customer_contacts
FROM paginated_apps pa
JOIN application app ON app.id = pa.id
LEFT JOIN customer cus ON cus.id = app.customer_id 
LEFT JOIN service service ON service.id = app.service_id
LEFT JOIN application_object ao ON ao.application_id = app.id
LEFT JOIN arch_object obj ON ao.arch_object_id = obj.id
LEFT JOIN district dis ON obj.district_id = dis.id
LEFT JOIN application_status st ON app.status_id = st.id
LEFT JOIN application_task task ON task.application_id = app.id
LEFT JOIN application_task_assignee ats ON ats.application_task_id = task.id
LEFT JOIN employee_in_structure eis ON eis.id = ats.structure_employee_id
LEFT JOIN structure_post sp ON sp.id = eis.post_id
LEFT JOIN employee eee ON eee.id = eis.employee_id
LEFT JOIN customer_contact cc ON cus.id = cc.customer_id 
LEFT JOIN ""User"" uc ON uc.id = app.created_by
LEFT JOIN employee emp_c ON emp_c.user_id = uc.""userId""
LEFT JOIN workflow w ON service.workflow_id = w.id
LEFT JOIN architecture_process proc ON proc.id = app.id
LEFT JOIN ""User"" u_proc ON u_proc.id = proc.created_by
LEFT JOIN employee e_proc ON e_proc.user_id = u_proc.""userId""
GROUP BY app.id, cus.id, service.id, st.id, emp_c.id
ORDER BY app.id DESC";

                IEnumerable<Domain.Entities.Application> models = new List<Domain.Entities.Application>();
                if (!onlyCount)
                {
                    models = await _dbConnection.QueryAsync<Domain.Entities.Application>(mainSql2,
                        CreateParameters(filter), transaction: _dbTransaction);
                }

                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(countSql2,
                    CreateParameters(filter), transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<Domain.Entities.Application>(domainItems, totalItems, filter.pageNumber,
                    filter.pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }

        public async Task<PaginatedList<Domain.Entities.Application>> GetPaginated(PaginationFields filter, bool onlyCount, bool skip)
        {
            try
            {
                // Updated count query - using extracted columns instead of JSON operations
                var countSql = @"
SELECT count(distinct app.id)
FROM application app
    inner JOIN service on service.id = app.service_id
    inner JOIN application_status st on app.status_id = st.id
    LEFT JOIN application_object ao ON ao.application_id = app.id
    LEFT JOIN arch_object obj ON ao.arch_object_id = obj.id
        ";

                // Updated main query - using extracted columns for better performance
                var mainSql = @"
SELECT app.id, app.done_date, app.object_tag_id, registration_date, app.customer_id, 
       app.customer_name_extracted as customer_name, 
       app.customer_pin_extracted as customer_pin, 
       app.status_id, app.workflow_id, 
       st.name status_name, st.code status_code, st.status_color status_color, 
       maria_db_statement_id,
       service_id, service.name as service_name, deadline, work_description, 
       app.arch_objects_extracted as arch_object_name, 
       app.arch_objects_extracted as arch_object_address, 
       app.cashed_info->>'district_names' as arch_object_district,
       -- Using cached registrator name instead of JOIN-based created_by_name
       app.cashed_info->>'registrator_name' AS created_by_name,
       is_paid, number, app.total_sum, app.total_payed, service.day_count,
       app.cashed_info->>'assignees' AS assigned_employees_names,
       app.cashed_info->>'comments' AS comments,
       app.customer_contacts_extracted AS customer_contacts
FROM application app
    LEFT JOIN service on service.id = app.service_id
    LEFT JOIN application_status st on app.status_id = st.id
    LEFT JOIN application_object ao ON ao.application_id = app.id
    LEFT JOIN arch_object obj ON ao.arch_object_id = obj.id
        ";

                var sql = "";

                if (filter.useCommon)
                {
                    // Common filter logic with extracted columns
                    if (string.IsNullOrWhiteSpace(filter.common_filter))
                    {
                        sql += "WHERE 1=1 ";
                        if (filter.isExpired != null && filter.isExpired.Value)
                        {
                            // Deadline filtering logic - no changes needed as it doesn't use extracted columns
                            if ((filter.deadline_day ?? 0) == 0)
                            {
                                sql += @$" AND (deadline::date < CURRENT_DATE and (st.code in ('review',
'executor_assignment',
'preparation')))";
                            }
                            else if (filter.deadline_day == -1)
                            {
                                sql += @$" AND (deadline::date = CURRENT_DATE and (st.code in ('review',
'executor_assignment',
'preparation')))";
                            }
                            else if (filter.deadline_day == 7)
                            {
                                sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '4 days' AND CURRENT_DATE + INTERVAL '7 days' AND (st.code in ('review',
'executor_assignment',
'preparation')))";
                            }
                            else if (filter.deadline_day == 3)
                            {
                                sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '1 days' AND CURRENT_DATE + INTERVAL '3 days' AND (st.code in ('review',
'executor_assignment',
'preparation')))";
                            }
                            else if (filter.deadline_day == 1)
                            {
                                sql += @$" and (deadline::DATE = CURRENT_DATE + INTERVAL '1 day' and  (st.code in ('review',
'executor_assignment',
'preparation')))";
                            }
                        }
                    }
                    else
                    {
                        // Common filter search logic using extracted columns for better performance
                        sql += @"WHERE (app.number ILIKE CONCAT('%', @common_filter, '%')
or app.customer_name_extracted ILIKE CONCAT('%', @common_filter, '%')
or app.customer_pin_extracted ILIKE CONCAT('%', @common_filter, '%')
or app.arch_objects_extracted ILIKE CONCAT('%', @common_filter, '%')
or app.customer_contacts_extracted ILIKE CONCAT('%', @common_filter, '%')
or app.work_description ILIKE CONCAT('%', @common_filter, '%')
or app.incoming_numbers ILIKE CONCAT('%', @common_filter, '%')
or app.outgoing_numbers ILIKE CONCAT('%', @common_filter, '%'))";
                    }
                }
                else
                {
                    sql = "where 1=1 ";

                    if (filter.withoutAssignedEmployee == true)
                    {
                        // This condition was commented out in original, keeping as is
                        //sql += " and sp.code != 'employee' "; //TODO revert
                    }

                    // Individual filter conditions using extracted columns
                    if (!string.IsNullOrEmpty(filter.pin))
                    {
                        sql += " and app.customer_pin_extracted ilike concat('%', @pin, '%') ";
                    }
                    if (!string.IsNullOrEmpty(filter.number))
                    {
                        sql += " and LOWER(app.number) ilike concat('%', @number, '%') ";
                    }
                    if (!string.IsNullOrEmpty(filter.address))
                    {
                        sql += @$"
AND app.arch_objects_extracted ilike '%{filter.address.ToLower()}%'";
                    }
                    if (!string.IsNullOrEmpty(filter.customerName))
                    {
                        sql += @$"
AND app.customer_name_extracted ILIKE concat('%',@customer_name,'%') ";
                    }

                    if (filter.service_ids.Count() > 0)
                    {
                        sql += @$"
AND service_id in ({string.Join(',', filter.service_ids)})";
                    }
                    if (filter.status_ids.Count() > 0)
                    {
                        sql += @$"
AND app.status_id in ({string.Join(',', filter.status_ids)})";
                    }

                    // District filtering
                    if (filter.district_id != null && filter.district_id != 0 && filter.district_id != 6)
                    {
                        sql += $" AND app.cashed_info->'district_ids' @> '[{filter.district_id}]' ";
                    }

                    // NEW: Tunduk address unit filtering
                    if (filter.tunduk_address_unit_id != null && filter.tunduk_address_unit_id != 0)
                    {
                        sql += @$" AND obj.tunduk_address_unit_id = {filter.tunduk_address_unit_id}";
                    }

                    // NEW: Tunduk street filtering
                    if (filter.tunduk_street_id != null && filter.tunduk_street_id != 0)
                    {
                        sql += @$" AND obj.tunduk_street_id = {filter.tunduk_street_id}";
                    }

                    // Architecture process filtering using cached data
                    if (filter.employee_arch_id != null && filter.employee_arch_id != 0)
                    {
                        // Using cached dp_registrator_id instead of JOIN-based e_proc.id
                        sql += @$"
AND (app.cashed_info->>'dp_registrator_id')::int = {filter.employee_arch_id}";

                        // Date filtering using cached dp_created_at
                        if (filter.dashboard_date_start != null)
                        {
                            sql += @$"
AND (app.cashed_info->>'dp_created_at')::timestamp >= @dashboard_date_start";
                        }
                        if (filter.dashboard_date_end != null)
                        {
                            sql += @$"
AND (app.cashed_info->>'dp_created_at')::timestamp <= @dashboard_date_end";
                        }
                    }

                    if (filter.employee_id != null && filter.employee_id != 0)
                    {
                        sql += $" AND app.cashed_info->'assignee_ids' @> '[{filter.employee_id}]'";
                    }

                    if (!string.IsNullOrEmpty(filter.incoming_numbers))
                    {
                        sql += " and LOWER(app.incoming_numbers) ilike concat('%', @incomingNumbers, '%') ";
                    }

                    if (!string.IsNullOrEmpty(filter.outgoing_numbers))
                    {
                        sql += " and LOWER(app.outgoing_numbers) ilike concat('%', @outgoingNumbers, '%') ";
                    }

                    // Deadline filtering logic - unchanged
                    if (filter.isExpired != null && filter.isExpired.Value)
                    {
                        if ((filter.deadline_day ?? 0) == 0)
                        {
                            sql += @$" AND (deadline::date < CURRENT_DATE and (st.code in ('review',
'executor_assignment',
'preparation')))";
                        }
                        else if (filter.deadline_day == -1)
                        {
                            sql += @$" AND (deadline::date = CURRENT_DATE and (st.code in ('review',
'executor_assignment',
'preparation')))";
                        }
                        else if (filter.deadline_day == 7)
                        {
                            sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '4 days' AND CURRENT_DATE + INTERVAL '7 days' AND (st.code in ('review',
'executor_assignment',
'preparation')))";
                        }
                        else if (filter.deadline_day == 3)
                        {
                            sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '1 days' AND CURRENT_DATE + INTERVAL '3 days' AND (st.code in ('review',
'executor_assignment',
'preparation')))";
                        }
                        else if (filter.deadline_day == 1)
                        {
                            sql += @$" and (deadline::DATE = CURRENT_DATE + INTERVAL '1 day' and  (st.code in ('review',
'executor_assignment',
'preparation')))";
                        }
                    }

                    // Date range filtering - unchanged
                    if (filter.date_start != null)
                    {
                        sql += @$"
AND registration_date >= @date_start";
                    }

                    if (filter.date_end != null)
                    {
                        sql += @$"
AND registration_date <= @date_end";
                    }

                    // Sum filtering logic - unchanged
                    if (filter.total_sum_from.HasValue)
                    {
                        sql += " AND app.total_sum >= @total_sum_from";
                    }
                    if (filter.total_sum_to.HasValue)
                    {
                        sql += " AND app.total_sum <= @total_sum_to";
                    }
                    if (filter.total_payed_from.HasValue)
                    {
                        sql += " AND app.total_payed >= @total_payed_from";
                    }
                    if (filter.total_payed_to.HasValue)
                    {
                        sql += " AND app.total_payed <= @total_payed_to";
                    }
                    if (filter.app_ids?.Count() > 0)
                    {
                        sql += " AND app.id = ANY(@appids)";
                    }
                }

                // Structure filtering - unchanged
                if (filter.structure_ids != null && filter.structure_ids.Length > 0)
                {
                    sql += @$"
AND service.structure_id in ({string.Join(',', filter.structure_ids)}) ";
                }

                if (filter.journals_id != null && filter.journals_id != 0)
                {
                    sql += " AND app.id IN (SELECT application_id FROM journal_application WHERE journal_id = @journal_id)";
                }
                if (filter.journals_id == 0 && filter.is_journal == true)
                {
                    sql += " AND app.id IN (SELECT application_id FROM journal_application)";
                }

                // Payment status filtering - unchanged
                if (filter.is_paid != null)
                {
                    sql += $@"
AND (
    (@is_paid = true AND (is_paid = true OR (is_paid = false AND total_payed >= total_sum AND total_payed > 0)))
    OR (@is_paid = false AND is_paid = false AND total_payed < total_sum)
)";
                }
                if (filter.app_ids?.Count() > 0)
                {
                    sql += " AND app.id = ANY(@appids)";
                }
                
                if (filter.for_signature.HasValue && filter.for_signature.Value)
                {
                    sql += " AND app.status_id = (select id from application_status where code = 'ready_for_signing_eo')";
                }

                countSql = countSql + sql;

                // Group by clause - simplified since we removed architecture_process JOIN
                sql += @$" 
group by app.id, st.id, service.id";

                // Sorting logic - unchanged
                if (filter.sort_by != null && filter.sort_type != null)
                {
                    sql += @$"
ORDER BY {filter.sort_by} {filter.sort_type}";
                }
                else
                {
                    sql += @$"
ORDER BY app.id desc";
                }

                // Pagination logic - unchanged
                var sqlWithPagination = sql + @"
OFFSET @pageSize * @pageNumber Limit @pageSize;
        ";

                IEnumerable<Domain.Entities.Application> models = new List<Domain.Entities.Application>();

                // Execute main query if not only counting
                if (!onlyCount)
                {
                    models = await _dbConnection.QueryAsync<Domain.Entities.Application>(mainSql + sqlWithPagination,
                    new
                    {
                        filter.pageSize,
                        filter.pageNumber,
                        pin = filter.pin?.ToLower(),
                        customer_name = filter.customerName?.ToLower(),
                        number = filter.number?.ToLower(),
                        filter.date_start,
                        filter.date_end,
                        filter.common_filter,
                        journal_id = filter.journals_id,
                        incomingNumbers = filter.incoming_numbers,
                        outgoingNumbers = filter.outgoing_numbers,
                        filter.dashboard_date_start,
                        filter.dashboard_date_end,
                        is_paid = filter.is_paid,
                        filter.total_payed_from,
                        filter.total_payed_to,
                        filter.total_sum_from,
                        filter.total_sum_to,
                        appids = filter.app_ids?.ToArray()
                    }, transaction: _dbTransaction);
                }

                var totalItems = 0;

                // Execute count query if needed
                if (!skip)
                {
                    totalItems = await _dbConnection.ExecuteScalarAsync<int>(countSql,
                    new
                    {
                        filter.pageSize,
                        filter.pageNumber,
                        pin = filter.pin?.ToLower(),
                        customer_name = filter.customerName?.ToLower(),
                        number = filter.number?.ToLower(),
                        filter.date_start,
                        filter.date_end,
                        filter.common_filter,
                        journal_id = filter.journals_id,
                        incomingNumbers = filter.incoming_numbers,
                        outgoingNumbers = filter.outgoing_numbers,
                        filter.dashboard_date_start,
                        filter.dashboard_date_end,
                        filter.is_paid,
                        filter.total_payed_from,
                        filter.total_payed_to,
                        filter.total_sum_from,
                        filter.total_sum_to,
                        appids = filter.app_ids?.ToArray()
                    }, transaction: _dbTransaction);
                }

                var domainItems = models.ToList();

                return new PaginatedList<Domain.Entities.Application>(domainItems, totalItems, filter.pageNumber,
                    filter.pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }
        private string BuildWhereClause(PaginationFields filter)
        {
            var whereClause = "WHERE 1=1 ";

            if (filter.useCommon)
            {
                if (string.IsNullOrWhiteSpace(filter.common_filter))
                {
                whereClause += BuildExpirationFilter(filter);
            }
                else
            {
                    whereClause += @"
AND (lower(app.number) LIKE lower (CONCAT('%', @common_filter, '%'))
  OR lower(cus.full_name) LIKE lower(CONCAT('%', @common_filter, '%'))
  OR lower(cus.pin) LIKE lower(CONCAT('%', @common_filter, '%'))
  OR lower(obj.address) LIKE lower(CONCAT('%', @common_filter, '%'))
  OR lower(cc.value) LIKE lower(CONCAT('%', @common_filter, '%'))
  OR lower(app.work_description) LIKE lower(CONCAT('%', @common_filter, '%'))
  OR lower(app.incoming_numbers) LIKE lower(CONCAT('%', @common_filter, '%'))
  OR lower(app.outgoing_numbers) LIKE lower(CONCAT('%', @common_filter, '%')))";
                }
            }
            else
            {
                if (filter.withoutAssignedEmployee == true)
                {
                    whereClause += " AND sp.code != 'employee'";
                }
                if (!string.IsNullOrEmpty(filter.pin))
                {
                    whereClause += " AND LOWER(cus.pin) like concat('%', @pin, '%')";
                }
                if (!string.IsNullOrEmpty(filter.number))
                {
                    whereClause += " AND LOWER(app.number) like concat('%', @number, '%')";
                }
                if (!string.IsNullOrEmpty(filter.address))
                {
                    whereClause += $" AND LOWER(obj.address) like '%{filter.address.ToLower()}%'";
                }
                if (!string.IsNullOrEmpty(filter.customerName))
                {
                    whereClause += " AND LOWER(cus.full_name) LIKE concat('%',@customer_name,'%')";
                }
                if (filter.service_ids?.Count() > 0)
                {
                    whereClause += $" AND service_id in ({string.Join(',', filter.service_ids)})";
                }
                if (filter.status_ids?.Count() > 0)
                {
                    whereClause += $" AND app.status_id in ({string.Join(',', filter.status_ids)})";
                }
                if (filter.district_id != null && filter.district_id != 0)
                {
                    whereClause += $" AND obj.district_id = {filter.district_id}";
                }
                if (filter.employee_arch_id != null && filter.employee_arch_id != 0)
                {
                    whereClause += $" AND e_proc.id = {filter.employee_arch_id}";
                    if (filter.dashboard_date_start != null)
                    {
                        whereClause += " AND proc.created_at >= @dashboard_date_start";
                    }
                    if (filter.dashboard_date_end != null)
                    {
                        whereClause += " AND proc.created_at <= @dashboard_date_end";
                    }
                }
                if (filter.employee_id != null && filter.employee_id != 0)
                {
                    whereClause += $" AND eee.id = {filter.employee_id}";
                }
                if (!string.IsNullOrEmpty(filter.incoming_numbers))
                {
                    whereClause += " AND LOWER(app.incoming_numbers) like concat('%', @incomingNumbers, '%')";
                }
                if (!string.IsNullOrEmpty(filter.outgoing_numbers))
                {
                    whereClause += " AND LOWER(app.outgoing_numbers) like concat('%', @outgoingNumbers, '%')";
                }

                whereClause += BuildExpirationFilter(filter);

                if (filter.date_start != null)
                {
                    whereClause += " AND registration_date >= @date_start";
            }
                if (filter.date_end != null)
                {
                    whereClause += " AND registration_date <= @date_end";
                }
            }

            if (filter.structure_ids != null && filter.structure_ids.Length > 0)
            {
                whereClause += $@" AND w.id in (select wtt.workflow_id from workflow_task_template wtt where wtt.type_id != 1 and wtt.structure_id in ({string.Join(',', filter.structure_ids)}))";
            }

            if (filter.is_paid != null)
            {
                whereClause += @" AND (
        (@is_paid = true AND (is_paid = true OR (is_paid = false AND total_payed >= total_sum AND total_payed > 0)))
        OR (@is_paid = false AND is_paid = false AND total_payed < total_sum)
    )";
            }

            return whereClause;
        }

        private string BuildExpirationFilter(PaginationFields filter)
        {
            if (filter.isExpired != true) return "";

            var statusCodes = @"('in_progress')";

            return (filter.deadline_day ?? 0) switch
            {
                0 => $" AND (deadline::date < CURRENT_DATE and (st.group_code in {statusCodes}))",
                -1 => $" AND (deadline::date = CURRENT_DATE and (st.group_code in {statusCodes}))",
                7 => $" AND (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '4 days' AND CURRENT_DATE + INTERVAL '7 days' AND (st.group_code in {statusCodes}))",
                3 => $" AND (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '1 days' AND CURRENT_DATE + INTERVAL '3 days' AND (st.group_code in {statusCodes}))",
                1 => $" AND (deadline::DATE = CURRENT_DATE + INTERVAL '1 day' and  (st.group_code in {statusCodes}))",
                _ => ""
            };
        }

        private object CreateParameters(PaginationFields filter)
        {
            return new
            {
                filter.pageSize,
                filter.pageNumber,
                pin = filter.pin?.ToLower(),
                customer_name = filter.customerName?.ToLower(),
                number = filter.number?.ToLower(),
                filter.date_start,
                filter.date_end,
                filter.common_filter,
                incomingNumbers = filter.incoming_numbers,
                outgoingNumbers = filter.outgoing_numbers,
                filter.dashboard_date_start,
                filter.dashboard_date_end,
                is_paid = filter.is_paid,
                // Добавляем параметры для фильтрации по суммам
                total_sum_from = filter.total_sum_from,
                total_sum_to = filter.total_sum_to,
                total_payed_from = filter.total_payed_from,
                total_payed_to = filter.total_payed_to,
            };
        }


        public async Task<PaginatedList<Domain.Entities.Application>> GetPaginatedDashboardIssuedFromRegister(PaginationFields filter, bool onlyCount)
        {
            // это кастомный запрос для дополнительной фильтрации через дашборды
            try
            {
                var countSql = @"
SELECT count(distinct app.id)
FROM application app
        	LEFT JOIN customer cus on cus.id = app.customer_id 
        	LEFT JOIN service on service.id = app.service_id
        	LEFT JOIN application_object ao on ao.application_id = app.id
        	LEFT JOIN arch_object obj on ao.arch_object_id = obj.id
        	LEFT JOIN district dis on obj.district_id = dis.id
           -- LEFT JOIN arch_object_tag obj_tag on app.arch_object_id = obj_tag.id_object
           -- LEFT JOIN tag on obj_tag.id_tag = tag.id
        	LEFT JOIN application_status st on app.status_id = st.id
        	LEFT JOIN application_task task on task.application_id = app.id
        	LEFT JOIN application_task_assignee ats on ats.application_task_id = task.id
        	LEFT JOIN employee_in_structure eis on eis.id = ats.structure_employee_id
            LEFT JOIN structure_post sp on sp.id = eis.post_id
        	LEFT JOIN employee eee on eee.id = eis.employee_id
        	LEFT JOIN customer_contact cc on cus.id = cc.customer_id 
                    left join ""User"" uc on uc.id = app.created_by
                    left join employee emp_c on emp_c.user_id = uc.""userId""
            left join workflow w on service.workflow_id = w.id

            left join (select distinct his.application_id from application_status_history his
                left join application_status st on st.id = his.status_id
                left join ""User"" u on u.id = his.user_id
                left join employee e on u.""userId"" = e.user_id
                where st.code = 'document_issued' and e.id = @issued_employee_id and his.date_change > @dashboard_date_start and his.date_change < @dashboard_date_end
            order by his.application_id) issued on issued.application_id = app.id

            LEFT JOIN architecture_process proc on proc.id = app.id
            LEFT JOIN ""User"" u_proc on u_proc.id = proc.created_by
            LEFT JOIN employee e_proc on e_proc.user_id = u_proc.""userId""
        ";

                var mainSql = @"
SELECT app.id, app.object_tag_id, registration_date, app.customer_id, cus.full_name as customer_name, cus.pin as customer_pin, app.status_id, app.workflow_id, st.name status_name, st.code status_code, st.status_color status_color, maria_db_statement_id,
                service_id, service.name as service_name, deadline,work_description, 
        		string_agg(DISTINCT obj.name, '; ') as arch_object_name, string_agg(DISTINCT obj.address, '; ') as arch_object_address, string_agg(DISTINCT dis.name, '; ') as arch_object_district,
                CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                is_paid, number, app.total_sum, app.total_payed, service.day_count,
        		string_agg(DISTINCT CONCAT(COALESCE(eee.last_name, ''), ' ', COALESCE(eee.first_name, '')), ', ') AS assigned_employees_names,
                --'' AS assigned_employees_names,
        		string_agg(DISTINCT coalesce(cc.value), ', ') AS customer_contacts
        FROM application app
        	LEFT JOIN customer cus on cus.id = app.customer_id 
        	LEFT JOIN service on service.id = app.service_id
        	LEFT JOIN application_object ao on ao.application_id = app.id
        	LEFT JOIN arch_object obj on ao.arch_object_id = obj.id
        	LEFT JOIN district dis on obj.district_id = dis.id
           -- LEFT JOIN arch_object_tag obj_tag on app.arch_object_id = obj_tag.id_object
           -- LEFT JOIN tag on obj_tag.id_tag = tag.id
        	LEFT JOIN application_status st on app.status_id = st.id
        	LEFT JOIN application_task task on task.application_id = app.id
        	LEFT JOIN application_task_assignee ats on ats.application_task_id = task.id
        	LEFT JOIN employee_in_structure eis on eis.id = ats.structure_employee_id
            LEFT JOIN structure_post sp on sp.id = eis.post_id
        	LEFT JOIN employee eee on eee.id = eis.employee_id
        	LEFT JOIN customer_contact cc on cus.id = cc.customer_id 
                    left join ""User"" uc on uc.id = app.created_by
                    left join employee emp_c on emp_c.user_id = uc.""userId""	
            left join workflow w on service.workflow_id = w.id

            left join (select distinct his.application_id from application_status_history his
                left join application_status st on st.id = his.status_id
                left join ""User"" u on u.id = his.user_id
                left join employee e on u.""userId"" = e.user_id
                where st.code = 'document_issued' and e.id = @issued_employee_id and his.date_change > @dashboard_date_start and his.date_change < @dashboard_date_end
            order by his.application_id) issued on issued.application_id = app.id

            LEFT JOIN architecture_process proc on proc.id = app.id
            LEFT JOIN ""User"" u_proc on u_proc.id = proc.created_by
            LEFT JOIN employee e_proc on e_proc.user_id = u_proc.""userId""

        ";
                var sql = "";

                if (filter.useCommon)
                {
                    if (string.IsNullOrWhiteSpace(filter.common_filter))
                    {
                        sql += "WHERE 1=1 ";
                        if (filter.isExpired != null && filter.isExpired.Value)
                        {
                            if ((filter.deadline_day ?? 0) == 0)
                            {
                                sql += @$" AND (deadline <= now() and (st.group_code = 'in_progress'))";
                            }
                            else if (filter.deadline_day == 7)
                            {
                                sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '4 days' AND CURRENT_DATE + INTERVAL '7 days' AND (st.group_code = 'in_progress'))";
                            }
                            else if (filter.deadline_day == 3)
                            {
                                sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '1 days' AND CURRENT_DATE + INTERVAL '3 days' AND (st.group_code = 'in_progress'))";
                            }
                            else if (filter.deadline_day == 1)
                            {
                                sql += @$" and (deadline::DATE = CURRENT_DATE + INTERVAL '1 day' and  (st.group_code = 'in_progress'))";
                            }
                        }
                    }
                    else
                    {
                        sql += @"WHERE (app.number ILIKE CONCAT('%', @common_filter, '%')
                        or cus.full_name ILIKE CONCAT('%', @common_filter, '%')
                        or cus.pin ILIKE CONCAT('%', @common_filter, '%')
                        or obj.address ILIKE CONCAT('%', @common_filter, '%')
                        or cc.value ILIKE CONCAT('%', @common_filter, '%')
                        or app.work_description ILIKE CONCAT('%', @common_filter, '%')
                        or app.incoming_numbers ILIKE CONCAT('%', @common_filter, '%')
                        or app.outgoing_numbers ILIKE CONCAT('%', @common_filter, '%'))";
                    }

                }
                else
                {
                    sql = "where 1=1 ";
                    if (filter.withoutAssignedEmployee == true)
                    {
                        sql += " and sp.code != 'employee' ";
                    }
                    if (!string.IsNullOrEmpty(filter.pin))
                    {
                        sql += " and LOWER(cus.pin) like concat('%', @pin, '%') ";
                    }
                    if (!string.IsNullOrEmpty(filter.number))
                    {
                        sql += " and LOWER(app.number) like concat('%', @number, '%') ";
                    }
                    if (!string.IsNullOrEmpty(filter.address))
                    {
                        sql += @$"
        AND LOWER(obj.address) like '%{filter.address.ToLower()}%'";
                    }
                    if (!string.IsNullOrEmpty(filter.customerName))
                    {
                        sql += @$"
        AND LOWER(cus.full_name) LIKE concat('%',@customer_name,'%') ";
                    }

                    if (filter.service_ids.Count() > 0)
                    {
                        sql += @$"
        AND service_id in ({string.Join(',', filter.service_ids)})";
                    }
                    if (filter.status_ids.Count() > 0)
                    {
                        sql += @$"
        AND app.status_id in ({string.Join(',', filter.status_ids)})";
                    }

                    if (filter.district_id != null && filter.district_id != 0)
                    {
                        sql += @$"
        AND obj.district_id = {filter.district_id}";
                    }

                    if (filter.employee_arch_id != null && filter.employee_arch_id != 0)
                    {
                        sql += @$"
        AND e_proc.id = {filter.employee_arch_id}";
                        if (filter.dashboard_date_start != null)
                        {
                            sql += @$"
            AND proc.created_at >= @dashboard_date_start";
                        }
                        if (filter.dashboard_date_end != null)
                        {
                            sql += @$"
            AND proc.created_at <= @dashboard_date_end";
                        }
                    }


                    if (filter.employee_id != null && filter.employee_id != 0)
                    {
                        sql += @$" AND emp_c.id = {filter.employee_id}";
                    }

                    if (!string.IsNullOrEmpty(filter.incoming_numbers))
                    {
                        sql += " and LOWER(app.incoming_numbers) like concat('%', @incomingNumbers, '%') ";
                    }

                    if (!string.IsNullOrEmpty(filter.outgoing_numbers))
                    {
                        sql += " and LOWER(app.outgoing_numbers) like concat('%', @outgoingNumbers, '%') ";
                    }

                    if (filter.isExpired != null && filter.isExpired.Value)
                    {
                        if ((filter.deadline_day ?? 0) == 0)
                        {
                            sql += @$" AND (deadline <= now() and (st.group_code = 'in_progress'))";
                        }
                        else if (filter.deadline_day == 7)
                        {
                            sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '4 days' AND CURRENT_DATE + INTERVAL '7 days' AND (st.group_code = 'in_progress'))";
                        }
                        else if (filter.deadline_day == 3)
                        {
                            sql += @$" and (deadline::DATE BETWEEN CURRENT_DATE + INTERVAL '1 days' AND CURRENT_DATE + INTERVAL '3 days' AND (st.group_code = 'in_progress'))";
                        }
                        else if (filter.deadline_day == 1)
                        {
                            sql += @$" and (deadline::DATE = CURRENT_DATE + INTERVAL '1 day' and  (st.group_code = 'in_progress'))";
                        }
                    }

                    if (filter.structure_ids != null && filter.structure_ids.Length > 0)
                    {
                        sql += @$"
                        AND w.id in (select wtt.workflow_id from workflow_task_template wtt where wtt.type_id != 1 and wtt.structure_id in ({string.Join(',', filter.structure_ids)}))";
                    }

                    if (filter.date_start != null)
                    {
                        sql += @$"
        AND registration_date >= @date_start";
                    }


                    if (filter.date_end != null)
                    {
                        sql += @$"
        AND registration_date <= @date_end";
                    }

                }
                sql += @$"
        AND issued.application_id is not null";

                countSql = countSql + sql;
                // group
                sql += @$" 
        group by app.id, cus.id, service.id, st.id, emp_c.id";

                // sort
                if (filter.sort_by != null && filter.sort_type != null)
                {
                    sql += @$"
        ORDER BY {filter.sort_by} {filter.sort_type}";
                }
                else
                {
                    sql += @$"
        ORDER BY app.registration_date desc";
                }

                // pagesize
                var sqlWithPagination = sql + @"
        OFFSET @pageSize * @pageNumber Limit @pageSize;
        ";

                IEnumerable<Domain.Entities.Application> models = new List<Domain.Entities.Application>();
                if (!onlyCount)
                {
                    models = await _dbConnection.QueryAsync<Domain.Entities.Application>(mainSql + sqlWithPagination,
                    new
                    {
                        filter.pageSize,
                        filter.pageNumber,
                        pin = filter.pin?.ToLower(),
                        customer_name = filter.customerName?.ToLower(),
                        number = filter.number?.ToLower(),
                        filter.date_start,
                        filter.date_end,
                        filter.common_filter,
                        incomingNumbers = filter.incoming_numbers,
                        outgoingNumbers = filter.outgoing_numbers,
                        filter.dashboard_date_start,
                        filter.dashboard_date_end,
                        filter.issued_employee_id,
                    }, transaction: _dbTransaction);
                }

                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(countSql,
                  new
                  {
                      filter.pageSize,
                      filter.pageNumber,
                      pin = filter.pin?.ToLower(),
                      customer_name = filter.customerName?.ToLower(),
                      number = filter.number?.ToLower(),
                      filter.date_start,
                      filter.date_end,
                      filter.common_filter,
                      incomingNumbers = filter.incoming_numbers,
                      outgoingNumbers = filter.outgoing_numbers,
                      filter.dashboard_date_start,
                      filter.dashboard_date_end,
                      filter.issued_employee_id,
                  }, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<Domain.Entities.Application>(domainItems, totalItems, filter.pageNumber,
                    filter.pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }



        public async Task Delete(int id)
        {
            try
            {
                var setUserQuery = $"SET LOCAL \"bga.current_user\" TO '{await _userRepository.GetUserID()}'";
                _dbConnection.Execute(setUserQuery, transaction: _dbTransaction);
                var sql = "DELETE FROM application WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("Application not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete Application", ex);
            }
        }

        public async Task<ApplicationStatus> GetStatusById(int id)
        {
            try
            {
                var sql =
                    "SELECT  application_status.* FROM  application LEFT JOIN  application_status ON  application.status_id =  application_status.id WHERE  application.id = @Id ORDER BY  application_status.updated_at DESC LIMIT 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Domain.Entities.ApplicationStatus>(sql,
                    new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Application with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }
        public async Task<List<ApplicationPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end, int service_id, int status_id)
        {
            try
            {
                var sql = @"
select 
	s.name service_name,
	obj.name object_name,
	orgt.name org_type,
	d.name disctrict_name,
	to_char(app.registration_date, 'YYYY') as year,
	to_char(app.registration_date, 'MONTH') as month,
	to_char(app.registration_date, 'DAY') as day,
	app.registration_date,
	ast.name as status,
    CASE
        WHEN ast.group_code IN ('completed') THEN 'Завершено'
        WHEN ast.group_code IN ('in_progress') and CURRENT_DATE - deadline::date BETWEEN 1 AND 3 THEN '1-3 дней опоздания'
        WHEN ast.group_code IN ('in_progress') and CURRENT_DATE - deadline::date BETWEEN 4 AND 7 THEN '4-7 дней опоздания'
        WHEN ast.group_code IN ('in_progress') and CURRENT_DATE - deadline::date BETWEEN 8 AND 14 THEN '8-14 дней опоздания'
        WHEN ast.group_code IN ('in_progress') and CURRENT_DATE - deadline::date > 14 THEN 'Более 14 дней опоздания'
		WHEN ast.group_code IN ('in_progress') and CURRENT_DATE < deadline::date THEN 'В работе, без опоздания'

		WHEN ast.group_code IN ('refusal') THEN 'Отказано'
        ELSE 'В работе, без опоздания'


		
    END AS gradation
from 
application app
left join application_status ast on ast.id = app.status_id
left join arch_object obj on obj.id = app.arch_object_id
left join service s on s.id = app.service_id
left join customer c on c.id = app.customer_id
left join organization_type orgt on orgt.id = c.organization_type_id
left join district d on d.id = obj.district_id
where  app.registration_date > @date_start and app.registration_date < @date_end
and ast.code != 'deleted'
and (@service_id = 0 OR @service_id = app.service_id)
and (@status_id = 0 OR @status_id = app.status_id)
order by app.registration_date
";

                var model = await _dbConnection.QueryAsync<ApplicationPivot>(sql, new { date_end, date_start, service_id, status_id }, transaction: _dbTransaction);
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
        public async Task<List<ApplicationPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end, int service_id, int status_id, string user_id)
        {
            try
            {
                var sql = @"
select 
	s.name service_name,
	obj.name object_name,
	orgt.name org_type,
	d.name disctrict_name,
	to_char(app.registration_date, 'YYYY') as year,
	to_char(app.registration_date, 'MONTH') as month,
	to_char(app.registration_date, 'DAY') as day,
	app.registration_date,
	ast.name as status,
    CASE
        WHEN ast.group_code IN ('completed') THEN 'Завершено'
        WHEN ast.group_code IN ('in_progress') and CURRENT_DATE - deadline::date BETWEEN 1 AND 3 THEN '1-3 дней опоздания'
        WHEN ast.group_code IN ('in_progress') and CURRENT_DATE - deadline::date BETWEEN 4 AND 7 THEN '4-7 дней опоздания'
        WHEN ast.group_code IN ('in_progress') and CURRENT_DATE - deadline::date BETWEEN 8 AND 14 THEN '8-14 дней опоздания'
        WHEN ast.group_code IN ('in_progress') and CURRENT_DATE - deadline::date > 14 THEN 'Более 14 дней опоздания'
		WHEN ast.group_code IN ('in_progress') and CURRENT_DATE < deadline::date THEN 'В работе, без опоздания'

		WHEN ast.group_code IN ('refusal') THEN 'Отказано'
        ELSE 'В работе, без опоздания'


		
    END AS gradation
from 
application app
left join application_status ast on ast.id = app.status_id
left join arch_object obj on obj.id = app.arch_object_id
left join service s on s.id = app.service_id
left join customer c on c.id = app.customer_id
left join organization_type orgt on orgt.id = c.organization_type_id
left join district d on d.id = obj.district_id
                 LEFT JOIN workflow_task_template wtt ON wtt.workflow_id = s.workflow_id
         LEFT JOIN org_structure os ON wtt.structure_id = os.id
         LEFT JOIN employee_in_structure ON os.id = employee_in_structure.structure_id
         LEFT JOIN employee e ON employee_in_structure.employee_id = e.id
where  app.registration_date > @date_start and app.registration_date < @date_end and e.user_id = @user_id
and ast.code != 'deleted'
and (@service_id = 0 OR @service_id = app.service_id)
and (@status_id = 0 OR @status_id = app.status_id)
order by app.registration_date
";

                var model = await _dbConnection.QueryAsync<ApplicationPivot>(sql, new { date_end, date_start, service_id, status_id, user_id }, transaction: _dbTransaction);
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

        public async Task<List<Domain.Entities.ApplicationReport>> GetForReport(bool? isOrg, int? mount, int? year,
            int? structure)
        {
            try
            {
                var sql =
                    @"SELECT application.id, ROW_NUMBER() OVER (ORDER BY application.id) AS order_number, 
                                    number, 
                                    registration_date, 
                                    customer.full_name as customer_name, 
                                    arch_object.name as arch_object_name,
                                    service.price,
                                    '12%' as nds,
                                    '2%' as nsp,
                                    COALESCE(SUM(application_paid_invoice.sum), 0) AS sum
                                    FROM application
                                    left join customer on customer.id = application.customer_id
                                    left join arch_object on arch_object.id = application.arch_object_id
                                    left join service on application.service_id = service.id
                                    left join application_paid_invoice on application.id = application_paid_invoice.application_id
                                    left join application_payment on application.id = application_payment.application_id
                                    WHERE 
                                        (@isOrg IS NULL OR customer.is_organization = @isOrg) AND 
                                        (@mount IS NULL OR EXTRACT(MONTH FROM application.registration_date) = @mount) AND 
                                        (@year IS NULL OR EXTRACT(YEAR FROM application.registration_date) = @year) AND 
                                        (@structure IS NULL OR application_payment.structure_id = @structure)
                                    group by application.id, number, registration_date, customer.full_name, arch_object.name, service.price
                                    ";

                var parameters = new
                {
                    isOrg,
                    mount,
                    year,
                    structure
                };

                var models =
                    await _dbConnection.QueryAsync<Domain.Entities.ApplicationReport>(sql, parameters,
                        transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }

        public async Task<PaginatedList<Domain.Entities.ApplicationReport>> GetForReportPaginated(
            bool? isOrg,
            int? mount,
            int? year,
            int? structure,
            int pageSize,
            int pageNumber,
            string orderBy,
            string? orderType)
        {
            try
            {
                var baseSql = @"
                                            SELECT a.id, 
			ROW_NUMBER() OVER (ORDER BY a.id) AS order_number,
                   number, 
                   registration_date, 
                   customer.full_name as customer_name, 
                   string_agg(ao2.address, ';') as arch_object_name,
				   application_payment.structure_id,
ROUND(SUM(application_payment.sum * 0.12 / 1.12)::NUMERIC, 2) AS nds,  -- НДС 12%, включенный в стоимость
    ROUND(SUM(application_payment.sum * 0.02 / 1.12)::NUMERIC,2) AS nsp,  -- НСП 2%, включенный в стоимость
    ROUND(SUM(application_payment.sum / 1.12)::NUMERIC,2) AS sum, 
                   ROUND(COALESCE(SUM(application_payment.sum), 0)::NUMERIC,2) AS price
            FROM application a
			INNER JOIN application_in_reestr air on air.application_id = a.id
			INNER JOIN reestr r on r.id = air.reestr_id 
			INNER JOIN reestr_status rs on rs.id = r.status_id
            LEFT JOIN customer ON customer.id = a.customer_id
            LEFT JOIN application_payment ON a.id = application_payment.application_id
			LEFT JOIN application_object ao on ao.application_id = a.id
			LEFT JOIN arch_object ao2 on ao2.id = ao.arch_object_id
            WHERE rs.code = 'accepted' and
                (@isOrg IS NULL OR customer.is_organization = @isOrg) AND 
                (@mount IS NULL OR r.month = @mount) AND 
                (@year IS NULL OR r.year = @year) AND 
                (@structure IS NULL OR application_payment.structure_id = @structure)
            GROUP BY a.id, number, registration_date, customer.full_name,application_payment.structure_id
        ";

                if (!string.IsNullOrEmpty(orderBy) && !string.IsNullOrEmpty(orderType))
                {
                    baseSql += $@"
                ORDER BY {orderBy} {orderType}";
                }
                else
                {
                    baseSql += @"
                ORDER BY a.id DESC";
                }

                baseSql += @"
            OFFSET @pageSize * @pageNumber  LIMIT @pageSize";

                var countSql = @"
            SELECT COUNT(DISTINCT application.id)
            FROM application
            LEFT JOIN customer ON customer.id = application.customer_id
            LEFT JOIN application_payment ON application.id = application_payment.application_id
            WHERE 
                (@isOrg IS NULL OR customer.is_organization = @isOrg) AND 
                (@mount IS NULL OR EXTRACT(MONTH FROM application.registration_date) = @mount) AND 
                (@year IS NULL OR EXTRACT(YEAR FROM application.registration_date) = @year) AND 
                (@structure IS NULL OR application_payment.structure_id = @structure)";

                var parameters = new
                {
                    isOrg,
                    mount,
                    year,
                    structure,
                    pageSize,
                    pageNumber
                };

                var models = await _dbConnection.QueryAsync<Domain.Entities.ApplicationReport>(baseSql, parameters, transaction: _dbTransaction);
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(countSql, parameters, transaction: _dbTransaction);

                var domainItems = models.ToList();
                return new PaginatedList<Domain.Entities.ApplicationReport>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application report with pagination", ex);
            }
        }

        public async Task<int> ChangeStatus(int application_id, int status_id)
        {
            var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

            var sql = @"UPDATE  ""application"" SET status_id = @status_id WHERE id = @application_id";

            await _dbConnection.ExecuteAsync(sql, new { application_id, status_id }, transaction: _dbTransaction);

            return application_id;
        }
        public async Task SaveMariaDbId(int application_id, int maria_db_statement_id)
        {
            var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
            var sql = @"UPDATE ""application"" SET maria_db_statement_id = @maria_db_statement_id WHERE id = @application_id";

            await _dbConnection.ExecuteAsync(sql, new { application_id, maria_db_statement_id }, transaction: _dbTransaction);
        }

        public async Task<ApplicationStatus> GetStatusByIdTask(int task_id)
        {
            var sql = @"select s.* from application_task at
                        left join application a on at.application_id = a.id
                        left join application_status s on a.status_id = s.id
                        where at.id = @task_id;";

            var result = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationStatus>(sql, new { task_id }, transaction: _dbTransaction);
            return result;
        }

        public async Task UpdateSum(ApplicationTotalSumData domain)
        {
            try
            {
                var sql = @"UPDATE application SET sum_wo_discount = @sum_wo_discount, 
                                                   total_sum = @total_sum, 
                                                   nds_value = @nds_value, 
                                                   nsp_value = @nsp_value 
                   WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Application", ex);
            }
        }

        public async Task<Domain.Entities.Application> GetOneApplicationSumByID(int id)
        {
            try
            {
                var sql =
                    @"SELECT sum_wo_discount, total_sum, discount_percentage, discount_value, nds_value,
                            nsp_value, nds_percentage, nsp_percentage, has_discount 
                        FROM application 
                        WHERE application.id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Domain.Entities.Application>(sql,
                    new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Application with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }

        public async Task<Domain.Entities.Application> GetForSaveApplicationTotalSum(int id)
        {
            try
            {
                var sql =
                    @"SELECT id,
                             app_cabinet_uuid,
                             sum_wo_discount, 
                             total_sum, 
                             discount_percentage, 
                             discount_value, 
                             nds_value,
                             nsp_value, 
                             nds_percentage, 
                             nsp_percentage, 
                             has_discount,
                             calc_updated_by,
                             calc_created_by, 
                             calc_created_at, 
                             calc_updated_at 
                        FROM application 
                        WHERE application.id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Domain.Entities.Application>(sql,
                    new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Application with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }

        public async Task<Domain.Entities.Application> SaveApplicationTotalSum(Domain.Entities.Application request)
        {
            try
            {
                var sql = @"UPDATE application SET 
                             sum_wo_discount = @sum_wo_discount, 
                             total_sum = @total_sum, 
                             discount_percentage = @discount_percentage, 
                             discount_value = @discount_value, 
                             nds_value = @nds_value,
                             nsp_value = @nsp_value, 
                             nds_percentage = @nds_percentage, 
                             nsp_percentage = @nsp_percentage, 
                             has_discount = @has_discount,
                             calc_updated_by = @calc_updated_by,
                             calc_created_by = @calc_created_by, 
                             calc_created_at = @calc_created_at, 
                             calc_updated_at = @calc_updated_at
                   WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, request, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Application", ex);
            }
            return request;
        }

        public async Task<int> sendOutgoingNumber(int application_id, string? outgoing_numbers)
        {

            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Domain.Entities.Application
                {
                    id = application_id,
                    outgoing_numbers = outgoing_numbers,

                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE application SET  outgoing_numbers = @outgoing_numbers
                   WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
                return affected;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Application", ex);
            }
        }

        public async Task<int> sendDpOutgoingNumber(int application_id, string? dp_outgoing_number)
        {

            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Domain.Entities.Application
                {
                    id = application_id,
                    dp_outgoing_number = dp_outgoing_number,

                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE application SET  dp_outgoing_number = @dp_outgoing_number
                   WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
                return affected;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Application", ex);
            }
        }
        public async Task<List<Domain.Entities.Application>> GetForReestrOtchet(int year, int month, string status, int structure_id)
        {
            try
            {
                var sql = @"
select 
   coalesce(sum(round(api.sum::numeric,2)),0) as total_sum, 
   coalesce(round(ceil(sum(round(api.sum::numeric, 2)) * 100 * 12 / 114) / 100, 2), 0) AS nds_value,
   coalesce(round(ceil(sum(round(api.sum::numeric, 2)) * 100 * 2 / 114) / 100, 2), 0) AS nsp_value, 
   app.number, app.old_sum, app.registration_date, app.id, cus.full_name customer_name, cus.pin customer_pin, 
   cus.is_organization customer_is_organization, cus.address customer_address,
   ao.name as arch_object_name, ao.address as arch_object_address, dis.name arch_object_district, s.name service_name,
   air.id as air_id
from application_in_reestr air
inner join application app on air.application_id = app.id
left join arch_object ao on ao.id = app.arch_object_id
left join district dis on dis.id = ao.district_id
left join customer cus on cus.id = app.customer_id
left join application_status st on st.id = app.status_id
left join service s on s.id = app.service_id
left join reestr r on r.id = air.reestr_id
left join application_payment api on api.application_id = app.id
where r.year = @year and r.month = @month and app.id is not null
";
                if (status == "done")
                {
                    sql += @"
    and r.status_id = 2
";
                }

                if (structure_id != 0)
                {
                    sql += @"
    and api.structure_id = @structure_id
";
                }

                sql += @"
group by app.id, ao.id, cus.id, dis.id, s.id, air.id
order by air.id
";
                var models =
                    await _dbConnection.QueryAsync<Domain.Entities.Application>(sql, new { year, month, structure_id, status }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }


        public async Task<List<Domain.Entities.Application>> GetForReestrRealization(int year, int month, string status, int[]? structure_ids)
        {
            try
            {
                var sql = @"
select sum(sum) as total_sum, sum(nds_value) as nds_value, sum(nsp_value) as nsp_value, short_name as service_name, order_number from (
select 
app.id,
os.order_number,
os.short_name,
sum(round(api.sum::numeric,2)), 
round(ceil(sum(round(api.sum::numeric, 2)) * 100 * 12 / 114) / 100, 2) AS nds_value,
round(ceil(sum(round(api.sum::numeric, 2)) * 100 * 2 / 114) / 100, 2) AS nsp_value
from application app
left join application_status st on st.id = app.status_id
left join application_in_reestr air on air.application_id = app.id
left join reestr r on r.id = air.reestr_id
left join application_payment api on api.application_id = app.id
left join org_structure os on os.id = api.structure_id
where r.year = @year and r.month = @month and air.id is not null
";
                if (status == "done")
                {
                    sql += @"
    and r.status_id = 2
";
                }

                if (structure_ids != null)
                {
                    sql += @"
    and api.structure_id = ANY(@structure_ids) 
";
                }

                sql += @"
group by 1,2,3) a
group by short_name, order_number
order by order_number
";

                var models =
                    await _dbConnection.QueryAsync<Domain.Entities.Application>(sql, new { year, month, structure_ids, status }, transaction: _dbTransaction);




                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }


        public async Task<Domain.Entities.Application> GetOneByApplicationCode(string code)
        {
            try
            {
                var sql = @"SELECT * FROM application WHERE application.application_code = @Code";
                var model = await _dbConnection.QueryFirstOrDefaultAsync<Domain.Entities.Application>(sql, new { Code = code }, transaction: _dbTransaction);

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }
        public async Task ChangeAllStatuses(int reestr_id, int status_id)
        {
            try
            {

                var sql = @"UPDATE application SET status_id = @status_id
where id in (select application_id from application_in_reestr where reestr_id = @reestr_id)";
                var affected = await _dbConnection.ExecuteAsync(sql, new { reestr_id, status_id }, transaction: _dbTransaction);

                return;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to ChangeAllStatuses", ex);
            }
        }
        public async Task<Domain.Entities.Application> CheckHasCreated(Domain.Entities.Application domain)
        {
            try
            {

                var sql = @"
    select app.* from application app
    left join customer c on c.id = app.customer_id
    left join arch_object ao on app.arch_object_id = ao.id
    where app.registration_date >= @registration_date
    and app.service_id = @service_id
    and c.pin = @pin
    and LOWER(ao.address) = LOWER(@address)
    limit 1
";

                domain.registration_date = domain.registration_date?.AddMinutes(-100);

                var res = await _dbConnection.QuerySingleOrDefaultAsync<Domain.Entities.Application>(sql,
                    new
                    {
                        domain.customer.pin,
                        domain.service_id,
                        domain.registration_date,
                        domain.archObjects?.FirstOrDefault()?.address
                    }, transaction: _dbTransaction);

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to ChangeAllStatuses", ex);
            }
        }


        public async Task SetHtmlFromCabinet(int applicationId, string html)
        {
            try
            {
                var sql = @"UPDATE application SET cabinet_html = @html where id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { id = applicationId, html }, transaction: _dbTransaction);

                return;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to ChangeAllStatuses", ex);
            }
        }

        public async Task SetElectronicOnly(int applicationId, bool isElectronic)
        {
            try
            {
                var sql = @"UPDATE application SET is_electronic_only = @isElectronic where id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { id = applicationId, isElectronic }, transaction: _dbTransaction);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to SetElectronicOnly", ex);
            }
        }

        public async Task<int> AddToFavorite(int application_id, int employee_id)
        {
            try
            {
                var sql = @"INSERT INTO application_chosen (application_id, employee_id) VALUES (@application_id, @employee_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, new {application_id, employee_id}, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add Application", ex);
            }
        }

        public async Task<int> DeleteToFavorite(int application_id, int employee_id)
        {
            try
            {
                var sql = @"DELETE FROM application_chosen WHERE application_id = @application_id AND employee_id = @employee_id";
                var result = await _dbConnection.ExecuteAsync(sql, new {application_id, employee_id}, transaction: _dbTransaction);
                return application_id;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add Application", ex);
            }
        }
        
        public async Task<bool> GetStatusFavorite(int application_id, int employee_id)
        {
            try
            {
                var sql = @"SELECT EXISTS(SELECT 1 FROM application_chosen WHERE application_id = @application_id AND employee_id = @employee_id);";
                var result = await _dbConnection.ExecuteScalarAsync<bool>(sql, new {application_id, employee_id}, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add Application", ex);
            }
        }

        public async Task<List<MyApplication>> GetMyApplication(string user_id)
        {
            try
            {
                var sql = @"SELECT DISTINCT a.id, a.number, ""as"".name as status, c.full_name, ao.address, coalesce(api.total_sum, 0) as total_sum FROM application a
LEFT JOIN (
    SELECT application_id, SUM(sum) AS total_sum
    FROM application_paid_invoice
    GROUP BY application_id
) api ON a.id = api.application_id
LEFT JOIN application_task at ON a.id = at.application_id
LEFT JOIN application_task_assignee ata ON at.id = ata.application_task_id
LEFT JOIN employee_in_structure eis ON ata.structure_employee_id = eis.id
LEFT JOIN employee e ON eis.employee_id = e.id
LEFT JOIN application_status ""as"" ON a.status_id = ""as"".id
LEFT JOIN customer c ON a.customer_id = c.id
LEFT JOIN arch_object ao ON a.arch_object_id = ao.id
WHERE e.user_id = @user_id
";
                var models =
                    await _dbConnection.QueryAsync<MyApplication>(sql, new { user_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }

        public async Task<List<Domain.Entities.Application>> GetMyArchiveApplications(string pin)
        {
            try
            {
                var sql = @"
SELECT app.id, app.done_date, app.object_tag_id, registration_date, app.customer_id, app.app_cabinet_uuid, cus.full_name as customer_name, cus.pin as customer_pin, app.status_id, app.workflow_id, st.name status_name, st.name_kg status_name_kg, st.code status_code, st.status_color status_color, maria_db_statement_id,
                service_id, service.name as service_name, service.name_kg as service_name_kg, deadline,work_description, 
        		string_agg(DISTINCT obj.name, '; ') as arch_object_name, string_agg(DISTINCT obj.address, '; ') as arch_object_address, string_agg(DISTINCT dis.name, '; ') as arch_object_district,
                is_paid, number, app.total_sum, app.total_payed, service.day_count,
        		string_agg(DISTINCT coalesce(cc.value), ', ') AS customer_contacts
        FROM application app
        	LEFT JOIN customer cus on cus.id = app.customer_id 
        	LEFT JOIN service on service.id = app.service_id
        	LEFT JOIN application_object ao on ao.application_id = app.id
        	LEFT JOIN arch_object obj on ao.arch_object_id = obj.id
        	LEFT JOIN district dis on obj.district_id = dis.id
           -- LEFT JOIN arch_object_tag obj_tag on app.arch_object_id = obj_tag.id_object
           -- LEFT JOIN tag on obj_tag.id_tag = tag.id
        	LEFT JOIN application_status st on app.status_id = st.id
        	LEFT JOIN customer_contact cc on cus.id = cc.customer_id 
            where cus.pin = @pin
        group by app.id, cus.id, service.id, st.id
        order by registration_date desc
;";
                var models =
                    await _dbConnection.QueryAsync<Domain.Entities.Application>(sql, new { pin }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }

        public async Task<int> SetAppCabinetGuid(int id, string guid)
        {
            try
            {
                var sql = @"UPDATE application SET app_cabinet_uuid = @guid WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { id = id, guid = guid }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
                return 1;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Application", ex);
            }
        }
    }
}