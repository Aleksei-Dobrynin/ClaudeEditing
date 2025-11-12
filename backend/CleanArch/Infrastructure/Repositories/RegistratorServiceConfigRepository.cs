using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Application.Exceptions;
using Application.Repositories;
using Dapper;
using Domain.Entities;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class RegistratorServiceConfigRepository : IRegistratorServiceConfigRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private readonly IUserRepository _userRepository;

        public RegistratorServiceConfigRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<IEnumerable<int>> GetServiceIdsByEmployeeId(int employeeId)
        {
            try
            {
                var sql = @"
                    SELECT service_id 
                    FROM registrator_service_config 
                    WHERE employee_id = @employeeId
                    ORDER BY service_id";

                var result = await _dbConnection.QueryAsync<int>(sql,
                    new { employeeId },
                    transaction: _dbTransaction);

                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to get service IDs for employee {employeeId}", ex);
            }
        }

        public async Task<IEnumerable<RegistratorServiceConfig>> GetByEmployeeId(int employeeId)
        {
            try
            {
                var sql = @"
                    SELECT 
                        rsc.id,
                        rsc.employee_id,
                        rsc.service_id,
                        rsc.created_at,
                        rsc.created_by,
                        rsc.updated_at,
                        rsc.updated_by,
                        s.name as service_name,
                        s.code as service_code
                    FROM registrator_service_config rsc
                    LEFT JOIN service s ON s.id = rsc.service_id
                    WHERE rsc.employee_id = @employeeId
                    ORDER BY s.name";

                var result = await _dbConnection.QueryAsync<RegistratorServiceConfig>(sql,
                    new { employeeId },
                    transaction: _dbTransaction);

                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to get registrator service configs for employee {employeeId}", ex);
            }
        }

        public async Task<IEnumerable<RegistratorServiceConfig>> GetAll()
        {
            try
            {
                var sql = @"
                    SELECT 
                        rsc.id,
                        rsc.employee_id,
                        rsc.service_id,
                        rsc.created_at,
                        rsc.created_by,
                        rsc.updated_at,
                        rsc.updated_by,
                        s.name as service_name,
                        s.code as service_code,
                        CONCAT(e.last_name, ' ', e.first_name, ' ', e.second_name) as employee_full_name
                    FROM registrator_service_config rsc
                    LEFT JOIN service s ON s.id = rsc.service_id
                    LEFT JOIN employee e ON e.id = rsc.employee_id
                    ORDER BY e.last_name, s.name";

                var result = await _dbConnection.QueryAsync<RegistratorServiceConfig>(sql,
                    transaction: _dbTransaction);

                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get all registrator service configs", ex);
            }
        }

        public async Task<RegistratorServiceConfig> Add(int employeeId, int serviceId, int createdBy)
        {
            try
            {
                var model = new RegistratorServiceConfig
                {
                    employee_id = employeeId,
                    service_id = serviceId
                };

                await FillLogDataHelper.FillLogDataCreate(model, createdBy);

                var sql = @"
                    INSERT INTO registrator_service_config 
                    (employee_id, service_id, created_at, created_by, updated_at, updated_by)
                    VALUES (@employee_id, @service_id, @created_at, @created_by, @updated_at, @updated_by)
                    ON CONFLICT (employee_id, service_id) DO NOTHING
                    RETURNING *";

                var result = await _dbConnection.QueryFirstOrDefaultAsync<RegistratorServiceConfig>(sql,
                    model,
                    transaction: _dbTransaction);

                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to add service {serviceId} for employee {employeeId}", ex);
            }
        }

        public async Task Delete(int employeeId, int serviceId)
        {
            try
            {
                var sql = @"
                    DELETE FROM registrator_service_config 
                    WHERE employee_id = @employeeId AND service_id = @serviceId";

                var affected = await _dbConnection.ExecuteAsync(sql,
                    new { employeeId, serviceId },
                    transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException($"Service config not found for employee {employeeId} and service {serviceId}", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to delete service {serviceId} for employee {employeeId}", ex);
            }
        }

        public async Task DeleteById(int id)
        {
            try
            {
                var sql = "DELETE FROM registrator_service_config WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql,
                    new { id },
                    transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException($"Service config with ID {id} not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to delete service config {id}", ex);
            }
        }

        public async Task UpdateServicesForRegistrator(int employeeId, int[] serviceIds, int updatedBy)
        {
            try
            {
                // Транзакционно: удаляем старые и добавляем новые
                var deleteSql = "DELETE FROM registrator_service_config WHERE employee_id = @employeeId";
                await _dbConnection.ExecuteAsync(deleteSql, new { employeeId }, transaction: _dbTransaction);

                if (serviceIds != null && serviceIds.Any())
                {
                    var insertSql = @"
                        INSERT INTO registrator_service_config 
                        (employee_id, service_id, created_at, created_by, updated_at, updated_by)
                        VALUES (@employeeId, @serviceId, @created_at, @updatedBy, @updated_at, @updatedBy)";

                    var now = DateTime.UtcNow;
                    foreach (var serviceId in serviceIds)
                    {
                        await _dbConnection.ExecuteAsync(insertSql,
                            new
                            {
                                employeeId,
                                serviceId,
                                created_at = now,
                                updated_at = now,
                                updatedBy
                            },
                            transaction: _dbTransaction);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to update services for employee {employeeId}", ex);
            }
        }

        public async Task<bool> Exists(int employeeId, int serviceId)
        {
            try
            {
                var sql = @"
                    SELECT COUNT(1) 
                    FROM registrator_service_config 
                    WHERE employee_id = @employeeId AND service_id = @serviceId";

                var count = await _dbConnection.ExecuteScalarAsync<int>(sql,
                    new { employeeId, serviceId },
                    transaction: _dbTransaction);

                return count > 0;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to check existence of service config", ex);
            }
        }
    }
}