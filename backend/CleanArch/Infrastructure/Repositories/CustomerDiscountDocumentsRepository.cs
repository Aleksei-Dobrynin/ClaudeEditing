using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class CustomerDiscountDocumentsRepository : ICustomerDiscountDocumentsRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public CustomerDiscountDocumentsRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<CustomerDiscountDocuments>> GetAll()
        {
            try
            {
                var sql = "SELECT id, customer_discount_id, discount_documents_id FROM customer_discount_documents";
                var models = await _dbConnection.QueryAsync<CustomerDiscountDocuments>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomerDiscountDocuments", ex);
            }
        } 
        
        public async Task<List<CustomerDiscountDocuments>> GetByIdCustomer(int idCustomer)
        {
            try
            {
                var sql = @"SELECT cdd.id, 
                                   cdd.customer_discount_id, 
                                   cdd.discount_documents_id, 
                                   ds.start_date, 
                                   ds.end_date, 
                                   ds.discount, 
                                   f.name as file_name,
                                   dt.name as discount_type_name,
                                   ddt.name as discount_document_name                                  
                            FROM customer_discount_documents cdd 
                            LEFT JOIN discount_documents ds ON cdd.discount_documents_id = ds.id
                            LEFT JOIN file f ON ds.file_id = f.id
                            LEFT JOIN discount_type dt ON ds.discount_type_id = dt.id
                            LEFT JOIN discount_document_type ddt ON ds.document_type_id = ddt.id
                            WHERE cdd.customer_discount_id = @idCustomer";
                var models = await _dbConnection.QueryAsync<CustomerDiscountDocuments>(sql, new { idCustomer = idCustomer },  transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomerDiscountDocuments", ex);
            }
        }

        public async Task<CustomerDiscountDocuments> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT id, customer_discount_id, discount_documents_id FROM customer_discount_documents WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<CustomerDiscountDocuments>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"CustomerDiscountDocuments with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomerDiscountDocuments", ex);
            }
        }

        public async Task<int> Add(CustomerDiscountDocuments domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO customer_discount_documents (customer_discount_id, discount_documents_id) 
                            VALUES (@customer_discount_id, @discount_documents_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add CustomerDiscountDocuments", ex);
            }
        }

        public async Task Update(CustomerDiscountDocuments domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE customer_discount_documents SET customer_discount_id = @customer_discount_id, discount_documents_id = @discount_documents_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update CustomerDiscountDocuments", ex);
            }
        }

        public async Task<PaginatedList<CustomerDiscountDocuments>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM customer_discount_documents OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<CustomerDiscountDocuments>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM customer_discount_documents";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<CustomerDiscountDocuments>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomerDiscountDocuments", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM customer_discount_documents WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("CustomerDiscountDocuments not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete CustomerDiscountDocuments", ex);
            }
        }
    }
}
