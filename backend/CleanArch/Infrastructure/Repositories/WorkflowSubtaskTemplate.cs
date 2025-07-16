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
    public class WorkflowSubtaskTemplateRepository : IWorkflowSubtaskTemplateRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public WorkflowSubtaskTemplateRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<WorkflowSubtaskTemplate>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, description, workflow_task_id, type_id FROM workflow_subtask_template";
                var models = await _dbConnection.QueryAsync<WorkflowSubtaskTemplate>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkflowSubtaskTemplate", ex);
            }
        }

        public async Task<WorkflowSubtaskTemplate> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, description, workflow_task_id, type_id FROM workflow_subtask_template WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<WorkflowSubtaskTemplate>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"WorkflowSubtaskTemplate with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkflowSubtaskTemplate", ex);
            }
        }
        
        public async Task<List<WorkflowSubtaskTemplate>> GetByidWorkflowTaskTemplate(int idWorkflowTaskTemplate)
        {
            try
            {
                var sql = "SELECT id, name, description, workflow_task_id, type_id FROM workflow_subtask_template WHERE workflow_task_id=@IdWorkflowTaskTemplate";
                var models = await _dbConnection.QueryAsync<WorkflowSubtaskTemplate>(sql, new { IdWorkflowTaskTemplate = idWorkflowTaskTemplate }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkflowSubtaskTemplate", ex);
            }
        }

        public async Task<int> Add(WorkflowSubtaskTemplate domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new WorkflowSubtaskTemplate
                {
                    name = domain.name,
                    description = domain.description,
                    workflow_task_id = domain.workflow_task_id,
                    type_id = domain.type_id,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO workflow_subtask_template(name, description, workflow_task_id, type_id, created_at, created_by, updated_at, updated_by) VALUES (@name, @description, @workflow_task_id, @type_id, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add WorkflowSubtaskTemplate", ex);
            }
        }

        public async Task Update(WorkflowSubtaskTemplate domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new WorkflowSubtaskTemplate
                {
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    workflow_task_id = domain.workflow_task_id,
                    type_id = domain.type_id,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "UPDATE workflow_subtask_template SET name = @name, description = @description, workflow_task_id = @workflow_task_id, type_id = @type_id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update WorkflowSubtaskTemplate", ex);
            }
        }

        public async Task<PaginatedList<WorkflowSubtaskTemplate>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM workflow_subtask_template OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<WorkflowSubtaskTemplate>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM workflow_subtask_template";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<WorkflowSubtaskTemplate>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkflowSubtaskTemplate", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM workflow_subtask_template WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("WorkflowSubtaskTemplate not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete WorkflowSubtaskTemplate", ex);
            }
        }
    }
}
