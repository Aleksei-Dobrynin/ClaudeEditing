using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Newtonsoft.Json;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class S_DocumentTemplateRepository : IS_DocumentTemplateRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public S_DocumentTemplateRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<S_DocumentTemplate>> GetAll()
        {
            try
            {
                var sql = "SELECT \r\n\tdoc.*, \r\n\tARRAY_AGG(DISTINCT ost.structure_id)  FILTER (WHERE ost.structure_id IS NOT NULL) AS orgStructures \r\nFROM \"S_DocumentTemplate\" doc \r\n\tLEFT JOIN org_structure_templates ost ON doc.id = ost.template_id \r\nGROUP BY doc.id \r\nORDER by doc.name ";
                var result = await _dbConnection.QueryAsync(sql, transaction: _dbTransaction);


                var models = result.Select(row => new S_DocumentTemplate
                {
                    id = row.id,
                    name = row.name,
                    description = row.description,
                    code = row.code,
                    created_at = row.created_at,
                    created_by = row.created_by,
                    iconColor = row.iconColor,
                    idCustomSvgIcon = row.idCustomSvgIcon,
                    idDocumentType = row.idDocumentType,
                    updated_at = row.updated_at,
                    updated_by = row.updated_by,
                    orgStructures = row.orgStructures != null ? ((int[])row.orgStructures).ToList() : new List<int>()
                }).ToList();

                return models;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplate", ex);
            }
        }

        public async Task<List<S_DocumentTemplate>> GetByType(string type)
        {
            try
            {
                var sql = @"
select temp.* from ""S_DocumentTemplate"" temp
              left join ""S_DocumentTemplateType"" typ on typ.id = temp.""idDocumentType""
where typ.code = @type
";

                var models = await _dbConnection.QueryAsync<S_DocumentTemplate>(sql, new { type }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplate", ex);
            }
        }
        public async Task<List<S_DocumentTemplate>> GetStructureReports(List<int> structure_ids)
        {
            try
            {
                var sql = @"
select temp.* from ""S_DocumentTemplate"" temp
              left join ""S_DocumentTemplateType"" typ on typ.id = temp.""idDocumentType""
              left join org_structure_templates ost on ost.template_id = temp.id
where typ.code = 'report_structure' and ost.structure_id in (
";
                if(structure_ids == null || structure_ids.Count() == 0)
                {
                    structure_ids = new List<int> { 0 };
                }
                var ids = string.Join(',', structure_ids);

                sql += ids + ")";


                var models = await _dbConnection.QueryAsync<S_DocumentTemplate>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplate", ex);
            }
        }

        public async Task<int> Add(S_DocumentTemplate domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new S_DocumentTemplateModel
                {

                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    idCustomSvgIcon = domain.idCustomSvgIcon,
                    iconColor = domain.iconColor,
                    idDocumentType = domain.idDocumentType,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO \"S_DocumentTemplate\"(\"name\", \"description\", \"code\", \"idCustomSvgIcon\", \"iconColor\", \"idDocumentType\", created_at, updated_at, created_by, updated_by) " +
                    "VALUES (@name, @description, @code, @idCustomSvgIcon, @iconColor, @idDocumentType, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add S_DocumentTemplate", ex);
            }
        }

        public async Task Update(S_DocumentTemplate domain)
        {
            try
            {

                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new S_DocumentTemplateModel
                {

                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    idCustomSvgIcon = domain.idCustomSvgIcon,
                    iconColor = domain.iconColor,
                    idDocumentType = domain.idDocumentType,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE \"S_DocumentTemplate\" SET \"id\" = @id, \"name\" = @name, \"description\" = @description, \"code\" = @code, \"idCustomSvgIcon\" = @idCustomSvgIcon, \"iconColor\" = @iconColor, \"idDocumentType\" = @idDocumentType, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_DocumentTemplate", ex);
            }
        }

        public async Task<PaginatedList<S_DocumentTemplate>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT " +
                    "doc.*, " +
                    "ARRAY_AGG(DISTINCT ost.structure_id)  FILTER (WHERE ost.structure_id IS NOT NULL) AS orgstructures " +
                    "FROM \"S_DocumentTemplate\" doc " +
                    "LEFT JOIN org_structure_templates ost ON doc.id = ost.template_id " +
                    "GROUP BY doc.id " +
                    "OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var result = await _dbConnection.QueryAsync(sql,new {pageSize,pageNumber }, transaction: _dbTransaction);


                var models = result.Select(row => new S_DocumentTemplate
                {
                    id = row.id,
                    name = row.name,
                    description = row.description,
                    code = row.code,
                    created_at = row.created_at,
                    created_by = row.created_by,
                    iconColor = row.iconColor,
                    idCustomSvgIcon = row.idCustomSvgIcon,
                    idDocumentType = row.idDocumentType,
                    updated_at = row.updated_at,
                    updated_by = row.updated_by,
                    orgStructures = row.orgstructures != null ? ((int[])row.orgstructures).ToList() : new List<int>()
                }).ToList();


                var sqlCount = "SELECT Count(*) FROM \"S_DocumentTemplate\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<S_DocumentTemplate>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplates", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"S_DocumentTemplate\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update S_DocumentTemplate", ex);
            }
        }
        public async Task<S_DocumentTemplate> GetOne(int id)
        {
            try
            {
                var sql = "SELECT " +
                    "doc.*, " +
                    "ARRAY_AGG(DISTINCT ost.structure_id) FILTER (WHERE ost.structure_id IS NOT NULL) AS orgstructures " +
                    "FROM \"S_DocumentTemplate\" doc " +
                    "LEFT JOIN org_structure_templates ost ON doc.id = ost.template_id " +
                    "WHERE doc.id = @id " +
                    "GROUP BY doc.id " +
                    "LIMIT 1";
                var result = await _dbConnection.QueryAsync(sql, new { id }, transaction: _dbTransaction);


                var models = result.Select(row => new S_DocumentTemplate
                {
                    id = row.id,
                    name = row.name,
                    description = row.description,
                    code = row.code,
                    created_at = row.created_at,
                    created_by = row.created_by,
                    iconColor = row.iconColor,
                    idCustomSvgIcon = row.idCustomSvgIcon,
                    idDocumentType = row.idDocumentType,
                    updated_at = row.updated_at,
                    updated_by = row.updated_by,
                    orgStructures = row.orgstructures != null ? ((int[])row.orgstructures).ToList() : new List<int>()
                }).ToList();
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplate", ex);
            }
        }


        public async Task<S_DocumentTemplate> GetOneByLanguage(int id, string language)
        {
            try
            {
                string sql = @"
                SELECT 
                temp.""id"",
                temp.""name"",
                temp.""description"",
                temp.""code"",
                temp.""idCustomSvgIcon"",
                temp.""iconColor"",
                temp.""idDocumentType"",

                t.""id"" as S_DocumentTemplateTranslationId,
                t.""template"",
                t.""idLanguage"",
                t.""idDocumentTemplate""
            FROM ""S_DocumentTemplate"" temp
            LEFT JOIN ""S_DocumentTemplateTranslation"" t ON temp.id = t.""idDocumentTemplate""
            LEFT JOIN ""Language"" l ON l.id = t.""idLanguage""
WHERE temp.""id"" = @id AND l.""code"" = @language LIMIT 1
";

                var models = await _dbConnection.QueryAsync<S_DocumentTemplate, S_DocumentTemplateTranslation, S_DocumentTemplate>(
                    sql,
                    (S_DocumentTemplate, S_DocumentTemplateTranslation) =>
                    {
                        S_DocumentTemplate.S_DocumentTemplateTranslation = S_DocumentTemplateTranslation;
                        return S_DocumentTemplate;
                    },
                    new { id, language },
                    splitOn: "S_DocumentTemplateTranslationId"
                );

                return models.ToList().FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SmProjects", ex);
            }
        }


        public async Task<List<S_DocumentTemplate>> GetByidCustomSvgIcon(int idCustomSvgIcon)
        {
            try
            {
                var sql = "SELECT * FROM \"S_DocumentTemplate\" WHERE \"idCustomSvgIcon\" = @idCustomSvgIcon";
                var models = await _dbConnection.QueryAsync<S_DocumentTemplate>(sql, new { idCustomSvgIcon }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplate", ex);
            }
        }

        public async Task<List<S_DocumentTemplate>> GetByidDocumentType(int idDocumentType)
        {
            try
            {
                var sql = "SELECT * FROM \"S_DocumentTemplate\" WHERE \"idDocumentType\" = @idDocumentType";
                var models = await _dbConnection.QueryAsync<S_DocumentTemplate>(sql, new { idDocumentType }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplate", ex);
            }
        }

        public async Task<ApplicationCustomerIsOrganization> GetByApplicationIsOrganization(int idApplication)
        {
            try
            {
                var sql = @"SELECT application.id, cus.pin as customer_pin, cus.is_organization as is_organization 
                            FROM application 
                            left join customer cus on application.customer_id = cus.id 
                            WHERE application.id = @idApplication 
                            LIMIT 1 ";
                var models = await _dbConnection.QueryAsync<ApplicationCustomerIsOrganization>(sql, new { idApplication }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplate", ex);
            }

        }

        public async Task<List<S_DocumentTemplate>> GetByApplicationTypeAndID(int idDocumentType, int idApplication)
        {
            try
            {
                var sql = @"SELECT
                                sdt.*,
                                json_agg(
                                        row_to_json(sad)
                                ) AS saved_application_documents
                            FROM ""S_DocumentTemplate"" sdt
                                     LEFT JOIN saved_application_document sad
                                               ON sdt.id = sad.template_id
                                                   AND (sad.application_id = @idApplication OR sad.application_id IS NULL)
                            WHERE sdt.""idDocumentType"" = @idDocumentType
                            GROUP BY sdt.id;";
                var result = await _dbConnection.QueryAsync(sql, new { idDocumentType, idApplication }, transaction: _dbTransaction);
                
                var templates = result.Select(row =>
                {
                    var template = new S_DocumentTemplate
                    {
                        id = row.id,
                        name = row.name,
                        idDocumentType = row.idDocumentType,
                        code = row.code,
                    };
                    
                    var documentsJson = row.saved_application_documents?.ToString() ?? "[]";
                    template.saved_application_documents = JsonConvert.DeserializeObject<List<SavedApplicationDocument>>(documentsJson);

                    return template;
                }).ToList();

                return templates;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplate", ex);
            }
        }
        
        public async Task<S_DocumentTemplate> GetOneByCode(string code)
        {
            try
            {
                var sql = @"SELECT id, name, description, code FROM ""S_DocumentTemplate"" WHERE code = @code LIMIT 1";
                var model = await _dbConnection.QuerySingleAsync<S_DocumentTemplate>(sql, new { code }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get S_DocumentTemplate", ex);
            }
        }
    }
}
