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
    public class EmployeeInStructureRepository : IEmployeeInStructureRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public EmployeeInStructureRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<EmployeeInStructure>> GetAll()
        {
            try
            {
                var sql = @"SELECT st.id, 
                            st.employee_id, st.date_start, st.is_temporary, 
                            st.date_end, st.structure_id,
                            structure_post.name as post_name,
                            CONCAT(employee.last_name, ' ', employee.first_name, ' ', employee.second_name) AS employee_name 
                            FROM employee_in_structure st 
                                left join employee on employee.id = st.employee_id
                                left join employee_event on employee.id = employee_event.employee_id
                                left join structure_post on st.post_id = structure_post.id
                            WHERE (employee_event.date_start IS NULL AND employee_event.date_end IS NULL)
                               OR (CURRENT_DATE < DATE(employee_event.date_start) OR CURRENT_DATE > DATE(employee_event.date_end))";
                var models = await _dbConnection.QueryAsync<EmployeeInStructure>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }

        public async Task<List<EmployeeInStructure>> GetInMyStructure(int userId)
        {
            try
            {
                var sql = @"
select eis.* from employee_in_structure eis 
left join employee e on eis.employee_id = e.id
left join ""User"" u on u.""userId"" = e.user_id
where u.id = @userId 
	AND ((NOW() >= eis.date_start AND (eis.date_end > NOW() OR eis.date_end IS NULL)) )
";
                var models = await _dbConnection.QueryAsync<EmployeeInStructure>(sql, new { userId = userId }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }

        public async Task<EmployeeInStructure> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, employee_id, date_start, date_end, structure_id, post_id, is_temporary FROM employee_in_structure WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<EmployeeInStructure>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"EmployeeInStructure with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }


        public async Task<List<EmployeeInStructure>> GetByidStructures(int[] idStructure)
        {
            try
            {
                var sql = @"SELECT employee_in_structure.id,
                                   employee_id,
                                   CONCAT(employee.last_name, ' ', employee.first_name, ' ', employee.second_name) AS employee_name,
                                   date_start,
                                   date_end,
                                   structure_id,
                                   post_id,
                                   is_temporary,
                                   structure_post.name as post_name
                            FROM employee_in_structure
                                     left join employee on employee.id = employee_in_structure.employee_id
                                     left join structure_post on employee_in_structure.post_id = structure_post.id
                            WHERE employee_in_structure.structure_id=any(@IdStructure)";
                var models = await _dbConnection.QueryAsync<EmployeeInStructure>(sql, new { IdStructure = idStructure }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }

        public async Task<List<EmployeeInStructure>> GetByidStructure(int idStructure)
        {
            try
            {
                var sql = @"SELECT employee_in_structure.id,
                                   employee_id,
                                   CONCAT(employee.last_name, ' ', employee.first_name, ' ', employee.second_name) AS employee_name,
                                   date_start,
                                   date_end,
                                   structure_id,
                                   post_id,
                                   is_temporary,
                                   structure_post.name as post_name
                            FROM employee_in_structure
                                     left join employee on employee.id = employee_in_structure.employee_id
                                     left join structure_post on employee_in_structure.post_id = structure_post.id
                            WHERE employee_in_structure.structure_id=@IdStructure";
                var models = await _dbConnection.QueryAsync<EmployeeInStructure>(sql, new { IdStructure = idStructure }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }

        public async Task<List<EmployeeInStructure>> GetByStructureAndPost(int? idStructure, string codePost)
        {
            try
            {
                var sql = @"SELECT employee_in_structure.id,
                                   employee_id,
                                   CONCAT(employee.last_name, ' ', employee.first_name, ' ', employee.second_name) AS employee_name,
                                   date_start,
                                   date_end,
                                   structure_id,
                                   post_id,
                                   is_temporary,
                                   structure_post.name as post_name
                            FROM employee_in_structure
                                     left join employee on employee.id = employee_in_structure.employee_id
                                     left join structure_post on employee_in_structure.post_id = structure_post.id
                            WHERE employee_in_structure.structure_id = @IdStructure AND structure_post.code = @CodePost AND employee_in_structure.date_start < now() and (employee_in_structure.date_end is null OR employee_in_structure.date_end > now())";
                var model = await _dbConnection.QueryAsync<EmployeeInStructure>(sql, new { IdStructure = idStructure, CodePost = codePost }, transaction: _dbTransaction);
                return model.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }

        public async Task<List<EmployeeInStructure>> GetByidEmployee(int idEmployee)
        {
            try
            {
                var sql = @"SELECT employee_in_structure.id,
                                   employee_id,
                                   CONCAT(employee.last_name, ' ', employee.first_name, ' ', employee.second_name) AS employee_name,
                                   employee_in_structure.date_start,
                                   employee_in_structure.date_end,
                                   structure_id,
                                   post_id,
                                   is_temporary,
                                   structure_post.name as post_name,
                                   org_structure.name as structure_name
                            FROM employee_in_structure
                                     left join employee on employee.id = employee_in_structure.employee_id
                                     left join structure_post on employee_in_structure.post_id = structure_post.id
                                    left join org_structure on org_structure.id = employee_in_structure.structure_id
                            WHERE employee_in_structure.employee_id=@IdEmployee";
                var models = await _dbConnection.QueryAsync<EmployeeInStructure>(sql, new { IdEmployee = idEmployee }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }
        public async Task<List<EmployeeInStructure>> GetByEmployeeStructureId(int idStructure, int? idEmployee)
        {
            try
            {
                var sql = @"
                            SELECT 
                            CONCAT(employee.last_name, ' ', employee.first_name, ' ', employee.second_name) AS employee_name,
                            employee_in_structure.id AS id,
                            employee_in_structure.date_start AS date_start,
                            org_str.name as structure_name,
                            employee_in_structure.date_end AS date_end,
                            structure_post.name AS post_name,
                            structure_post.code AS post_code,
                            employee_id,
                            structure_id
                            FROM employee_in_structure
                            left join employee on employee.id = employee_in_structure.employee_id
                            left join org_structure org_str on employee_in_structure.structure_id = org_str.id
                            left join structure_post on employee_in_structure.post_id = structure_post.id
                            WHERE 
				employee_in_structure.date_start < now() and (employee_in_structure.date_end is null or employee_in_structure.date_end > now())
                                AND ((org_str.id = @IdStructure AND org_str.parent_id IS NULL)
                                OR (org_str.parent_id = @IdStructure) 
                                OR (employee_in_structure.structure_id = @IdStructure) 
                                OR (employee_in_structure.structure_id = org_str.parent_id)
                                OR (employee_in_structure.structure_id IN (SELECT id FROM org_structure WHERE org_structure.id = org_structure.parent_id)))
                                ORDER BY employee_name";
                var model = await _dbConnection.QueryAsync<EmployeeInStructure>(sql, new { IdStructure = idStructure, IdEmployee = idEmployee }, transaction: _dbTransaction);
                return model.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }

        public async Task<List<EmployeeInStructure>> GetByEmployeeStructureIdHistory(int idStructure, int? idEmployee)
        {
            try
            {
                var sql = @"
                            SELECT 
                            CONCAT(employee.last_name, ' ', employee.first_name, ' ', employee.second_name) AS employee_name,
                            employee_in_structure.id AS id,
                            employee_in_structure.date_start AS date_start,
                            org_str.name as structure_name,
                            employee_in_structure.date_end AS date_end,
                            structure_post.name AS post_name,
                            employee_id
                            FROM employee_in_structure
                            left join employee on employee.id = employee_in_structure.employee_id
                            left join org_structure org_str on employee_in_structure.structure_id = org_str.id
                            left join structure_post on employee_in_structure.post_id = structure_post.id
                            WHERE 
				employee_in_structure.date_end < now() and (employee_in_structure.employee_id != @IdEmployee)
                                AND ((org_str.id = @IdStructure AND org_str.parent_id IS NULL)
                                OR (org_str.parent_id = @IdStructure) 
                                OR (employee_in_structure.structure_id = @IdStructure) 
                                OR (employee_in_structure.structure_id = org_str.parent_id)
                                OR (employee_in_structure.structure_id IN (SELECT id FROM org_structure WHERE org_structure.id = org_structure.parent_id)))
                                ORDER BY employee_in_structure.date_end DESC";
                var model = await _dbConnection.QueryAsync<EmployeeInStructure>(sql, new { IdStructure = idStructure, IdEmployee = idEmployee }, transaction: _dbTransaction);
                return model.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }

        public async Task<List<EmployeeInStructureHeadofStructures>> DashboardHeadOfStructures(int employee_id)
        {
            try
            {
                var sql = @"WITH RECURSIVE OrgHierarchy AS (
                            SELECT org.name AS structure_name, org.id AS id, org.parent_id
                            FROM employee_in_structure eis
                            LEFT JOIN structure_post sp ON eis.post_id = sp.id
                            LEFT JOIN org_structure org ON eis.structure_id = org.id
                            WHERE eis.employee_id = @employee_id AND sp.code = 'head_structure'
                            UNION ALL
                            SELECT child.name AS structure_name, child.id AS id, child.parent_id
                            FROM org_structure child
                            INNER JOIN OrgHierarchy parent ON child.parent_id = parent.id
                            )
                            SELECT * 
                            FROM OrgHierarchy";
                var model = await _dbConnection.QueryAsync<EmployeeInStructureHeadofStructures>(sql, new { employee_id }, transaction: _dbTransaction);
                return model.ToList();

            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }



        public async Task<List<OrgStructure>> HeadOfStructures(int employee_id)
        {
            try
            {
                var sql = @"
                            select org.* from employee_in_structure eis
left join structure_post sp on eis.post_id = sp.id
left join org_structure org on eis.structure_id = org.id
where employee_id = @employee_id and (sp.code = 'head_structure' or sp.code = 'financial_plan' or sp.code = 'accountant')
";
                var model = await _dbConnection.QueryAsync<OrgStructure>(sql, new { employee_id }, transaction: _dbTransaction);
                return model.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }
        public async Task<List<DashboardStructures>> DashboardStructures(int employee_id)
        {
            try
            {
                var sql = @"WITH RECURSIVE OrgHierarchy AS (
    SELECT org.name AS structure_name, org.id AS id, org.parent_id
    FROM employee_in_structure eis
    LEFT JOIN structure_post sp ON eis.post_id = sp.id
    LEFT JOIN org_structure org ON eis.structure_id = org.id
    WHERE eis.employee_id = @employee_id AND sp.code = 'head_structure'
    UNION ALL
    SELECT org.name AS structure_name, org.id AS id, org.parent_id
    FROM employee_in_structure eis
    LEFT JOIN structure_post sp ON eis.post_id = sp.id
    LEFT JOIN org_structure org ON eis.structure_id = org.id
    WHERE eis.employee_id = @employee_id 
      AND sp.code = 'employee'
      AND NOW() >= eis.date_start
	AND ((NOW() >= eis.date_start AND (eis.date_end > NOW() OR eis.date_end IS NULL)) )
    UNION ALL
    SELECT child.name AS structure_name, child.id AS id, child.parent_id
    FROM org_structure child
    INNER JOIN OrgHierarchy parent ON child.parent_id = parent.id
    WHERE EXISTS (
        SELECT 1
        FROM employee_in_structure eis
        LEFT JOIN structure_post sp ON eis.post_id = sp.id
        WHERE eis.employee_id = @employee_id AND sp.code = 'head_structure'
            )
        )
        SELECT * 
        FROM OrgHierarchy";
                var model = await _dbConnection.QueryAsync<DashboardStructures>(sql, new { employee_id }, transaction: _dbTransaction);
                return model.ToList();

            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }

        public async Task<List<DashboardServices>> DashboardServices(int employee_id)
        {
            try
            {
                var sql = @"
                            select service.id as id, service.name as service_name
                            from employee_in_structure eis
                            left join structure_post sp on eis.post_id = sp.id
                            left join workflow_task_template wtt on eis.structure_id = wtt.structure_id
                            left join service on wtt.workflow_id = service.workflow_id
                            where employee_id = @employee_id
                            group by service.id
                    ";
                var model = await _dbConnection.QueryAsync<DashboardServices>(sql, new { employee_id }, transaction: _dbTransaction);
                return model.ToList();

            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }



        public async Task<int> Add(EmployeeInStructure domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new EmployeeInStructure
                {
                    employee_id = domain.employee_id,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    structure_id = domain.structure_id,
                    is_temporary = domain.is_temporary,
                    post_id = domain.post_id
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO employee_in_structure(employee_id, date_start, date_end, structure_id, created_at, created_by, updated_at, updated_by, post_id, is_temporary) 
                            VALUES (@employee_id, @date_start, @date_end, @structure_id, @created_at, @created_by, @updated_at, @updated_by, @post_id, @is_temporary) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add EmployeeInStructure", ex);
            }
        }



        public async Task Update(EmployeeInStructure domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new EmployeeInStructure
                {
                    id = domain.id,
                    employee_id = domain.employee_id,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    structure_id = domain.structure_id,
                    is_temporary = domain.is_temporary,
                    post_id = domain.post_id
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE employee_in_structure SET employee_id = @employee_id, date_start = @date_start, 
                                date_end = @date_end, structure_id = @structure_id, updated_at = @updated_at, updated_by = @updated_by, post_id = @post_id, is_temporary = @is_temporary WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update EmployeeInStructure", ex);
            }
        }

        public async Task<PaginatedList<EmployeeInStructure>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM employee_in_structure OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<EmployeeInStructure>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM employee_in_structure";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<EmployeeInStructure>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM employee_in_structure WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("EmployeeInStructure not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete EmployeeInStructure", ex);
            }
        }
        public async Task<List<EmployeeInStructure>> GetEmployeesHeadStructures(int employee_id)
        {
            try
            {
                var sql = @"
SELECT eis.* FROM employee_in_structure eis
left join structure_post post on eis.post_id = post.id
WHERE employee_id = @employee_id and post.code = 'head_structure'
";
                var model = await _dbConnection.QueryAsync<EmployeeInStructure>(sql, new { employee_id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"EmployeeInStructure not found.", null);
                }

                return model.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete EmployeeInStructure", ex);
            }
        }

        /// <summary>
        /// Получает информацию о сотрудниках по списку ID из employee_in_structure
        /// Включает полную информацию: employee, structure_post, org_structure
        /// Используется для получения данных назначенных исполнителей
        /// </summary>
        /// <param name="ids">Список ID записей employee_in_structure</param>
        /// <returns>Список сотрудников с полной информацией о должности и отделе</returns>
        public async Task<List<EmployeeInStructure>> GetByIdsAsync(List<int> ids)
        {
            if (ids == null || !ids.Any())
                return new List<EmployeeInStructure>();

            try
            {
                var sql = @"
            SELECT 
                eis.id,
                eis.employee_id,
                eis.date_start,
                eis.date_end,
                eis.structure_id,
                eis.post_id,
                eis.is_temporary,
                -- Полное имя сотрудника: ""Иванов Иван Иванович""
                CONCAT(e.last_name, ' ', e.first_name, ' ', COALESCE(e.second_name, '')) as employee_fullname,
                -- Краткое имя для списков: ""Иванов И.И.""
                e.last_name || ' ' || 
                LEFT(e.first_name, 1) || '.' || 
                COALESCE(LEFT(e.second_name, 1) || '.', '') as employee_name,
                -- Информация о должности
                sp.name as post_name,
                sp.code as post_code,
                -- Информация о структуре/отделе
                os.name as structure_name,
                os.code as structure_code
            FROM employee_in_structure eis
            INNER JOIN employee e ON eis.employee_id = e.id
            LEFT JOIN structure_post sp ON eis.post_id = sp.id
            LEFT JOIN org_structure os ON eis.structure_id = os.id
            WHERE eis.id = ANY(@Ids)
            ORDER BY e.last_name, e.first_name";

                var result = await _dbConnection.QueryAsync<EmployeeInStructure>(
                    sql,
                    new { Ids = ids.ToArray() },
                    transaction: _dbTransaction
                );

                return result.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure by IDs", ex);
            }
        }

        /// <summary>
        /// Получает активных сотрудников по отделу и должности на указанную дату
        /// Проверяет date_start <= checkDate AND (date_end IS NULL OR date_end >= checkDate)
        /// </summary>
        /// <param name="structureId">ID структуры (отдела)</param>
        /// <param name="postId">ID должности</param>
        /// <param name="asOfDate">Дата проверки (по умолчанию - текущая)</param>
        /// <returns>Список активных сотрудников</returns>
        public async Task<List<EmployeeInStructure>> GetActiveByStructureAndPostAsync(
            int structureId,
            int postId,
            DateTime? asOfDate = null)
        {
            var checkDate = asOfDate ?? DateTime.UtcNow;

            try
            {
                var sql = @"
            SELECT 
                eis.id,
                eis.employee_id,
                eis.date_start,
                eis.date_end,
                eis.structure_id,
                eis.post_id,
                eis.is_temporary,
                -- Полное имя сотрудника: ""Иванов Иван Иванович""
                CONCAT(e.last_name, ' ', e.first_name, ' ', COALESCE(e.second_name, '')) as employee_fullname,
                -- Краткое имя для списков: ""Иванов И.И.""
                e.last_name || ' ' || 
                LEFT(e.first_name, 1) || '.' || 
                COALESCE(LEFT(e.second_name, 1) || '.', '') as employee_name,
                -- Информация о должности
                sp.name as post_name,
                sp.code as post_code,
                -- Информация о структуре/отделе
                os.name as structure_name,
                os.code as structure_code
            FROM employee_in_structure eis
            INNER JOIN employee e ON eis.employee_id = e.id
            LEFT JOIN structure_post sp ON eis.post_id = sp.id
            LEFT JOIN org_structure os ON eis.structure_id = os.id
            WHERE eis.structure_id = @StructureId 
                AND eis.post_id = @PostId
                AND eis.date_start <= @CheckDate
                AND (eis.date_end IS NULL OR eis.date_end >= @CheckDate)
            ORDER BY e.last_name, e.first_name";

                var result = await _dbConnection.QueryAsync<EmployeeInStructure>(
                    sql,
                    new
                    {
                        StructureId = structureId,
                        PostId = postId,
                        CheckDate = checkDate
                    },
                    transaction: _dbTransaction
                );

                return result.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get active EmployeeInStructure by structure and post", ex);
            }
        }

    }
}
