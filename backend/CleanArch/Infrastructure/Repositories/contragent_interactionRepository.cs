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
    public class contragent_interactionRepository : Icontragent_interactionRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public contragent_interactionRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<contragent_interaction>> GetAll()
        {
            try
            {
                var sql = @"SELECT 
 ci.*, c.full_name as customer_name, ao.address as object_address,
 cc.value as customer_contact
FROM contragent_interaction ci
left join application a on a.id = ci.application_id
left join customer c on a.customer_id = c.id
left join arch_object ao on a.arch_object_id = ao.id
left join customer_contact cc on cc.customer_id = c.id ";
                var models = await _dbConnection.QueryAsync<contragent_interaction>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent_interaction", ex);
            }
        }

        public async Task<int> Add(contragent_interaction domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new contragent_interactionModel
                {
                    id = domain.id,
                    application_id = domain.application_id,
                    task_id = domain.task_id,
                    contragent_id = domain.contragent_id,
                    description = domain.description,
                    progress = domain.progress,
                    name = domain.name,
                    status = domain.status,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO ""contragent_interaction""(""updated_by"", ""application_id"", ""task_id"", ""contragent_id"", ""description"", ""progress"", ""name"", ""created_at"", ""updated_at"", ""created_by"", status) 
                VALUES (@updated_by, @application_id, @task_id, @contragent_id, @description, @progress, @name, @created_at, @updated_at, @created_by, @status) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add contragent_interaction", ex);
            }
        }

        public async Task Update(contragent_interaction domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new contragent_interactionModel
                {
                    id = domain.id,
                    application_id = domain.application_id,
                    task_id = domain.task_id,
                    contragent_id = domain.contragent_id,
                    description = domain.description,
                    progress = domain.progress,
                    name = domain.name,
                    status = domain.status,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE ""contragent_interaction"" SET ""id"" = @id, ""updated_by"" = @updated_by, ""application_id"" = @application_id, ""task_id"" = @task_id, ""contragent_id"" = @contragent_id, ""description"" = @description, ""progress"" = @progress, ""name"" = @name, ""updated_at"" = @updated_at, status = @status WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update contragent_interaction", ex);
            }
        }

        public async Task<PaginatedList<contragent_interaction>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""contragent_interaction"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<contragent_interaction>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""contragent_interaction""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<contragent_interaction>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent_interactions", ex);
            }
        }
        public async Task<List<contragent_interaction>> GetFilter(string pin, string address, string number, DateTime? date_start, DateTime? date_end)
        {
            try
            {
                var sql = @"
select con.*, c.full_name as customer_name, ao.address as object_address,
 string_agg(concat(cc.value, '(', t.name, ') '), ', ') as customer_contact from contragent_interaction con
left join application a on con.application_id = a.id
left join customer c on a.customer_id = c.id
left join arch_object ao on a.arch_object_id = ao.id
left join customer_contact cc on cc.customer_id = c.id
left join contact_type t on t.id = cc.type_id
WHERE LOWER(c.pin) like concat('%', @pin, '%') and LOWER(a.number) like concat('%', @number, '%') and LOWER(ao.address) like concat('%', @address, '%')
";

                if (date_start != null)
                {
                    sql += @$"
AND con.created_at >= to_timestamp('{date_start}', 'DD.MM.YYYY HH24:MI:SS')";
                }

                if (date_end != null)
                {
                    sql += @$"
AND con.created_at <= to_timestamp('{date_end}', 'DD.MM.YYYY HH24:MI:SS') ";
                }
                sql += @$"
group by con.id, ao.address, c.full_name
ORDER BY con.created_at desc
";

                var models = await _dbConnection.QueryAsync<contragent_interaction>(sql, new { number, pin, address }, transaction: _dbTransaction);


                var domainItems = models.ToList();

                return domainItems;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent_interactions", ex);
            }
        }
        
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""contragent_interaction"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update contragent_interaction", ex);
            }
        }
        public async Task<contragent_interaction> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT 
 ci.*, c.full_name as customer_name, ao.address as object_address,
 cc.value as customer_contact
FROM contragent_interaction ci
left join application a on a.id = ci.application_id
left join customer c on a.customer_id = c.id
left join arch_object ao on a.arch_object_id = ao.id
left join customer_contact cc on cc.customer_id = c.id
WHERE ci.id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<contragent_interaction>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent_interaction", ex);
            }
        }

        
        public async Task<List<contragent_interaction>> GetByapplication_id(int application_id)
        {
            try
            {
                var sql = "SELECT inter.*, contr.name contragent_name, task.name task_name FROM \"contragent_interaction\" inter left join application_task task on task.id = inter.task_id left join contragent contr on contr.id = inter.contragent_id WHERE inter.\"application_id\" = @application_id";
                var models = await _dbConnection.QueryAsync<contragent_interaction>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent_interaction", ex);
            }
        }
        
        public async Task<List<contragent_interaction>> GetBytask_id(int task_id)
        {
            try
            {
                var sql = "SELECT inter.*, contr.name contragent_name, task.name task_name FROM \"contragent_interaction\" inter left join application_task task on task.id = inter.task_id left join contragent contr on contr.id = inter.contragent_id WHERE inter.task_id = @task_id";
                var models = await _dbConnection.QueryAsync<contragent_interaction>(sql, new { task_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent_interaction", ex);
            }
        }
        
        public async Task<List<contragent_interaction>> GetBycontragent_id(int contragent_id)
        {
            try
            {
                var sql = "SELECT * FROM \"contragent_interaction\" WHERE \"contragent_id\" = @contragent_id";
                var models = await _dbConnection.QueryAsync<contragent_interaction>(sql, new { contragent_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent_interaction", ex);
            }
        }
        
    }
}
