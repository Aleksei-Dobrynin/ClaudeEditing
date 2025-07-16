using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class JournalApplicationRepository : IJournalApplicationRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public JournalApplicationRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<JournalApplication>> GetAll()
        {
            try
            {
                var sql = @"SELECT ja.id, 
                            ja.journal_id, 
                            dj.name as journal_name,
                            ja.application_id, 
                            a.number as application_number,
                            ja.application_status_id, 
                            ast.name as application_status_name,
                            ja.outgoing_number, 
                            ja.created_at, 
                            ja.updated_at, 
                            ja.created_by, 
                            ja.updated_by 
                            FROM journal_application ja 
                            LEFT JOIN document_journals dj ON dj.id = ja.journal_id
                            LEFT JOIN application a ON a.id = ja.application_id
                            LEFT JOIN application_status ast ON ast.id = ja.application_status_id";
                var models = await _dbConnection.QueryAsync<JournalApplication>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get JournalApplication", ex);
            }
        }

        public async Task<JournalApplication> GetOneByID(int id)
        {
            try
            {
                var sql =
                    "SELECT id, journal_id, application_id, application_status_id, outgoing_number, created_at, updated_at, created_by, updated_by FROM journal_application WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<JournalApplication>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"JournalApplication with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get JournalApplication", ex);
            }
        }

        public async Task<int> Add(JournalApplication domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql =
                    @"INSERT INTO journal_application (journal_id, application_id, application_status_id, outgoing_number, created_at, updated_at, created_by, updated_by) 
                            VALUES (@journal_id, @application_id, @application_status_id, @outgoing_number, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add JournalApplication", ex);
            }
        }

        public async Task Update(JournalApplication domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql =
                    "UPDATE journal_application SET journal_id = @journal_id, application_id = @application_id, application_status_id = @application_status_id, outgoing_number = @outgoing_number, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update JournalApplication", ex);
            }
        }

        public async Task<PaginatedList<JournalApplication>> GetPaginated(int pageSize, int pageNumber, string sortBy,
            string sortDir, int journalsId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(sortBy))
                    sortBy = "id";
                if (string.IsNullOrWhiteSpace(sortDir) || (sortDir.ToLower() != "asc" && sortDir.ToLower() != "desc"))
                    sortDir = "ASC";

                var allowedSortColumns = new[]
                {
                    "id", "journal_id", "application_id", "application_status_id", "outgoing_number", "created_at",
                    "updated_at", "created_by", "updated_by"
                };
                if (!allowedSortColumns.Contains(sortBy))
                    sortBy = "id";

                var sql = $@"SELECT ja.id, 
                                   ja.journal_id,
                                   dj.name  as journal_name,
                                   ja.application_id,
                                   a.number as application_number,
                                   a2.name as status_name,
                                   s.name as service_name,
                                   string_agg(DISTINCT obj.address, '; ') as arch_object_address,
                                   cus.full_name as customer_name,
                                   cus.pin as customer_pin,
                                   a.registration_date as registration_date,
                                   a.deadline as deadline,
                                   ja.application_status_id,
                                   ast.name as application_status_name,
                                   ja.outgoing_number,
                                   ja.created_at,
                                   ja.updated_at,
                                   ja.created_by,
                                   ja.updated_by
                            FROM journal_application ja 
                             LEFT JOIN document_journals dj ON dj.id = ja.journal_id
                             LEFT JOIN application a ON a.id = ja.application_id
                             LEFT JOIN application_status a2 ON ja.application_status_id = a2.id
                             LEFT JOIN service s ON a.service_id = s.id
                             LEFT JOIN application_object ao ON ao.application_id = a.id
                             LEFT JOIN arch_object obj ON ao.arch_object_id = obj.id
                             LEFT JOIN customer cus ON cus.id = a.customer_id
                             LEFT JOIN application_status ast ON ast.id = ja.application_status_id
            WHERE ja.journal_id = @journalsId
            GROUP BY ja.id, ja.journal_id, dj.name, ja.application_id, a.number, a2.name, s.name, cus.full_name, a.registration_date, a.deadline, cus.pin, ja.application_status_id, ast.name, ja.outgoing_number, ja.created_at, ja.updated_at, ja.created_by, ja.updated_by 
            ORDER BY ja.{sortBy} {sortDir}
            OFFSET @Offset ROWS LIMIT @Limit";

                var models = await _dbConnection.QueryAsync<JournalApplication>(sql, new
                {
                    journalsId,
                    Offset = pageSize * (pageNumber - 1),
                    Limit = pageSize
                }, transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM journal_application WHERE journal_id = @journalsId";
                var totalItems =
                    await _dbConnection.ExecuteScalarAsync<int>(sqlCount, new { journalsId },
                        transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<JournalApplication>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get JournalApplication", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM journal_application WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("JournalApplication not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete JournalApplication", ex);
            }
        }
    }
}