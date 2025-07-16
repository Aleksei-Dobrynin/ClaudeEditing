using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class ApplicationLegalRecordRepository : IApplicationLegalRecordRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public ApplicationLegalRecordRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationLegalRecord>> GetAll()
        {
            try
            {
                var sql = "SELECT id, id_application, id_legalrecord, id_legalact, created_at, updated_at, created_by, updated_by FROM application_legal_record";
                var models = await _dbConnection.QueryAsync<ApplicationLegalRecord>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationLegalRecord", ex);
            }
        }

        public async Task<ApplicationLegalRecord> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, id_application, id_legalrecord, id_legalact, created_at, updated_at, created_by, updated_by FROM application_legal_record WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationLegalRecord>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationLegalRecord with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationLegalRecord", ex);
            }
        }

        public async Task<int> Add(ApplicationLegalRecord domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO application_legal_record (id_application, id_legalrecord, id_legalact, created_at, updated_at, created_by, updated_by) 
                            VALUES (@id_application, @id_legalrecord, @id_legalact, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationLegalRecord", ex);
            }
        }

        public async Task Update(ApplicationLegalRecord domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE application_legal_record SET id_application = @id_application, id_legalrecord = @id_legalrecord, id_legalact = @id_legalact, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationLegalRecord", ex);
            }
        }

        public async Task<PaginatedList<ApplicationLegalRecord>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM application_legal_record OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ApplicationLegalRecord>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM application_legal_record";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ApplicationLegalRecord>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationLegalRecord", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM application_legal_record WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationLegalRecord not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationLegalRecord", ex);
            }
        }
    }
}
