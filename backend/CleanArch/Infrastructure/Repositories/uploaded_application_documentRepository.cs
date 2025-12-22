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
    public class uploaded_application_documentRepository : Iuploaded_application_documentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public uploaded_application_documentRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<uploaded_application_document>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"uploaded_application_document\"";
                var models = await _dbConnection.QueryAsync<uploaded_application_document>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get uploaded_application_document", ex);
            }
        }

        public async Task<int> Add(uploaded_application_document domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new uploaded_application_documentModel
                {

                    id = domain.id,
                    file_id = domain.file_id,
                    application_document_id = domain.application_document_id,
                    name = domain.name,
                    service_document_id = domain.service_document_id,
                    document_number = domain.document_number,
                    app_step_id = domain.app_step_id,
                    status_id = domain.status_id,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO \"uploaded_application_document\"(\"file_id\", \"application_document_id\", \"name\", \"service_document_id\", \"created_at\", \"updated_at\", \"created_by\", \"updated_by\", \"document_number\", \"status_id\", app_step_id ) " +
                    "VALUES (@file_id, @application_document_id, @name, @service_document_id, @created_at, @updated_at, @created_by, @updated_by, @document_number, @status_id, @app_step_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add uploaded_application_document", ex);
            }
        }

        public async Task<int> CreateWithoutUser(uploaded_application_document domain)
        {
            try
            {
                var setUserQuery = $"SET LOCAL \"bga.current_user\" TO '{domain.created_by}'";
                _dbConnection.Execute(setUserQuery, transaction: _dbTransaction);

                var model = new uploaded_application_documentModel
                {

                    id = domain.id,
                    file_id = domain.file_id,
                    application_document_id = domain.application_document_id,
                    name = domain.name,
                    service_document_id = domain.service_document_id,
                    created_at = DateTime.Now,
                    app_step_id = domain.app_step_id,
                    updated_at = DateTime.Now,
                    status_id = domain.status_id,
                };
                var sql = "INSERT INTO \"uploaded_application_document\"(\"file_id\", \"application_document_id\", \"name\", \"service_document_id\", \"created_at\", \"updated_at\", \"status_id\", app_step_id) " +
                    "VALUES (@file_id, @application_document_id, @name, @service_document_id, @created_at, @updated_at, @status_id, @app_step_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add uploaded_application_document", ex);
            }
        }

        public async Task Update(uploaded_application_document domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                
                var model = new uploaded_application_documentModel
                {

                    id = domain.id,
                    file_id = domain.file_id,
                    application_document_id = domain.application_document_id,
                    name = domain.name,
                    service_document_id = domain.service_document_id,
                    status_id = domain.status_id,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE \"uploaded_application_document\" SET \"id\" = @id, \"file_id\" = @file_id, \"application_document_id\" = @application_document_id, \"name\" = @name, \"service_document_id\" = @service_document_id, \"created_at\" = @created_at, \"updated_at\" = @updated_at, \"created_by\" = @created_by, \"updated_by\" = @updated_by, \"status_id\" = @status_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update uploaded_application_document", ex);
            }
        }
        
        public async Task DeleteSoft(uploaded_application_document domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                
                var model = new uploaded_application_documentModel
                {
                    id = domain.id,
                    delete_reason = domain.delete_reason,
                    deleted_at = domain.deleted_at,
                    deleted_by = userId,
                };
                var sql = "UPDATE uploaded_application_document SET is_deleted = true, delete_reason = @delete_reason, deleted_at = @deleted_at, deleted_by = @deleted_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update uploaded_application_document", ex);
            }
        }

        public async Task<PaginatedList<uploaded_application_document>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"uploaded_application_document\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<uploaded_application_document>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"uploaded_application_document\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<uploaded_application_document>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get uploaded_application_documents", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var setUserQuery = $"SET LOCAL \"bga.current_user\" TO '{await _userRepository.GetUserID()}'";
                var model = new { id = id };
                var sql = "DELETE FROM \"uploaded_application_document\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update uploaded_application_document", ex);
            }
        }
        public async Task<uploaded_application_document> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"uploaded_application_document\" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<uploaded_application_document>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get uploaded_application_document", ex);
            }
        }


        public async Task<List<uploaded_application_document>> GetByfile_id(int file_id)
        {
            try
            {
                var sql = "SELECT * FROM \"uploaded_application_document\" WHERE \"file_id\" = @file_id";
                var models = await _dbConnection.QueryAsync<uploaded_application_document>(sql, new { file_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get uploaded_application_document", ex);
            }
        }

        public async Task<List<uploaded_application_document>> GetByapplication_document_id(int application_document_id)
        {
            try
            {
                var sql = @"
select upl.*, ad.name app_doc_name, ad.id as document_type_id, file.name file_name, CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name from uploaded_application_document upl
         left join service_document sd on upl.service_document_id = sd.id
         left join application_document ad on ad.id = sd.application_document_id
         left join file on file.id = upl.file_id
         left join ""User"" uc on uc.id = upl.created_by
         left join employee emp_c on emp_c.user_id = uc.""userId""
         where upl.application_document_id = @application_document_id";
                var models = await _dbConnection.QueryAsync<uploaded_application_document>(sql, new { application_document_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get uploaded_application_document", ex);
            }
        }

        public async Task<List<uploaded_application_document>> ByApplicationIdAndStepId(int application_document_id, int app_step_id)
        {
            try
            {
                var sql = @"
select upl.*,
       ad.name                                                                   app_doc_name,
       ad.id                                                                  as document_type_id,
       file.name                                                                 file_name,
       CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
       os.name                                                                AS structure_name,
       CONCAT(emp_d.last_name, ' ', emp_d.first_name, ' ', emp_d.second_name) AS deleted_by_name
from uploaded_application_document upl
         left join service_document sd on upl.service_document_id = sd.id
         left join application_document ad on ad.id = sd.application_document_id
         left join file on file.id = upl.file_id
         left join ""User"" uc on uc.id = upl.created_by
         left join employee emp_c on emp_c.user_id = uc.""userId""
         left join ""User"" ud on ud.id = upl.deleted_by
         left join employee emp_d on emp_d.user_id = ud.""userId""
         left join employee_in_structure eis on emp_c.id = eis.employee_id
         left join org_structure os on eis.structure_id = os.id
         where upl.application_document_id = @application_document_id and upl.app_step_id = @app_step_id";
                var models = await _dbConnection.QueryAsync<uploaded_application_document>(sql, new { application_document_id, app_step_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get uploaded_application_document", ex);
            }
        }
        
        public async Task<List<uploaded_application_document>> GetByservice_document_id(int service_document_id)
        {
            try
            {
                var sql = "SELECT * FROM \"uploaded_application_document\" WHERE \"service_document_id\" = @service_document_id";
                var models = await _dbConnection.QueryAsync<uploaded_application_document>(sql, new { service_document_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get uploaded_application_document", ex);
            }
        }

        public async Task<int> RejectDocument(int upl_id)
        {
            var userId = await _userRepository.GetUserID();

            var sql = @"UPDATE uploaded_application_document 
                SET status_id = @status_id,
                    updated_at = @updated_at,
                    updated_by = @updated_by
                WHERE id = @upl_id";

            await _dbConnection.ExecuteAsync(sql, new
            {
                upl_id = upl_id,
                status_id = 3, // ID ������� "rejected" - ����� �������� ���������� ID
                updated_at = DateTime.Now,
                updated_by = userId
            }, transaction: _dbTransaction);

            return upl_id;
        }

        public async Task<int> SetDocumentStatus(int id, string status_code)
        {
            var userId = await _userRepository.GetUserID();

            var sql = @"UPDATE uploaded_application_document 
                SET status = @status_code,
                    updated_at = @updated_at,
                    updated_by = @updated_by
                WHERE id = @id";

            await _dbConnection.ExecuteAsync(sql, new
            {
                id = id,
                status_code = status_code,
                updated_at = DateTime.Now,
                updated_by = userId
            }, transaction: _dbTransaction);

            return id;
        }

        public async Task<UpdatedDocument> GetUpdatedDocumentById(int id)
        {
            var sql = @"
        SELECT 
            uad.id, 
            uad.status, 
            ad.name AS document_name, 
            f.name AS file_name,
            sd.id AS service_id
        FROM uploaded_application_document uad
        LEFT JOIN service_document sd ON uad.service_document_id = sd.id
        LEFT JOIN application_document ad ON sd.application_document_id = ad.id
        LEFT JOIN file f ON uad.file_id = f.id
        WHERE uad.id = @id
    ";

            return await _dbConnection.QueryFirstOrDefaultAsync<UpdatedDocument>(
                sql, new { id }, transaction: _dbTransaction
            );
        }
        
        public async Task<List<CustomUploadedDocument>> GetCustomByApplicationId(int application_document_id)
        {
            try
            {
                var sql = @"
select doc.id, appdoc.name doc_name, appdoc.id app_doc_id, doc.is_required, typ.name type_name, typ.code type_code, upl.id upload_id, upl.status_id status_id, 
           case 
        when file.id is not null 
            then coalesce(document_status.name, 'Не валидный')
        else document_status.name
    end as status_name, doc.id service_document_id,
	upl.name upload_name, upl.created_at, upl.file_id, file.name file_name, upl.created_by, appdoc.doc_is_outcome is_outcome, upl.document_number from service_document doc
left join service on service.id = doc.service_id
left join application app on app.service_id = service.id
left join application_document appdoc on appdoc.id = doc.application_document_id
left join application_document_type typ on typ.id = appdoc.document_type_id
left join (	
	WITH RankedDocuments AS (
		SELECT *,
			ROW_NUMBER() OVER (PARTITION BY service_document_id ORDER BY created_at DESC) AS rn
		FROM uploaded_application_document upl
			where upl.is_deleted != true AND upl.application_document_id = @application_document_id
	)
	SELECT *
	FROM RankedDocuments
	WHERE rn = 1) upl on upl.service_document_id = doc.id
left join file on file.id = upl.file_id
left join document_status on document_status.id = upl.status_id
where app.id = @application_document_id
order by doc.id
";
                var models = await _dbConnection.QueryAsync<CustomUploadedDocument>(sql, new { application_document_id }, transaction: _dbTransaction);

                sql = @"
select -1 id, up.name doc_name, 0 app_doc_id, false is_required, 'manual_docment' type_name, up.id upload_id, up.name upload_name, up.service_document_id,
	up.created_at, up.file_id, f.name file_name, up.created_by, up.is_outcome, up.document_number  from uploaded_application_document up 
	left join application app on app.id = up.application_document_id
	left join File f on f.id = up.file_id
	where up.is_deleted != true AND app.id = @application_document_id and service_document_id is null
";
                var manual_documents = await _dbConnection.QueryAsync<CustomUploadedDocument>(sql, new { application_document_id }, transaction: _dbTransaction);

                var res = models.ToList();
                var i = -1;
                manual_documents.ToList().ForEach(x =>
                {
                    x.id = i;
                    i--;
                });
                res.AddRange(manual_documents);

                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get uploaded_application_document", ex);
            }
        }
        
    }
}
