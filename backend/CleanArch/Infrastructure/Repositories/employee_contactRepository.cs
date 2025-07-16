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
    public class employee_contactRepository : Iemployee_contactRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public employee_contactRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<employee_contact>> GetAll()
        {
            try
            {
                var sql = "SELECT t1.*, t2.name as type_name, t2.code as type_code FROM \"employee_contact\" t1 inner join contact_type t2 on t1.type_id = t2.id";
                var models = await _dbConnection.QueryAsync<employee_contact>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get employee_contact", ex);
            }
        }

        public async Task<int> Add(employee_contact domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new employee_contactModel
                {
                    
                    id = domain.id,
                    value = domain.value,
                    employee_id = domain.employee_id,
                    type_id = domain.type_id,
                    allow_notification = domain.allow_notification,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO \"employee_contact\"(\"value\", \"employee_id\", type_id, \"allow_notification\", created_at, updated_at, created_by, updated_by) " +
                    "VALUES (@value, @employee_id, @type_id, @allow_notification, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add employee_contact", ex);
            }
        }

        public async Task Update(employee_contact domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new employee_contactModel
                {
                    
                    id = domain.id,
                    value = domain.value,
                    employee_id = domain.employee_id,
                    type_id = domain.type_id,
                    allow_notification = domain.allow_notification,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE \"employee_contact\" SET \"id\" = @id, \"value\" = @value, type_id = @type_id, \"employee_id\" = @employee_id, \"allow_notification\" = @allow_notification, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update employee_contact", ex);
            }
        }

        
        public async Task<PaginatedList<employee_contact>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"employee_contact\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<employee_contact>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"employee_contact\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<employee_contact>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get employee_contacts", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"employee_contact\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update employee_contact", ex);
            }
        }
        public async Task<employee_contact> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"employee_contact\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<employee_contact>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get employee_contact", ex);
            }
        }

        public async Task<List<employee_contact>> GetContactsByEmployeeId(int employee_id)
        {
            try
            {
                var sql = "SELECT t1.*, t2.name as type_name, t2.code as type_code FROM \"employee_contact\" t1 inner join contact_type t2 on t1.type_id = t2.id WHERE t1.employee_id = @employee_id";
                //var sql = "SELECT empc.*, typec.code type_code FROM \"employee_contact\" empc left join contact_type typec on typec.id = empc.type_id WHERE \"employee_id\" = @employee_id";
                var models = await _dbConnection.QueryAsync<employee_contact>(sql, new { employee_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get employee_contact", ex);
            }
        }

    }
}
