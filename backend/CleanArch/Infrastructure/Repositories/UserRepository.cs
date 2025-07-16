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
    public class UserRepository : IUserRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IAuthRepository _authRepository;


        public UserRepository(IDbConnection dbConnection, IAuthRepository authRepository)
        {
            _dbConnection = dbConnection;
            _authRepository = authRepository;

        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<User> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT id, ""userId"", type_system FROM ""User"" WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<User>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"User with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get User", ex);
            }
        }

        public async Task<int> GetUserID()
        {
            try
            {
                var userInfo = await _authRepository.GetUserInfo();
                var sql = @"SELECT id FROM ""User"" WHERE ""userId""=@UId";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<int>(sql, new { UId = userInfo.Id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"User not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get User", ex);
            }
        }
        public async Task<UserInfo> GetUserInfo()
        {
            var userInfo = await _authRepository.GetUserInfo();
            return userInfo;
        }

        public async Task<string> GetUserUID()
        {
            try
            {
                var userInfo = await _authRepository.GetUserInfo();
                var sql = @"SELECT ""userId"" FROM ""User"" WHERE ""userId""=@UId";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<string>(sql, new { UId = userInfo.Id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"User not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get User", ex);
            }
        }

        public async Task<User> GetByEmail(string email)
        {
            try
            {
                var sql = @"SELECT * FROM ""User"" WHERE email = @Email";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<User>(sql, 
                    new { Email = email }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get user by email", ex);
            }
        }

        public async Task<bool> UpdateLastLogin(int userId)
        {
            try
            {
                var sql = @"UPDATE ""User"" SET last_login = @LastLogin, updated_at = @UpdatedAt WHERE id = @Id";
                var result = await _dbConnection.ExecuteAsync(sql, 
                    new { Id = userId, LastLogin = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }, transaction: _dbTransaction);
                return result > 0;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update last login", ex);
            }
        }

        public async Task<int> Add(User domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(this, _dbConnection, _dbTransaction);

                var model = new User
                {
                    userId = domain.userId,
                    type_system = domain.type_system,
                    password_hash = string.Empty,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO ""User""(""userId"", password_hash, type_system, created_at, updated_at, created_by, updated_by) VALUES (@userId, @password_hash, @type_system, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add User", ex);
            }
        }
    }
}