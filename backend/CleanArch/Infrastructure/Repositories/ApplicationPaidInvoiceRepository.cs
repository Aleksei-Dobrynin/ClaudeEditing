using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using static System.Net.Mime.MediaTypeNames;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class ApplicationPaidInvoiceRepository : IApplicationPaidInvoiceRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ApplicationPaidInvoiceRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationPaidInvoice>> GetAll()
        {
            try
            {
                var sql = "SELECT id, date, payment_identifier, sum, bank_identifier, application_id FROM application_paid_invoice";
                var models = await _dbConnection.QueryAsync<ApplicationPaidInvoice>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationPaidInvoice", ex);
            }
        }

        public async Task<ApplicationPaidInvoice> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, date, payment_identifier, sum, bank_identifier, application_id FROM application_paid_invoice WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationPaidInvoice>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationPaidInvoice with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationPaidInvoice", ex);
            }
        }

        public async Task<List<ApplicationPaidInvoice>> GetByIDApplication(int idApplication)
        {
            try
            {
                var sql = "SELECT id, date, payment_identifier, sum, bank_identifier, application_id FROM application_paid_invoice WHERE application_id=@IdApplication";
                var model = await _dbConnection.QueryAsync<ApplicationPaidInvoice>(sql, new { IdApplication = idApplication }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationPaidInvoice with ID Application {idApplication} not found.", null);
                }

                return model.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationPaidInvoice", ex);
            }
        }

        public async Task<List<ApplicationPaidInvoice>> GetOneByApplicationIds(List<int> ids)
        {
            try
            {
                var sql = "SELECT id, date, payment_identifier, sum, bank_identifier, application_id FROM application_paid_invoice WHERE application_id = Any(@ids)";
                var model = await _dbConnection.QueryAsync<ApplicationPaidInvoice>(sql, new { ids = ids.ToArray() }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationPaidInvoice with ID Application not found.", null);
                }

                return model.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationPaidInvoice", ex);
            }
        }

        public async Task<int> Add(ApplicationPaidInvoice domain)
        {
            try
            {
                //var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationPaidInvoice
                {
                    date = domain.date,
                    payment_identifier = domain.payment_identifier,
                    sum = domain.sum,
                    bank_identifier = domain.bank_identifier,
                    application_id = domain.application_id
                };

                //await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO application_paid_invoice(date, payment_identifier, sum, bank_identifier, application_id, created_at, updated_at, created_by, updated_by) VALUES (@date, @payment_identifier, @sum, @bank_identifier, @application_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationPaidInvoice", ex);
            }
        }

        public async Task Update(ApplicationPaidInvoice domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationPaidInvoice
                {
                    id = domain.id,
                    date = domain.date,
                    payment_identifier = domain.payment_identifier,
                    sum = domain.sum,
                    bank_identifier = domain.bank_identifier,
                    application_id = domain.application_id,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE application_paid_invoice SET date = @date, payment_identifier = @payment_identifier, sum = @sum, bank_identifier = @bank_identifier, application_id = @application_id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationPaidInvoice", ex);
            }
        }

        public async Task<PaginatedList<ApplicationPaidInvoice>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM application_paid_invoice OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ApplicationPaidInvoice>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM application_paid_invoice";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ApplicationPaidInvoice>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationPaidInvoice", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM application_paid_invoice WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationPaidInvoice not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationPaidInvoice", ex);
            }
        }

        public async Task<List<ApplicationPaidInvoice>> GetApplicationWithTaxAndDateRange(DateTime startDate, DateTime endDate)
        {
            try
            {
                //var sql = "WITH invoice_data AS (SELECT a.id, a.date, a.payment_identifier, a.sum, a.bank_identifier, a.application_id, a.sum * 0.12 AS tax FROM \"application_paid_invoice\" a WHERE a.application_id = @IdApplication AND a.date BETWEEN @StartDate AND @EndDate::date + interval '1 day' - interval '1 second'),unique_id AS (SELECT COALESCE(MAX(id), 0) + 1 AS new_id FROM \"application_paid_invoice\") SELECT id, date, payment_identifier, sum, tax, application_id FROM invoice_data UNION ALL SELECT u.new_id AS id, NULL AS date, NULL AS payment_identifier, SUM(i.sum) AS total_sum, SUM(i.sum * 0.12) AS total_tax, 1 AS application_id FROM invoice_data i CROSS JOIN unique_id u GROUP BY u.new_id";
                var sql = @"
WITH invoice_data AS (
    SELECT 
        a.id, 
        a.date, 
        a.payment_identifier, 
        a.sum, 
        a.bank_identifier, 
        a.application_id, 
        a.sum * 0.12 AS tax 
    FROM 
        ""application_paid_invoice"" a 
    WHERE 
        a.date BETWEEN @StartDate AND @EndDate::date + interval '1 day' - interval '1 second'
)
SELECT 
    id, 
    date, 
    payment_identifier, 
    sum, 
    tax, 
    application_id 
FROM 
    invoice_data";

                var model = await _dbConnection.QueryAsync<ApplicationPaidInvoice>(
    sql,
    new { StartDate = startDate, EndDate = endDate },
    transaction: _dbTransaction
);


                if (model == null)
                {
                    throw new RepositoryException($"ApplicationPaidInvoice with start date:{startDate}, end date {endDate} not found.", null);
                }

                return model.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationPaidInvoice", ex);
            }
        }

        public async Task<List<ApplicationPaidInvoice>> GetByApplicationGuid(string guid)
        {
            try
            {
                //var sql = "WITH invoice_data AS (SELECT a.id, a.date, a.payment_identifier, a.sum, a.bank_identifier, a.application_id, a.sum * 0.12 AS tax FROM \"application_paid_invoice\" a WHERE a.application_id = @IdApplication AND a.date BETWEEN @StartDate AND @EndDate::date + interval '1 day' - interval '1 second'),unique_id AS (SELECT COALESCE(MAX(id), 0) + 1 AS new_id FROM \"application_paid_invoice\") SELECT id, date, payment_identifier, sum, tax, application_id FROM invoice_data UNION ALL SELECT u.new_id AS id, NULL AS date, NULL AS payment_identifier, SUM(i.sum) AS total_sum, SUM(i.sum * 0.12) AS total_tax, 1 AS application_id FROM invoice_data i CROSS JOIN unique_id u GROUP BY u.new_id";
                var sql = @"
select inv.* from application_paid_invoice inv
left join application app on app.id = inv.application_id
where app.app_cabinet_uuid = @guid
";

                var model = await _dbConnection.QueryAsync<ApplicationPaidInvoice>(
    sql,
    new { guid },
    transaction: _dbTransaction
);
                return model.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationPaidInvoice by app guid", ex);
            }
        }

        public async Task<List<PaidInvoiceInfo>> GetPaidInvoices(DateTime dateStart, DateTime dateEnd, string? number, int[]? structures_ids)
        {
            try
            {
                var sql = @"SELECT
    api.id,
    api.date AS invoice_date,
    a.number AS application_number,
    a.id AS application_id,
    COALESCE(api.sum, 0) AS invoice_sum,
    api.payment_identifier,
    c.full_name AS customer_name,
    ao.address AS object_address,
    s.name AS service_name,
    payments.payments_by_structure AS payments_structure,
    COALESCE(payments.payments_sum, 0) AS payments_sum,
    COALESCE(paid_invoices.paid_sum, 0) AS paid_sum
FROM application_paid_invoice api
         LEFT JOIN application a ON api.application_id = a.id
         LEFT JOIN customer c ON a.customer_id = c.id
         LEFT JOIN arch_object ao ON a.arch_object_id = ao.id
         LEFT JOIN service s ON a.service_id = s.id
         LEFT JOIN LATERAL (
    SELECT
        coalesce(json_agg(
                json_build_object(
                        'structure_name', COALESCE(org.short_name, org.name),
                        'sum', COALESCE(ap2.sum, 0)
                )
        ), '[]'::json) AS payments_by_structure,
        SUM(COALESCE(ap2.sum, 0)) AS payments_sum
    FROM application_payment ap2
             LEFT JOIN org_structure org ON org.id = ap2.structure_id
    WHERE ap2.application_id = a.id";
                ;

                if (structures_ids != null && structures_ids.Length > 0)
                {
                    sql += " AND ap2.structure_id = ANY(@StructuresIds)";
                }

                sql += @") payments ON TRUE
         LEFT JOIN LATERAL (
    SELECT SUM(COALESCE(api2.sum, 0)) AS paid_sum
    FROM application_paid_invoice api2
    WHERE api2.application_id = a.id
    ) paid_invoices ON TRUE
WHERE a.id IS NOT NULL ";

                var parameters = new DynamicParameters();

                sql += " AND (api.date::date >= @dateStart::date and api.date::date <= @dateEnd::date)";
                parameters.Add("dateStart", dateStart);
                parameters.Add("dateEnd", dateEnd);

                if (!string.IsNullOrWhiteSpace(number))
                {
                    sql += " AND (@Number IS NULL OR a.number ILIKE '%' || @Number || '%')";
                    parameters.Add("Number", number);
                }

                if (structures_ids != null && structures_ids.Length > 0)
                {
                    parameters.Add("StructuresIds", structures_ids);
                }

                sql += " ORDER BY api.date DESC, a.number";

                parameters.Add("Number", number);

                var models = await _dbConnection.QueryAsync<PaidInvoiceInfo>(sql, parameters, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationPaidInvoice", ex);
            }
        }
    }

}
