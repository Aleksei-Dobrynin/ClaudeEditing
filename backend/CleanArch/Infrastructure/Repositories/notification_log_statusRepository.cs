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
    public class notification_log_statusRepository : Inotification_log_statusRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public notification_log_statusRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<notification_log_status>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM notification_log_status";
                var models = await _dbConnection.QueryAsync<notification_log_status>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_log_status", ex);
            }
        }

        public async Task<int> Add(notification_log_status domain)
        {
            try
            {
                var model = new notification_log_statusModel
                {
                    // Убрано id из маппинга
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    name_kg = domain.name_kg,
                    description_kg = domain.description_kg,
                    text_color = domain.text_color,
                    background_color = domain.background_color,
                    created_at = domain.created_at,
                };

                var sql = @"
                    INSERT INTO notification_log_status(
                        updated_at, created_by, updated_by, 
                        name, description, code, 
                        name_kg, description_kg, text_color, 
                        background_color, created_at
                    ) 
                    VALUES (
                        @updated_at, @created_by, @updated_by, 
                        @name, @description, @code, 
                        @name_kg, @description_kg, @text_color, 
                        @background_color, @created_at
                    ) 
                    RETURNING id";

                return await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add notification_log_status", ex);
            }
        }

        public async Task Update(notification_log_status domain)
        {
            try
            {
                var model = new notification_log_statusModel
                {
                    id = domain.id,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    name_kg = domain.name_kg,
                    description_kg = domain.description_kg,
                    text_color = domain.text_color,
                    background_color = domain.background_color,
                    created_at = domain.created_at,
                };

                var sql = @"
                    UPDATE notification_log_status 
                    SET 
                        updated_at = @updated_at, 
                        created_by = @created_by, 
                        updated_by = @updated_by, 
                        name = @name, 
                        description = @description, 
                        code = @code, 
                        name_kg = @name_kg, 
                        description_kg = @description_kg, 
                        text_color = @text_color, 
                        background_color = @background_color, 
                        created_at = @created_at 
                    WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update notification_log_status", ex);
            }
        }

        public async Task<PaginatedList<notification_log_status>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var offset = pageSize * (pageNumber - 1);

                var sql = @"
                    SELECT * FROM notification_log_status 
                    ORDER BY id 
                    OFFSET @Offset 
                    LIMIT @PageSize";

                var models = await _dbConnection.QueryAsync<notification_log_status>(
                    sql,
                    new { PageSize = pageSize, Offset = offset },
                    transaction: _dbTransaction
                );

                var sqlCount = "SELECT COUNT(*) FROM notification_log_status";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                return new PaginatedList<notification_log_status>(
                    models.ToList(),
                    totalItems,
                    pageNumber,
                    pageSize
                );
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_log_statuss", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM notification_log_status WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update notification_log_status", ex);
            }
        }

        public async Task<notification_log_status> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM notification_log_status WHERE id = @Id LIMIT 1";
                return await _dbConnection.QueryFirstOrDefaultAsync<notification_log_status>(
                    sql,
                    new { Id = id },
                    transaction: _dbTransaction
                );
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_log_status", ex);
            }
        }
    }
}