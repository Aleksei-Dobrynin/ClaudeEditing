using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;

namespace Infrastructure.Repositories
{
    public class service_pathRepository : Iservice_pathRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public service_pathRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<service_path>> GetAll()
        {
            try
            {
                var sql = @"
                    SELECT 
                        sp.*,
                        s.name as service_name,
                        COUNT(ps.id) as steps_count
                    FROM ""service_path"" sp
                    LEFT JOIN service s ON s.id = sp.service_id
                    LEFT JOIN path_step ps ON ps.path_id = sp.id
                    WHERE sp.is_active = true
                    GROUP BY sp.id, s.name
                    ORDER BY s.name, sp.name";

                var models = await _dbConnection.QueryAsync<service_path>(
                    sql,
                    transaction: _dbTransaction
                );

                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get service_path", ex);
            }
        }

        public async Task<int> Add(service_path domain)
        {
            try
            {
                var model = new service_pathModel
                {
                    id = domain.id,
                    updated_by = domain.updated_by,
                    service_id = domain.service_id,
                    name = domain.name,
                    description = domain.description,
                    is_default = domain.is_default,
                    is_active = domain.is_active,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                };
                var sql = @"INSERT INTO ""service_path""(""updated_by"", ""service_id"", ""name"", ""description"", ""is_default"", ""is_active"", ""created_at"", ""updated_at"", ""created_by"") 
                VALUES (@updated_by, @service_id, @name, @description, @is_default, @is_active, @created_at, @updated_at, @created_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add service_path", ex);
            }
        }

        public async Task Update(service_path domain)
        {
            try
            {
                var model = new service_pathModel
                {
                    id = domain.id,
                    updated_by = domain.updated_by,
                    service_id = domain.service_id,
                    name = domain.name,
                    description = domain.description,
                    is_default = domain.is_default,
                    is_active = domain.is_active,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                };
                var sql = @"UPDATE ""service_path"" SET ""id"" = @id, ""updated_by"" = @updated_by, ""service_id"" = @service_id, ""name"" = @name, ""description"" = @description, ""is_default"" = @is_default, ""is_active"" = @is_active, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update service_path", ex);
            }
        }

        public async Task<PaginatedList<service_path>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                // Добавлены JOIN'ы для получения service_name и steps_count
                var sql = @"
                    SELECT 
                        sp.*,
                        s.name as service_name,
                        COUNT(ps.id) as steps_count
                    FROM ""service_path"" sp
                    LEFT JOIN service s ON s.id = sp.service_id
                    LEFT JOIN path_step ps ON ps.path_id = sp.id
                    GROUP BY sp.id, s.name
                    ORDER BY sp.id
                    OFFSET @pageSize * (@pageNumber - 1) 
                    LIMIT @pageSize";

                var models = await _dbConnection.QueryAsync<service_path>(
                    sql,
                    new { pageSize, pageNumber },
                    transaction: _dbTransaction
                );

                var sqlCount = @"SELECT Count(*) FROM ""service_path""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<service_path>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get service_paths", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""service_path"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete service_path", ex);
            }
        }

        public async Task<service_path> GetOne(int id)
        {
            try
            {
                // Добавлены JOIN'ы для получения service_name и steps_count
                var sql = @"
                    SELECT 
                        sp.*,
                        s.name as service_name,
                        COUNT(ps.id) as steps_count
                    FROM ""service_path"" sp
                    LEFT JOIN service s ON s.id = sp.service_id
                    LEFT JOIN path_step ps ON ps.path_id = sp.id
                    WHERE sp.id = @id
                    GROUP BY sp.id, s.name
                    LIMIT 1";

                var models = await _dbConnection.QueryAsync<service_path>(
                    sql,
                    new { id },
                    transaction: _dbTransaction
                );

                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get service_path", ex);
            }
        }

        public async Task<List<service_path>> GetByservice_id(int service_id)
        {
            try
            {
                // Добавлены JOIN'ы для получения service_name и steps_count
                var sql = @"
                    SELECT 
                        sp.*,
                        s.name as service_name,
                        COUNT(ps.id) as steps_count
                    FROM ""service_path"" sp
                    LEFT JOIN service s ON s.id = sp.service_id
                    LEFT JOIN path_step ps ON ps.path_id = sp.id
                    WHERE sp.service_id = @service_id
                    GROUP BY sp.id, s.name
                    ORDER BY sp.name";

                var models = await _dbConnection.QueryAsync<service_path>(
                    sql,
                    new { service_id },
                    transaction: _dbTransaction
                );

                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get service_path by service_id", ex);
            }
        }
        /// <summary>
        /// Получить услугу с активным путем, шагами, документами и подписантами
        /// </summary>
        public async Task<ServiceWithPathAndSignersModel?> GetServiceWithPathAndSigners(int serviceId)
        {
            try
            {
                // 1. Получить услугу
                var serviceSql = @"
                    SELECT id, name, description, is_active, created_at 
                    FROM service 
                    WHERE id = @serviceId AND is_active = true";
                    
                var service = await _dbConnection.QueryFirstOrDefaultAsync<ServiceWithPathAndSignersModel>(
                    serviceSql, 
                    new { serviceId },
                    transaction: _dbTransaction
                );

                if (service == null)
                {
                    return null;
    }

                // 2. Получить активный путь (service_path)
                var pathSql = @"
                    SELECT id, service_id, name, description, is_default, is_active, created_at, updated_at
                    FROM service_path 
                    WHERE service_id = @serviceId AND is_active = true
                    LIMIT 1";
                    
                var servicePath = await _dbConnection.QueryFirstOrDefaultAsync<ServicePathWithStepsModel>(
                    pathSql, 
                    new { serviceId },
                    transaction: _dbTransaction
                );

                if (servicePath == null)
                {
                    // Если нет активного пути, возвращаем услугу без пути
                    service.service_path = null;
                    return service;
                }

                // 3. Получить все шаги пути
                var stepsSql = @"
                    SELECT 
                        ps.id,
                        ps.path_id,
                        ps.order_number,
                        ps.name,
                        ps.description,
                        ps.step_type,
                        ps.estimated_days,
                        ps.is_required,
                        ps.wait_for_previous_steps,
                        ps.responsible_org_id,
                        os.name as responsible_org_name
                    FROM path_step ps
                    LEFT JOIN org_structure os ON os.id = ps.responsible_org_id
                    WHERE ps.path_id = @pathId
                    ORDER BY ps.order_number";
                    
                var steps = await _dbConnection.QueryAsync<PathStepWithDocumentsModel>(
                    stepsSql, 
                    new { pathId = servicePath.id },
                    transaction: _dbTransaction
                );

                var stepsList = steps.ToList();

                // 4. Для каждого шага получить документы и подписантов
                foreach (var step in stepsList)
                {
                    // 4.1. Получить обязательные документы шага
                    var documentsSql = @"
                        SELECT 
                            srd.id,
                            srd.step_id,
                            srd.document_type_id,
                            ad.name as document_type_name,
                            srd.is_required
                        FROM step_required_document srd
                        LEFT JOIN application_document ad ON ad.id = srd.document_type_id
                        WHERE srd.step_id = @stepId";
                        
                    var documents = await _dbConnection.QueryAsync<RequiredDocumentWithApproversModel>(
                        documentsSql, 
                        new { stepId = step.id },
                        transaction: _dbTransaction
                    );

                    var documentsList = documents.ToList();

                    // 4.2. Для каждого документа получить подписантов
                    foreach (var document in documentsList)
                    {
                        var approversSql = @"
                            SELECT 
                                da.id,
                                da.step_doc_id,
                                da.approval_order,
                                da.position_id,
                                sp.name as position_name,
                                da.department_id,
                                os.name as department_name,
                                da.is_required
                            FROM document_approver da
                            LEFT JOIN structure_post sp ON sp.id = da.position_id
                            LEFT JOIN org_structure os ON os.id = da.department_id
                            WHERE da.step_doc_id = @documentId
                            ORDER BY da.approval_order";
                            
                        var approvers = await _dbConnection.QueryAsync<DocumentApproverDetailModel>(
                            approversSql, 
                            new { documentId = document.id },
                            transaction: _dbTransaction
                        );

                        document.approvers = approvers.ToList();
                    }

                    step.required_documents = documentsList;
                }

                servicePath.steps = stepsList;
                service.service_path = servicePath;

                return service;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to get service {serviceId} with path and signers", ex);
            }
        }

        /// <summary>
        /// Получить все активные услуги с путями, шагами, документами и подписантами
        /// </summary>
        public async Task<List<ServiceWithPathAndSignersModel>> GetAllServicesWithPathsAndSigners()
        {
            try
            {
                // 1. Получить все активные услуги
                var servicesSql = @"
                    SELECT id, name, description, is_active, created_at 
                    FROM service 
                    WHERE is_active = true
                    ORDER BY name";
                    
                var services = await _dbConnection.QueryAsync<ServiceWithPathAndSignersModel>(
                    servicesSql,
                    transaction: _dbTransaction
                );

                var servicesList = services.ToList();

                // 2. Для каждой услуги загрузить путь с данными
                foreach (var service in servicesList)
                {
                    var serviceWithData = await GetServiceWithPathAndSigners(service.id);
                    if (serviceWithData != null && serviceWithData.service_path != null)
                    {
                        service.service_path = serviceWithData.service_path;
                    }
                }

                return servicesList;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get all services with paths and signers", ex);
            }
        }
        
    }
}
