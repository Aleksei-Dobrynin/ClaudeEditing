using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class CustomerDiscountRepository : ICustomerDiscountRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public CustomerDiscountRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<CustomerDiscount>> GetAll()
        {
            try
            {
                var sql = "SELECT id, pin_customer, description, created_at, updated_at, created_by, updated_by FROM customer_discount";
                var models = await _dbConnection.QueryAsync<CustomerDiscount>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomerDiscount", ex);
            }
        }

        public async Task<CustomerDiscount> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, pin_customer, description, created_at, updated_at, created_by, updated_by FROM customer_discount WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<CustomerDiscount>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"CustomerDiscount with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomerDiscount", ex);
            }
        }
        
        public async Task<CustomerDiscount> GetOneByPin(string pin)
        {
            try
            {
                var sql = @"SELECT cd.id,
                                   cd.pin_customer,
                                   cd.description,
                                   count(cdd.id) as active_discount_count
                            FROM customer_discount cd
                            LEFT JOIN customer_discount_documents cdd ON cd.id = cdd.customer_discount_id
                            LEFT JOIN discount_documents dd ON cdd.discount_documents_id = dd.id
                            WHERE pin_customer=@Pin AND dd.start_date < NOW() AND dd.end_date > NOW()
                            GROUP BY cd.id, cd.pin_customer, cd.description";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<CustomerDiscount>(sql, new { Pin = pin }, transaction: _dbTransaction);

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomerDiscount", ex);
            }
        }

        public async Task<int> Add(CustomerDiscount domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO customer_discount (pin_customer, description, created_by, created_at, updated_at) 
                            VALUES (@pin_customer, @description, @created_by, @created_at, @updated_at) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add CustomerDiscount", ex);
            }
        }

        public async Task Update(CustomerDiscount domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE customer_discount SET pin_customer = @pin_customer, description = @description, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update CustomerDiscount", ex);
            }
        }

        public async Task<PaginatedList<CustomerDiscount>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM customer_discount OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<CustomerDiscount>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM customer_discount";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<CustomerDiscount>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomerDiscount", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM customer_discount WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("CustomerDiscount not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete CustomerDiscount", ex);
            }
        }
    }
}
