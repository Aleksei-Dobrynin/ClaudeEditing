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
    public class WorkflowTaskTemplateRepository : IWorkflowTaskTemplateRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public WorkflowTaskTemplateRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<WorkflowTaskTemplate>> GetAll()
        {
            try
            {
                var sql =
                    "SELECT wtt.id, wtt.workflow_id, wtt.name, wtt.\"order\", wtt.is_active, wtt.is_required, wtt.description, wtt.structure_id, wtt.type_id, os.name as structure_name " +
                    "FROM workflow_task_template wtt " +
                    "LEFT JOIN org_structure os on os.id = wtt.structure_id";
                var models = await _dbConnection.QueryAsync<WorkflowTaskTemplate>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkflowTaskTemplate", ex);
            }
        }

        public async Task<WorkflowTaskTemplate> GetOneByID(int id)
        {
            try
            {
                var sql =
                    "SELECT id, workflow_id, name, \"order\", is_active, is_required, description, structure_id, type_id FROM workflow_task_template WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<WorkflowTaskTemplate>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"WorkflowTaskTemplate with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkflowTaskTemplate", ex);
            }
        }

        public async Task<List<WorkflowTaskTemplate>> GetByidWorkflow(int idWorkflow)
        {
            try
            {
                var sql = @"SELECT workflow_task_template.id, workflow_id, workflow_task_template.name, ""order"", 
                                workflow_task_template.is_active, is_required, description, structure_id, type_id, 
                                org_structure.name as structure_name
                            FROM workflow_task_template
                            LEFT JOIN org_structure ON structure_id = org_structure.id
                            WHERE workflow_id = @IdWorkflow";
                var models = await _dbConnection.QueryAsync<WorkflowTaskTemplate>(sql, new { IdWorkflow = idWorkflow },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkflowTaskTemplate", ex);
            }
        }
        public async Task<List<WorkflowTaskTemplate>> GetByServiceId(int service_id)
        {
            try
            {
                var sql = @"SELECT tasks.* 
                            FROM workflow_task_template tasks
LEFT JOIN service ser on ser.workflow_id = tasks.workflow_id
WHERE ser.id = @service_id";
                var models = await _dbConnection.QueryAsync<WorkflowTaskTemplate>(sql, new { service_id },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkflowTaskTemplate", ex);
            }
        }

        

        public async Task<int> Add(WorkflowTaskTemplate domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new WorkflowTaskTemplate
                {
                    workflow_id = domain.workflow_id,
                    name = domain.name,
                    order = domain.order,
                    is_active = domain.is_active,
                    is_required = domain.is_required,
                    description = domain.description,
                    structure_id = domain.structure_id,
                    type_id = domain.type_id,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql =
                    @"INSERT INTO workflow_task_template(workflow_id, name, ""order"", is_active, is_required, description, structure_id, created_at, created_by, updated_at, updated_by, type_id) 
                                VALUES (@workflow_id, @name, @order, @is_active, @is_required, @description, @structure_id, @created_at, @created_by, @updated_at, @updated_by, @type_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add WorkflowTaskTemplate", ex);
            }
        }

        public async Task Update(WorkflowTaskTemplate domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new WorkflowTaskTemplate
                {
                    id = domain.id,
                    workflow_id = domain.workflow_id,
                    name = domain.name,
                    order = domain.order,
                    is_active = domain.is_active,
                    is_required = domain.is_required,
                    description = domain.description,
                    structure_id = domain.structure_id,
                    type_id = domain.type_id,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql =
                    "UPDATE workflow_task_template SET workflow_id = @workflow_id, name = @name, \"order\" = @order, is_active = @is_active, is_required = @is_required, description = @description, structure_id = @structure_id, updated_at = @updated_at, updated_by = @updated_by, type_id = @type_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update WorkflowTaskTemplate", ex);
            }
        }

        public async Task<PaginatedList<WorkflowTaskTemplate>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM workflow_task_template OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<WorkflowTaskTemplate>(sql, new { pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM workflow_task_template";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<WorkflowTaskTemplate>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkflowTaskTemplate", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM workflow_task_template WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("WorkflowTaskTemplate not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete WorkflowTaskTemplate", ex);
            }
        }
    }
}