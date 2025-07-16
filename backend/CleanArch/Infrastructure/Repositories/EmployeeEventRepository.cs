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
    public class EmployeeEventRepository : IEmployeeEventRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public EmployeeEventRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<EmployeeEvent>> GetAll()
        {
            try
            {
                var sql = "SELECT id, date_start, date_end, event_type_id, employee_id FROM employee_event";
                var models = await _dbConnection.QueryAsync<EmployeeEvent>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeEvent", ex);
            }
        }

        public async Task<List<EmployeeEvent>> GetByIDEmployee(int idEmployee)
        {
            try
            {
                var sql =
                    @"SELECT employee_event.id, date_start, date_end, event_type_id, 
                            hrms_event_type.name as event_type_name, employee_id 
                            FROM employee_event
                            LEFT JOIN hrms_event_type ON event_type_id = hrms_event_type.id
                            WHERE employee_id=@IDEmployee";
                var models = await _dbConnection.QueryAsync<EmployeeEvent>(sql, new { IDEmployee = idEmployee },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeEvent", ex);
            }
        }

        public async Task<EmployeeEvent> GetOneByID(int id)
        {
            try
            {
                var sql =
                    "SELECT id, date_start, date_end, event_type_id, employee_id FROM employee_event WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<EmployeeEvent>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"EmployeeEvent with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeEvent", ex);
            }
        }

        public async Task<int> Add(EmployeeEvent domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new EmployeeEvent
                {
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    event_type_id = domain.event_type_id,
                    employee_id = domain.employee_id
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql =
                    "INSERT INTO employee_event(date_start, date_end, event_type_id, employee_id, created_at, updated_at, created_by, updated_by ) VALUES (@date_start, @date_end, @event_type_id, @employee_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add EmployeeEvent", ex);
            }
        }

        public async Task Update(EmployeeEvent domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new EmployeeEvent
                {
                    id = domain.id,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    event_type_id = domain.event_type_id,
                    employee_id = domain.employee_id
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql =
                    "UPDATE employee_event SET date_start = @date_start, date_end = @date_end, event_type_id = @event_type_id, employee_id = @employee_id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update EmployeeEvent", ex);
            }
        }

        public async Task<PaginatedList<EmployeeEvent>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM employee_event OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<EmployeeEvent>(sql, new { pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM employee_event";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<EmployeeEvent>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get EmployeeEvent", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM employee_event WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("EmployeeEvent not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete EmployeeEvent", ex);
            }
        }
    }
}