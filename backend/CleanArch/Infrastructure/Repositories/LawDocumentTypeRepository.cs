using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class LawDocumentTypeRepository : ILawDocumentTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public LawDocumentTypeRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<LawDocumentType>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, description, code, name_kg, description_kg, created_at, updated_at, created_by, updated_by FROM law_document_type";
                var models = await _dbConnection.QueryAsync<LawDocumentType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get LawDocumentType", ex);
            }
        }

        public async Task<LawDocumentType> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, description, code, name_kg, description_kg, created_at, updated_at, created_by, updated_by FROM law_document_type WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<LawDocumentType>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"LawDocumentType with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get LawDocumentType", ex);
            }
        }

        public async Task<int> Add(LawDocumentType domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO law_document_type (name, description, code, name_kg, description_kg, created_at, updated_at, created_by, updated_by) 
                            VALUES (@name, @description, @code, @name_kg, @description_kg, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add LawDocumentType", ex);
            }
        }

        public async Task Update(LawDocumentType domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE law_document_type SET name = @name, description = @description, code = @code, name_kg = @name_kg, description_kg = @description_kg, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update LawDocumentType", ex);
            }
        }

        public async Task<PaginatedList<LawDocumentType>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM law_document_type OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<LawDocumentType>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM law_document_type";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<LawDocumentType>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get LawDocumentType", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM law_document_type WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("LawDocumentType not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete LawDocumentType", ex);
            }
        }
    }
}
