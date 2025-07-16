using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class DocumentJournalsRepository : IDocumentJournalsRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public DocumentJournalsRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<DocumentJournals>> GetAll()
        {
            try
            {
                var sql = @"SELECT dj.id, dj.code, dj.name, dj.number_template, dj.current_number, dj.reset_period, 
                                dj.last_reset, dj.created_at, dj.updated_at, dj.created_by, dj.updated_by, 
                                dj.period_type_id, jpt.name as period_type_name,
								COALESCE(array_agg(st.id) FILTER (WHERE st.id IS NOT NULL), '{}') status_ids, string_agg(st.name, ', ') status_names
                            FROM document_journals dj 
                            LEFT JOIN journal_period_type jpt on dj.period_type_id = jpt.id
                            left join journal_app_status jap on dj.id = jap.journal_id
                            left join application_status st on st.id = jap.status_id
                            group by dj.id, jpt.id

";
                var models = await _dbConnection.QueryAsync<DocumentJournals>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DocumentJournals", ex);
            }
        }

        public async Task<DocumentJournals> GetOneByID(int id)
        {
            try
            {

                var sql = @"
SELECT dj.*,
COALESCE(array_agg(st.id) FILTER (WHERE st.id IS NOT NULL), '{}') status_ids, string_agg(st.name, ', ') status_names
FROM document_journals dj
left join journal_app_status jap on dj.id = jap.journal_id
left join application_status st on st.id = jap.status_id
WHERE dj.id=@Id
group by dj.id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<DocumentJournals>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"DocumentJournals with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DocumentJournals", ex);
            }
        }

        public async Task<int> Add(DocumentJournals domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO document_journals (code, name, number_template, current_number, reset_period, last_reset, created_at, updated_at, created_by, updated_by, period_type_id) 
                            VALUES (@code, @name, @number_template, @current_number, @reset_period, @last_reset, @created_at, @updated_at, @created_by, @updated_by, @period_type_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add DocumentJournals", ex);
            }
        }

        public async Task<int> AddStatus(JournalAppStatus domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO journal_app_status (journal_id, status_id, created_at, updated_at, created_by, updated_by) 
                            VALUES (@journal_id, @status_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add DocumentJournals", ex);
            }
        }

        public async Task Update(DocumentJournals domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = @"UPDATE document_journals SET code = @code, name = @name, number_template = @number_template, 
                            current_number = @current_number, reset_period = @reset_period, last_reset = @last_reset,
                            created_at = @created_at, updated_at = @updated_at, created_by = @created_by, 
                            updated_by = @updated_by, period_type_id = @period_type_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update DocumentJournals", ex);
            }
        }

        public async Task<PaginatedList<DocumentJournals>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM document_journals OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<DocumentJournals>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM document_journals";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<DocumentJournals>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DocumentJournals", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM document_journals WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("DocumentJournals not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete DocumentJournals", ex);
            }
        }
                
        public async Task DeleteStatuses(int id)
        {
            try
            {
                var sql = "DELETE FROM journal_app_status WHERE journal_id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete journal_app_status", ex);
            }
        }
        
        public async Task<List<JournalPeriodType>> GetPeriodTypes()
        {
            try
            {
                var sql = "SELECT id, code, name, created_at, updated_at, created_by, updated_by FROM journal_period_type";
                var models = await _dbConnection.QueryAsync<JournalPeriodType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get JournalPeriodType", ex);
            }
        }
    }
}
