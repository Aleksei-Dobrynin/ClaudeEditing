using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class TechCouncilRepository : ITechCouncilRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public TechCouncilRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<TechCouncil>> GetAll()
        {
            try
            {
                var sql = @"SELECT id, 
                                   structure_id, 
                                   application_id, 
                                   decision,
                                   decision_type_id,
                                   date_decision,
                                   employee_id,
                                   created_at, 
                                   updated_at, 
                                   created_by, 
                                   updated_by 
                            FROM tech_council
                            order by id";
                var models = await _dbConnection.QueryAsync<TechCouncil>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncil", ex);
            }
        }

        public async Task<List<TechCouncilTable>> GetTable()
        {
            try
            {
                var sql = @"
            SELECT a.id AS id,
                a.id AS application_id,
                a.number AS application_number,
                c.full_name,
                aobj.address,
                td.name AS tech_decision_name,
                tc.structure_id,
                os.name AS structure_name,
                dt.name AS decision_type_name,
                CONCAT(
                    COALESCE(emp.last_name, ''), ' ', 
                    COALESCE(emp.first_name, ''), ' ', 
                    COALESCE(emp.second_name, '')
                ) AS employee_name
            FROM tech_council tc
            LEFT JOIN application a ON tc.application_id = a.id
            LEFT JOIN customer c ON a.customer_id = c.id
            LEFT JOIN application_object ao ON ao.application_id = a.id
            LEFT JOIN arch_object aobj ON a.arch_object_id = aobj.id
            LEFT JOIN decision_type dt ON tc.decision_type_id = dt.id
            LEFT JOIN tech_decision td ON a.tech_decision_id = td.id
            LEFT JOIN org_structure os ON tc.structure_id = os.id
            LEFT JOIN employee emp ON emp.id = tc.employee_id;
        ";

                var techCouncilDictionary = new Dictionary<int, TechCouncilTable>();

                var result = await _dbConnection.QueryAsync<TechCouncilTable, TechCouncilTableDetail, TechCouncilTable>(
                    sql,
                    (techCouncil, detail) =>
                    {
                        if (!techCouncilDictionary.TryGetValue(techCouncil.application_id, out var currentTechCouncil))
                        {
                            currentTechCouncil = techCouncil;
                            currentTechCouncil.details = new List<TechCouncilTableDetail>();
                            techCouncilDictionary[techCouncil.application_id] = currentTechCouncil;
                        }

                        if (detail != null &&
                            !currentTechCouncil.details.Any(d =>
                                d.structure_id == detail.structure_id &&
                                d.decision_type_name == detail.decision_type_name &&
                                d.structure_name == detail.structure_name &&
                                d.employee_name == detail.employee_name))
                        {
                            currentTechCouncil.details.Add(detail);
                        }

                        return currentTechCouncil;
                    },
                    splitOn: "structure_id",
                    transaction: _dbTransaction
                );

                return techCouncilDictionary.Values.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncil", ex);
            }
        }
        
        public async Task<List<TechCouncilTable>> GetTableBySession(int session_id)
        {
            try
            {
                var sql = @"
            SELECT a.id AS id,
                a.id AS application_id,
                a.number AS application_number,
                a.tech_decision_date AS tech_decision_date,
                c.full_name,
                aobj.address,
                td.name AS tech_decision_name,
                tc.structure_id,
                os.name AS structure_name,
                dt.name AS decision_type_name,
                CONCAT(
                    COALESCE(emp.last_name, ''), ' ', 
                    COALESCE(emp.first_name, ''), ' ', 
                    COALESCE(emp.second_name, '')
                ) AS employee_name
            FROM tech_council tc
            LEFT JOIN application a ON tc.application_id = a.id
            LEFT JOIN customer c ON a.customer_id = c.id
            LEFT JOIN application_object ao ON ao.application_id = a.id
            LEFT JOIN arch_object aobj ON a.arch_object_id = aobj.id
            LEFT JOIN decision_type dt ON tc.decision_type_id = dt.id
            LEFT JOIN tech_decision td ON a.tech_decision_id = td.id
            LEFT JOIN org_structure os ON tc.structure_id = os.id
            LEFT JOIN employee emp ON emp.id = tc.employee_id
            WHERE tc.tech_council_session_id = @SessionId;";

                var techCouncilDictionary = new Dictionary<int, TechCouncilTable>();

                var result = await _dbConnection.QueryAsync<TechCouncilTable, TechCouncilTableDetail, TechCouncilTable>(
                    sql,
                    (techCouncil, detail) =>
                    {
                        if (!techCouncilDictionary.TryGetValue(techCouncil.application_id, out var currentTechCouncil))
                        {
                            currentTechCouncil = techCouncil;
                            currentTechCouncil.details = new List<TechCouncilTableDetail>();
                            techCouncilDictionary[techCouncil.application_id] = currentTechCouncil;
                        }

                        if (detail != null &&
                            !currentTechCouncil.details.Any(d =>
                                d.structure_id == detail.structure_id &&
                                d.decision_type_name == detail.decision_type_name &&
                                d.structure_name == detail.structure_name &&
                                d.employee_name == detail.employee_name))
                        {
                            currentTechCouncil.details.Add(detail);
                        }

                        return currentTechCouncil;
                    },
                    new { SessionId = session_id},
                    splitOn: "structure_id",
                    transaction: _dbTransaction
                );

                return techCouncilDictionary.Values.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncil", ex);
            }
        }
        
        public async Task<List<TechCouncilTable>> GetTableByStructure(int structure_id)
        {
            try
            {
                var sql = @"
            SELECT a.id AS id,
                a.id AS application_id,
                a.number AS application_number,
                a.tech_decision_date AS tech_decision_date,
                c.full_name,
                aobj.address,
                td.name AS tech_decision_name,
                tc.structure_id,
                os.name AS structure_name,
                dt.name AS decision_type_name,
                CONCAT(
                    COALESCE(emp.last_name, ''), ' ', 
                    COALESCE(emp.first_name, ''), ' ', 
                    COALESCE(emp.second_name, '')
                ) AS employee_name
            FROM tech_council tc
            LEFT JOIN application a ON tc.application_id = a.id
            LEFT JOIN customer c ON a.customer_id = c.id
            LEFT JOIN application_object ao ON ao.application_id = a.id
            LEFT JOIN arch_object aobj ON a.arch_object_id = aobj.id
            LEFT JOIN decision_type dt ON tc.decision_type_id = dt.id
            LEFT JOIN tech_decision td ON a.tech_decision_id = td.id
            LEFT JOIN org_structure os ON tc.structure_id = os.id
            LEFT JOIN employee emp ON emp.id = tc.employee_id
            WHERE tc.application_id in (SELECT application_id FROM tech_council tc WHERE tc.structure_id = @StructureId);";

                var techCouncilDictionary = new Dictionary<int, TechCouncilTable>();

                var result = await _dbConnection.QueryAsync<TechCouncilTable, TechCouncilTableDetail, TechCouncilTable>(
                    sql,
                    (techCouncil, detail) =>
                    {
                        if (!techCouncilDictionary.TryGetValue(techCouncil.application_id, out var currentTechCouncil))
                        {
                            currentTechCouncil = techCouncil;
                            currentTechCouncil.details = new List<TechCouncilTableDetail>();
                            techCouncilDictionary[techCouncil.application_id] = currentTechCouncil;
                        }

                        if (detail != null &&
                            !currentTechCouncil.details.Any(d =>
                                d.structure_id == detail.structure_id &&
                                d.decision_type_name == detail.decision_type_name &&
                                d.structure_name == detail.structure_name &&
                                d.employee_name == detail.employee_name))
                        {
                            currentTechCouncil.details.Add(detail);
                        }

                        return currentTechCouncil;
                    },
                    new { StructureId = structure_id},
                    splitOn: "structure_id",
                    transaction: _dbTransaction
                );

                return techCouncilDictionary.Values.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncil", ex);
            }
        }
                
        public async Task<List<TechCouncilTable>> GetTableWithOutSession()
        {
            try
            {
                var sql = @"
            SELECT a.id AS id,
                a.id AS application_id,
                a.number AS application_number,
                c.full_name,
                aobj.address,
                td.name AS tech_decision_name,
                tc.structure_id,
                os.name AS structure_name,
                dt.name AS decision_type_name,
                CONCAT(
                    COALESCE(emp.last_name, ''), ' ', 
                    COALESCE(emp.first_name, ''), ' ', 
                    COALESCE(emp.second_name, '')
                ) AS employee_name
            FROM tech_council tc
            LEFT JOIN application a ON tc.application_id = a.id
            LEFT JOIN customer c ON a.customer_id = c.id
            LEFT JOIN application_object ao ON ao.application_id = a.id
            LEFT JOIN arch_object aobj ON a.arch_object_id = aobj.id
            LEFT JOIN decision_type dt ON tc.decision_type_id = dt.id
            LEFT JOIN tech_decision td ON a.tech_decision_id = td.id
            LEFT JOIN org_structure os ON tc.structure_id = os.id
            LEFT JOIN employee emp ON emp.id = tc.employee_id
            WHERE tc.tech_council_session_id IS NULL";

                var techCouncilDictionary = new Dictionary<int, TechCouncilTable>();

                var result = await _dbConnection.QueryAsync<TechCouncilTable, TechCouncilTableDetail, TechCouncilTable>(
                    sql,
                    (techCouncil, detail) =>
                    {
                        if (!techCouncilDictionary.TryGetValue(techCouncil.application_id, out var currentTechCouncil))
                        {
                            currentTechCouncil = techCouncil;
                            currentTechCouncil.details = new List<TechCouncilTableDetail>();
                            techCouncilDictionary[techCouncil.application_id] = currentTechCouncil;
                        }

                        if (detail != null &&
                            !currentTechCouncil.details.Any(d =>
                                d.structure_id == detail.structure_id &&
                                d.decision_type_name == detail.decision_type_name &&
                                d.structure_name == detail.structure_name &&
                                d.employee_name == detail.employee_name))
                        {
                            currentTechCouncil.details.Add(detail);
                        }

                        return currentTechCouncil;
                    },
                    splitOn: "structure_id",
                    transaction: _dbTransaction
                );

                return techCouncilDictionary.Values.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncil", ex);
            }
        }


        public async Task<List<TechCouncil>> GetByStructureId(int structure_id)
        {
            try
            {
                var sql = @"SELECT tc.id, 
                                   tc.structure_id, 
                                   tc.application_id, 
                                   tc.decision,
                                   tc.decision_type_id,
                                   tc.date_decision,
                                   tc.employee_id,
                                   tc.created_at, 
                                   tc.updated_at, 
                                   tc.created_by, 
                                   tc.updated_by
                            FROM tech_council tc
                            WHERE tc.structure_id = @StructureId
                            order by tc.id";

                var models = await _dbConnection.QueryAsync<TechCouncil>(sql, new { StructureId = structure_id },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncil", ex);
            }
        }

        public async Task<List<TechCouncil>> GetByApplicationId(int application_id)
        {
            try
            {
                var sql = @"SELECT tc.id, 
                                   tc.structure_id, 
                                   tc.application_id, 
                                   tc.decision,
                                   tc.decision_type_id,
                                   tc.date_decision,
                                   tc.employee_id,
                                   tc.tech_council_session_id,
                                   tc.created_at, 
                                   tc.updated_at, 
                                   tc.created_by, 
                                   tc.updated_by, 
                                   os.name AS structure_name,
                                   CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS created_by_name,
                                   CONCAT(emp.last_name, ' ', emp.first_name, ' ', emp.second_name) AS employee_name,
                                   tcf.tech_council_id, 
                                   tcf.file_id, 
                                   tcf.id as id, 
                                   f.name as file_name,
                                   lric.application_legal_record_id AS application_legal_record_id,
                                   lric.id AS id, 
                                   lric.tech_council_id AS tech_council_id
                            FROM tech_council tc 
                            LEFT JOIN org_structure os ON os.id = tc.structure_id
                            LEFT JOIN ""User"" uc on uc.id = tc.created_by
                            LEFT JOIN employee emp_c on emp_c.user_id = uc.""userId""
                            LEFT JOIN employee emp on emp.id = tc.employee_id
                            LEFT JOIN tech_council_files tcf ON tc.id = tcf.tech_council_id
                            LEFT JOIN file f ON f.id = tcf.file_id
                            LEFT JOIN legal_record_in_council lric ON tc.id = lric.tech_council_id
                            WHERE tc.application_id = @ApplicationId
                            order by tc.id";

                var techCouncilDict = new Dictionary<int, TechCouncil>();

                var models = await _dbConnection
                    .QueryAsync<TechCouncil, TechCouncilFiles, LegalRecordInCouncil, TechCouncil>(
                        sql,
                        (tc, tcf, lric) =>
                        {
                            if (!techCouncilDict.TryGetValue(tc.id, out var techCouncil))
                            {
                                techCouncil = tc;
                                techCouncil.files = new List<TechCouncilFiles>();
                                techCouncil.legal_records = new List<LegalRecordInCouncil>();
                                techCouncilDict.Add(tc.id, techCouncil);
                            }

                            if (tcf != null && tcf.tech_council_id != 0)
                            {
                                if (!techCouncil.files.Any(f => f.id == tcf.id && f.file_id == tcf.file_id))
                                {
                                    tcf.file_name ??= string.Empty;
                                    techCouncil.files.Add(tcf);
                                }
                            }

                            if (lric != null && lric.tech_council_id != 0)
                            {
                                if (!techCouncil.legal_records.Any(r => r.id == lric.id))
                                {
                                    techCouncil.legal_records.Add(lric);
                                }
                            }

                            return techCouncil;
                        },
                        new { ApplicationId = application_id },
                        splitOn: "tech_council_id,application_legal_record_id",
                        transaction: _dbTransaction
                    );

                return techCouncilDict.Values.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncil", ex);
            }
        }

        public async Task<TechCouncil> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT id, 
                                   structure_id, 
                                   application_id, 
                                   decision,
                                   decision_type_id,
                                   date_decision,
                                   employee_id,
                                   created_at, 
                                   updated_at, 
                                   created_by, 
                                   updated_by 
                            FROM tech_council WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<TechCouncil>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"TechCouncil with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncil", ex);
            }
        }

        public async Task<int> Add(TechCouncil domain)
        {
            try
            {
                var userId =
                    await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                await FillLogDataHelper.FillLogDataCreate(domain, userId);
                var sql = @"INSERT INTO tech_council (
                                   structure_id, 
                                   application_id, 
                                   decision,
                                   decision_type_id,
                                   date_decision,
                                   employee_id,
                                   created_at, 
                                   updated_at, 
                                   created_by, 
                                   updated_by) 
                           VALUES (@structure_id, 
                                   @application_id, 
                                   @decision,
                                   @decision_type_id,
                                   @date_decision,
                                   @employee_id,
                                   @created_at, 
                                   @updated_at, 
                                   @created_by, 
                                   @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add TechCouncil", ex);
            }
        }

        public async Task Update(TechCouncil domain)
        {
            try
            {
                var userId =
                    await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                await FillLogDataHelper.FillLogDataUpdate(domain, userId);
                var sql = @"UPDATE tech_council SET 
                                structure_id = @structure_id, 
                                application_id = @application_id,  
                                decision = @decision, 
                                decision_type_id = @decision_type_id, 
                                date_decision = @date_decision, 
                                employee_id = @employee_id, 
                                created_at = @created_at, 
                                updated_at = @updated_at, 
                                created_by = @created_by, 
                                updated_by = @updated_by 
                            WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update TechCouncil", ex);
            }
        }
        
        public async Task UpdateSession(int? application_id, int? session_id)
        {
            try
            {
                var sql = @"UPDATE tech_council SET 
                                tech_council_session_id = @SessionId
                            WHERE application_id = @ApplicationId";
                var affected = await _dbConnection.ExecuteAsync(sql, new
                {
                    ApplicationId = application_id, 
                    SessionId = session_id
                }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update TechCouncil", ex);
            }
        }

        public async Task<PaginatedList<TechCouncil>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM tech_council OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<TechCouncil>(sql, new { pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM tech_council";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<TechCouncil>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncil", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM tech_council WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("TechCouncil not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete TechCouncil", ex);
            }
        }
    }
}