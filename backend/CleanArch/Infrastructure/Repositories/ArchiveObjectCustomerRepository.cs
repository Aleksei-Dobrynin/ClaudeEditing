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
    public class ArchiveObjectCustomerRepository : IArchiveObjectCustomerRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;
        private IDbConnection dbConnection;
        private IUserRepository? userRepository;

        public ArchiveObjectCustomerRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }
        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }
        public async Task<List<ArchiveObjectCustomer>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"archive_object_customer\"";
                var models = await _dbConnection.QueryAsync<ArchiveObjectCustomer>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_object_customer", ex);
            }
        }

        public async Task<int> Add(ArchiveObjectCustomer domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchiveObjectCustomer
                {
                    id = domain.id,
                    archive_object_id = domain.archive_object_id,
                    customer_id = domain.customer_id,
                    description = domain.description,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO \"archive_object_customer\"(\"archive_object_id\",\"customer_id\", \"description\", created_at, created_by, updated_at, updated_by) " +
                    "VALUES (@archive_object_id, @customer_id, @description, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add archive_object_customer", ex);
            }
        }

        public async Task Update(ArchiveObjectCustomer domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchiveObjectCustomer
                {

                    id = domain.id,
                    archive_object_id = domain.archive_object_id,
                    customer_id = domain.customer_id,
                    description = domain.description,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE \"archive_object_customer\" SET \"id\" = @id, \"archive_object_id\" = @archive_object_id, \"customer_id\" = @customer_id, \"description\" = @description, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update archive_object_customer", ex);
            }
        }

        public async Task<PaginatedList<ArchiveObjectCustomer>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"archive_object_customer\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ArchiveObjectCustomer>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"archive_object_customer\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ArchiveObjectCustomer>(domainItems, totalItems, pageNumber, pageSize);
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
                var sql = "DELETE FROM \"archive_object_customer\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update archive_object_customer", ex);
            }
        }
        public async Task<ArchiveObjectCustomer> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"archive_object_customer\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<ArchiveObjectCustomer>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_object_customer", ex);
            }
        }
        
        public async Task<List<ArchiveObjectCustomer>> GetByArchiveObjectId(int archiveObjectId)
        {
            try
            {
                var sql = @"SELECT * FROM archive_object_customer WHERE archive_object_id = @ArchiveObjectId LIMIT 1";
                var models = await _dbConnection.QueryAsync<ArchiveObjectCustomer>(sql, new { ArchiveObjectId = archiveObjectId }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_object_customer", ex);
            }
        }
    }
}
