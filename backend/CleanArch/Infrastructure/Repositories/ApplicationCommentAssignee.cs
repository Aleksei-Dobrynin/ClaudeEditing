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
    public class ApplicationCommentAssigneeRepository : IApplicationCommentAssigneeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ApplicationCommentAssigneeRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationCommentAssignee>> GetAll()
        {
            try
            {
                var sql = @"SELECT id, application_id, comment_id, employee_id, is_completed, completed_date, created_at, created_by, updated_at, updated_by FROM application_comment_assignee";
                var models = await _dbConnection.QueryAsync<ApplicationCommentAssignee>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationCommentAssignee", ex);
            }
        }

        public async Task<ApplicationCommentAssignee> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT id, application_id, comment_id, employee_id, is_completed, completed_date, created_at, created_by, updated_at, updated_by FROM application_comment_assignee WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationCommentAssignee>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationCommentAssignee with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationCommentAssignee", ex);
            }
        }
        
        public async Task<ApplicationCommentAssignee> GetOneByCommentID(int id)
        {
            try
            {
                var sql = @"SELECT id, application_id, comment_id, employee_id, is_completed, completed_date, created_at, created_by, updated_at, updated_by FROM application_comment_assignee WHERE comment_id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationCommentAssignee>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationCommentAssignee with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationCommentAssignee", ex);
            }
        }

        public async Task<int> Add(ApplicationCommentAssignee domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationCommentAssignee
                {
                    application_id = domain.application_id,
                    comment_id = domain.comment_id,
                    employee_id = domain.employee_id,
                    is_completed = domain.is_completed,
                    completed_date = domain.completed_date,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO application_comment_assignee (application_id, comment_id, employee_id, is_completed, completed_date, created_at, created_by, updated_at, updated_by) VALUES (@application_id, @comment_id, @employee_id, @is_completed, @completed_date, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationCommentAssignee", ex);
            }
        }

        public async Task Update(ApplicationCommentAssignee domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationCommentAssignee
                {
                    id = domain.id,
                    application_id = domain.application_id,
                    comment_id = domain.comment_id,
                    employee_id = domain.employee_id,
                    is_completed = domain.is_completed,
                    completed_date = domain.completed_date,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE public.application_comment_assignee SET application_id = @application_id, comment_id = @comment_id, employee_id = @employee_id, is_completed = @is_completed, completed_date = @completed_date, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationCommentAssignee", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM application_comment_assignee WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationCommentAssignee not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationCommentAssignee", ex);
            }
        }
    }
}