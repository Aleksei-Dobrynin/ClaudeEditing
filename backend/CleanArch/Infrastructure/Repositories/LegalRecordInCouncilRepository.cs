using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class LegalRecordInCouncilRepository : ILegalRecordInCouncilRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public LegalRecordInCouncilRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<LegalRecordInCouncil>> GetAll()
        {
            try
            {
                var sql = "SELECT id, application_legal_record_id, tech_council_id, created_at, updated_at, created_by, updated_by FROM legal_record_in_council";
                var models = await _dbConnection.QueryAsync<LegalRecordInCouncil>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get LegalRecordInCouncil", ex);
            }
        }

        public async Task<LegalRecordInCouncil> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, application_legal_record_id, tech_council_id, created_at, updated_at, created_by, updated_by FROM legal_record_in_council WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<LegalRecordInCouncil>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"LegalRecordInCouncil with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get LegalRecordInCouncil", ex);
            }
        }

        public async Task<int> Add(LegalRecordInCouncil domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO legal_record_in_council (application_legal_record_id, tech_council_id, created_at, updated_at, created_by, updated_by) 
                            VALUES (@application_legal_record_id, @tech_council_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add LegalRecordInCouncil", ex);
            }
        }

        public async Task Update(LegalRecordInCouncil domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE legal_record_in_council SET application_legal_record_id = @application_legal_record_id, tech_council_id = @tech_council_id, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update LegalRecordInCouncil", ex);
            }
        }

        public async Task<PaginatedList<LegalRecordInCouncil>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM legal_record_in_council OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<LegalRecordInCouncil>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM legal_record_in_council";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<LegalRecordInCouncil>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get LegalRecordInCouncil", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM legal_record_in_council WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("LegalRecordInCouncil not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete LegalRecordInCouncil", ex);
            }
        }      
        
        public async Task DeleteByTechCouncilId(int tech_council_id)
        {
            try
            {
                var sql = "DELETE FROM legal_record_in_council WHERE tech_council_id = @TechCouncilId";
                await _dbConnection.ExecuteAsync(sql, new { TechCouncilId = tech_council_id }, transaction: _dbTransaction);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete LegalRecordInCouncil", ex);
            }
        }
    }
}
