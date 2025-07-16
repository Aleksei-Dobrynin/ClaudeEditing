using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class ServiceStatusNumberingRepository : IServiceStatusNumberingRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public ServiceStatusNumberingRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ServiceStatusNumbering>> GetAll()
        {
            try
            {
                var sql = "SELECT id, date_start, date_end, is_active, service_id, journal_id, number_template, created_at, updated_at, created_by, updated_by FROM service_status_numbering";
                var models = await _dbConnection.QueryAsync<ServiceStatusNumbering>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ServiceStatusNumbering", ex);
            }
        }
        
        public async Task<List<ServiceStatusNumbering>> GetByServiceId(int id)
        {
            try
            {
                var sql = @"SELECT ssn.id, ssn.date_start, ssn.date_end, ssn.is_active, ssn.service_id, ssn.journal_id, ssn.number_template, 
                            ssn.created_at, ssn.updated_at, ssn.created_by, ssn.updated_by, dj.name AS journal_name 
                            FROM service_status_numbering ssn 
                            LEFT JOIN document_journals dj ON dj.id = ssn.journal_id
                            WHERE service_id = @id";
                var models = await _dbConnection.QueryAsync<ServiceStatusNumbering>(sql, new {id}, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ServiceStatusNumbering", ex);
            }
        }

        public async Task<List<ServiceStatusNumbering>> GetByJournalId(int id)
        {
            try
            {
                var sql = @"SELECT ssn.id, ssn.date_start, ssn.date_end, ssn.is_active, ssn.service_id, ssn.journal_id, ssn.number_template, 
                            ssn.created_at, ssn.updated_at, ssn.created_by, ssn.updated_by, s.name AS service_name 
                            FROM service_status_numbering ssn 
                            LEFT JOIN service s ON s.id = ssn.service_id
                            WHERE journal_id = @id";
                var models = await _dbConnection.QueryAsync<ServiceStatusNumbering>(sql, new { id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ServiceStatusNumbering", ex);
            }
        }

        public async Task<ServiceStatusNumbering> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, date_start, date_end, is_active, service_id, journal_id, number_template, created_at, updated_at, created_by, updated_by FROM service_status_numbering WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ServiceStatusNumbering>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ServiceStatusNumbering with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ServiceStatusNumbering", ex);
            }
        }

        public async Task<int> Add(ServiceStatusNumbering domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO service_status_numbering (date_start, date_end, is_active, service_id, journal_id, number_template, created_at, updated_at, created_by, updated_by) 
                            VALUES (@date_start, @date_end, @is_active, @service_id, @journal_id, @number_template, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ServiceStatusNumbering", ex);
            }
        }

        public async Task Update(ServiceStatusNumbering domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE service_status_numbering SET date_start = @date_start, date_end = @date_end, is_active = @is_active, service_id = @service_id, journal_id = @journal_id, number_template = @number_template, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ServiceStatusNumbering", ex);
            }
        }

        public async Task<PaginatedList<ServiceStatusNumbering>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM service_status_numbering OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ServiceStatusNumbering>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM service_status_numbering";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ServiceStatusNumbering>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ServiceStatusNumbering", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM service_status_numbering WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ServiceStatusNumbering not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ServiceStatusNumbering", ex);
            }
        }
    }
}
