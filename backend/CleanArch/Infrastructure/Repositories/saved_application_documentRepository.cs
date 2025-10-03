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
    public class saved_application_documentRepository : Isaved_application_documentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public saved_application_documentRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<saved_application_document>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""saved_application_document""";
                var models = await _dbConnection.QueryAsync<saved_application_document>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get saved_application_document", ex);
            }
        }

        public async Task<int> Add(saved_application_document domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new saved_application_documentModel
                {
                    
                    id = domain.id,
                    application_id = domain.application_id,
                    template_id = domain.template_id,
                    language_id = domain.language_id,
                    file_id = domain.file_id,
                    body = domain.body,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO ""saved_application_document""(""application_id"", ""template_id"", ""language_id"", ""body"", ""file_id"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@application_id, @template_id, @language_id, @body, @file_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add saved_application_document", ex);
            }
        }

        public async Task Update(saved_application_document domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new saved_application_documentModel
                {
                    
                    id = domain.id,
                    application_id = domain.application_id,
                    template_id = domain.template_id,
                    language_id = domain.language_id,
                    body = domain.body,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE ""saved_application_document"" SET ""id"" = @id, ""file_id"" = @file_id, ""application_id"" = @application_id, ""template_id"" = @template_id, ""language_id"" = @language_id, ""body"" = @body, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update saved_application_document", ex);
            }
        }

        public async Task<PaginatedList<saved_application_document>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""saved_application_document"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<saved_application_document>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""saved_application_document""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<saved_application_document>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get saved_application_documents", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""saved_application_document"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update saved_application_document", ex);
            }
        }
        public async Task<saved_application_document> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""saved_application_document"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<saved_application_document>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get saved_application_document", ex);
            }
        }
        public async Task<saved_application_document> GetByApplication(int application_id, int template_id, int language_id)
        {
            try
            {
                var sql = @"
select sav.*, concat(e.last_name, ' ', e.first_name) as updated_by_name from saved_application_document sav
        LEFT JOIN ""User"" u on sav.updated_by = u.id
                   LEFT JOIN employee e on e.user_id = u.""userId""
where sav.application_id = @application_id and sav.language_id = @language_id and sav.template_id = @template_id

order by created_at limit 1";
                var models = await _dbConnection.QueryAsync<saved_application_document>(sql, new { application_id, template_id, language_id }, transaction: _dbTransaction);
                var sav = models.FirstOrDefault();

                if (sav == null)
                {
                    sql = @"
select 0 id, @application_id application_id, tem.id template_id, tran.""idLanguage"" language_id, tran.template body from ""S_DocumentTemplate"" tem
left join ""S_DocumentTemplateTranslation"" tran on tran.""idDocumentTemplate"" = tem.id
where tem.id = @template_id and tran.""idLanguage"" = @language_id
";
                    models = await _dbConnection.QueryAsync<saved_application_document>(sql, new { application_id, template_id, language_id }, transaction: _dbTransaction);
                    sav = models.FirstOrDefault();
                }


                return sav;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get saved_application_document", ex);
            }
        }

        public async Task<List<saved_application_document>> GetByapplication_id(int application_id)
        {
            try
            {
                var sql = """
SELECT saved.*, CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name, l.name language_name, s.name template_name FROM saved_application_document saved
LEFT JOIN "S_DocumentTemplate" s on s.id = saved.template_id
LEFT JOIN "Language" l on l.id = saved.language_id
LEFT JOIN "User" uc on uc.id = saved.created_by
LEFT JOIN employee emp_c on emp_c.user_id = uc."userId"
WHERE saved.application_id = @application_id
""";
                var models = await _dbConnection.QueryAsync<saved_application_document>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get saved_application_document", ex);
            }
        }
        
        public async Task<List<saved_application_document>> GetBytemplate_id(int template_id)
        {
            try
            {
                var sql = "SELECT * FROM \"saved_application_document\" WHERE \"template_id\" = @template_id";
                var models = await _dbConnection.QueryAsync<saved_application_document>(sql, new { template_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get saved_application_document", ex);
            }
        }
        
        public async Task<List<saved_application_document>> GetBylanguage_id(int language_id)
        {
            try
            {
                var sql = "SELECT * FROM \"saved_application_document\" WHERE \"language_id\" = @language_id";
                var models = await _dbConnection.QueryAsync<saved_application_document>(sql, new { language_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get saved_application_document", ex);
            }
        }
        
    }
}
