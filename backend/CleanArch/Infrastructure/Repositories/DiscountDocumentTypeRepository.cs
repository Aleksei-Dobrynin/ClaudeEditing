using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class DiscountDocumentTypeRepository : IDiscountDocumentTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public DiscountDocumentTypeRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<DiscountDocumentType>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, code, description, created_at, updated_at, created_by, updated_by FROM discount_document_type";
                var models = await _dbConnection.QueryAsync<DiscountDocumentType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DiscountDocumentType", ex);
            }
        }

        public async Task<DiscountDocumentType> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, code, description, created_at, updated_at, created_by, updated_by FROM discount_document_type WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<DiscountDocumentType>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"DiscountDocumentType with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DiscountDocumentType", ex);
            }
        }

        public async Task<int> Add(DiscountDocumentType domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO discount_document_type (name, code, description, created_by, created_at, updated_at) 
                            VALUES (@name, @code, @description, @created_by, @created_at, @updated_at) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add DiscountDocumentType", ex);
            }
        }

        public async Task Update(DiscountDocumentType domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE discount_document_type SET name = @name, code = @code, description = @description, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update DiscountDocumentType", ex);
            }
        }

        public async Task<PaginatedList<DiscountDocumentType>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM discount_document_type OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<DiscountDocumentType>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM discount_document_type";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<DiscountDocumentType>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DiscountDocumentType", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM discount_document_type WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("DiscountDocumentType not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete DiscountDocumentType", ex);
            }
        }
    }
}
