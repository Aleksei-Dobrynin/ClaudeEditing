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
    public class customers_for_archive_objectRepository : Icustomers_for_archive_objectRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;
        private IDbConnection dbConnection;
        private IUserRepository? userRepository;

        public customers_for_archive_objectRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }
        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }
        public async Task<List<customers_for_archive_object>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"customers_for_archive_object\"";
                var models = await _dbConnection.QueryAsync<customers_for_archive_object>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get customers_for_archive_object", ex);
            }
        }
        

        public async Task<List<customers_objects>> GetCustomersForArchiveObjects()
        {
            try
            {
                var sql = @"SELECT customers_for_archive_object.full_name full_name, dutyplan_object.id obj_id 
                                FROM customers_for_archive_object
                                LEFT JOIN archive_object_customer ON archive_object_customer.customer_id = customers_for_archive_object.id
                                LEFT JOIN dutyplan_object ON dutyplan_object.id = archive_object_customer.archive_object_id
                                WHERE dutyplan_object.id = archive_object_customer.archive_object_id";
                var models = await _dbConnection.QueryAsync<customers_objects>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get customers_for_archive_object", ex);
            }
        }

        public async Task<List<customers_for_archive_object>> GetByCustomersIdArchiveObject(int ArchiveObject_id)
        {
            try
            {
                var sql = @$"
                SELECT * FROM customers_for_archive_object
                LEFT JOIN archive_object_customer arch_obj_customer on arch_obj_customer.customer_id = customers_for_archive_object.id
               
                WHERE arch_obj_customer.archive_object_id = @ArchiveObject_id
                ";

                var models = await _dbConnection.QueryAsync<customers_for_archive_object>(sql, new { ArchiveObject_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get customers_for_archive_object", ex);
            }
        }

        public async Task<int> Add(customers_for_archive_object domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new customers_for_archive_object
                {
                    id = domain.id,
                    full_name = domain.full_name,
                    pin = domain.pin,
                    address = domain.address,
                    is_organization = domain.is_organization,
                    description = domain.description,
                    dp_outgoing_number = domain.dp_outgoing_number
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO \"customers_for_archive_object\"(\"full_name\",\"pin\", \"address\", \"is_organization\", \"description\", \"dp_outgoing_number\", created_at, created_by, updated_at, updated_by) " +
                    "VALUES (@full_name, @pin, @address, @is_organization, @description, @dp_outgoing_number, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add customers_for_archive_object", ex);
            }
        }

        public async Task Update(customers_for_archive_object domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new customers_for_archive_object
                {

                    id = domain.id,
                    full_name = domain.full_name,
                    pin = domain.pin,
                    address = domain.address,
                    is_organization = domain.is_organization,
                    description = domain.description,
                    dp_outgoing_number = domain.dp_outgoing_number
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE \"customers_for_archive_object\" SET \"id\" = @id, \"full_name\" = @full_name, \"pin\" = @pin, \"address\" = @address, \"is_organization\" = @is_organization, \"description\" = @description, \"dp_outgoing_number\" = @dp_outgoing_number, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update customers_for_archive_object", ex);
            }
        }

        public async Task<PaginatedList<customers_for_archive_object>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"customers_for_archive_object\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<customers_for_archive_object>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"customers_for_archive_object\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<customers_for_archive_object>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_object_customer", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"customers_for_archive_object\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update customers_for_archive_object", ex);
            }
        }
        public async Task<customers_for_archive_object> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"customers_for_archive_object\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<customers_for_archive_object>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get customers_for_archive_object", ex);
            }
        }

    }
}

