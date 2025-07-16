using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class JournalTemplateTypeRepository : IJournalTemplateTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public JournalTemplateTypeRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<JournalTemplateType>> GetAll()
        {
            try
            {
                var sql = @"SELECT jtt.id, jtt.code, jtt.name, jtt.raw_value, jtt.placeholder_id, 
                            jtt.created_at, jtt.updated_at, jtt.created_by, jtt.updated_by, jtt.example, 
                            SPHT.name as placeholder_name
                            FROM journal_template_type jtt
                            LEFT JOIN ""S_PlaceHolderTemplate"" SPHT on jtt.placeholder_id = SPHT.id";
                var models = await _dbConnection.QueryAsync<JournalTemplateType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get JournalTemplateType", ex);
            }
        }

        public async Task<JournalTemplateType> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, code, name, raw_value, placeholder_id, created_at, updated_at, created_by, updated_by, example FROM journal_template_type WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<JournalTemplateType>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"JournalTemplateType with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get JournalTemplateType", ex);
            }
        }

        public async Task<int> Add(JournalTemplateType domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO journal_template_type (code, name, raw_value, placeholder_id, created_at, updated_at, created_by, updated_by, example) 
                            VALUES (@code, @name, @raw_value, @placeholder_id, @created_at, @updated_at, @created_by, @updated_by, @example) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add JournalTemplateType", ex);
            }
        }

        public async Task Update(JournalTemplateType domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE journal_template_type SET code = @code, name = @name, raw_value = @raw_value, placeholder_id = @placeholder_id, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by, example = @example WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update JournalTemplateType", ex);
            }
        }

        public async Task<PaginatedList<JournalTemplateType>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM journal_template_type OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<JournalTemplateType>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM journal_template_type";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<JournalTemplateType>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get JournalTemplateType", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM journal_template_type WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("JournalTemplateType not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete JournalTemplateType", ex);
            }
        }
    }
}
