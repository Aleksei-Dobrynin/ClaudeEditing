using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Domain;
using Infrastructure.FillLogData;
using Npgsql;

namespace Infrastructure.Repositories
{
    public class ServicePriceRepository : IServicePriceRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;


        public ServicePriceRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<ServicePrice> GetByApplicationAndStructure(int applicationId, int structureId)
        {
            var sql = @"SELECT sp.* FROM service_price sp
         LEFT JOIN application a ON sp.service_id = a.service_id
         WHERE sp.structure_id = @StructureId AND a.id = @ApplicationId LIMIT 1";
            var model = await _dbConnection.QuerySingleOrDefaultAsync<ServicePrice>(sql, new { ApplicationId = applicationId, StructureId = structureId });
            return model;
        }
        
        public async Task<List<ServicePrice>> GetAll()
        {
            var sql = @"SELECT sp.id,
       sp.service_id,
       sp.structure_id,
       sp.price,
       sp.document_template_id,
       s.name AS service_name,
       os.name AS structure_name
FROM service_price sp
         LEFT JOIN service s ON sp.service_id = s.id
         LEFT JOIN org_structure os ON sp.structure_id = os.id";
            var result = await _dbConnection.QueryAsync<ServicePrice>(sql, transaction: _dbTransaction);
            return result.ToList();
        }
        
        public async Task<List<ServicePrice>> GetByStructure(int structure_id)
        {
            var sql = @"SELECT sp.id,
       sp.service_id,
       sp.structure_id,
       sp.price,
       sp.document_template_id,
       s.name AS service_name,
       os.name AS structure_name
FROM service_price sp
         LEFT JOIN service s ON sp.service_id = s.id
         LEFT JOIN org_structure os ON sp.structure_id = os.id
WHERE sp.structure_id = @structure_id";
            var result = await _dbConnection.QueryAsync<ServicePrice>(sql, new { structure_id }, transaction: _dbTransaction);
            return result.ToList();
        }
        
        public async Task<List<ServicePrice>> GetByStructureAndService(int structure_id, int service_id)
        {
            var sql = @"SELECT sp.id,
       sp.service_id,
       sp.structure_id,
       sp.price,
       sp.document_template_id,
       s.name AS service_name,
       os.name AS structure_name,
       dt.name AS document_template_name
FROM service_price sp
         LEFT JOIN service s ON sp.service_id = s.id
         LEFT JOIN org_structure os ON sp.structure_id = os.id
         LEFT JOIN ""S_DocumentTemplate"" dt ON sp.document_template_id = dt.id
WHERE sp.structure_id = @structure_id AND sp.service_id = @service_id";
            var result = await _dbConnection.QueryAsync<ServicePrice>(sql, new { structure_id, service_id }, transaction: _dbTransaction);
            return result.ToList();
        }
        
        public async Task<List<Service>> GetServiceAll()
        {
            try
            {
                var sql = @"SELECT service.id, service.name, short_name, code, description, day_count, workflow_id, price, workflow.name as workflow_name, service.is_active
FROM service
         left join workflow on workflow.id = service.workflow_id
WHERE service.id not in (select service_id from service_price)
ORDER BY service.name;";
                var models = await _dbConnection.QueryAsync<Service>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }
        
        public async Task<List<Service>> GetServiceAll(int service_id)
        {
            try
            {
                var sql = @"SELECT service.id, service.name, short_name, code, description, day_count, workflow_id, price, workflow.name as workflow_name, service.is_active
FROM service
         left join workflow on workflow.id = service.workflow_id
WHERE service.id not in (select service_id from service_price where service_id != @ServiceId)
ORDER BY service.name;";
                var models = await _dbConnection.QueryAsync<Service>(sql, new { ServiceId = service_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }
        
        public async Task<List<Service>> GetServiceByStructure(int structure_id, int? service_id)
        {
            try
            {
                var sql = @"SELECT service.id, service.name, short_name, code, description, day_count, workflow_id, price, workflow.name as workflow_name, service.is_active
FROM service
         left join workflow on workflow.id = service.workflow_id
WHERE structure_id = @StructureId AND service.id not in (select service_id from service_price where @ServiceId IS NULL OR service_id != @ServiceId)
ORDER BY service.name;";
                var models = await _dbConnection.QueryAsync<Service>(sql, new { StructureId = structure_id, ServiceId = service_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Service", ex);
            }
        }
        
        public async Task<ServicePrice> GetOneById(int id)
        {
            var sql = @"SELECT * FROM service_price WHERE id = @id LIMIT 1";
            var model = await _dbConnection.QuerySingleOrDefaultAsync<ServicePrice>(sql, new { id });
            return model;
        }
        
        public async Task<int> Add(ServicePrice domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                await FillLogDataHelper.FillLogDataCreate(domain, userId);

                var sql = @"
                    INSERT INTO service_price (service_id, structure_id, price, created_at, updated_at, created_by, updated_by, document_template_id)
                    VALUES (@service_id, @structure_id, @price, @created_at, @updated_at, @created_by, @updated_by, @document_template_id)
                    RETURNING id";

                return await _dbConnection.ExecuteScalarAsync<int>(sql, domain, _dbTransaction);
            }
            catch (PostgresException ex)
            {
                if (ex.SqlState == "23505")
                {
                    throw new InvalidOperationException("ServicePrice_already_exists", ex);
                }
                throw new RepositoryException("Failed to add ServicePrice", ex);
            }
        }
        
        public async Task Update(ServicePrice domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                await FillLogDataHelper.FillLogDataUpdate(domain, userId);

                var sql = @"
                    UPDATE service_price SET 
                        price = @price,
                        updated_at = @updated_at,
                        updated_by = @updated_by,
                        document_template_id = @document_template_id,
                        service_id = @service_id,
                        structure_id = @structure_id
                    WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, domain, _dbTransaction);
                if (affected == 0)
                    throw new RepositoryException("ServicePrice not found", null);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ServicePrice", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM service_price WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { id }, _dbTransaction);

                if (affected == 0)
                    throw new RepositoryException("ServicePrice not found", null);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ServicePrice", ex);
            }
        }
    }
}