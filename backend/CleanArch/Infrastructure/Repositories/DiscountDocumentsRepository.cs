using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class DiscountDocumentsRepository : IDiscountDocumentsRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public DiscountDocumentsRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<DiscountDocuments>> GetAll()
        {
            try
            {
                var sql = @"SELECT dd.id, dd.file_id, dd.description, dd.discount, dd.discount_type_id, 
                                dd.document_type_id, dd.start_date, dd.end_date, 
                                f.name as file_name, 
                                dt.name as discount_type_name, 
                                ddt.name as document_type_name
                            FROM discount_documents dd 
                            LEFT JOIN file f ON dd.file_id = f.id
                            LEFT JOIN discount_type dt ON dd.discount_type_id = dt.id
                            LEFT JOIN discount_document_type ddt ON dd.document_type_id = ddt.id";
                var models = await _dbConnection.QueryAsync<DiscountDocuments>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DiscountDocuments", ex);
            }
        }

        public async Task<DiscountDocuments> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT dd.id, dd.file_id, dd.description, dd.discount, dd.discount_type_id, dd.document_type_id, 
                            dd.start_date, dd.end_date, f.name as file_name FROM discount_documents dd LEFT JOIN file f ON dd.file_id = f.id WHERE dd.id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<DiscountDocuments>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"DiscountDocuments with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DiscountDocuments", ex);
            }
        }

        public async Task<int> Add(DiscountDocuments domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO discount_documents (file_id, description, discount, discount_type_id, document_type_id, start_date, end_date, created_by, created_at, updated_at) 
                            VALUES (@file_id, @description, @discount, @discount_type_id, @document_type_id, @start_date, @end_date, @created_by, @created_at, @updated_at) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add DiscountDocuments", ex);
            }
        }

        public async Task Update(DiscountDocuments domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE discount_documents SET file_id = @file_id, description = @description, discount = @discount, discount_type_id = @discount_type_id, document_type_id = @document_type_id, start_date = @start_date, end_date = @end_date, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update DiscountDocuments", ex);
            }
        }

        public async Task<PaginatedList<DiscountDocuments>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM discount_documents OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<DiscountDocuments>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM discount_documents";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<DiscountDocuments>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DiscountDocuments", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM discount_documents WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("DiscountDocuments not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete DiscountDocuments", ex);
            }
        }
    }
}
