using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class ServiceDocumentRepository : IServiceDocumentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ServiceDocumentRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ServiceDocument>> GetAll()
        {
            try
            {
                var sql = "SELECT id, service_id, application_document_id, is_required FROM service_document";
                var models = await _dbConnection.QueryAsync<ServiceDocument>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ServiceDocument", ex);
            }
        }
        
        public async Task<List<ServiceDocument>> GetByidService(int idService)
        {
            try
            {
                var sql = @"SELECT service_document.id,
                                   service_id,
                                   service.name as service_name,
                                   application_document_id,
                                   is_required,
                                    application_document.doc_is_outcome as is_outcome,
                                   application_document.name as application_document_name
                            FROM service_document
                                     LEFT JOIN application_document ON service_document.application_document_id = application_document.id
                                     LEFT JOIN service ON service_document.service_id = service.id
                            WHERE service_id=@IdService";
                var models = await _dbConnection.QueryAsync<ServiceDocument>(sql, new { IdService = idService }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ServiceDocument", ex);
            }
        }

        public async Task<List<ServiceDocument>> GetByidServiceCabinet(int idService)
        {
            try
            {
                var sql = @"SELECT service_document.id,
                                   service_id,
                                   service.name as service_name,
                                   service_document.application_document_id,
                                   is_required,
                                    application_document.doc_is_outcome as is_outcome,
                                   application_document.name as application_document_name,
                                    application_document.name_kg as application_document_name_kg,
                                    adt.id as application_document_type_id,
                                    adt.name as application_document_type_name,
                                    adt.name_kg as application_document_type_name_kg,
								   uad.file_id
                            FROM service_document
                                     LEFT JOIN application_document ON service_document.application_document_id = application_document.id
                                     LEFT join application_document_type adt on adt.id = application_document.document_type_id
                                     LEFT JOIN service ON service_document.service_id = service.id
                                     LEFT JOIN (
    SELECT 
        uad1.* 
    FROM 
        uploaded_application_document uad1
    JOIN (
        SELECT 
            service_document_id, 
            MAX(id) AS max_id
        FROM 
            uploaded_application_document
        GROUP BY 
            service_document_id
    ) uad2 ON uad1.service_document_id = uad2.service_document_id AND uad1.id = uad2.max_id
) uad ON uad.service_document_id = service_document.id
                            WHERE service_id=@IdService";
                var models = await _dbConnection.QueryAsync<ServiceDocument>(sql, new { IdService = idService }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ServiceDocument", ex);
            }
        }

        public async Task<ServiceDocument> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT service_document.id, service_id, application_document_id, is_required, application_document.name as application_document_name
                            FROM service_document LEFT JOIN application_document ON service_document.application_document_id = application_document.id WHERE service_document.id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ServiceDocument>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ServiceDocument with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ServiceDocument", ex);
            }
        }

        public async Task<int> Add(ServiceDocument domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ServiceDocument
                {
                    service_id = domain.service_id,
                    application_document_id = domain.application_document_id,
                    is_required = domain.is_required,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO service_document(service_id, application_document_id, is_required, created_at, updated_at, created_by, updated_by) VALUES (@service_id, @application_document_id, @is_required, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ServiceDocument", ex);
            }
        }

        public async Task Update(ServiceDocument domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ServiceDocument
                {
                    id = domain.id,
                    service_id = domain.service_id,
                    application_document_id = domain.application_document_id,
                    is_required = domain.is_required,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE service_document SET service_id = @service_id, application_document_id = @application_document_id, is_required = @is_required, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ServiceDocument", ex);
            }
        }

        public async Task<PaginatedList<ServiceDocument>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM service_document OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ServiceDocument>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM service_document";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ServiceDocument>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ServiceDocument", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM service_document WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ServiceDocument not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ServiceDocument", ex);
            }
        }
    }
}
