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
    public class application_subtask_assigneeRepository : Iapplication_subtask_assigneeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public application_subtask_assigneeRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<application_subtask_assignee>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""application_subtask_assignee""";
                var models = await _dbConnection.QueryAsync<application_subtask_assignee>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_subtask_assignee", ex);
            }
        }

        public async Task<int> Add(application_subtask_assignee domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new application_subtask_assigneeModel
                {
                    id = domain.id,
                    structure_employee_id = domain.structure_employee_id,
                    application_subtask_id = domain.application_subtask_id,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO ""application_subtask_assignee""(""structure_employee_id"", ""application_subtask_id"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@structure_employee_id, @application_subtask_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_subtask_assignee", ex);
            }
        }

        public async Task Update(application_subtask_assignee domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new application_subtask_assigneeModel
                {
                    id = domain.id,
                    structure_employee_id = domain.structure_employee_id,
                    application_subtask_id = domain.application_subtask_id,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE ""application_subtask_assignee"" SET ""id"" = @id, ""structure_employee_id"" = @structure_employee_id, ""application_subtask_id"" = @application_subtask_id, ""updated_at"" = @updated_at, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_subtask_assignee", ex);
            }
        }

        public async Task<PaginatedList<application_subtask_assignee>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_subtask_assignee"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<application_subtask_assignee>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""application_subtask_assignee""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<application_subtask_assignee>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_subtask_assignees", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""application_subtask_assignee"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_subtask_assignee", ex);
            }
        }
        public async Task<application_subtask_assignee> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_subtask_assignee"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<application_subtask_assignee>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_subtask_assignee", ex);
            }
        }

        
        public async Task<List<application_subtask_assignee>> GetBystructure_employee_id(int structure_employee_id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_subtask_assignee\" WHERE \"structure_employee_id\" = @structure_employee_id";
                var models = await _dbConnection.QueryAsync<application_subtask_assignee>(sql, new { structure_employee_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_subtask_assignee", ex);
            }
        }
        
        public async Task<List<application_subtask_assignee>> GetByapplication_subtask_id(int application_subtask_id)
        {
            try
            {
                var sql = @"
SELECT assig.*, CONCAT(employee.last_name, ' ', employee.first_name, ' ', employee.second_name) AS employee_name, sp.name AS employee_ocupation FROM ""application_subtask_assignee"" assig
    left join employee_in_structure st on st.id = assig.structure_employee_id
    left join structure_post sp on st.post_id = sp.id
    left join employee on employee.id = st.employee_id
WHERE assig.""application_subtask_id"" = @application_subtask_id";
                var models = await _dbConnection.QueryAsync<application_subtask_assignee>(sql, new { application_subtask_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_subtask_assignee", ex);
            }
        }
        
    }
}
