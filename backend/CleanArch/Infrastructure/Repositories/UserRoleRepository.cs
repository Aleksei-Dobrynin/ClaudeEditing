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
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public UserRoleRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<UserRole>> GetAll()
        {
            try
            {
                var sql = "SELECT id, role_id, structure_id, user_id FROM user_role";
                var models = await _dbConnection.QueryAsync<UserRole>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UserRole", ex);
            }
        }

        public async Task<UserRole> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, role_id, structure_id, user_id FROM user_role WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<UserRole>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"UserRole with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UserRole", ex);
            }
        }

        public async Task<int> Add(UserRole domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new UserRole
                {
                    role_id = domain.role_id,
                    structure_id = domain.structure_id,
                    user_id = domain.user_id
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO user_role(role_id, structure_id, user_id, created_at, created_by, updated_at, updated_by) VALUES (@role_id, @structure_id, @user_id, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add UserRole", ex);
            }
        }

        public async Task Update(UserRole domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new UserRole
                {
                    id = domain.id,
                    role_id = domain.role_id,
                    structure_id = domain.structure_id,
                    user_id = domain.user_id
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "UPDATE user_role SET role_id = @role_id, structure_id = @structure_id, user_id = @user_id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update UserRole", ex);
            }
        }

        public async Task<PaginatedList<UserRole>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM user_role OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<UserRole>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM user_role";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<UserRole>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UserRole", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM user_role WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("UserRole not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete UserRole", ex);
            }
        }
    }
}
