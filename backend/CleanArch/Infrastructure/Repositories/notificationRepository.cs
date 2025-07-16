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
    public class notificationRepository : InotificationRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public notificationRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<notification>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""notification""";
                var models = await _dbConnection.QueryAsync<notification>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification", ex);
            }
        }
        public async Task<List<notification>> GetMyNotifications(int userId)
        {
            try
            {
                var sql = @"
SELECT n.* FROM ""notification"" n 
   -- left join public.""User"" u on u.id = n.user_id 
    where n.user_id = @userId and n.has_read != true 
    order by n.created_at desc";
                var models = await _dbConnection.QueryAsync<notification>(sql, new { userId }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification", ex);
            }
        }

        

        public async Task<int> Add(notification domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new notificationModel
                {
                    
                    id = domain.id,
                    title = domain.title,
                    text = domain.text,
                    employee_id = domain.employee_id,
                    user_id = domain.user_id,
                    has_read = domain.has_read,
                    created_at = domain.created_at,
                    code = domain.code,
                    link = domain.link,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO ""notification""(""title"", ""text"", ""employee_id"", ""user_id"", ""has_read"", ""code"", ""link"", created_at, updated_at, created_by, updated_by) 
                VALUES (@title, @text, @employee_id, @user_id, @has_read, @code, @link, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add notification", ex);
            }
        }

        public async Task Update(notification domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new notificationModel
                {
                    
                    id = domain.id,
                    title = domain.title,
                    text = domain.text,
                    employee_id = domain.employee_id,
                    user_id = domain.user_id,
                    has_read = domain.has_read,
                    created_at = domain.created_at,
                    code = domain.code,
                    link = domain.link,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE ""notification"" SET ""id"" = @id, ""title"" = @title, ""text"" = @text, ""employee_id"" = @employee_id, ""user_id"" = @user_id, ""has_read"" = @has_read, ""code"" = @code, ""link"" = @link, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update notification", ex);
            }
        }

        public async Task ReadAll(List<int> ids)
        {
            try
            {
                var sql = @"UPDATE notification SET has_read = true WHERE id = any(@ids)";
                var affected = await _dbConnection.ExecuteAsync(sql, new { ids }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update notification", ex);
            }
        }

        public async Task<PaginatedList<notification>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""notification"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<notification>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""notification""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<notification>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notifications", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""notification"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update notification", ex);
            }
        }
        public async Task<notification> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""notification"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<notification>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification", ex);
            }
        }

        
    }
}
