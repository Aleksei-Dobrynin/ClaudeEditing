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
    public class WorkflowRepository : IWorkflowRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository; 

        public WorkflowRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<Workflow>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, is_active, date_start, date_end FROM workflow";
                var models = await _dbConnection.QueryAsync<Workflow>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Workflow", ex);
            }
        }

        public async Task<Workflow> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, is_active, date_start, date_end FROM workflow WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Workflow>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Workflow with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Workflow", ex);
            }
        }

        public async Task<int> Add(Workflow domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Workflow
                {
                    name = domain.name,
                    is_active = domain.is_active,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO workflow(name, is_active, date_start, date_end, created_at, created_by, updated_at, updated_by) VALUES (@name, @is_active, @date_start, @date_end, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add Workflow", ex);
            }
        }

        public async Task Update(Workflow domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Workflow
                {
                    id = domain.id,
                    name = domain.name,
                    is_active = domain.is_active,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE workflow SET name = @name, is_active = @is_active, date_start = @date_start, 
                                    date_end = @date_end, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Workflow", ex);
            }
        }

        public async Task<PaginatedList<Workflow>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM workflow OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<Workflow>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM workflow";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<Workflow>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Workflow", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM workflow WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("Workflow not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete Workflow", ex);
            }
        }
    }
}
