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
    public class org_structure_templatesRepository : Iorg_structure_templatesRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public org_structure_templatesRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<org_structure_templates>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""org_structure_templates""";
                var models = await _dbConnection.QueryAsync<org_structure_templates>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get org_structure_templates", ex);
            }
        }

        public async Task<int> Add(org_structure_templates domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new org_structure_templatesModel
                {
                    
                    id = domain.id,
                    structure_id = domain.structure_id,
                    template_id = domain.template_id,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO ""org_structure_templates""(""structure_id"", ""template_id"", created_at, updated_at, created_by, updated_by) 
                VALUES (@structure_id, @template_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add org_structure_templates", ex);
            }
        }

        public async Task Update(org_structure_templates domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new org_structure_templatesModel
                {
                    
                    id = domain.id,
                    structure_id = domain.structure_id,
                    template_id = domain.template_id,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE ""org_structure_templates"" SET ""id"" = @id, ""structure_id"" = @structure_id, ""template_id"" = @template_id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update org_structure_templates", ex);
            }
        }

        public async Task<PaginatedList<org_structure_templates>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""org_structure_templates"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<org_structure_templates>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""org_structure_templates""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<org_structure_templates>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get org_structure_templatess", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""org_structure_templates"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update org_structure_templates", ex);
            }
        }
        public async Task<org_structure_templates> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""org_structure_templates"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<org_structure_templates>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get org_structure_templates", ex);
            }
        }

        
        public async Task<List<org_structure_templates>> GetBystructure_id(int structure_id)
        {
            try
            {
                var sql = @"
SELECT ost.*, tem.name template_name FROM ""org_structure_templates"" ost
    left join ""S_DocumentTemplate"" tem on tem.id = ost.template_id
WHERE ""structure_id"" = @structure_id
";
                var models = await _dbConnection.QueryAsync<org_structure_templates>(sql, new { structure_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get org_structure_templates", ex);
            }
        }
        
        public async Task<List<org_structure_templates>> GetBytemplate_id(int template_id)
        {
            try
            {
                var sql = "SELECT * FROM \"org_structure_templates\" WHERE \"template_id\" = @template_id";
                var models = await _dbConnection.QueryAsync<org_structure_templates>(sql, new { template_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get org_structure_templates", ex);
            }
        }
        
        public async Task<List<S_DocumentTemplateWithLanguage>> GetMyTemplates(int user_id)
        {
            try
            {
                var sql = @$"
select row_number() OVER () as id, concat(tem.name, '(', l.name, ')') name, tr.""idLanguage"", 
	tem.id template_id, l.name language, l.code language_code, tem.name template from ""User"" u 
	inner join employee e on u.""userId"" = e.user_id
	inner join employee_in_structure eis on eis.employee_id = e.id
	inner join org_structure org on eis.structure_id = org.id
	inner join org_structure_templates orgt on orgt.structure_id = org.id
	inner join ""S_DocumentTemplate"" tem on tem.id = orgt.template_id
	inner join ""S_DocumentTemplateTranslation"" tr on tr.""idDocumentTemplate"" = tem.id
	left join ""Language"" l on tr.""idLanguage"" = l.id
where u.id = @user_id
group by tem.id, tr.""idLanguage"", l.id
order by name
";
                var models = await _dbConnection.QueryAsync<S_DocumentTemplateWithLanguage>(sql, new { user_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get org_structure_templates", ex);
            }
        }
        
    }
}
