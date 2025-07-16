using Application.Exceptions;
using Application.Repositories;
using Dapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class UploadedApplicationDocumentRepository : IUploadedApplicationDocumentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public UploadedApplicationDocumentRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<UploadedApplicationDocument>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM uploaded_application_document";
                var models = await _dbConnection.QueryAsync<UploadedApplicationDocument>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UploadedApplicationDocument", ex);
            }
        }
        public async Task<List<UploadedApplicationDocumentToCabinet>> GetUpoadsToCabinetById(int app_id)
        {
            try
            {
                var sql = @"
select upl.id upl_id, upl.created_at, upl.file_id, upl.service_document_id, ad.id app_doc_id,
       ad.name app_doc_name, fs.id sign_id, fs.sign_timestamp, concat(e.last_name, ' ', e.first_name) employee_name from uploaded_application_document upl
    left join application app on app.id = upl.application_document_id
    left join service_document sd on sd.id = upl.service_document_id
    left join application_document ad on ad.id = sd.application_document_id
    left join file on file.id = upl.file_id
    left join file_sign fs on file.id = fs.file_id
    left join employee e on e.id = fs.employee_id

where app.id = @app_id
-- and is_outcome is true
";
                var models = await _dbConnection.QueryAsync<UploadedApplicationDocumentToCabinet>(sql, new { app_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UploadedApplicationDocument", ex);
            }
        }

        public async Task<UploadedApplicationDocument> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT * FROM uploaded_application_document WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<UploadedApplicationDocument>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"UploadedApplicationDocument with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UploadedApplicationDocument", ex);
            }
        }
    }
}
