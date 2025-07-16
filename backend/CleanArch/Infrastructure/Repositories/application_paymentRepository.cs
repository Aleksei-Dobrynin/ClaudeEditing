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
    public class application_paymentRepository : Iapplication_paymentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public application_paymentRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<application_payment>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"application_payment\"";
                var models = await _dbConnection.QueryAsync<application_payment>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_payment", ex);
            }
        }

        public async Task<int> Add(application_payment domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new application_paymentModel
                {
                    
                    id = domain.id,
                    application_id = domain.application_id,
                    description = domain.description,
                    sum = domain.sum,
                    sum_wo_discount = domain.sum_wo_discount,
                    discount_percentage = domain.discount_percentage,
                    discount_value = domain.discount_value,
                    reason = domain.reason,
                    file_id = domain.file_id,
                    nds = domain.nds,
                    nds_value = domain.nds_value,
                    nsp = domain.nsp,
                    nsp_value = domain.nsp_value,
                    head_structure_id = domain.head_structure_id,
                    implementer_id = domain.implementer_id,
                    structure_id = domain.structure_id,
                    created_at = DateTime.Now,
                    created_by = userId,
                };
                var sql = @"INSERT INTO application_payment (
                                 application_id, 
                                 description, 
                                 sum, 
                                 sum_wo_discount, 
                                 discount_percentage, 
                                 discount_value, 
                                 reason,
                                 file_id,
                                 nds,
                                 nds_value,
                                 nsp, 
                                 nsp_value, 
                                 head_structure_id, 
                                 implementer_id,
                                 structure_id, 
                                 created_at, 
                                 updated_at, 
                                 created_by, 
                                 updated_by) " +
                    @"VALUES (@application_id, @description, @sum, @sum_wo_discount, @discount_percentage, @discount_value, 
                                                     @reason, @file_id, @nds, @nds_value, @nsp, @nsp_value, @head_structure_id, @implementer_id,
                                                     @structure_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_payment", ex);
            }
        }

        public async Task Update(application_payment domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new application_paymentModel
                {
                    
                    id = domain.id,
                    application_id = domain.application_id,
                    description = domain.description,
                    sum = domain.sum,
                    sum_wo_discount = domain.sum_wo_discount,
                    discount_percentage = domain.discount_percentage,
                    discount_value = domain.discount_value,
                    reason = domain.reason,
                    file_id = domain.file_id,
                    nds = domain.nds,
                    nds_value = domain.nds_value,
                    nsp = domain.nsp,
                    nsp_value = domain.nsp_value,
                    head_structure_id = domain.head_structure_id,
                    implementer_id = domain.implementer_id,
                    structure_id = domain.structure_id,
                    updated_at = DateTime.Now,
                    updated_by = userId,
                };
                var sql = @"UPDATE application_payment SET id = @id, 
                               application_id = @application_id, 
                               description = @description, 
                               sum = @sum, 
                               sum_wo_discount = @sum_wo_discount, 
                               discount_percentage = @discount_percentage, 
                               discount_value = @discount_value, 
                               reason = @reason, 
                               file_id = @file_id,
                               nds = @nds,
                               nds_value = @nds_value,
                               nsp = @nsp, 
                               nsp_value = @nsp_value, 
                               head_structure_id = @head_structure_id, 
                               implementer_id = @implementer_id,
                               structure_id = @structure_id, 
                               updated_at = @updated_at, 
                               updated_by = @updated_by 
                           WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_payment", ex);
            }
        }

        public async Task<PaginatedList<application_payment>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"application_payment\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<application_payment>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"application_payment\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<application_payment>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_payments", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var setUserQuery = $"SET LOCAL \"bga.current_user\" TO '{_userRepository.GetUserID()}'";
                _dbConnection.Execute(setUserQuery, transaction: _dbTransaction);
                
                var model = new { id = id };
                var sql = "DELETE FROM \"application_payment\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_payment", ex);
            }
        }
        public async Task<application_payment> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT ap.*, f.name as file_name FROM application_payment ap
                            left join file f on f.id = ap.file_id 
                            WHERE ap.id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<application_payment>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_payment", ex);
            }
        }

        
        public async Task<List<application_payment>> GetByapplication_id(int application_id)
        {
            try
            {
                var sql = @"SELECT ap.*, f.name as file_name, f.id as file_id,
                                        CONCAT(eh.last_name, ' ', eh.first_name, ' ', eh.second_name) as head_structure_name, 
                                        CONCAT(ei.last_name, ' ', ei.first_name, ' ', ei.second_name) as implementer_ids_name, 
                                CONCAT(org.name, CASE WHEN org.short_name IS NOT NULL THEN CONCAT(' (', org.short_name, ')') ELSE '' END) AS structure_name, 
                                org.short_name structure_short_name, 
                                CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name, 
                                CONCAT(emp_u.last_name, ' ', emp_u.first_name, ' ', emp_u.second_name) AS updated_by_name,
                                string_agg(
                                  CONCAT(
                                    emp_f.last_name, ' ', emp_f.first_name, ' ', emp_f.second_name,
                                    CASE 
                                      WHEN fs.timestamp IS NOT NULL 
                                      THEN CONCAT('<br/>(', to_char(fs.timestamp, 'DD.MM.YYYY HH24:MI'), ')') 
                                      ELSE '' 
                                    END
                                  ),
                                  '<br/><br/>'
                                ) AS sign_full_name

                                FROM application_payment ap 
                                left join org_structure org on org.id = ap.structure_id 
                                left join file f on f.id = ap.file_id 
                                left join employee eh on eh.id = ap.head_structure_id 
                                left join employee ei on ei.id = ap.implementer_id 
                                left join ""User"" uc on uc.id = ap.created_by 
                                left join employee emp_c on emp_c.user_id = uc.""userId""
                                left join ""User"" uu on uu.id = ap.updated_by 
                                left join employee emp_u on emp_u.user_id = uu.""userId""
								left join file_sign fs on fs.file_id = ap.file_id
								left join ""User"" uf on uf.id = fs.user_id
								left join employee emp_f on emp_f.user_id = uf.""userId""
                                WHERE application_id = @application_id
								group by ap.id, f.id, eh.id, ei.id, org.id, emp_c.id, emp_u.id";
                var models = await _dbConnection.QueryAsync<application_payment>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_payment", ex);
            }
        }

        public async Task<List<DashboardGetEmployeeCalculationsDto>> DashboardGetEmployeeCalculations(int structure_id, DateTime date_start, DateTime date_end, string sort)
        {
            try
            {
                var sql = @"
select
    row_number() over (order by 
        case @sort_column
            when 'employee' then e.last_name
            when 'registration_date' then app.registration_date::text
            else e.last_name
        end) as row_id,
    app.id application_id,
    app.number,
    coalesce(sum(pay.sum), 0) all_sum,
    round(coalesce(sum(pay.sum) - sum(coalesce(pay.nsp_value, 0) + coalesce(pay.nds_value, 0)), 0)::numeric, 2) wo_nalog,
    round(coalesce(sum(coalesce(pay.nds_value, 0) + coalesce(pay.nsp_value, 0)), 0)::numeric, 2) nalog,
    c.full_name customer,
    ao.address,
    concat(e.last_name, ' ', e.first_name, ' ', e.second_name) employee,
    case when app.has_discount then 'Да' else 'Нет' end discount
from application_payment pay
         left join application app on pay.application_id = app.id
         left join employee e on pay.implementer_id = e.id
         left join application_status st on st.id = app.status_id
         left join customer c on app.customer_id = c.id
         left join arch_object ao on ao.id = app.arch_object_id
where st.code = 'done' and pay.created_at between @date_start::date and @date_end::date
  and e.id in (WITH RECURSIVE org_hierarchy AS (
       SELECT id
       FROM org_structure
       WHERE id = @structure_id
       UNION ALL
       SELECT o.id
       FROM org_structure o
                INNER JOIN org_hierarchy oh ON o.parent_id = oh.id)
       SELECT eis.employee_id
       FROM org_hierarchy orgs
                LEFT JOIN employee_in_structure eis on orgs.id = eis.structure_id)
group by e.id, app.id, c.id, ao.id
order by case @sort_column
        when 'employee' then e.last_name
        when 'registration_date' then app.registration_date::text
        else e.last_name
    end;
";
                var model = await _dbConnection.QueryAsync<DashboardGetEmployeeCalculationsDto>(sql, new { structure_id, date_end, date_start, sort_column = sort },
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
        public async Task<List<DashboardGetEmployeeCalculationsGroupedDto>> DashboardGetEmployeeCalculationsGrouped(int structure_id, DateTime date_start, DateTime date_end)
        {
            try
            {
                var sql = @"
select
    row_number() over (order by e.last_name) as row_id,
    count(app.id) app_count,
    coalesce(sum(pay.sum), 0) all_sum,
    round(coalesce(sum(pay.sum) - sum(coalesce(pay.nsp_value, 0) + coalesce(pay.nds_value, 0)), 0)::numeric, 2) wo_nalog,
    round(coalesce(sum(coalesce(pay.nds_value, 0) + coalesce(pay.nsp_value, 0)), 0)::numeric, 2) nalog,
       concat(e.last_name, ' ', e.first_name, ' ', e.second_name) employee
from application_payment pay
         left join application app on pay.application_id = app.id
         left join application_status st on st.id = app.status_id
         left join employee e on pay.implementer_id = e.id
where st.code = 'done' and pay.created_at between @date_start::date and @date_end::date
  and e.id in (WITH RECURSIVE org_hierarchy AS (SELECT id
                                                FROM org_structure
                                                WHERE id = @structure_id
                                                UNION ALL
                                                SELECT o.id
                                                FROM org_structure o
                                                         INNER JOIN org_hierarchy oh ON o.parent_id = oh.id)
               SELECT eis.employee_id
               FROM org_hierarchy orgs
                        LEFT JOIN employee_in_structure eis on orgs.id = eis.structure_id)
group by e.id
order by e.last_name;
";
                var model = await _dbConnection.QueryAsync<DashboardGetEmployeeCalculationsGroupedDto>(sql, new { structure_id, date_end, date_start },
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
        public async Task<List<application_payment>> GetByApplicationIds(List<int> ids)
        {
            try
            {
                var sql = "SELECT ap.*, org.\"name\" structure_name, " +
                                "CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name, " +
                                "CONCAT(emp_u.last_name, ' ', emp_u.first_name, ' ', emp_u.second_name) AS updated_by_name " +
                                "FROM \"application_payment\" ap " +
                                "left join org_structure org on org.id = ap.\"structure_id\" " +
                                "left join \"User\" uc on uc.id = ap.created_by " +
                                "left join employee emp_c on emp_c.user_id = uc.\"userId\" " +
                                "left join \"User\" uu on uu.id = ap.updated_by " +
                                "left join employee emp_u on emp_u.user_id = uu.\"userId\" " +
                                "WHERE \"application_id\" = Any(@ids)";
                var models = await _dbConnection.QueryAsync<application_payment>(sql, new { ids = ids.ToArray() }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_payment", ex);
            }
        }

        public async Task<List<application_payment>> GetBystructure_id(int structure_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_payment\" WHERE \"structure_id\" = @structure_id";
                var models = await _dbConnection.QueryAsync<application_payment>(sql, new { structure_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_payment", ex);
            }
        }

        public async Task<PaginatedList<applacation_payment_sum>> GetPagniatedByParam(DateTime dateStart, DateTime dateEnd, List<int> structure_ids)
        {
            try
            {
                var sql = @"
            SELECT 
                os.id AS id,
                os.name AS structure_name,
                SUM(ap.sum) AS sum
            FROM 
                application_payment ap
            JOIN 
                application a ON ap.application_id = a.id
            JOIN 
                org_structure os ON ap.structure_id = os.id
            WHERE 
                a.registration_date BETWEEN @dateStart AND @dateEnd
                AND ap.structure_id = ANY(@structure_ids)
            GROUP BY 
                os.id, os.name;
        ";

                var result = await _dbConnection.QueryAsync<applacation_payment_sum>(sql, new { dateStart, dateEnd, structure_ids }, transaction: _dbTransaction);

                return new PaginatedList<applacation_payment_sum>(result.ToList(), result.Count(), 1, result.Count());
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get payment sums by departments", ex);
            }
        }
    }
}
