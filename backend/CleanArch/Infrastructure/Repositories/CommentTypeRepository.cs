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
    public class CommentTypeRepository : ICommentTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public CommentTypeRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<CommentType>> GetAll()
        {
            try
            {
                var sql = @"SELECT id, name, code, button_label, button_color, created_at, created_by, updated_at, updated_by FROM comment_type";
                var models = await _dbConnection.QueryAsync<CommentType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CommentType", ex);
            }
        }

        public async Task<CommentType> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT id, name, code, button_label, button_color, created_at, created_by, updated_at, updated_by FROM comment_type WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<CommentType>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"CommentType with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CommentType", ex);
            }
        }

        public async Task<int> Add(CommentType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new CommentType
                {
                    name = domain.name,
                    code = domain.code,
                    button_label = domain.button_label,
                    button_color = domain.button_color,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO comment_type (name, code, button_label, button_color, created_at, created_by, updated_at, updated_by) VALUES (@name, @code, @button_label, @button_color, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add CommentType", ex);
            }
        }

        public async Task Update(CommentType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new CommentType
                {
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    button_label = domain.button_label,
                    button_color = domain.button_color,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE comment_type SET name = @name, code = @code, button_label = @button_label, button_color = @button_color, created_at = @created_at, created_by = @created_by, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update CommentType", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM comment_type WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("CommentType not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete CommentType", ex);
            }
        }
    }
}