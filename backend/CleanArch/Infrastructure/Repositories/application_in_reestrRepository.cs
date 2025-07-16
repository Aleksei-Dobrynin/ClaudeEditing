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
    public class application_in_reestrRepository : Iapplication_in_reestrRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public application_in_reestrRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<application_in_reestr>> GetAll()
        {
            try
            {
                var sql = $"""SELECT air.*, reestr.name reestr_name, st.code reestr_status_code, st.name reestr_status_name FROM application_in_reestr air left join reestr on reestr.id = air.reestr_id left join reestr_status st on reestr.status_id = st.id """;
                var models = await _dbConnection.QueryAsync<application_in_reestr>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_in_reestr", ex);
            }
        }

        public async Task<List<application_in_reestr>> GetByApplicationIds(int[] ids)
        {
            try
            {
                var sql = @"SELECT air.*, reestr.name reestr_name, st.code reestr_status_code, st.name reestr_status_name 
FROM application_in_reestr air 
left join reestr on reestr.id = air.reestr_id 
left join reestr_status st on reestr.status_id = st.id 
where air.application_id = ANY(@ids)
";
                var models = await _dbConnection.QueryAsync<application_in_reestr>(sql, new { ids = ids }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_in_reestr", ex);
            }
        }

        public async Task<int> Add(application_in_reestr domain)
        {
            try
            {
                var model = new application_in_reestrModel
                {

                    id = domain.id,
                    reestr_id = domain.reestr_id,
                    application_id = domain.application_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"INSERT INTO ""application_in_reestr""(""reestr_id"", ""application_id"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@reestr_id, @application_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_in_reestr", ex);
            }
        }

        public async Task Update(application_in_reestr domain)
        {
            try
            {
                var model = new application_in_reestrModel
                {

                    id = domain.id,
                    reestr_id = domain.reestr_id,
                    application_id = domain.application_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"UPDATE ""application_in_reestr"" SET ""id"" = @id, ""reestr_id"" = @reestr_id, ""application_id"" = @application_id, ""updated_at"" = @updated_at, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_in_reestr", ex);
            }
        }

        public async Task<PaginatedList<application_in_reestr>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_in_reestr"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<application_in_reestr>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""application_in_reestr""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<application_in_reestr>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_in_reestrs", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""application_in_reestr"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_in_reestr", ex);
            }
        }
        public async Task<application_in_reestr> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_in_reestr"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<application_in_reestr>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_in_reestr", ex);
            }
        }


        public async Task<List<application_in_reestr>> GetByreestr_id(int reestr_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_in_reestr\" WHERE \"reestr_id\" = @reestr_id";
                var models = await _dbConnection.QueryAsync<application_in_reestr>(sql, new { reestr_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_in_reestr", ex);
            }
        }
        public async Task<List<application_in_reestr>> GetByAppId(int application_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_in_reestr\" WHERE \"application_id\" = @application_id";
                var models = await _dbConnection.QueryAsync<application_in_reestr>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_in_reestr", ex);
            }
        }
        public async Task<List<ReestrOtchetApplicationData>> GetByreestr_idWithApplication(int reestr_id)
        {
            try
            {
                var sql = """

SELECT app.id, app.old_sum, app.total_sum, app.discount_percentage, app.discount_value, app.number, st.code as status_code, c.is_organization, c.full_name customer, concat(ao.address, ', ', dis.name) arch_object   FROM application_in_reestr air
    left join application app on air.application_id = app.id
    left join application_status st on st.id = app.status_id
    left join customer c on app.customer_id = c.id
    left join arch_object ao on app.arch_object_id = ao.id
    left join district dis on ao.district_id = dis.id
WHERE reestr_id = @reestr_id and app.id is not null
order by air.id
""";
                var models = await _dbConnection.QueryAsync<ReestrOtchetApplicationData>(sql, new { reestr_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_in_reestr", ex);
            }
        }

        public async Task<List<ReestrOtchetApplicationData>> GetSvodnaya(int year, int month, string status)
        {
            try
            {
                var sql = """

SELECT app.id, app.old_sum, app.total_sum, app.discount_percentage, app.discount_value, app.number, st.code as status_code, c.is_organization, c.full_name customer, concat(ao.address, ', ', dis.name) arch_object 
FROM application app 
    inner join application_in_reestr air on air.application_id = app.id
    left join reestr r on r.id = air.reestr_id
    left join application_status st on st.id = app.status_id
    left join customer c on app.customer_id = c.id
    left join arch_object ao on app.arch_object_id = ao.id
    left join district dis on ao.district_id = dis.id
WHERE r.year = @year and r.month = @month and air.id is not null
""";
                //TODO
                if (status == "done")
                {
                    sql += @"
    and r.status_id = 2
";
                }

                sql += " order by air.id";

                var models = await _dbConnection.QueryAsync<ReestrOtchetApplicationData>(sql, new { year, month }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_in_reestr", ex);
            }
        }


        public async Task<List<TaxOtchetData>> GetTaxReport(int year, int month, string status)
        {
            try
            {
                var sql = @"

WITH tax_data AS (
   select 
app.id,
c.is_organization,
os.order_number,
os.short_name,
sum(round(api.sum::numeric,2)), 
round(ceil(sum(round(api.sum::numeric, 2)) * 100 * 12 / 114) / 100, 2) AS nds_value,
round(ceil(sum(round(api.sum::numeric, 2)) * 100 * 2 / 114) / 100, 2) AS nsp_value
from application app
left join customer c on c.id = app.customer_id
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

              sql += @"
group by 1,2,3,4
),
nds_summary AS (
    SELECT 
        coalesce(sum(CASE WHEN is_organization = true THEN nds_value ELSE 0 END), 0) as fiz_summa,
        coalesce(sum(CASE WHEN is_organization = false THEN nds_value ELSE 0 END), 0) as your_summa,
        coalesce(sum(nds_value), 0) as all_summa
    FROM tax_data
),
nsp_summary AS (
    SELECT 
        coalesce(sum(CASE WHEN is_organization = true THEN nsp_value ELSE 0 END), 0) as fiz_summa,
        coalesce(sum(CASE WHEN is_organization = false THEN nsp_value ELSE 0 END), 0) as your_summa,
        coalesce(sum(nsp_value), 0) as all_summa
    FROM tax_data
)

SELECT 
    'nds' as tax_name,
    fiz_summa,
    your_summa,
    all_summa
FROM nds_summary

UNION ALL

SELECT 
    'nsp' as tax_name,
    fiz_summa,
    your_summa,
    all_summa
FROM nsp_summary
";

                var models = await _dbConnection.QueryAsync<TaxOtchetData>(sql, new { year, month }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_in_reestr", ex);
            }
        }


    }
}
