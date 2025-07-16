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
    public class UserLoginHistoryRepository : IUserLoginHistoryRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public UserLoginHistoryRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<int> SaveLoginUserData(string userId, string ipAddress, string device, string browser, string os)
        {
            try
            {
                var model = new UserLoginHistory
                {
                    user_id = userId,
                    ip_address = ipAddress,
                    device = device,
                    browser = browser,
                    os = os
                };
                var sql = @"INSERT INTO user_login_history (user_id, ip_address, device, browser, os) 
                                    VALUES (@user_id, @ip_address, @device, @browser, @os) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add UserLoginHistory", ex);
            }
        }

        public async Task<List<UserLoginHistory>> GetRecentByUserId(string userId, int limit = 10)
        {
            try
            {
                var sql = @"SELECT * FROM user_login_history 
                           WHERE user_id = @UserId 
                           ORDER BY created_at DESC 
                           LIMIT @Limit";
                
                var models = await _dbConnection.QueryAsync<UserLoginHistory>(sql, 
                    new { UserId = userId, Limit = limit }, transaction: _dbTransaction);
                
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get recent login history", ex);
            }
        }
        
        public async Task<int> Add(UserLoginHistory domain)
        {
            try
            {
                var sql = @"INSERT INTO user_login_history (user_id, success, ip_address, device, browser, os, start_time, end_time, created_at, updated_at) VALUES (
                        @user_id, @success, @ip_address, @device, @browser, @os, @start_time, @end_time, @created_at, @updated_at) RETURNING id";
                
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, new
                {
                    user_id = domain.user_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    success = domain.success,
                    ip_address = domain.ip_address,
                    device = domain.device,
                    browser = domain.browser,
                    os = domain.os,
                    start_time = domain.start_time,
                    end_time = domain.end_time,

                }, transaction: _dbTransaction);

                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Unexpected error while adding login history: {ex.Message}", ex);
            }
        }
    }
}