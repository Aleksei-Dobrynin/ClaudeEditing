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
    public class WorkflowTaskDependencyRepository : IWorkflowTaskDependencyRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public WorkflowTaskDependencyRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<WorkflowTaskDependency>> GetAll()
        {
            try
            {
                var sql = "SELECT id, task_id, dependent_task_id FROM workflow_task_dependency";
                var models = await _dbConnection.QueryAsync<WorkflowTaskDependency>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkflowTaskDependency", ex);
            }
        }

        public async Task<WorkflowTaskDependency> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, task_id, dependent_task_id FROM workflow_task_dependency WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<WorkflowTaskDependency>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"WorkflowTaskDependency with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkflowTaskDependency", ex);
            }
        }

        public async Task<int> Add(WorkflowTaskDependency domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new WorkflowTaskDependency
                {
                    task_id = domain.task_id,
                    dependent_task_id = domain.dependent_task_id,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO workflow_task_dependency(task_id, dependent_task_id, created_at, created_by, updated_at, updated_by) VALUES (@task_id, @dependent_task_id, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add WorkflowTaskDependency", ex);
            }
        }

        public async Task Update(WorkflowTaskDependency domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new WorkflowTaskDependency
                {
                    id = domain.id,
                    task_id = domain.task_id,
                    dependent_task_id = domain.dependent_task_id,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "UPDATE workflow_task_dependency SET task_id = @task_id, dependent_task_id = @dependent_task_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update WorkflowTaskDependency", ex);
            }
        }

        public async Task<PaginatedList<WorkflowTaskDependency>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM workflow_task_dependency OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<WorkflowTaskDependency>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM workflow_task_dependency";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<WorkflowTaskDependency>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get WorkflowTaskDependency", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM workflow_task_dependency WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("WorkflowTaskDependency not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete WorkflowTaskDependency", ex);
            }
        }
    }
}
