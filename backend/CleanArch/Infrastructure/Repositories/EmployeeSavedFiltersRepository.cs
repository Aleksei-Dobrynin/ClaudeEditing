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
    public class EmployeeSavedFiltersRepository : IEmployeeSavedFiltersRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public EmployeeSavedFiltersRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<EmployeeSavedFilters>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM employee_saved_filters";
                var models = await _dbConnection.QueryAsync<EmployeeSavedFilters>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeSavedFilters", ex);
            }
        }

        public async Task<EmployeeSavedFilters> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT * FROM employee_saved_filters WHERE id = @Id LIMIT 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<EmployeeSavedFilters>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"EmployeeSavedFilters with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeSavedFilters", ex);
            }
        }

        public async Task<List<EmployeeSavedFilters>> GetByEmployeeId(int employeeId)
        {
            try
            {
                var sql = @"SELECT * FROM employee_saved_filters 
                           WHERE employee_id = @EmployeeId 
                           ORDER BY is_default DESC, filter_name ASC";
                var models = await _dbConnection.QueryAsync<EmployeeSavedFilters>(sql, new { EmployeeId = employeeId }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeSavedFilters by employee_id", ex);
            }
        }

        public async Task<int> Add(EmployeeSavedFilters domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new EmployeeSavedFilters
                {
                    employee_id = domain.employee_id,
                    filter_name = domain.filter_name,
                    is_default = domain.is_default,
                    is_active = domain.is_active,
                    page_size = domain.page_size,
                    page_number = domain.page_number,
                    sort_by = domain.sort_by,
                    sort_type = domain.sort_type,
                    pin = domain.pin,
                    customer_name = domain.customer_name,
                    common_filter = domain.common_filter,
                    address = domain.address,
                    number = domain.number,
                    incoming_numbers = domain.incoming_numbers,
                    outgoing_numbers = domain.outgoing_numbers,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    dashboard_date_start = domain.dashboard_date_start,
                    dashboard_date_end = domain.dashboard_date_end,
                    service_ids = domain.service_ids,           // Passed as-is; SQL will handle empty string → NULL
                    status_ids = domain.status_ids,
                    structure_ids = domain.structure_ids,
                    app_ids = domain.app_ids,
                    district_id = domain.district_id,
                    tag_id = domain.tag_id,
                    filter_employee_id = domain.filter_employee_id,
                    journals_id = domain.journals_id,
                    employee_arch_id = domain.employee_arch_id,
                    issued_employee_id = domain.issued_employee_id,
                    tunduk_district_id = domain.tunduk_district_id,
                    tunduk_address_unit_id = domain.tunduk_address_unit_id,
                    tunduk_street_id = domain.tunduk_street_id,
                    deadline_day = domain.deadline_day,
                    total_sum_from = domain.total_sum_from,
                    total_sum_to = domain.total_sum_to,
                    total_payed_from = domain.total_payed_from,
                    total_payed_to = domain.total_payed_to,
                    is_expired = domain.is_expired,
                    is_my_org_application = domain.is_my_org_application,
                    without_assigned_employee = domain.without_assigned_employee,
                    use_common = domain.use_common,
                    only_count = domain.only_count,
                    is_journal = domain.is_journal,
                    is_paid = domain.is_paid,
                    updated_at = DateTime.Now,
                    last_used_at = domain.last_used_at,
                    usage_count = domain.usage_count ?? 0
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO employee_saved_filters(
                       employee_id, filter_name, is_default, is_active, page_size, page_number, 
                       sort_by, sort_type, pin, customer_name, common_filter, address, number, 
                       incoming_numbers, outgoing_numbers, date_start, date_end, 
                       dashboard_date_start, dashboard_date_end, service_ids, status_ids, 
                       structure_ids, app_ids, district_id, tag_id, filter_employee_id, 
                       journals_id, employee_arch_id, issued_employee_id, tunduk_district_id, 
                       tunduk_address_unit_id, tunduk_street_id, deadline_day, total_sum_from, 
                       total_sum_to, total_payed_from, total_payed_to, is_expired, 
                       is_my_org_application, without_assigned_employee, use_common, 
                       only_count, is_journal, is_paid, created_at, updated_at, 
                       last_used_at, usage_count) 
                   VALUES (
                       @employee_id, @filter_name, @is_default, @is_active, @page_size, @page_number, 
                       @sort_by, @sort_type, @pin, @customer_name, @common_filter, @address, @number, 
                       @incoming_numbers, @outgoing_numbers, @date_start, @date_end, 
                       @dashboard_date_start, @dashboard_date_end, 
                       NULLIF(@service_ids, '')::jsonb, 
                       NULLIF(@status_ids, '')::jsonb, 
                       NULLIF(@structure_ids, '')::jsonb, 
                       NULLIF(@app_ids, '')::jsonb, 
                       @district_id, @tag_id, @filter_employee_id, 
                       @journals_id, @employee_arch_id, @issued_employee_id, @tunduk_district_id, 
                       @tunduk_address_unit_id, @tunduk_street_id, @deadline_day, @total_sum_from, 
                       @total_sum_to, @total_payed_from, @total_payed_to, @is_expired, 
                       @is_my_org_application, @without_assigned_employee, @use_common, 
                       @only_count, @is_journal, @is_paid, @created_at, @updated_at, 
                       @last_used_at, @usage_count) 
                   RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add EmployeeSavedFilters", ex);
            }
        }


        public async Task Update(EmployeeSavedFilters domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new EmployeeSavedFilters
                {
                    id = domain.id,
                    employee_id = domain.employee_id,
                    filter_name = domain.filter_name,
                    is_default = domain.is_default,
                    is_active = domain.is_active,
                    page_size = domain.page_size,
                    page_number = domain.page_number,
                    sort_by = domain.sort_by,
                    sort_type = domain.sort_type,
                    pin = domain.pin,
                    customer_name = domain.customer_name,
                    common_filter = domain.common_filter,
                    address = domain.address,
                    number = domain.number,
                    incoming_numbers = domain.incoming_numbers,
                    outgoing_numbers = domain.outgoing_numbers,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    dashboard_date_start = domain.dashboard_date_start,
                    dashboard_date_end = domain.dashboard_date_end,
                    service_ids = domain.service_ids,           // Passed as-is; SQL handles empty → NULL
                    status_ids = domain.status_ids,
                    structure_ids = domain.structure_ids,
                    app_ids = domain.app_ids,
                    district_id = domain.district_id,
                    tag_id = domain.tag_id,
                    filter_employee_id = domain.filter_employee_id,
                    journals_id = domain.journals_id,
                    employee_arch_id = domain.employee_arch_id,
                    issued_employee_id = domain.issued_employee_id,
                    tunduk_district_id = domain.tunduk_district_id,
                    tunduk_address_unit_id = domain.tunduk_address_unit_id,
                    tunduk_street_id = domain.tunduk_street_id,
                    deadline_day = domain.deadline_day,
                    total_sum_from = domain.total_sum_from,
                    total_sum_to = domain.total_sum_to,
                    total_payed_from = domain.total_payed_from,
                    total_payed_to = domain.total_payed_to,
                    is_expired = domain.is_expired,
                    is_my_org_application = domain.is_my_org_application,
                    without_assigned_employee = domain.without_assigned_employee,
                    use_common = domain.use_common,
                    only_count = domain.only_count,
                    is_journal = domain.is_journal,
                    is_paid = domain.is_paid,
                    updated_at = DateTime.Now,
                    last_used_at = domain.last_used_at,
                    usage_count = domain.usage_count
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE employee_saved_filters SET 
                       employee_id = @employee_id,
                       filter_name = @filter_name,
                       is_default = @is_default,
                       is_active = @is_active,
                       page_size = @page_size,
                       page_number = @page_number,
                       sort_by = @sort_by,
                       sort_type = @sort_type,
                       pin = @pin,
                       customer_name = @customer_name,
                       common_filter = @common_filter,
                       address = @address,
                       number = @number,
                       incoming_numbers = @incoming_numbers,
                       outgoing_numbers = @outgoing_numbers,
                       date_start = @date_start,
                       date_end = @date_end,
                       dashboard_date_start = @dashboard_date_start,
                       dashboard_date_end = @dashboard_date_end,
                       service_ids = NULLIF(@service_ids, '')::jsonb,
                       status_ids = NULLIF(@status_ids, '')::jsonb,
                       structure_ids = NULLIF(@structure_ids, '')::jsonb,
                       app_ids = NULLIF(@app_ids, '')::jsonb,
                       district_id = @district_id,
                       tag_id = @tag_id,
                       filter_employee_id = @filter_employee_id,
                       journals_id = @journals_id,
                       employee_arch_id = @employee_arch_id,
                       issued_employee_id = @issued_employee_id,
                       tunduk_district_id = @tunduk_district_id,
                       tunduk_address_unit_id = @tunduk_address_unit_id,
                       tunduk_street_id = @tunduk_street_id,
                       deadline_day = @deadline_day,
                       total_sum_from = @total_sum_from,
                       total_sum_to = @total_sum_to,
                       total_payed_from = @total_payed_from,
                       total_payed_to = @total_payed_to,
                       is_expired = @is_expired,
                       is_my_org_application = @is_my_org_application,
                       without_assigned_employee = @without_assigned_employee,
                       use_common = @use_common,
                       only_count = @only_count,
                       is_journal = @is_journal,
                       is_paid = @is_paid,
                       updated_at = @updated_at,
                       last_used_at = @last_used_at,
                       usage_count = @usage_count
                   WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update EmployeeSavedFilters", ex);
            }
        }

        public async Task<PaginatedList<EmployeeSavedFilters>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM employee_saved_filters OFFSET @pageSize * (@pageNumber - 1) LIMIT @pageSize";
                var models = await _dbConnection.QueryAsync<EmployeeSavedFilters>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM employee_saved_filters";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<EmployeeSavedFilters>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeSavedFilters", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM employee_saved_filters WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("EmployeeSavedFilters not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete EmployeeSavedFilters", ex);
            }
        }
    }
}