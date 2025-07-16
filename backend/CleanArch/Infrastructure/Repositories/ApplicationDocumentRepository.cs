using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Domain;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class ApplicationDocumentRepository : IApplicationDocumentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;


        public ApplicationDocumentRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationDocument>> GetAll()
        {
            try
            {
                var sql = @"
                            SELECT application_document.id,
                                   application_document.name,
                                   application_document.document_type_id,
                                   application_document.description,
                                   application_document.law_description,
                                   application_document.doc_is_outcome,
                                   application_document_type.name as document_type_name
                           FROM application_document
                                     LEFT JOIN application_document_type
                                 ON application_document.document_type_id = application_document_type.id";
                var models = await _dbConnection.QueryAsync<ApplicationDocument>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocument", ex);
            }
        }

        public async Task<List<ApplicationDocument>> GetByServiceId(int service_id)
        {
            try
            {
                var sql = @"
                            SELECT d.*
                           FROM application_document d
                                     JOIN service_document s on s.application_document_id = d.id
                                  WHERE s.service_id = @service_id and doc_is_outcome is true";
                var models = await _dbConnection.QueryAsync<ApplicationDocument>(sql, new { service_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocument", ex);
            }
        }

        public async Task<List<CustomAttachedDocument>> GetAttachedOldDocuments(int application_document_id, int application_id)
        {
            try
            {
                var sql = @"
                            select 
upl.id, upl.file_id, app_cust.number, ser.name service_name, upl.created_at, upl.service_document_id, file.name file_name, doc.id service_document_id
from application app
left join application app_cust on app_cust.customer_id = app.customer_id
inner join uploaded_application_document upl on upl.application_document_id = app_cust.id
left join service_document doc on doc.id = upl.service_document_id
left join service ser on ser.id = app_cust.service_id
	left join file on file.id = upl.file_id

where app.id = @application_id
and doc.application_document_id = @application_document_id
and upl.file_id is not null";
                var models = await _dbConnection.QueryAsync<CustomAttachedDocument>(sql, new { application_document_id, application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocument", ex);
            }
        }
        public async Task<List<CustomAttachedOldDocument>> GetOldUploads(int application_id)
        {
            try
            {
                var sql = @"
select
upl.id, upl.file_id, appp.number, appp.id application_id, ser.name service_name, appd.name doc_name, appd.doc_is_outcome is_outcome, upl.created_at, upl.service_document_id, file.name file_name, doc.id service_document_id
from application app
    left join customer c on c.id = app.customer_id
    left join customer cc on cc.pin like c.pin
    left join application appp on appp.customer_id = cc.id
inner join uploaded_application_document upl on upl.application_document_id = appp.id
left join service_document doc on doc.id = upl.service_document_id
    left join application_document appd on appd.id = doc.application_document_id
left join service ser on ser.id = appp.service_id
	left join file on file.id = upl.file_id

where app.id = @application_id and upl.file_id is not null and appd.doc_is_outcome is true;
";
                var models = await _dbConnection.QueryAsync<CustomAttachedOldDocument>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocument", ex);
            }
        }
        

        public async Task<ApplicationDocument> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT application_document.id,
                                   application_document.name,
                                   application_document.name_kg,
                                   application_document.document_type_id,
                                   application_document.description,
                                   application_document.law_description,
                                   application_document.doc_is_outcome,
                                   application_document_type.name as document_type_name
                            FROM application_document
                                     LEFT JOIN application_document_type
                                 ON application_document.document_type_id = application_document_type.id
                            WHERE application_document.id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationDocument>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationDocument with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocument", ex);
            }
        }

        public async Task<ApplicationDocument> GetOneByType(string type_code)
        {
            try
            {
                var sql = @"SELECT application_document.id,
                                   application_document.name,
                                   application_document.document_type_id,
                                   application_document.description,
                                   application_document.law_description,
                                   application_document.doc_is_outcome,
                                   application_document_type.name as document_type_name
                            FROM application_document
                                     LEFT JOIN application_document_type
                                 ON application_document.document_type_id = application_document_type.id
                            WHERE application_document_type.code=@Code";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationDocument>(sql, new { Code = type_code },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationDocument with type {type_code} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocument", ex);
            }
        }

        public async Task<ApplicationDocument> GetOneByNameAndType(string name, string type_code)
        {
            try
            {
                var sql = @"SELECT application_document.id,
                                   application_document.name,
                                   application_document.document_type_id,
                                   application_document.description,
                                   application_document.law_description,
                                   application_document.doc_is_outcome,
                                   application_document_type.name as document_type_name
                            FROM application_document
                                     LEFT JOIN application_document_type
                                 ON application_document.document_type_id = application_document_type.id
                            WHERE application_document.name=@Name AND application_document_type.code=@Code";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationDocument>(sql, new { Name = name, Code = type_code },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationDocument with name {name} and type {type_code} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocument", ex);
            }
        }

        public async Task<int> Add(ApplicationDocument domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationDocument
                {
                    name = domain.name,
                    document_type_id = domain.document_type_id,
                    description = domain.description,
                    law_description = domain.law_description,
                    doc_is_outcome = domain.doc_is_outcome,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql =
                    @"INSERT INTO application_document(name, document_type_id, description, law_description, doc_is_outcome, created_at, updated_at, created_by, updated_by) VALUES 
                        (@name, @document_type_id, @description, @law_description, @doc_is_outcome, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationDocument", ex);
            }
        }

        public async Task Update(ApplicationDocument domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationDocument
                {
                    id = domain.id,
                    name = domain.name,
                    document_type_id = domain.document_type_id,
                    description = domain.description,
                    law_description = domain.law_description,
                    doc_is_outcome = domain.doc_is_outcome,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql =
                    @"UPDATE application_document SET 
                        name = @name, 
                        document_type_id = @document_type_id, 
                        description = @description,
                        law_description = @law_description,
                        doc_is_outcome = @doc_is_outcome,
                        updated_at = @updated_at,
                        updated_by = @updated_by
                        WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationDocument", ex);
            }
        }

        public async Task<PaginatedList<ApplicationDocument>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql =
                    "SELECT * FROM application_document OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ApplicationDocument>(sql, new { pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM application_document";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ApplicationDocument>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocument", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM application_document WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationDocument not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationDocument", ex);
            }
        }
    }
}