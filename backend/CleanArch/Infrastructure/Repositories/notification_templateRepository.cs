using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class notification_templateRepository : Inotification_templateRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public notification_templateRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<notification_template>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""notification_template""";
                var models = await _dbConnection.QueryAsync<notification_template>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_template", ex);
            }
        }

        public async Task<int> Add(notification_template domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new notification_templateModel
                {
                    
                    id = domain.id,
                    contact_type_id = domain.contact_type_id,
                    code = domain.code,
                    subject = domain.subject,
                    body = domain.body,
                    placeholders = domain.placeholders,
                    link = domain.link,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO ""notification_template""(""contact_type_id"", ""code"", ""subject"", ""body"", ""placeholders"", ""link"", created_at, updated_at, created_by, updated_by) 
                VALUES (@contact_type_id, @code, @subject, @body, @placeholders, @link, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add notification_template", ex);
            }
        }

        public async Task Update(notification_template domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new notification_templateModel
                {
                    
                    id = domain.id,
                    contact_type_id = domain.contact_type_id,
                    code = domain.code,
                    subject = domain.subject,
                    body = domain.body,
                    placeholders = domain.placeholders,
                    link = domain.link,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE ""notification_template"" SET ""id"" = @id, ""contact_type_id"" = @contact_type_id, ""code"" = @code, ""subject"" = @subject, ""body"" = @body, ""placeholders"" = @placeholders, ""link"" = @link, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update notification_template", ex);
            }
        }

        public async Task<PaginatedList<notification_template>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""notification_template"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<notification_template>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""notification_template""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<notification_template>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_templates", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""notification_template"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update notification_template", ex);
            }
        }
        public async Task<notification_template> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""notification_template"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<notification_template>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_template", ex);
            }
        }


        public async Task<List<notification_template>> GetBycontact_type_id(int contact_type_id)
        {
            try
            {
                var sql = "SELECT * FROM \"notification_template\" WHERE \"contact_type_id\" = @contact_type_id";
                var models = await _dbConnection.QueryAsync<notification_template>(sql, new { contact_type_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_template", ex);
            }
        }
        public async Task<List<notification_template>> GetByCode(string code)
        {
            try
            {
                var sql = "SELECT * FROM \"notification_template\" WHERE \"code\" = @code";
                var models = await _dbConnection.QueryAsync<notification_template>(sql, new { code }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get notification_template", ex);
            }
        }


    }
}
