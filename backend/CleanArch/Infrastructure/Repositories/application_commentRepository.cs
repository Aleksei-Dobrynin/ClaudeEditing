using Application.Exceptions;
using Application.Repositories;
using Dapper;
using Domain.Entities;
using Infrastructure.Data.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class application_commentRepository : Iapplication_commentRepository
    {

        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public application_commentRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }
        
        public async Task<List<application_comment>> GetAll()
        {
            try
            {
                var sql = "SELECT a.*, b.first_name || ' ' || b.last_name || ' ' || b.second_name AS full_name FROM \"application_comment\" a JOIN \"employee\" b ON CAST(a.created_by AS integer) = b.id ORDER BY b.created_at";
                var models = await _dbConnection.QueryAsync<application_comment>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_comment", ex);
            }
        }
        public async Task<application_comment> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM application_comment WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<application_comment>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"application_comment with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocumentType", ex);
            }
        }
        public async Task<int> Add(application_comment domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new application_commentModel
                {
                    id = domain.id,
                    application_id = domain.application_id,
                    comment = domain.comment,
                };
                
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                
                var sql = "INSERT INTO \"application_comment\"(\"application_id\", \"comment\", \"created_at\", \"updated_at\", \"created_by\", \"updated_by\") " +
                    "VALUES (@application_id, @comment, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_comment", ex);
            }
        }
        public async Task Update(application_comment domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new application_commentModel
                {

                    id = domain.id,
                    application_id = domain.application_id,
                    comment = domain.comment,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE \"application_comment\" SET \"id\" = @id, \"application_id\" = @application_id, \"comment\" = @comment, \"updated_at\" = @updated_at, \"updated_by\" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_comment", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var setUserQuery = $"SET LOCAL \"bga.current_user\" TO '{await _userRepository.GetUserID()}'";
                _dbConnection.Execute(setUserQuery, transaction: _dbTransaction);
                var sql = "DELETE FROM application_comment WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("application_comment not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete application_comment", ex);
            }
        }
        public async Task<List<application_comment>> GetByapplication_id(int id)
        {
            try
            {
                var sql = "SELECT a.*, e.first_name || ' ' || e.last_name || ' ' || e.second_name AS full_name FROM \"application_comment\" a  JOIN \"User\" u ON a.created_by = u.id JOIN \"employee\" e ON u.\"userId\" = e.user_id WHERE a.application_id = @Id ORDER BY a.created_at";

                var models = await _dbConnection.QueryAsync<application_comment>(sql, new { Id = id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_comment", ex);
            }
        }
        public async Task<int> GetUserByEmail(string email)
        {
            try
            {
                var sql = "SELECT * FROM \"User\" WHERE email = @Email";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<User>(sql, new { Email = email }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"application_comment with EMAIL {email} not found.", null);
                }

                return model.id;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get User", ex);
            }
        }
    }
}
