using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class TechCouncilFilesRepository : ITechCouncilFilesRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public TechCouncilFilesRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<TechCouncilFiles>> GetAll()
        {
            try
            {
                var sql = "SELECT id, tech_council_id, file_id, created_at, updated_at, created_by, updated_by FROM tech_council_files";
                var models = await _dbConnection.QueryAsync<TechCouncilFiles>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncilFiles", ex);
            }
        }

        public async Task<TechCouncilFiles> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, tech_council_id, file_id, created_at, updated_at, created_by, updated_by FROM tech_council_files WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<TechCouncilFiles>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"TechCouncilFiles with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncilFiles", ex);
            }
        }

        public async Task<int> Add(TechCouncilFiles domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO tech_council_files (tech_council_id, file_id, created_at, updated_at, created_by, updated_by) 
                            VALUES (@tech_council_id, @file_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add TechCouncilFiles", ex);
            }
        }

        public async Task Update(TechCouncilFiles domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE tech_council_files SET tech_council_id = @tech_council_id, file_id = @file_id, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update TechCouncilFiles", ex);
            }
        }

        public async Task<PaginatedList<TechCouncilFiles>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM tech_council_files OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<TechCouncilFiles>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM tech_council_files";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<TechCouncilFiles>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncilFiles", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM tech_council_files WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("TechCouncilFiles not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete TechCouncilFiles", ex);
            }
        }
    }
}
