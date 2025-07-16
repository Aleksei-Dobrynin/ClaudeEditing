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
    public class customer_contactRepository : Icustomer_contactRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public customer_contactRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<customer_contact>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"customer_contact\"";
                var models = await _dbConnection.QueryAsync<customer_contact>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get customer_contact", ex);
            }
        }

        public async Task<int> Add(customer_contact domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new customer_contactModel
                {
                    
                    id = domain.id,
                    value = domain.value,
                    type_id = domain.type_id,
                    customer_id = domain.customer_id,
                    allow_notification = domain.allow_notification,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO \"customer_contact\"(\"value\", \"type_id\", \"customer_id\", \"allow_notification\", \"created_at\", \"updated_at\", \"created_by\", \"updated_by\") " +
                    "VALUES (@value, @type_id, @customer_id, @allow_notification, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add customer_contact", ex);
            }
        }        
        
        public async Task<int> AddTelegram(telegram domain)
        {
            try
            {
                var sql = @"INSERT INTO telegram (username, number, chat_id) 
                    VALUES (@username, @number, @chat_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add customer_contact", ex);
            }
        }

        public async Task<telegram> GetOneTelegram(string chat_id, string number)
        {
            try
            {
                var sql = "SELECT * FROM telegram WHERE chat_id = @chat_id and number = @number LIMIT 1";
                var models = await _dbConnection.QueryAsync<telegram>(sql, new { chat_id, number }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get customer_contact", ex);
            }
        }

        public async Task<List<telegram>> GetTelegramByNumber(string number)
        {
            try
            {
                var sql = "SELECT * FROM telegram WHERE number = @number";
                var models = await _dbConnection.QueryAsync<telegram>(sql, new { number }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get customer_contact", ex);
            }
        }




        public async Task Update(customer_contact domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new customer_contactModel
                {
                    
                    id = domain.id,
                    value = domain.value,
                    type_id = domain.type_id,
                    customer_id = domain.customer_id,
                    allow_notification = domain.allow_notification,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"customer_contact\" SET \"id\" = @id, \"value\" = @value, \"type_id\" = @type_id, \"customer_id\" = @customer_id, \"allow_notification\" = @allow_notification, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update customer_contact", ex);
            }
        }

        public async Task<PaginatedList<customer_contact>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"customer_contact\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<customer_contact>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"customer_contact\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<customer_contact>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get customer_contacts", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"customer_contact\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update customer_contact", ex);
            }
        }
        public async Task<customer_contact> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"customer_contact\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<customer_contact>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get customer_contact", ex);
            }
        }

        
        public async Task<List<customer_contact>> GetBytype_id(int type_id)
        {
            try
            {
                var sql = "SELECT * FROM \"customer_contact\" WHERE \"type_id\" = @type_id";
                var models = await _dbConnection.QueryAsync<customer_contact>(sql, new { type_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get customer_contact", ex);
            }
        }
        
        public async Task<List<customer_contact>> GetBycustomer_id(int customer_id)
        {
            try
            {
                var sql = "SELECT cont.*, typ.name as type_name, typ.code as type_code FROM \"customer_contact\" cont left join contact_type typ on typ.id = cont.type_id WHERE \"customer_id\" = @customer_id";
                var models = await _dbConnection.QueryAsync<customer_contact>(sql, new { customer_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get customer_contact", ex);
            }
        }

        public async Task<List<customer_contact>> GetByNumber(string value)
        {
            try
            {
                var sql = "SELECT * FROM \"customer_contact\" WHERE regexp_replace(\"value\", '[^0-9]', '', 'g') = regexp_replace(@value, '[^0-9]', '', 'g');";
                var models = await _dbConnection.QueryAsync<customer_contact>(sql, new { value }, transaction: _dbTransaction);
                return models?.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get customer_contact", ex);
            }
        }
    }
}
