using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;

namespace Infrastructure.Repositories
{
    public class application_additional_serviceRepository : Iapplication_additional_serviceRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public application_additional_serviceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<application_additional_service>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""application_additional_service""";
                var models = await _dbConnection.QueryAsync<application_additional_service>(
                    sql,
                    transaction: _dbTransaction
                );
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_additional_service", ex);
            }
        }

        public async Task<application_additional_service> GetOne(int id)
        {
            try
            {
                var sql = @"
                    SELECT aas.*, 
                           sp.name as service_path_name,
                           s.name as service_name,
                           (e.last_name || ' ' || e.first_name) as requested_by_name,
                           ps.name as added_at_step_name
                    FROM ""application_additional_service"" aas
                    LEFT JOIN service_path sp ON sp.id = aas.additional_service_path_id
                    LEFT JOIN service s ON s.id = sp.service_id
                    LEFT JOIN employee e ON e.id = aas.requested_by
                    LEFT JOIN application_step app_step ON app_step.id = aas.added_at_step_id
                    LEFT JOIN path_step ps ON ps.id = app_step.step_id
                    WHERE aas.id = @id";

                var result = await _dbConnection.QueryFirstOrDefaultAsync<application_additional_service>(
                    sql,
                    new { id },
                    transaction: _dbTransaction
                );

                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_additional_service", ex);
            }
        }

        public async Task<List<application_additional_service>> GetByApplicationId(int applicationId)
        {
            try
            {
                var sql = @"
            SELECT aas.*, 
                   sp.name as service_path_name,
                   s.name as service_name,
                   CONCAT(e.last_name, ' ', e.first_name, ' ', COALESCE(e.second_name, '')) as requested_by_name,
                   ps.name as added_at_step_name
            FROM ""application_additional_service"" aas
            LEFT JOIN service_path sp ON sp.id = aas.additional_service_path_id
            LEFT JOIN service s ON s.id = sp.service_id
            LEFT JOIN employee e ON e.id = aas.requested_by
            LEFT JOIN application_step app_step ON app_step.id = aas.added_at_step_id
            LEFT JOIN path_step ps ON ps.id = app_step.step_id
            WHERE aas.application_id = @applicationId
            ORDER BY aas.requested_at DESC";

                var result = await _dbConnection.QueryAsync<application_additional_service>(
                    sql,
                    new { applicationId },
                    transaction: _dbTransaction
                );

                return result.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_additional_services", ex);
            }
        }

        public async Task<application_additional_service> GetActiveByServicePathId(int applicationId, int servicePathId)
        {
            try
            {
                var sql = @"
                    SELECT * 
                    FROM ""application_additional_service"" 
                    WHERE application_id = @applicationId 
                    AND additional_service_path_id = @servicePathId
                    AND status NOT IN ('cancelled')";

                var result = await _dbConnection.QueryFirstOrDefaultAsync<application_additional_service>(
                    sql,
                    new { applicationId, servicePathId },
                    transaction: _dbTransaction
                );

                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to check existing service", ex);
            }
        }

        public async Task<int> GetActiveServicesCount(int applicationId)
        {
            try
            {
                var sql = @"
                    SELECT COUNT(*) 
                    FROM ""application_additional_service"" 
                    WHERE application_id = @applicationId 
                    AND status NOT IN ('cancelled')";

                var count = await _dbConnection.ExecuteScalarAsync<int>(
                    sql,
                    new { applicationId },
                    transaction: _dbTransaction
                );

                return count;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to count active services", ex);
            }
        }

        public async Task<int> Add(application_additional_service domain)
        {
            try
            {
                var sql = @"
                    INSERT INTO ""application_additional_service"" (
                        application_id,
                        additional_service_path_id,
                        added_at_step_id,
                        insert_after_step_order,
                        add_reason,
                        requested_by,
                        requested_at,
                        status,
                        created_by,
                        created_at
                    ) VALUES (
                        @application_id,
                        @additional_service_path_id,
                        @added_at_step_id,
                        @insert_after_step_order,
                        @add_reason,
                        @requested_by,
                        NOW(),
                        @status,
                        @created_by,
                        NOW()
                    ) RETURNING id";

                var id = await _dbConnection.ExecuteScalarAsync<int>(
                    sql,
                    domain,
                    transaction: _dbTransaction
                );

                return id;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to create application_additional_service", ex);
            }
        }

        public async Task Update(application_additional_service domain)
        {
            try
            {
                var sql = @"
                    UPDATE ""application_additional_service"" 
                    SET status = @status,
                        first_added_step_id = @first_added_step_id,
                        last_added_step_id = @last_added_step_id,
                        completed_at = @completed_at,
                        updated_at = NOW(),
                        updated_by = @updated_by
                    WHERE id = @id";

                await _dbConnection.ExecuteAsync(
                    sql,
                    domain,
                    transaction: _dbTransaction
                );
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_additional_service", ex);
            }
        }

        public async Task CompleteService(int id)
        {
            try
            {
                var sql = @"
                    UPDATE ""application_additional_service"" 
                    SET status = 'completed',
                        completed_at = NOW(),
                        updated_at = NOW()
                    WHERE id = @id";

                await _dbConnection.ExecuteAsync(
                    sql,
                    new { id },
                    transaction: _dbTransaction
                );
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to complete service", ex);
            }
        }

        public async Task CancelService(int id)
        {
            try
            {
                var sql = @"
                    UPDATE ""application_additional_service"" 
                    SET status = 'cancelled',
                        updated_at = NOW()
                    WHERE id = @id";

                await _dbConnection.ExecuteAsync(
                    sql,
                    new { id },
                    transaction: _dbTransaction
                );
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to cancel service", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = @"DELETE FROM ""application_additional_service"" WHERE id = @id";
                await _dbConnection.ExecuteAsync(sql, new { id }, transaction: _dbTransaction);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete application_additional_service", ex);
            }
        }
    }
}