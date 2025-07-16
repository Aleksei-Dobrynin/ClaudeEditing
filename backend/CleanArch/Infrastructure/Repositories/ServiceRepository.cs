using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Infrastructure.FillLogData;
using System.Data.Common;


namespace Infrastructure.Repositories
{
    public class ServiceRepository : IServiceRepository
    {
      
        private IDbTransaction? _dbTransaction;
        private IDbConnection _dbConnection;
        private IUserRepository? _userRepository;

        public ServiceRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

    
        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<Service>> GetAll()
        {
            try
            {
                var sql = @"SELECT service.id, service.name, service.name_kg, service.name_long, service.name_long_kg, 
                                   service.name_statement, service.name_statement_kg, service.name_confirmation, service.name_confirmation_kg,
                                   service.short_name, service.code, service.description, service.description_kg, service.day_count, 
                                   service.workflow_id, service.price, service.is_active, service.date_start, service.date_end, 
                                   service.law_document_id, service.text_color, service.background_color, service.structure_id,
                                   service.created_at, service.created_by, service.updated_at, service.updated_by,
                                   workflow.name as workflow_name, ld.name as law_document_name, os.name as structure_name
                                FROM service 
                                    LEFT JOIN workflow ON workflow.id = service.workflow_id
                                    LEFT JOIN law_document ld ON service.law_document_id = ld.id
                                    LEFT JOIN org_structure os ON service.structure_id = os.id
                                ORDER BY service.name";
                var models = await _dbConnection.QueryAsync<Service>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<List<Service>> GetMyStructure(string user_id)
        {
            try
            {
                var sql = @"SELECT service.id, service.name, service.name_kg, service.name_long, service.name_long_kg, 
                                   service.name_statement, service.name_statement_kg, service.name_confirmation, service.name_confirmation_kg,
                                   service.short_name, service.code, service.description, service.description_kg, service.day_count, 
                                   service.workflow_id, service.price, service.is_active, service.date_start, service.date_end, 
                                   service.law_document_id, service.text_color, service.background_color, service.structure_id,
                                   service.created_at, service.created_by, service.updated_at, service.updated_by,
                                   workflow.name as workflow_name, os.name as structure_name
                                FROM service 
                                    LEFT JOIN workflow ON workflow.id = service.workflow_id
                                    LEFT JOIN workflow_task_template wtt ON wtt.workflow_id = service.workflow_id
                                    LEFT JOIN org_structure os ON wtt.structure_id = os.id
                                    LEFT JOIN employee_in_structure eis ON os.id = eis.structure_id
                                    LEFT JOIN employee e ON eis.employee_id = e.id 
                                WHERE e.user_id=@user_id
                                ORDER BY service.name";
                var models = await _dbConnection.QueryAsync<Service>(sql, new { user_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<Service> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT service.id, service.name, service.name_kg, service.name_long, service.name_long_kg, 
                                   service.name_statement, service.name_statement_kg, service.name_confirmation, service.name_confirmation_kg,
                                   service.short_name, service.code, service.description, service.description_kg, service.day_count, 
                                   service.workflow_id, service.price, service.is_active, service.date_start, service.date_end, 
                                   service.law_document_id, service.text_color, service.background_color, service.structure_id,
                                   service.created_at, service.created_by, service.updated_at, service.updated_by,
                                   os.name as structure_name
                            FROM service
                                LEFT JOIN org_structure os ON service.structure_id = os.id
                            WHERE service.id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Service>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Service with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<int> Add(Service domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Service
                {
                    name = domain.name,
                    name_kg = domain.name_kg,
                    name_long = domain.name_long,
                    name_long_kg = domain.name_long_kg,
                    name_statement = domain.name_statement,
                    name_statement_kg = domain.name_statement_kg,
                    name_confirmation = domain.name_confirmation,
                    name_confirmation_kg = domain.name_confirmation_kg,
                    short_name = domain.short_name,
                    code = domain.code,
                    description = domain.description,
                    description_kg = domain.description_kg,
                    day_count = domain.day_count,
                    workflow_id = domain.workflow_id,
                    price = domain.price,
                    is_active = domain.is_active,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    law_document_id = domain.law_document_id,
                    text_color = domain.text_color,
                    background_color = domain.background_color,
                    structure_id = domain.structure_id
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO service(name, name_kg, name_long, name_long_kg, name_statement, name_statement_kg, 
                                               name_confirmation, name_confirmation_kg, short_name, code, description, description_kg, 
                                               day_count, workflow_id, structure_id, price, is_active, date_start, date_end, law_document_id, 
                                               text_color, background_color, created_at, updated_at, created_by, updated_by) 
                           VALUES (@name, @name_kg, @name_long, @name_long_kg, @name_statement, @name_statement_kg, 
                                   @name_confirmation, @name_confirmation_kg, @short_name, @code, @description, @description_kg, 
                                   @day_count, @workflow_id,@structure_id, @price, @is_active, @date_start, @date_end, @law_document_id, 
                                   @text_color, @background_color, @created_at, @updated_at, @created_by, @updated_by) 
                           RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add Service", ex);
            }
        }

        public async Task Update(Service domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Service
                {
                    id = domain.id,
                    name = domain.name,
                    name_kg = domain.name_kg,
                    name_long = domain.name_long,
                    name_long_kg = domain.name_long_kg,
                    name_statement = domain.name_statement,
                    name_statement_kg = domain.name_statement_kg,
                    name_confirmation = domain.name_confirmation,
                    name_confirmation_kg = domain.name_confirmation_kg,
                    short_name = domain.short_name,
                    code = domain.code,
                    description = domain.description,
                    description_kg = domain.description_kg,
                    day_count = domain.day_count,
                    workflow_id = domain.workflow_id,
                    price = domain.price,
                    is_active = domain.is_active,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    law_document_id = domain.law_document_id,
                    text_color = domain.text_color,
                    background_color = domain.background_color,
                    structure_id = domain.structure_id
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE service SET name = @name, name_kg = @name_kg, name_long = @name_long, name_long_kg = @name_long_kg, 
                                               name_statement = @name_statement, name_statement_kg = @name_statement_kg, 
                                               name_confirmation = @name_confirmation, name_confirmation_kg = @name_confirmation_kg,
                                               short_name = @short_name, code = @code, description = @description, description_kg = @description_kg,
                                               day_count = @day_count, workflow_id = @workflow_id, structure_id = @structure_id, price = @price, is_active = @is_active, 
                                               date_start = @date_start, date_end = @date_end, law_document_id = @law_document_id,
                                               text_color = @text_color, background_color = @background_color,
                                               updated_at = @updated_at, updated_by = @updated_by 
                           WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Service", ex);
            }
        }

        public async Task<PaginatedList<Service>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT id, name, name_kg, name_long, name_long_kg, name_statement, name_statement_kg, 
                                   name_confirmation, name_confirmation_kg, short_name, code, description, description_kg, 
                                   day_count, workflow_id, price, is_active, date_start, date_end, law_document_id, 
                                   text_color, background_color, created_at, created_by, updated_at, updated_by 
                            FROM service 
                            OFFSET @pageSize * (@pageNumber - 1) LIMIT @pageSize";
                var models = await _dbConnection.QueryAsync<Service>(sql, new { pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM service";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<Service>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM service WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("Service not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete Service", ex);
            }
        }

        public class ServiceCount
        {
            public long count { get; set; }
            public string name { get; set; }
        }

        public async Task<ResultDashboard> DashboardGetCountServices(DateTime date_start, DateTime date_end,
            int structure_id)
        {
            try
            {
                var sql = @"

select a.name, count(a.id) count from (select a.id, st.name
                  from application a
                           right join application_status st on a.status_id = st.id
                           left join application_task at on a.id = at.application_id
                           left join application_task_assignee ata on at.id = ata.application_task_id
                           left join employee_in_structure eis on eis.id = ata.structure_employee_id
                  where eis.structure_id = @structure_id
                    and a.registration_date >  @date_start
                    and a.registration_date <  @date_end
                  group by a.id, st.name
                  order by a.id) as a
group by a.name
order by count desc
";
                if (structure_id == 0)
                {
                    sql = @"
select coalesce(""as"".name, 'Без статуса') name, count(a) count from application a
right join application_status ""as"" on a.status_id = ""as"".id
where a.registration_date > @date_start and a.registration_date < @date_end
group by ""as"".id
order by count desc";
                }

                var model = await _dbConnection.QueryAsync<ServiceCount>(sql,
                    new { date_end, date_start, structure_id }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<ResultDashboard> DashboardGetAppsByStatusAndStructure(DateTime date_start, DateTime date_end,
            int structure_id, string status_name)
        {
            try
            {
                var sql = @"
select a.name, count(a.id) count from (
    select a.id, concat(e.last_name, ' ', e.first_name) name
          from application a
                left join application_task at on a.id = at.application_id
                left join application_status st on st.id = a.status_id
                left join application_task_assignee ats on at.id = ats.application_task_id
                left join employee_in_structure eis on eis.id = ats.structure_employee_id
                left join employee e on e.id = eis.employee_id
          where (@structure_id = 0 or eis.structure_id = @structure_id) and st.name = @status_name
            and a.registration_date > @date_start and a.registration_date < @date_end
          group by a.id, e.id
          order by a.id
      ) as a
group by a.name
order by a.count desc
";

                var model = await _dbConnection.QueryAsync<ServiceCount>(sql,
                    new { date_end, date_start, structure_id, status_name }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<ResultDashboard> DashboardGetFinance(DateTime date_start, DateTime date_end, int structure_id)
        {
            try
            {
                var sql = @"
SELECT
    to_char(DATE_TRUNC('month', ap.created_at), 'Mon') AS name,
       TO_CHAR(DATE_TRUNC('month', ap.created_at), 'YYYY') AS year,
    SUM(ap.sum) AS count
FROM
    application_payment ap
where ap.structure_id = @structure_id and ap.created_at > @date_start and ap.created_at < @date_end
GROUP BY
    DATE_TRUNC('month', ap.created_at)
ORDER BY
    DATE_TRUNC('month', ap.created_at);
";
                if (structure_id == 0)
                {
                    sql = @"
SELECT
    to_char(DATE_TRUNC('month', ap.created_at), 'Mon') AS name,
       TO_CHAR(DATE_TRUNC('month', ap.created_at), 'YYYY') AS year,
    SUM(ap.sum) AS count
FROM
    application_payment ap
where ap.created_at > @date_start and ap.created_at < @date_end
GROUP BY
    DATE_TRUNC('month', ap.created_at)
ORDER BY
    DATE_TRUNC('month', ap.created_at);
";
                }

                var model = await _dbConnection.QueryAsync<ServiceCount>(sql,
                    new { date_end, date_start, structure_id }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }
              
        public async Task<ResultDashboard> DashboardGetPaymentFinance(DateTime date_start, DateTime date_end, int structure_id)
        {
            try
            {
                var sql = @"
SELECT
    to_char(DATE_TRUNC('month', ap.date), 'Mon') AS name,
       TO_CHAR(DATE_TRUNC('month', ap.date), 'YYYY') AS year,
    SUM(ap.sum) AS count
FROM
    application_paid_invoice ap
where ap.structure_id = @structure_id and ap.date > @date_start and ap.date < @date_end
GROUP BY
    DATE_TRUNC('month', ap.date)
ORDER BY
    DATE_TRUNC('month', ap.date);
";
                if (structure_id == 0)
                {
                    sql = @"
SELECT
    to_char(DATE_TRUNC('month', ap.date), 'Mon') AS name,
       TO_CHAR(DATE_TRUNC('month', ap.date), 'YYYY') AS year,
    SUM(ap.sum) AS count
FROM
    application_paid_invoice ap
where ap.date > @date_start and ap.date < @date_end
GROUP BY
    DATE_TRUNC('month', ap.date)
ORDER BY
    DATE_TRUNC('month', ap.date);
";
                }

                var model = await _dbConnection.QueryAsync<ServiceCount>(sql,
                    new { date_end, date_start, structure_id }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<ResultDashboard> DashboardGetAppCount(DateTime date_start, DateTime date_end, int service_id, int status_id)
        {
            try
            {
                var sql = @"
SELECT
    to_char(DATE_TRUNC('month', app.registration_date), 'Mon') AS name,
    to_char(DATE_TRUNC('month', app.registration_date), 'MM') AS month_number,
    count(app.id) AS count
FROM
    application app
WHERE app.created_at > @date_start and app.created_at < @date_end
AND (@service_id = 0 OR app.service_id = @service_id)
AND (@status_id = 0 OR app.status_id = @status_id)
GROUP BY
    name, month_number
ORDER BY
    month_number;
";
                var model = await _dbConnection.QueryAsync<ServiceCount>(sql, new { date_end, date_start, status_id, service_id }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }
        
        public async Task<ResultDashboard> DashboardGetAppCount(DateTime date_start, DateTime date_end, int service_id, int status_id, string user_id)
        {
            try
            {
                var sql = @"
SELECT
    to_char(DATE_TRUNC('month', app.registration_date), 'Mon') AS name,
    to_char(DATE_TRUNC('month', app.registration_date), 'MM') AS month_number,
    count(app.id) AS count
FROM
    application app
         LEFT JOIN service s ON app.service_id = s.id
         LEFT JOIN workflow_task_template wtt ON wtt.workflow_id = s.workflow_id
         LEFT JOIN org_structure os ON wtt.structure_id = os.id
         LEFT JOIN employee_in_structure ON os.id = employee_in_structure.structure_id
         LEFT JOIN employee e ON employee_in_structure.employee_id = e.id
WHERE app.created_at > @date_start and app.created_at < @date_end
AND (@service_id = 0 OR app.service_id = @service_id)
AND (@status_id = 0 OR app.status_id = @status_id)
AND e.user_id = @user_id
GROUP BY
    DATE_TRUNC('month', app.registration_date)
ORDER BY
    month_number;
";
                var model = await _dbConnection.QueryAsync<ServiceCount>(sql, new { date_end, date_start, status_id, service_id, user_id }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }
        public async Task<ResultDashboard> GetForFinanceInvoice(DateTime date_start, DateTime date_end)
        {
            try
            {
                var sql = @"
SELECT
    to_char(DATE_TRUNC('month', api.date), 'Mon') AS name,
    to_char(DATE_TRUNC('month', api.date), 'MM') AS month_number,
    sum(api.sum) AS count
FROM
    application_paid_invoice api
WHERE api.date > @date_start AND api.date < @date_end
GROUP BY
    name, month_number
ORDER BY
    month_number;
";
                var model = await _dbConnection.QueryAsync<ServiceCount>(sql, new { date_end, date_start }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<ResultDashboard> DashboardGetCountTasks(DateTime date_start, DateTime date_end, int structure_id)
        {
            try
            {
                var sql = @"
select coalesce(ts.name, 'Без статуса') name, count(at) count from application_task at
right join task_status ts on at.status_id = ts.id
left join application_task_assignee ata on at.id = ata.application_task_id
left join employee_in_structure eis on eis.id = ata.structure_employee_id
where eis.structure_id = @structure_id and at.created_at > @date_start and at.created_at < @date_end
group by ts.id
order by count desc
";
                if (structure_id == 0)
                {
                    sql = @"
select coalesce(ts.name, 'Без статуса') name, count(at) count from application_task at
right join task_status ts on at.status_id = ts.id
where at.created_at > @date_start and at.created_at < @date_end
group by ts.id
order by count desc";
                }

                var model = await _dbConnection.QueryAsync<ServiceCount>(sql,
                    new { date_end, date_start, structure_id }, transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<ResultDashboard> DashboardGetCountUserApplications(DateTime date_start, DateTime date_end)
        {
            try
            {
                var sql = @"
            select 
concat(e.last_name, ' ', e.first_name, ' ', e.second_name) as name,
count(a.id) as count
from application a
inner join ""User"" u on u.id = a.created_by
inner join employee e on e.user_id = u.""userId""
where a.registration_date > @date_start and a.registration_date < @date_end
group by name
order by count desc";

                var model = await _dbConnection.QueryAsync<ServiceCount>(sql,
                    new { date_start, date_end }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException("No data found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long>(), names = new List<string>() };

                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get employee application dashboard", ex);
            }
        }

        public async Task<ResultDashboard> DashboardGetCountUserApplications(DateTime date_start, DateTime date_end, string user_id)
        {
            try
            {
                var sql = @"
            select 
concat(e.last_name, ' ', e.first_name, ' ', e.second_name) as name,
count(a.id) as count
from application a
inner join ""User"" u on u.id = a.created_by
inner join employee e on e.user_id = u.""userId""
         LEFT JOIN service s ON a.service_id = s.id
         LEFT JOIN workflow_task_template wtt ON wtt.workflow_id = s.workflow_id
         LEFT JOIN org_structure os ON wtt.structure_id = os.id
         LEFT JOIN employee_in_structure ON os.id = employee_in_structure.structure_id
         LEFT JOIN employee e2 ON employee_in_structure.employee_id = e2.id
where a.registration_date > @date_start and a.registration_date < @date_end and e2.user_id = @user_id
group by concat(e.last_name, ' ', e.first_name, ' ', e.second_name)
order by count desc";

                var model = await _dbConnection.QueryAsync<ServiceCount>(sql,
                    new { date_start, date_end, user_id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException("No data found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long>(), names = new List<string>() };

                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get employee application dashboard", ex);
            }
        }

        public async Task<List<ArchObjectLeaflet>> GetApplicationsWithCoords(DateTime date_start, DateTime date_end, int service_id, string status_code, int tag_id)
        {
            try
            {
                var sql = @"
select
	app.id app_id,
	obj.xcoordinate,
	obj.ycoordinate,
	s.name service_name,
	obj.name,
	obj.address,
	obj.description,
	app.registration_date,
    app.work_description,
    app.number,
    c.full_name customer,
    string_agg(tag.name, ', ') tags,
    st.name status
from
application app
left join arch_object obj on obj.id = app.arch_object_id
left join service s on s.id = app.service_id
left join application_status st on st.id = app.status_id
left join customer c on c.id = app.customer_id
left join arch_object_tag aot on aot.id_object = obj.id
left join tag on tag.id = aot.id_tag

where obj.xcoordinate is not null and obj.ycoordinate is not null
and  app.registration_date > @date_start and app.registration_date < @date_end
";

                if (service_id != 0)
                {
                    sql += @"
and s.id = @service_id";
                }
                if (status_code != "" && status_code != null)
                {
                    sql += @"
and st.code = @status_code";
                }
                if (tag_id != 0)
                {
                    sql += @"
and exists (
      select 1
      from arch_object_tag aot_sub
      join tag t_sub on t_sub.id = aot_sub.id_tag
      where aot_sub.id_object = obj.id
        and t_sub.id = @tag_id
  )

";
                }


                sql += @"
group by app.id, obj.id, s.id, st.id, c.id
order by app.id desc";
                var model = await _dbConnection.QueryAsync<ArchObjectLeaflet>(sql, new { date_end, date_start, service_id, status_code, tag_id }, transaction: _dbTransaction);
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


        public async Task<List<ArchObjectLeaflet>> GetApplicationsWithCoordsByStructures(DateTime date_start, DateTime date_end, int service_id, string status_code, int tag_id, List<int> structure_ids)
        {
            try
            {
                var sql = @"
select
	app.id app_id,
	obj.xcoordinate,
	obj.ycoordinate,
	s.name service_name,
	obj.name,
	obj.address,
	obj.description,
	app.registration_date,
    app.work_description,
    app.number,
    c.full_name customer,
    string_agg(tag.name, ', ') tags,
    st.name status
from
application app
left join arch_object obj on obj.id = app.arch_object_id
left join service s on s.id = app.service_id
left join application_status st on st.id = app.status_id
left join customer c on c.id = app.customer_id
left join arch_object_tag aot on aot.id_object = obj.id
left join tag on tag.id = aot.id_tag
left join application_task task on task.application_id = app.id

where obj.xcoordinate is not null and obj.ycoordinate is not null
and  app.registration_date > @date_start and app.registration_date < @date_end
";

                if (service_id != 0)
                {
                    sql += @"
and s.id = @service_id";
                }
                if (status_code != "" && status_code != null)
                {
                    sql += @"
and st.code = @status_code";
                }
                if (structure_ids.Count > 0)
                {
                    sql += @"
and task.structure_id in (" + string.Join(", ", structure_ids) + ")"; ;
                }
                if (tag_id != 0)
                {
                    sql += @"
and exists (
      select 1
      from arch_object_tag aot_sub
      join tag t_sub on t_sub.id = aot_sub.id_tag
      where aot_sub.id_object = obj.id
        and t_sub.id = @tag_id
  )

";
                }


                sql += @"
group by app.id, obj.id, s.id, st.id, c.id
order by app.id desc";
                var model = await _dbConnection.QueryAsync<ArchObjectLeaflet>(sql, new { date_end, date_start, service_id, status_code, tag_id }, transaction: _dbTransaction);
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
        public async Task<ResultDashboard> DashboardGetCountObjects(int district_id)
        {
            try
            {
                var sql = @"
select coalesce(t.name, 'Без статуса') name, count(ao) count from arch_object ao
left join arch_object_tag aot on ao.id = aot.id_object
right join tag t on aot.id_tag = t.id
where @district_id = 0 or ao.district_id = @district_id
group by t.id
order by count desc
";
                var model = await _dbConnection.QueryAsync<ServiceCount>(sql, new { district_id },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }        
        
        public async Task<ResultDashboard> DashboardGetCountObjectsMyStructure(int district_id, string user_id)
        {
            try
            {
                var sql = @"
select coalesce(t.name, 'Без статуса') name, count(ao) count from arch_object ao
left join arch_object_tag aot on ao.id = aot.id_object
right join tag t on aot.id_tag = t.id
         LEFT JOIN application a ON ao.id = a.arch_object_id
         LEFT JOIN service s ON a.service_id = s.id
         LEFT JOIN workflow_task_template wtt ON wtt.workflow_id = s.workflow_id
         LEFT JOIN org_structure os ON wtt.structure_id = os.id
         LEFT JOIN employee_in_structure ON os.id = employee_in_structure.structure_id
         LEFT JOIN employee e ON employee_in_structure.employee_id = e.id
where (@district_id = 0 or ao.district_id = @district_id) AND e.user_id = @user_id
group by t.id
order by count desc
";
                var model = await _dbConnection.QueryAsync<ServiceCount>(sql, new { district_id, user_id },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<ResultDashboard> GetApplicationCountHour(DateTime date_start, DateTime date_end)
        {
            try
            {
                var sql = @"SELECT

                                    row_number() OVER (ORDER BY h.hour) AS row_number,
                                    h.hour AS name,
                                    COALESCE(subquery.count, 0) AS count
                        FROM
                            (SELECT generate_series(8, 18) AS hour) AS h
                                LEFT JOIN
                            (
                                SELECT
                                    EXTRACT(hour FROM registration_date) AS hour,
                                    COUNT(app) AS count
                                FROM
                                    application app
                                WHERE
                                    EXTRACT(hour FROM registration_date) BETWEEN 8 AND 18 
                                          and registration_date > @date_start
                                          and registration_date < @date_end
                                GROUP BY
                                    hour
                            ) AS subquery ON h.hour = subquery.hour
                        ORDER BY
                            row_number;";
                var model = await _dbConnection.QueryAsync<ServiceCount>(sql, new { date_end, date_start },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }
        
        public async Task<ResultDashboard> GetApplicationCountHour(DateTime date_start, DateTime date_end, string user_id)
        {
            try
            {
                var sql = @"SELECT

                                    row_number() OVER (ORDER BY h.hour) AS row_number,
                                    h.hour AS name,
                                    COALESCE(subquery.count, 0) AS count
                        FROM
                            (SELECT generate_series(8, 18) AS hour) AS h
                                LEFT JOIN
                            (
                                SELECT
                                    EXTRACT(hour FROM registration_date) AS hour,
                                    COUNT(app) AS count
                                FROM
                                    application app
                                 LEFT JOIN service s ON app.service_id = s.id
         LEFT JOIN workflow_task_template wtt ON wtt.workflow_id = s.workflow_id
         LEFT JOIN org_structure os ON wtt.structure_id = os.id
         LEFT JOIN employee_in_structure ON os.id = employee_in_structure.structure_id
         LEFT JOIN employee e ON employee_in_structure.employee_id = e.id
                                WHERE
                                    EXTRACT(hour FROM registration_date) BETWEEN 8 AND 18 
                                          and registration_date > @date_start
                                          and registration_date < @date_end
                                    AND e.user_id = @user_id
                                GROUP BY
                                    hour
                            ) AS subquery ON h.hour = subquery.hour
                        ORDER BY
                            row_number;";
                var model = await _dbConnection.QueryAsync<ServiceCount>(sql, new { date_end, date_start, user_id },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<ResultDashboard> GetApplicationCountWeek(DateTime date_start, DateTime date_end)
        {
            try
            {
                var sql = @"SELECT
                            row_number() over (order by (w.weekday)) AS row_number,
                            case (w.weekday)
                                when 1 then 'Понедельник'
                                when 2 then 'Вторник'
                                when 3 then 'Среда'
                                when 4 then 'Четверг'
                                when 5 then 'Пятница'
                                end                                                          as name,
                            COALESCE(subquery.count, 0) AS count
                FROM
                    (SELECT generate_series(1, 5) AS weekday) AS w
                        LEFT JOIN
                    (select row_number() over (order by extract(dow from registration_date)) AS row_number,
                            EXTRACT(dow from registration_date)                                 weekday,
                            count(app)                                                          count
                     from application app
                     where EXTRACT(dow from registration_date) between 1 and 5
                                    and registration_date > @date_start
                                     and registration_date < @date_end
                     group by EXTRACT(dow from registration_date)
                     order by row_number) AS subquery ON w.weekday = subquery.weekday
                ORDER BY
                    row_number;";
                var model = await _dbConnection.QueryAsync<ServiceCount>(sql, new { date_end, date_start },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }        
        
        public async Task<ResultDashboard> GetApplicationCountWeek(DateTime date_start, DateTime date_end, string user_id)
        {
            try
            {
                var sql = @"SELECT
                            row_number() over (order by (w.weekday)) AS row_number,
                            case (w.weekday)
                                when 1 then 'Понедельник'
                                when 2 then 'Вторник'
                                when 3 then 'Среда'
                                when 4 then 'Четверг'
                                when 5 then 'Пятница'
                                end                                                          as name,
                            COALESCE(subquery.count, 0) AS count
                FROM
                    (SELECT generate_series(1, 5) AS weekday) AS w
                        LEFT JOIN
                    (select row_number() over (order by extract(dow from registration_date)) AS row_number,
                            EXTRACT(dow from registration_date)                                 weekday,
                            count(app)                                                          count
                     from application app
                                                 LEFT JOIN service s ON app.service_id = s.id
         LEFT JOIN workflow_task_template wtt ON wtt.workflow_id = s.workflow_id
         LEFT JOIN org_structure os ON wtt.structure_id = os.id
         LEFT JOIN employee_in_structure ON os.id = employee_in_structure.structure_id
         LEFT JOIN employee e ON employee_in_structure.employee_id = e.id
                     where EXTRACT(dow from registration_date) between 1 and 5
                                    and registration_date > @date_start
                                     and registration_date < @date_end
                                                    AND e.user_id = @user_id
                     group by EXTRACT(dow from registration_date)
                     order by row_number) AS subquery ON w.weekday = subquery.weekday
                ORDER BY
                    row_number;";
                var model = await _dbConnection.QueryAsync<ServiceCount>(sql, new { date_end, date_start, user_id },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }

        public async Task<ResultDashboard> GetArchiveCount(DateTime date_start, DateTime date_end)
        {
            try
            {
                var sql = @"SELECT count(al.*), alg.name  FROM public.archive_log al
inner join archive_log_status alg on alg.id = al.status_id
where al.created_at > @date_start and al.created_at < @date_end
group by alg.name";
                var model = await _dbConnection.QueryAsync<ServiceCount>(sql, new { date_end, date_start },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }
        
        public async Task<ResultDashboard> GetArchiveCount(DateTime date_start, DateTime date_end, string user_id)
        {
            try
            {
                var sql = @"SELECT count(al.*), alg.name  FROM public.archive_log al
inner join archive_log_status alg on alg.id = al.status_id
         LEFT JOIN employee_in_structure ON al.take_structure_id = employee_in_structure.structure_id
         LEFT JOIN employee e ON employee_in_structure.employee_id = e.id
where al.created_at > @date_start and al.created_at < @date_end AND e.user_id = @user_id
group by alg.name";
                var model = await _dbConnection.QueryAsync<ServiceCount>(sql, new { date_end, date_start, user_id },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }

                var services = model.ToList();
                var res = new ResultDashboard { counts = new List<long> { }, names = new List<string> { } };
                services.ForEach(x =>
                {
                    res.names.Add(x.name);
                    res.counts.Add(x.count);
                });


                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }


        public async Task<List<ChartTableDataDashboardStructure>> DashboardGetCountTaskByStructure(DateTime date_start, DateTime date_end)
        {
            try
            {
                var sql = @"
select 
os.name structure, at.structure_id, count(distinct at.id) as count
from application_task at
left join application a on a.id = at.application_id
left join org_structure os on os.id = at.structure_id
left join application_task_assignee ata on ata.application_task_id = at.id
inner join employee_in_structure eis on eis.id = ata.structure_employee_id
inner join employee e on e.id = eis.employee_id
where at.created_at >= @date_start and at.created_at <= @date_end
group by 1, 2
order by 3 desc
";
                var model = await _dbConnection.QueryAsync<ChartTableDataDashboardStructure>(sql, new { date_end, date_start },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }
                var res = model.ToList();

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Apps", ex);
            }
        }        
        
        public async Task<List<ChartTableDataDashboardStructure>> DashboardGetCountBySelectedStructure(DateTime date_start, DateTime date_end, int structure_id)
        {
            try
            {
                var sql = @"

select concat(e.last_name, ' ', e.first_name, ' (',sp.name,')') as employee, e.id as employee_id, count(distinct at.id) as count
from application_task at
left join application a on a.id = at.application_id
left join org_structure os on os.id = at.structure_id
left join application_task_assignee ata on ata.application_task_id = at.id
inner join employee_in_structure eis on eis.id = ata.structure_employee_id
inner join employee e on e.id = eis.employee_id
left join structure_post sp on sp.id = eis.post_id
where at.created_at >= @date_start and at.created_at <= @date_end
and at.structure_id = @structure_id
group by 1, 2
order by 3 desc

";
                var model = await _dbConnection.QueryAsync<ChartTableDataDashboardStructure>(sql, new { date_end, date_start, structure_id },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }
                var res = model.ToList();

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Apps", ex);
            }
        }
        public async Task<List<ChartTableDataDashboardStructure>> DashboardGetRefucalCountByStructure(DateTime date_start, DateTime date_end)
        {
            try
            {
                var sql = @"
select 
os.name structure, at.structure_id, count(distinct at.id)
from application_task at
left join application a on a.id = at.application_id
left join application_status a1 on a1.id = a.status_id
left join org_structure os on os.id = at.structure_id
left join application_task_assignee ata on ata.application_task_id = at.id
inner join employee_in_structure eis on eis.id = ata.structure_employee_id
inner join employee e on e.id = eis.employee_id
left join structure_post sp on sp.id = eis.post_id
where at.created_at >= @date_start and at.created_at <= @date_end
and a.deadline < now() and a1.code in (
'refusal_issued',
'refusal_ready',
'refusal_sent',
'rejection_ready'
) 
group by 1, 2
order by 3 desc
";
                var model = await _dbConnection.QueryAsync<ChartTableDataDashboardStructure>(sql, new { date_end, date_start },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }
                var res = model.ToList();

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Apps", ex);
            }
        }

        public async Task<List<ChartTableDataDashboardStructure>> DashboardGetRefucalCountBySelectedStructure(DateTime date_start, DateTime date_end, int structure_id)
        {
            try
            {
                var sql = @"
select 
concat(e.last_name, ' ', e.first_name, ' (',sp.name,')') as employee, e.id as employee_id, count(at.id)
from application_task at
left join application a on a.id = at.application_id
left join application_status a1 on a1.id = a.status_id
left join org_structure os on os.id = at.structure_id
left join application_task_assignee ata on ata.application_task_id = at.id
inner join employee_in_structure eis on eis.id = ata.structure_employee_id
inner join employee e on e.id = eis.employee_id
left join structure_post sp on sp.id = eis.post_id
where at.created_at >= @date_start and at.created_at <= @date_end
and at.structure_id = @structure_id
and a.deadline < now() and a1.code in (
'refusal_issued',
'refusal_ready',
'refusal_sent',
'rejection_ready'
) 
group by 1, 2
order by 3 desc
";
                var model = await _dbConnection.QueryAsync<ChartTableDataDashboardStructure>(sql, new { date_end, date_start, structure_id },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }
                var res = model.ToList();

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Apps", ex);
            }
        }
        public async Task<List<ChartTableDataDashboardStructure>> DashboardGetCountLateByStructure(DateTime date_start, DateTime date_end)
        {
            try
            {
                var sql = @"
SELECT 
    os.name AS structure, 
    os.id AS structure_id,
    COUNT(DISTINCT CASE 
        WHEN CURRENT_DATE - a.deadline BETWEEN INTERVAL '1 day' AND INTERVAL '3 days' 
        THEN a.id 
    END) AS days3,
    COUNT(DISTINCT CASE 
        WHEN CURRENT_DATE - a.deadline BETWEEN INTERVAL '4 days' AND INTERVAL '7 days' 
        THEN a.id 
    END) AS days7,
    COUNT(DISTINCT CASE 
        WHEN CURRENT_DATE - a.deadline > INTERVAL '7 days' 
        THEN a.id 
    END) AS days_more,
    COUNT(DISTINCT a.id) AS count
FROM application a
LEFT JOIN application_status a1 ON a1.id = a.status_id
LEFT JOIN service s ON s.id = a.service_id
LEFT JOIN workflow w ON w.id = s.workflow_id
LEFT JOIN workflow_task_template wtt ON wtt.workflow_id = w.id
LEFT JOIN org_structure os ON os.id = wtt.structure_id
WHERE a.registration_date >= @date_start 
    AND a.registration_date <= @date_end
    AND a.deadline::date < CURRENT_DATE
    AND a1.code IN (
        'review',
        'executor_assignment',
        'preparation',
        'return_to_eo',
        'ready_for_eo',
        'rejection_ready'
    ) 
GROUP BY 1, 2
ORDER BY 6 DESC

";
                var model = await _dbConnection.QueryAsync<ChartTableDataDashboardStructure>(sql, new { date_end, date_start },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }
                var res = model.ToList();

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Apps", ex);
            }
        }       
        
        public async Task<List<ChartTableDataDashboardStructure>> DashboardGetCountLateBySelectedStructure(DateTime date_start, DateTime date_end, int structure_id)
        {
            try
            {
                var sql = @"
SELECT 
    CONCAT(e.last_name, ' ', e.first_name, ' (', sp.name, ')') AS employee, 
    e.id AS employee_id,
    COUNT(DISTINCT CASE 
        WHEN CURRENT_DATE - a.deadline BETWEEN INTERVAL '1 day' AND INTERVAL '3 days' 
        THEN a.id 
    END) AS days3,
    COUNT(DISTINCT CASE 
        WHEN CURRENT_DATE - a.deadline BETWEEN INTERVAL '4 days' AND INTERVAL '7 days' 
        THEN a.id 
    END) AS days7,
    COUNT(DISTINCT CASE 
        WHEN CURRENT_DATE - a.deadline > INTERVAL '7 days' 
        THEN a.id 
    END) AS days_more,
    COUNT(DISTINCT a.id) AS count
FROM application a
LEFT JOIN application_status a1 ON a1.id = a.status_id
LEFT JOIN service s ON s.id = a.service_id
LEFT JOIN workflow w ON w.id = s.workflow_id
LEFT JOIN workflow_task_template wtt ON wtt.workflow_id = w.id
LEFT JOIN org_structure os ON os.id = wtt.structure_id
LEFT JOIN application_task at ON at.application_id = a.id
LEFT JOIN application_task_assignee ata ON ata.application_task_id = at.id
LEFT JOIN employee_in_structure eis ON eis.id = ata.structure_employee_id
LEFT JOIN employee e ON e.id = eis.employee_id
LEFT JOIN structure_post sp ON sp.id = eis.post_id
WHERE a.registration_date >= @date_start and a.registration_date <= @date_end
    AND a.deadline::date < CURRENT_DATE
	and os.id = @structure_id
    AND a1.code IN (
        'review',
        'executor_assignment',
        'preparation',
        'return_to_eo',
        'ready_for_eo'
    ) 
GROUP BY 1, 2
ORDER BY 6 DESC
";
                var model = await _dbConnection.QueryAsync<ChartTableDataDashboardStructure>(sql, new { date_end, date_start, structure_id },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }
                var res = model.ToList();

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Apps", ex);
            }
        }

        public async Task<List<ChartTableDataDashboard>> DashboardGetIssuedAppsRegister(DateTime date_start, DateTime date_end)
        {
            try
            {
                var sql = @"
with last_status_changes as (
    select
        his.application_id,
        concat(e.last_name, ' ', e.first_name, ' ', e.second_name) as employee_name,
        e.id as employee_id,
        his.date_change,
        row_number() over (
            partition by his.application_id
            order by his.date_change desc
        ) as rn
    from application_status_history his
    left join application_status st on st.id = his.status_id
    left join ""User"" u on u.id = his.user_id
    left join employee e on u.""userId"" = e.user_id
    where st.code = 'document_issued' 
      and his.user_id is not null
      and his.date_change > @date_start and his.date_change < @date_end 
)
select 
    count(distinct lsc.application_id) as count,
    lsc.employee_name register,
    lsc.employee_id
from last_status_changes lsc
where lsc.rn = 1
group by lsc.employee_name, lsc.employee_id
order by count desc;
";
                var model = await _dbConnection.QueryAsync<ChartTableDataDashboard>(sql, new { date_end, date_start },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }
                var res = model.ToList();

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Apps", ex);
            }
        }
        public async Task<List<ChartTableDataDashboard>> DashboardGetEmployeesToDutyPlan(DateTime date_start, DateTime date_end)
        {
            try
            {
                var sql = @"
select count(proc.id), concat(e.last_name, ' ', e.first_name, ' ', e.second_name) register, e.id employee_id from architecture_process proc
    join ""User"" u on u.id = proc.created_by
    join employee e on u.""userId"" = e.user_id
           and proc.created_at > @date_start and proc.created_at < @date_end
group by e.id
";
                var model = await _dbConnection.QueryAsync<ChartTableDataDashboard>(sql, new { date_end, date_start },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }
                var res = model.ToList();

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Apps", ex);
            }
        }
        public async Task<List<ChartTableDataDashboard>> DashboardGetAppsFromRegister(DateTime date_start, DateTime date_end)
        {
            try
            {
                var sql = @"
select count(app), concat(e.last_name, ' ', e.first_name, ' ', e.second_name) as register, e.id employee_id from application app
    left join application_status st on app.status_id = st.id
    left join ""User"" u on u.id = app.created_by
    left join employee e on u.""userId"" = e.user_id
    where app.registration_date > @date_start and app.registration_date < @date_end and st.code != 'deleted'
group by e.id
order by count desc
";
                var model = await _dbConnection.QueryAsync<ChartTableDataDashboard>(sql, new { date_end, date_start },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }
                var res = model.ToList();

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Apps", ex);
            }
        }
        public async Task<AppCountDashboradData> GetAppCountDashboardByStructure(DateTime date_start, DateTime date_end, int structure_id)
        {
            try
            {
                var sql = @"
with apps as (
        select task.application_id from application_task task
    left join org_structure org on org.id = task.structure_id
    where task.structure_id = @structure_id
    group by  task.application_id
)
select
    count(app.id) all_count,
       sum(case when td.code = 'accepted' then 1 else 0 end) tech_accepted_count,
       sum(case when td.code = 'declined' then 1 else 0 end) tech_declined_count,
       sum(case when st.code = 'done' then 1 else 0 end) done_count,
       sum(case when st.code in ('draft', 'service_requests', 'preparation') then 1 else 0 end) at_work_count
from apps
left join application app on apps.application_id = app.id
left join tech_decision td on td.id = app.tech_decision_id
left join application_status st on st.id = app.status_id
           where app.registration_date > @date_start and app.registration_date < @date_end
";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<AppCountDashboradData>(sql, new { date_end, date_start, structure_id },
                    transaction: _dbTransaction);
                if (model == null)
                {
                    throw new RepositoryException($"Service not found.", null);
                }
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Apps", ex);
            }
        }

        public async Task<object> GetApplicationsCategoryCount(DateTime date_start, DateTime date_end,
            int? district_id, bool? is_paid)
        {
            try
            {
                var sql = @"SELECT ROW_NUMBER() OVER (ORDER BY s.name) AS id,
    s.name,
    COUNT(DISTINCT CASE 
        WHEN a2.code IN ('done', 'document_ready', 'ready_for_ppo', 'document_issued') 
        THEN a.id 
    END) AS completed,
    COUNT(DISTINCT CASE 
        WHEN a2.code IN ('refusal_ready', 'refusal_issued') 
        THEN a.id 
    END) AS refusal,
    COUNT(DISTINCT CASE 
        WHEN a2.code IN (
            'review',
            'executor_assignment',
            'preparation',
            'return_to_eo',
            'ready_for_eo',
            'rejection_ready'
        ) 
        THEN a.id 
    END) AS in_work,
    COUNT(DISTINCT CASE 
        WHEN a2.code IN (
            'done',
            'document_ready',
            'ready_for_ppo',
            'document_issued',
            'refusal_ready',
            'refusal_issued',
            'review',
            'executor_assignment',
            'preparation',
            'return_to_eo',
            'ready_for_eo',
            'rejection_ready'
        ) 
        THEN a.id 
    END) AS all_count
FROM application a
    LEFT JOIN service s ON a.service_id = s.id
    LEFT JOIN application_status a2 ON a.status_id = a2.id
    LEFT JOIN arch_object ao ON a.arch_object_id = ao.id
    LEFT JOIN district d ON ao.district_id = d.id
WHERE a.created_at BETWEEN @date_start AND @date_end
 ";
                
                if (district_id.HasValue && district_id != 0)
                {
                    sql += " AND d.id = @district_id";
    }

                if (is_paid.HasValue)
                {
                    sql += " AND a.is_paid = @is_paid";
                }
                
                sql += @" GROUP BY s.name ORDER BY s.name;";
                
                var items = await _dbConnection.QueryAsync<object>(sql, new { date_start, date_end, district_id, is_paid }, transaction: _dbTransaction);

                return items;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application category count.", ex);
            }
        }
        
        public async Task<object> GetApplicationsCategoryCountForMyStructure(DateTime date_start, DateTime date_end, int? district_id, bool? is_paid, string user_id, List<int> ids)
        {
            try
            {
                var sql = @"SELECT ROW_NUMBER() OVER (ORDER BY s.name) AS id,
                                   s.name,
                            COUNT(CASE WHEN a2.code in ('done',
'document_ready',
'ready_for_ppo',
'ready_for_eo',
'document_issued') THEN 1 END) AS completed,
                            COUNT(CASE WHEN a2.code IN (
'refusal_ready',
'rejection_ready',
'refusal_issued'
) THEN 1 END) AS refusal,


                            COUNT(CASE WHEN a2.code IN (
'review',
'executor_assignment',
'preparation',
'refusal_issued',
'return_to_eo'
) THEN 1 END) AS in_work,
                            COUNT(a.id) AS all_count
                            FROM application a
                                     LEFT JOIN service s ON a.service_id = s.id
                                     LEFT JOIN application_status a2 ON a.status_id = a2.id
                                     LEFT JOIN arch_object ao ON a.arch_object_id = ao.id
                                     LEFT JOIN district d on ao.district_id = d.id
                            WHERE a.status_id != 14 and a.created_at BETWEEN @date_start AND @date_end and a.service_id = ANY(@ids) ";
                
                if (district_id.HasValue && district_id != 0)
                {
                    sql += " AND d.id = @district_id";
    }

                if (is_paid.HasValue)
                {
                    sql += " AND a.is_paid = @is_paid";
                }
                
                sql += @" GROUP BY s.name ORDER BY s.name;";
                
                var items = await _dbConnection.QueryAsync<object>(sql, new { date_start, date_end, district_id, is_paid, user_id, ids }, transaction: _dbTransaction);

                return items;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application category count.", ex);
            }
        }
    }
}