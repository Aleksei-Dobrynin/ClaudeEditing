using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class ApplicationOutgoingDocumentRepository : IApplicationOutgoingDocumentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public ApplicationOutgoingDocumentRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationOutgoingDocument>> GetAll()
        {
            try
            {
                var sql = @"SELECT aod.id, aod.application_id, aod.outgoing_number, aod.issued_to_customer, aod.issued_at,
                            aod.signed_ecp, aod.signature_data, aod.journal_id, aod.created_at, aod.updated_at, aod.created_by, 
                            aod.updated_by, a.number as application_number, dj.name as journal_name
                            FROM application_outgoing_document aod 
                            LEFT JOIN application a ON aod.application_id = a.id
                            LEFT JOIN document_journals dj ON dj.id = aod.journal_id";
                var models = await _dbConnection.QueryAsync<ApplicationOutgoingDocument>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationOutgoingDocument", ex);
            }
        }

        public async Task<ApplicationOutgoingDocument> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, application_id, outgoing_number, issued_to_customer, issued_at, signed_ecp, signature_data, journal_id, created_at, updated_at, created_by, updated_by FROM application_outgoing_document WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationOutgoingDocument>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationOutgoingDocument with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationOutgoingDocument", ex);
            }
        }

        public async Task<int> Add(ApplicationOutgoingDocument domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO application_outgoing_document (application_id, outgoing_number, issued_to_customer, issued_at, signed_ecp, signature_data, journal_id, created_at, updated_at, created_by, updated_by) 
                            VALUES (@application_id, @outgoing_number, @issued_to_customer, @issued_at, @signed_ecp, @signature_data, @journal_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationOutgoingDocument", ex);
            }
        }

        public async Task Update(ApplicationOutgoingDocument domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE application_outgoing_document SET application_id = @application_id, outgoing_number = @outgoing_number, issued_to_customer = @issued_to_customer, issued_at = @issued_at, signed_ecp = @signed_ecp, signature_data = @signature_data, journal_id = @journal_id, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationOutgoingDocument", ex);
            }
        }

        public async Task<PaginatedList<ApplicationOutgoingDocument>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM application_outgoing_document OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ApplicationOutgoingDocument>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM application_outgoing_document";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ApplicationOutgoingDocument>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationOutgoingDocument", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM application_outgoing_document WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationOutgoingDocument not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationOutgoingDocument", ex);
            }
        }
    }
}
