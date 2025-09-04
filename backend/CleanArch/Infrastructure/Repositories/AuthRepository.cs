using Application.Exceptions;
using Application.Models;
using Application.Repositories;
using Application.Services;
using AuthLibrary;
using Dapper;
using Domain.Entities;
using Infrastructure.Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Mysqlx.Session;
using System;
using System.Data;
using System.Data.Common;
using System.Reflection;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly IDbConnection _dbConnection;
        private readonly AuthService _authService;
        private static IHttpContextAccessor _httpContextAccessor;
        private static IConfiguration _configuration;
        private readonly IN8nService _n8nService;


        public AuthRepository(AuthService authService,
            IDbConnection dbConnection,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration,
            IN8nService n8nService
            )
        {
            _dbConnection = dbConnection;
            _authService = authService;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _n8nService = n8nService;

        }

        public async Task<AuthResult> Authenticate(string username, string password)
        {
            var authResult = await _authService.Authenticate(username, password);
            return authResult;
        }

        public async Task<UserInfo> GetCurrentUser()
        {
            var user = await _authService.GetUserInfo();
            if (user == null)
            {
                return null;
            }
            return new UserInfo
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName
            };
        }

        public async Task<UserInfo> ChangePassword(string currentPassword, string newPassword)
        {
            var user = await _authService.ChangePassword(currentPassword, newPassword);
            if (user == null)
            {
                return null;
            }
            return new UserInfo
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName
            };
        }


        public async Task<bool> IsSuperAdmin(string user_id)
        {
            try
            {
                var sql = @"
select id from ""User"" u 
	where u.""userId"" = @user_id and u.is_super_admin is true

";
                var models = await _dbConnection.QueryAsync<int>(sql, new { user_id });
                return models.Count() > 0;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to change password", ex);
            }
        }
        public async Task<List<string>> GetMyRoles()
        {
            var user = await GetCurrentUser();

            try
            {
                var sql = @"
select post.code from employee e 
	inner join employee_in_structure eis on eis.employee_id = e.id
	inner join structure_post post on post.id = eis.post_id
	where e.user_id = @user_id
	and eis.date_start < now() and (eis.date_end is null or eis.date_end > now())
	group by post.code
";
                var models = await _dbConnection.QueryAsync<string>(sql, new { user_id = user.Id });
                var res = models.ToList().Where(x => x != null).ToList();
                var isAdmin = await this.IsSuperAdmin(user.Id);
                if (isAdmin)
                {
                    res.Add("admin");
                }
                if (res.Count == 0)
                {
                    res.Add("employee");
                }
                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Customer", ex);
            }

        }
        public async Task<List<int>> GetMyRoleIds()
        {
            var user = await GetCurrentUser();

            try
            {
                var sql = @"
select post.id from employee e 
	inner join employee_in_structure eis on eis.employee_id = e.id
	inner join structure_post post on post.id = eis.post_id
	where e.user_id = @user_id
	and eis.date_start < now() and (eis.date_end is null or eis.date_end > now())
	group by post.id
";
                var models = await _dbConnection.QueryAsync<int>(sql, new { user_id = user.Id });
                var res = models.ToList().ToList();
                return res;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Customer", ex);
            }

        }
        public async Task<bool> ForgotPassword(string email, string newPassword)
        {
            try
            {
                var reset = await _authService.ForgotPassword(email, newPassword);
                return reset;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Auth", ex);
            }
        }

        public async Task<string> Create(string username, string password)
        {
            try
            {
                var userId = await _authService.Register(username, password);
                return userId;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add Employee", ex);
            }
        }

        public Task<UserInfo> GetUserInfo()
        {
            var isRabbitMqContext = _httpContextAccessor.HttpContext == null;

            // Если контекст - RabbitMQ, получаем системного пользователя из БД
            if (isRabbitMqContext)
            {
                return Task.FromResult(new UserInfo
                {
                    Email = "system",
                    UserName = "system",
                    Id = _configuration["system_user_id"]
                });
            }

            return GetCurrentUser();
        }

        public async Task<UserInfo> GetByUserId(string userId)
        {
            try
            {
                var user = await _authService.GetUserByEmail(userId);

                if (user == null)
                {
                    throw new RepositoryException($"User not found.", null);
                }
                return new UserInfo
                {
                    Id = user.Id,
                    Email = user.Email,
                    UserName = user.UserName
                };
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to change password", ex);
            }
        }
    }
}
