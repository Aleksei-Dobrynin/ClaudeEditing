using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class TechCouncilSessionRepository : ITechCouncilSessionRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public TechCouncilSessionRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<TechCouncilSession>> GetAll()
        {
            try
            {
                var sql = @"SELECT tcs.id, tcs.date, tcs.is_active,
                                   tcs.created_at, tcs.created_by, tcs.updated_at, tcs.updated_by,
                                   count(DISTINCT tc.application_id) as count_tech_council_case,
                                   count(tc.application_id) as count_tech_council_department
                            FROM tech_council_session tcs
                                     LEFT JOIN tech_council tc on tcs.id = tc.tech_council_session_id
                            WHERE tcs.is_active = true
                            GROUP BY tcs.id, tcs.date, tcs.is_active, tcs.created_at, tcs.created_by, tcs.updated_at, tcs.updated_by
                            ORDER BY date;";
                var models = await _dbConnection.QueryAsync<TechCouncilSession>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncilSession", ex);
            }
        }        
        
        public async Task<List<TechCouncilSession>> GetArchiveAll()
        {
            try
            {
                var sql = @"SELECT tcs.id, tcs.date, tcs.is_active,
                                   tcs.created_at, tcs.created_by, tcs.updated_at, tcs.updated_by,
                                   count(DISTINCT tc.application_id) as count_tech_council_case,
                                   count(tc.application_id) as count_tech_council_department
                            FROM tech_council_session tcs
                                     LEFT JOIN tech_council tc on tcs.id = tc.tech_council_session_id
                            WHERE tcs.is_active = false
                            GROUP BY tcs.id, tcs.date, tcs.is_active, tcs.created_at, tcs.created_by, tcs.updated_at, tcs.updated_by
                            ORDER BY date;";
                var models = await _dbConnection.QueryAsync<TechCouncilSession>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncilSession", ex);
            }
        }

        public async Task<TechCouncilSession> GetOneByID(int id)
        {
            try
            {
                var sql =
                    "SELECT id, date, is_active, document, created_at, created_by, updated_at, updated_by FROM tech_council_session WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<TechCouncilSession>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"TechCouncilSession with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncilSession", ex);
            }
        }

        public async Task<int> Add(TechCouncilSession domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql =
                    @"INSERT INTO tech_council_session (date, is_active, created_at, created_by, updated_at, updated_by) 
                            VALUES (@date, true, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add TechCouncilSession", ex);
            }
        }

        public async Task Update(TechCouncilSession domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE tech_council_session SET date = @date, created_at = @created_at, created_by = @created_by, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update TechCouncilSession", ex);
            }
        }
        
        public async Task toArchive(TechCouncilSession domain, string? document)
        {
            try
            {
                domain.document = document;
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = @"UPDATE tech_council_session SET 
                                date = @date, 
                                is_active = false, 
                                document = @document, 
                                created_at = @created_at, 
                                created_by = @created_by, 
                                updated_at = @updated_at, 
                                updated_by = @updated_by 
                            WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update TechCouncilSession", ex);
            }
        }

        public async Task<PaginatedList<TechCouncilSession>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM tech_council_session OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<TechCouncilSession>(sql, new { pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM tech_council_session";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<TechCouncilSession>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncilSession", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM tech_council_session WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("TechCouncilSession not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete TechCouncilSession", ex);
            }
        }
    }
}