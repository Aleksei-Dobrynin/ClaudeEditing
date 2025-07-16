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
    public class CustomerRepresentativeRepository : ICustomerRepresentativeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public CustomerRepresentativeRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<CustomerRepresentative>> GetAll()
        {
            try
            {
                var sql = "SELECT id, customer_id, last_name, first_name, date_document, second_name, date_start, date_end, notary_number, requisites, created_at, is_included_to_agreement, pin, contact FROM customer_representative";
                var models = await _dbConnection.QueryAsync<CustomerRepresentative>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomerRepresentative", ex);
            }
        }

        public async Task<CustomerRepresentative> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, customer_id, last_name, first_name, date_document, second_name, date_start, date_end, notary_number, requisites, created_at, is_included_to_agreement, pin, contact FROM customer_representative WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<CustomerRepresentative>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"CustomerRepresentative with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomerRepresentative", ex);
            }
        }
        
        public async Task<List<CustomerRepresentative>> GetByidCustomer(int idCustomer)
        {
            try
            {
                var sql = "SELECT id, customer_id, last_name, first_name, date_document, second_name, date_start, date_end, notary_number, requisites, created_at, is_included_to_agreement, pin, contact FROM customer_representative WHERE customer_id = @IdCustomer";
                var models = await _dbConnection.QueryAsync<CustomerRepresentative>(sql, new { IdCustomer = idCustomer }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomerRepresentative", ex);
            }
        }

        public async Task<int> Add(CustomerRepresentative domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new CustomerRepresentative
                {
                    customer_id = domain.customer_id,
                    last_name = domain.last_name,
                    first_name = domain.first_name,
                    second_name = domain.second_name,
                    date_start = domain.date_start,
                    pin = domain.pin,
                    contact = domain.contact,
                    date_end = domain.date_end,
                    notary_number = domain.notary_number,
                    requisites = domain.requisites,
                    date_document = domain.date_document,
                    is_included_to_agreement = domain.is_included_to_agreement
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO customer_representative(customer_id, last_name, first_name, second_name, date_start, date_end, notary_number, requisites, created_at, created_by, updated_at, updated_by, is_included_to_agreement, pin, contact, date_document) 
                            VALUES (@customer_id, @last_name, @first_name, @second_name, @date_start, @date_end, @notary_number, @requisites, @created_at, @created_by, @updated_at, @updated_by, @is_included_to_agreement, @pin, @contact, @date_document) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add CustomerRepresentative", ex);
            }
        }

        public async Task Update(CustomerRepresentative domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new CustomerRepresentative
                {
                    id = domain.id,
                    customer_id = domain.customer_id,
                    last_name = domain.last_name,
                    first_name = domain.first_name,
                    second_name = domain.second_name,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    pin = domain.pin,
                    contact = domain.contact,
                    notary_number = domain.notary_number,
                    requisites = domain.requisites,
                    date_document = domain.date_document,
                    is_included_to_agreement = domain.is_included_to_agreement
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE customer_representative SET customer_id = @customer_id, last_name = @last_name, 
                                    first_name = @first_name, second_name = @second_name, date_start = @date_start, 
                                    date_end = @date_end, notary_number = @notary_number, requisites = @requisites, date_document = @date_document, 
                                    updated_at = @updated_at, updated_by = @updated_by, is_included_to_agreement = @is_included_to_agreement, pin = @pin, contact = @contact WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update CustomerRepresentative", ex);
            }
        }

        public async Task<PaginatedList<CustomerRepresentative>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM customer_representative OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<CustomerRepresentative>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM customer_representative";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<CustomerRepresentative>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomerRepresentative", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM customer_representative WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("CustomerRepresentative not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete CustomerRepresentative", ex);
            }
        }
    }
}
