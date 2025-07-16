using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;
using System;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class DutyPlanLogRepository : IDutyPlanLogRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public DutyPlanLogRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<DutyPlanLog>> GetAll()
        {
            try
            {
                var sql = @"SELECT dpl.*,
                       a.number AS application_number,
                       CONCAT(emp.last_name, ' ', emp.first_name, ' ', emp.second_name) AS from_employee_name,
                       STRING_AGG(f.name, ', ') AS file_names
                FROM duty_plan_log dpl
                         LEFT JOIN application a ON dpl.application_id = a.id
                         LEFT JOIN employee emp ON dpl.from_employee_id = emp.id
                         LEFT JOIN archive_object_file aof ON dpl.archive_object_id = aof.archive_object_id
                         LEFT JOIN file f ON aof.file_id = f.id
                GROUP BY dpl.id, a.number, emp.last_name, emp.first_name, emp.second_name
                ORDER BY dpl.id DESC;";
                var models = await _dbConnection.QueryAsync<DutyPlanLog>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DutyPlanLog", ex);
            }
        }

        public async Task<DutyPlanLog> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT * FROM duty_plan_log WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<DutyPlanLog>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"DutyPlanLog with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DutyPlanLog", ex);
            }
        }

        public async Task<int> Add(DutyPlanLog domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new DutyPlanLog
                {
                    application_id = domain.application_id,
                    doc_number = domain.doc_number,
                    date = domain.date,
                    from_employee_id = domain.from_employee_id,
                    archive_object_id = domain.archive_object_id,
                    created_at = DateTime.UtcNow,
                    updated_at = DateTime.UtcNow,
                    created_by = userId,
                    updated_by = userId
                };

                var sql = @"INSERT INTO duty_plan_log(application_id, doc_number, date, from_employee_id, archive_object_id, created_at, updated_at, created_by, updated_by)
                            VALUES(@application_id, @doc_number, @date, @from_employee_id, @archive_object_id, @created_at, @updated_at, @created_by, @updated_by)
                            RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add DutyPlanLog", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM duty_plan_log WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("DutyPlanLog not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete DutyPlanLog", ex);
            }
        }

        public async Task Update(DutyPlanLog domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new DutyPlanLog
                {
                    id = domain.id,
                    application_id = domain.application_id,
                    doc_number = domain.doc_number,
                    date = domain.date,
                    from_employee_id = domain.from_employee_id,
                    archive_object_id = domain.archive_object_id,
                    updated_at = DateTime.UtcNow,
                    updated_by = userId
                };

                var sql = @"UPDATE duty_plan_log SET application_id = @application_id, doc_number = @doc_number, date = @date,
                             from_employee_id = @from_employee_id, archive_object_id = @archive_object_id, updated_at = @updated_at, updated_by = @updated_by
                             WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update DutyPlanLog", ex);
            }
        }

        public async Task<PaginatedList<DutyPlanLog>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM duty_plan_log OFFSET @pageSize * (@pageNumber - 1) LIMIT @pageSize;";
                var models = await _dbConnection.QueryAsync<DutyPlanLog>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM duty_plan_log";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<DutyPlanLog>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DutyPlanLog", ex);
            }
        }
        
        public async Task<List<DutyPlanLog>> GetByFilter(ArchiveLogFilter filter)
        {
            try
            {
                var sql = @"SELECT dpl.*,
                       a.number AS application_number,
                       CONCAT(emp.last_name, ' ', emp.first_name, ' ', emp.second_name) AS from_employee_name,
                       STRING_AGG(f.name, ', ') AS file_names
                FROM duty_plan_log dpl
                         LEFT JOIN application a ON dpl.application_id = a.id
                         LEFT JOIN employee emp ON dpl.from_employee_id = emp.id
                         LEFT JOIN archive_object_file aof ON dpl.archive_object_id = aof.archive_object_id
                         LEFT JOIN file f ON aof.file_id = f.id
                WHERE 1=1";
                
                var parameters = new DynamicParameters();
                
                if (!string.IsNullOrWhiteSpace(filter.doc_number))
                {
                    sql += " AND dpl.doc_number ILIKE @DocNumber";
                    parameters.Add("DocNumber", $"%{filter.doc_number}%");
                }

                if (filter.employee_id > 0)
                {
                    sql += " AND dpl.from_employee_id = @FromEmployeeID";
                    parameters.Add("FromEmployeeID", filter.employee_id);
                }
                
                sql += " GROUP BY dpl.id, a.number, emp.last_name, emp.first_name, emp.second_name ORDER BY dpl.id DESC";
                
                var models = await _dbConnection.QueryAsync<DutyPlanLog>(sql, parameters, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get DutyPlanLog", ex);
            }
        }
    }
}
