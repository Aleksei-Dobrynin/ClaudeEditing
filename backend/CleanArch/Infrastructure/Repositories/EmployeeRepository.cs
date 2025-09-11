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
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public EmployeeRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<Employee>> GetAll()
        {
            try
            {
                var sql = @"SELECT employee.id, last_name, first_name, second_name, pin, employee.remote_id, user_id, telegram, email, guid, 
                            STRING_AGG(structure_post.name, ', ') AS post_name, 
                            STRING_AGG(org_structure.name, ', ') AS structure_name 
                            FROM employee
                            left join employee_in_structure on employee_in_structure.employee_id = employee.id
                            left join structure_post on employee_in_structure.post_id = structure_post.id
                            left join org_structure on org_structure.id = employee_in_structure.structure_id
							group by employee.id, 
							last_name, 
							first_name, 
							second_name, 
							pin, 
							employee.remote_id, 
							user_id, 
							telegram, 
							email, 
							guid
							ORDER BY concat(last_name, '', first_name,'', second_name)
                            ";
                var models = await _dbConnection.QueryAsync<Employee>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Employee", ex);
            }
        }
        public async Task<List<Employee>> GetAllRegister()
        {
            try
            {
                var sql = @"select e.*, concat(e.last_name, ' ', e.first_name, ' ', e.second_name) full_name from employee_in_structure eis
    left join employee e on eis.employee_id = e.id
    left join structure_post post on post.id = eis.post_id
    where post.code = 'registrar'
group by e.id
order by full_name
                            ";
                var models = await _dbConnection.QueryAsync<Employee>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Employee", ex);
            }
        }
        public async Task<List<Employee>> GetEmployeesByEmail(string email)
        {
            try
            {
                var sql = "SELECT id, last_name, first_name, second_name, pin, remote_id, user_id, telegram, email, guid FROM employee where email = @email";
                var models = await _dbConnection.QueryAsync<Employee>(sql, new { email }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Employee", ex);
            }
        }

        public async Task<Employee> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, last_name, first_name, second_name, pin, remote_id, user_id, telegram, email, guid FROM employee WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Employee>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Employee with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Employee", ex);
            }
        }
        public async Task<int> GetUserIdByEmployeeId(int id)
        {
            try
            {
                var sql = @"SELECT u.id FROM employee e left join ""User"" u on e.user_id = u.""userId"" WHERE e.id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<int>(sql, new { Id = id }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Employee", ex);
            }
        }
        public async Task<Employee> GetOneByGuid(string guid)
        {
            try
            {
                var sql = "SELECT id, last_name, first_name, second_name, pin, remote_id, user_id, telegram, email, guid FROM employee WHERE guid=@guid";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Employee>(sql, new { guid }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Employee with guid {guid} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Employee", ex);
            }
        }

        public async Task<Employee> GetByUserId(string userId)
        {
            try
            {
                var sql = "SELECT * FROM employee WHERE user_id = @Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Employee>(sql, new { Id = userId }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Employee with ID {userId} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Employee", ex);
            }
        }


        public async Task<Employee> GetByUserId(int userId)
        {
            try
            {
                var sql = @$"
SELECT e.* FROM employee e
left join ""User"" u on e.user_id = u.""userId"" 
WHERE u.id = @userId
";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Employee>(sql, new { userId }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Employee with ID {userId} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Employee", ex);
            }
        }
        public async Task<int?> GetUserIdByEmployeeID(int id)
        {
            try
            {
                var sql = @"select u.id from employee emp
left join ""User"" u on emp.user_id = u.""userId""
where emp.id = @id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<int?>(sql, new { id }, transaction: _dbTransaction);

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Employee", ex);
            }
        }
        
        public async Task<int> Add(Employee domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Employee
                {
                    last_name = domain.last_name,
                    first_name = domain.first_name,
                    second_name = domain.second_name,
                    pin = domain.pin,
                    remote_id = domain.remote_id,
                    user_id = domain.user_id,
                    telegram = domain.telegram,
                    email = domain.email,
                    guid = domain.guid,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO employee(last_name, first_name, second_name, pin, remote_id, user_id, created_at, created_by, updated_at, updated_by, telegram, email, guid) VALUES (@last_name, @first_name, @second_name, @pin, @remote_id, @user_id, @created_at, @created_by, @updated_at, @updated_by, @telegram, @email, @guid) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add Employee", ex);
            }
        }

        public async Task Update(Employee domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Employee
                {
                    id = domain.id,
                    last_name = domain.last_name,
                    first_name = domain.first_name,
                    second_name = domain.second_name,
                    pin = domain.pin,
                    remote_id = domain.remote_id,
                    user_id = domain.user_id,
                    telegram = domain.telegram,
                    email= domain.email,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE employee SET last_name = @last_name, first_name = @first_name, second_name = @second_name, pin = @pin, remote_id = @remote_id, user_id = @user_id, updated_at = @updated_at, updated_by = @updated_by, telegram = @telegram, email = @email WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Employee", ex);
            }
        }

        public async Task<PaginatedList<Employee>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM employee OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<Employee>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM employee";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<Employee>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Employee", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM employee WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("Employee not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete Employee", ex);
            }
        }
        
        public async Task<Employee> GetUser()
        {
            try
            {
                var user = await _userRepository.GetUserID();
                var sql = "SELECT e.*, u.id as uid \r\nFROM Employee e\r\nJOIN \"User\" u ON e.\"user_id\" = u.\"userId\"\r\nWHERE u.id = @UId";
                //var affected = await _dbConnection.ExecuteAsync(sql, new { Email = email }, transaction: _dbTransaction);
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Employee>(sql, new { UId = user }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Employee not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Employee", ex);
            }
        }
        
        public async Task<EmployeeInStructure> GetEmployeeInStructureByUserEmail(string email)
        {
            try
            {
                var sql = @"SELECT employee_in_structure.id
                            FROM Employee e JOIN ""User"" u ON e.""user_id"" = u.""userId""
                            LEFT JOIN employee_in_structure on e.id = employee_in_structure.employee_id 
                            WHERE u.email = @Email";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<EmployeeInStructure>(sql, new { Email = email }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        } 
        
        public async Task<EmployeeInStructure> GetEmployeeInStructure()
        {
            var user = await _userRepository.GetUserID();
            try
            {
                var sql = @"SELECT *
                            FROM Employee e JOIN ""User"" u ON e.""user_id"" = u.""userId""
                            LEFT JOIN employee_in_structure on e.id = employee_in_structure.employee_id 
                            WHERE u.id = @UId";
                var model = await _dbConnection.QueryFirstOrDefaultAsync<EmployeeInStructure>(sql, new { UId = user }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }

        public async Task<Employee> GetEmployeeByToken()
        {
            var user = await _userRepository.GetUserUID();
            try
            {
                var sql = @"SELECT *
                            FROM employee
                            WHERE ""user_id"" = @UId";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Employee>(sql, new { UId = user }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeInStructure", ex);
            }
        }
        public async Task<Employee> UpdateInitials(EmployeeInitials domain)
        {
            try
            {
                var model = new EmployeeInitials
                {
                    id = domain.id,
                    last_name = domain.last_name,
                    first_name = domain.first_name,
                    second_name = domain.second_name,
                    pin = domain.pin
                };
                var sql = "UPDATE employee SET last_name = @last_name, first_name = @first_name, second_name = @second_name, pin = @pin WHERE id = @id RETURNING *";
                var affected = await _dbConnection.QueryAsync<Employee>(sql, model, transaction: _dbTransaction);
                if (affected.Count() == 0 || affected.Count() >1)
                {
                    throw new RepositoryException("Not found", null);
                }
                return affected.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Employee", ex);
            }
        }

        public async Task<List<Employee>> GetEmployeesByApplicationStep(int applicationStepId)
        {
            try
            {
                var sql = @"
WITH 
-- Сотрудники, подписавшие документы на этом этапе
document_signers AS (
    SELECT DISTINCT
        e.id,
        e.last_name,
        e.first_name,
        e.second_name,
        e.email,
        e.pin,
        e.remote_id,
        e.user_id,
        e.telegram,
        e.guid
    FROM application_work_document awd
    JOIN file f ON f.id = awd.file_id
    JOIN file_sign fs ON fs.file_id = f.id
    JOIN employee e ON e.id = fs.employee_id
    WHERE awd.app_step_id = @ApplicationStepId
        AND awd.is_active = true
),
-- Утвердители документов этого этапа
document_approvers AS (
    SELECT DISTINCT
        e.id,
        e.last_name,
        e.first_name,
        e.second_name,
        e.email,
        e.pin,
        e.remote_id,
        e.user_id,
        e.telegram,
        e.guid
    FROM document_approval da
    JOIN employee_in_structure eis ON 
        eis.structure_id = da.department_id 
        AND eis.post_id = da.position_id
    JOIN employee e ON e.id = eis.employee_id
    WHERE da.app_step_id = @ApplicationStepId
        AND (eis.date_end IS NULL OR eis.date_end > CURRENT_DATE)
),
-- Начальник ответственного отдела
department_head AS (
    SELECT DISTINCT
        e.id,
        e.last_name,
        e.first_name,
        e.second_name,
        e.email,
        e.pin,
        e.remote_id,
        e.user_id,
        e.telegram,
        e.guid
    FROM application_step apps
    JOIN path_step ps ON ps.id = apps.step_id
    JOIN employee_in_structure eis ON eis.structure_id = ps.responsible_org_id
    JOIN structure_post sp ON sp.id = eis.post_id AND sp.code = 'head_structure'
    JOIN employee e ON e.id = eis.employee_id
    WHERE apps.id = @ApplicationStepId
        AND (eis.date_end IS NULL OR eis.date_end > CURRENT_DATE)
)
-- Объединяем все результаты и убираем дубликаты
SELECT DISTINCT
    id,
    last_name,
    first_name,
    second_name,
    email,
    pin,
    remote_id,
    user_id,
    telegram,
    guid
FROM (
    SELECT * FROM document_signers
    UNION
    SELECT * FROM document_approvers
    UNION
    SELECT * FROM department_head
) all_employees
ORDER BY last_name, first_name, second_name";

                var models = await _dbConnection.QueryAsync<Employee>(
                    sql,
                    new { ApplicationStepId = applicationStepId },
                    transaction: _dbTransaction
                );

                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to get employees for application step {applicationStepId}", ex);
            }
        }
    }
}


