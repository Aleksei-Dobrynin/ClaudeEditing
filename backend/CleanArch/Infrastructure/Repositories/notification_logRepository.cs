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
    public class notification_logRepository : Inotification_logRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public notification_logRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<notification_log>> GetAll()
        {
            try
            {
                var sql = @"SELECT
                            nl.*, 
                            nls.name AS statusNme
                        FROM ""notification_log"" nl
                            INNER JOIN ""notification_log_status"" nls 
                            ON nl.""status_id"" = nls.""id""";
                var models = await _dbConnection.QueryAsync<notification_log>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_log", ex);
            }
        }

        public async Task<int> Add(notification_log domain)
        {
            try
            {
                var userId = 0;
                try
                {
                    userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }

                var model = new notification_logModel
                {
                    id = domain.id,
                    employee_id = domain.employee_id,
                    user_id = domain.user_id,
                    message = domain.message,
                    subject = domain.subject,
                    guid = domain.guid,
                    phone = domain.phone,
                    date_send = domain.date_send,
                    type = domain.type,
                    application_id = domain.application_id,
                    customer_id = domain.customer_id,
                    status_id = domain.status_id
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO ""notification_log""(""employee_id"", ""user_id"", ""message"", ""subject"", 
                                 ""guid"", ""date_send"", ""type"", application_id, customer_id,
                                 created_at, updated_at, created_by, updated_by, status_id, phone) 
                VALUES (@employee_id, @user_id, @message, @subject, @guid, @date_send, @type, @application_id, @customer_id,
                        @created_at, @updated_at, @created_by, @updated_by, @status_id, @phone) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add notification_log", ex);
            }
        }

        public async Task CreateRange(List<notification_log> domain)
        {
            try
            {
                var sql = @"INSERT INTO ""notification_log""(""employee_id"", ""user_id"", ""message"", ""subject"", ""guid"", ""date_send"", ""type"", ""status_id"") 
                VALUES ";
                domain.ForEach(x =>
                {
                    sql += @$" ({x.employee_id}, {x.user_id}, '{x.message}', '{x.subject}', '{x.guid}', {x.date_send}, '{x.type}', {x.status_id}),
";
                });
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, transaction: _dbTransaction);
                return;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add notification_log", ex);
            }
        }

        public async Task Update(notification_log domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new notification_logModel
                {
                    
                    id = domain.id,
                    employee_id = domain.employee_id,
                    user_id = domain.user_id,
                    message = domain.message,
                    subject = domain.subject,
                    guid = domain.guid,
                    date_send = domain.date_send,
                    type = domain.type,
                    status_id = domain.status_id

                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE ""notification_log"" SET ""id"" = @id, ""employee_id"" = @employee_id,""status_id"" = @status_id, ""user_id"" = @user_id, ""message"" = @message, ""subject"" = @subject, ""guid"" = @guid, ""date_send"" = @date_send, ""type"" = @type, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update notification_log", ex);
            }
        }

        public async Task<PaginatedList<notification_log>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""notification_log"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<notification_log>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""notification_log""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<notification_log>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_logs", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""notification_log"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update notification_log", ex);
            }
        }
        public async Task<notification_log> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""notification_log"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<notification_log>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_log", ex);
            }
        }
        
        public async Task<List<notification_log>> GetByApplicationId(int id)
        {
            try
            {
                var sql = @"SELECT nl.*, ns.name as ""statusName"" FROM notification_log nl
                            LEFT JOIN notification_log_status ns on ns.id = nl.status_id
                            WHERE application_id = @id";
                var models = await _dbConnection.QueryAsync<notification_log>(sql, new { id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_log", ex);
            }
        }

        public async Task<List<notification_log>> GetUnsended()
        {
            try
            {
                var sql = @"
            SELECT nl.* 
            FROM ""notification_log"" nl
            INNER JOIN ""notification_log_status"" nls 
                ON nl.""status_id"" = nls.""id""
            WHERE (nls.""code"" IS NULL OR nls.""code"" <> 'send')";

                var models = await _dbConnection.QueryAsync<notification_log>(
                    sql,
                    transaction: _dbTransaction
                );

                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get unsent notifications", ex);
            }
        }

        public async Task<PaginatedList<notification_log>> GetAppLogBySearch(string? search, bool? showOnlyFailed, int? pageNumber, int? pageSize)
        {
            try
            {
                var sql = @"SELECT nl.*, ns.name as ""statusName"", a.number AS application_number
                            FROM notification_log nl
                                     LEFT JOIN application a ON nl.application_id = a.id
                                     LEFT JOIN customer c ON nl.customer_id = c.id
                                     LEFT JOIN customer_contact cc ON c.id = cc.customer_id
                                     LEFT JOIN notification_log_status ns on ns.id = nl.status_id
                            WHERE nl.application_id IS NOT NULL ";

                if (!string.IsNullOrWhiteSpace(search))
                {
                    sql += @" AND (a.number ILIKE @search
                               OR c.full_name ILIKE @search
                               OR cc.value ILIKE @search
                               OR nl.phone ILIKE @search
                               OR a.number ILIKE @search)";
                }

                if (showOnlyFailed != null && showOnlyFailed.Value)
                {
                    sql += @" AND ns.code IN ('rejected', 'undelivered', 'insufficient_funds', 'timed_out') ";
                }
                
                sql += @" ORDER BY nl.id desc OFFSET @pageSize * (@pageNumber - 1) LIMIT @pageSize";
                
                var parameters = new
                {
                    search = $"%{search}%",
                    pageSize,
                    pageNumber
                };
                
                var models = await _dbConnection.QueryAsync<notification_log>(sql, parameters, transaction: _dbTransaction);
                
                var countSql = @"SELECT COUNT(nl.*)
                                    FROM notification_log nl
                                    LEFT JOIN application a ON nl.application_id = a.id
                                    LEFT JOIN customer c ON nl.customer_id = c.id
                                    LEFT JOIN customer_contact cc ON c.id = cc.customer_id
                                    LEFT JOIN notification_log_status ns on ns.id = nl.status_id
                                    WHERE nl.application_id IS NOT NULL ";
                
                if (!string.IsNullOrWhiteSpace(search))
                {
                    countSql += @" AND (a.number ILIKE @search
                               OR c.full_name ILIKE @search
                               OR cc.value ILIKE @search
                               OR nl.phone ILIKE @search
                               OR a.number ILIKE @search)";
                }
                
                if (showOnlyFailed != null && showOnlyFailed.Value)
                {
                    countSql += @"AND ns.code IN ('rejected', 'undelivered', 'insufficient_funds', 'timed_out')";
                }

                var totalCount = await _dbConnection.ExecuteScalarAsync<int>(countSql, parameters, transaction: _dbTransaction);

                return new PaginatedList<notification_log>(models.ToList(), totalCount, pageNumber ?? 1, pageSize ?? 10);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_log", ex);
            }
        }

        public async Task UpdateStatus(int status_id, int id)
        {
            try
            {
                var sql = @"UPDATE ""notification_log"" SET ""status_id"" = @status_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { id, status_id }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_log", ex);
            }
        }
    }
}
