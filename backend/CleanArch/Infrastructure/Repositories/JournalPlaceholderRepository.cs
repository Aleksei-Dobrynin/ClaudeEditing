using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class JournalPlaceholderRepository : IJournalPlaceholderRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public JournalPlaceholderRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<JournalPlaceholder>> GetAll()
        {
            try
            {
                var sql = "SELECT id, order_number, template_id, journal_id, created_at, updated_at, created_by, updated_by FROM journal_placeholder";
                var models = await _dbConnection.QueryAsync<JournalPlaceholder>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get JournalPlaceholder", ex);
            }
        }

        public async Task<JournalPlaceholder> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, order_number, template_id, journal_id, created_at, updated_at, created_by, updated_by FROM journal_placeholder WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<JournalPlaceholder>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"JournalPlaceholder with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get JournalPlaceholder", ex);
            }
        }        
        
        public async Task<List<JournalPlaceholder>> GetByDocumentJournalId(int id)
        {
            try
            {
                var sql = @"SELECT jp.id, jp.order_number, jp.template_id, jp.journal_id, jp.created_at, jp.updated_at, jp.created_by, jp.updated_by, jtt.placeholder_id, jtt.raw_value, jtt.code as template_code
                            FROM journal_placeholder jp
                            LEFT JOIN journal_template_type jtt on jtt.id = jp.template_id
                            WHERE jp.journal_id = @Id";
                var models = await _dbConnection.QueryAsync<JournalPlaceholder>(sql, new { Id = id }, transaction: _dbTransaction);

                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get JournalPlaceholder", ex);
            }
        }

        public async Task<int> Add(JournalPlaceholder domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO journal_placeholder (order_number, template_id, journal_id, created_at, updated_at, created_by, updated_by) 
                            VALUES (@order_number, @template_id, @journal_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add JournalPlaceholder", ex);
            }
        }

        public async Task Update(JournalPlaceholder domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE journal_placeholder SET order_number = @order_number, template_id = @template_id, journal_id = @journal_id, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update JournalPlaceholder", ex);
            }
        }

        public async Task<PaginatedList<JournalPlaceholder>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM journal_placeholder OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<JournalPlaceholder>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM journal_placeholder";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<JournalPlaceholder>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get JournalPlaceholder", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM journal_placeholder WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("JournalPlaceholder not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete JournalPlaceholder", ex);
            }
        }

        public async Task DeleteByDocumentJournalId(int id)
        {
            try
            {
                var sql = "DELETE FROM journal_placeholder WHERE journal_id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete JournalPlaceholder", ex);
            }
        }
    }
}
