using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class LawDocumentRepository : ILawDocumentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public LawDocumentRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<LawDocument>> GetAll()
        {
            try
            {
                var sql = @"SELECT ld.*, ldt.name as type_name FROM law_document ld LEFT JOIN law_document_type ldt ON ld.type_id = ldt.id";
                var models = await _dbConnection.QueryAsync<LawDocument>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get LawDocument", ex);
            }
        }

        public async Task<LawDocument> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, data, description, type_id, link, name_kg, description_kg, created_at, updated_at, created_by, updated_by FROM law_document WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<LawDocument>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"LawDocument with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get LawDocument", ex);
            }
        }

        public async Task<int> Add(LawDocument domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO law_document (name, data, description, type_id, link, name_kg, description_kg, created_at, updated_at, created_by, updated_by) 
                            VALUES (@name, @data, @description, @type_id, @link, @name_kg, @description_kg, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add LawDocument", ex);
            }
        }

        public async Task Update(LawDocument domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE law_document SET name = @name, data = @data, description = @description, type_id = @type_id, link = @link, name_kg = @name_kg, description_kg = @description_kg, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update LawDocument", ex);
            }
        }

        public async Task<PaginatedList<LawDocument>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM law_document OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<LawDocument>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM law_document";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<LawDocument>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get LawDocument", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM law_document WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("LawDocument not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete LawDocument", ex);
            }
        }
    }
}
