using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Infrastructure.FillLogData;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Repositories
{
    public class structure_application_logRepository : Istructure_application_logRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public structure_application_logRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<structure_application_log>> GetAll()
        {
            try
            {
                var sql = @"SELECT log.*, app.number app_number, org.name structure_name  
FROM ""structure_application_log"" log
                                left join application app on app.id = log.application_id 
                                left join org_structure org on org.id = log.structure_id

";
                var models = await _dbConnection.QueryAsync<structure_application_log>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_application_log", ex);
            }
        }

        public async Task<List<structure_application_log>> GetByapplication_id(int application_id)
        {
            try
            {
                var sql = @"SELECT log.*, app.number app_number, org.name structure_name 
                            FROM structure_application_log log 
                                left join application app on app.id = log.application_id 
                                left join org_structure org on org.id = log.structure_id
                            WHERE application_id = @application_id";
                var models = await _dbConnection.QueryAsync<structure_application_log>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_application_log", ex);
            }
        }
        public async Task<List<structure_application_log>> GetAllMyStructure(string user_id)
        {
            try
            {
                var sql = @"SELECT log.*, app.number app_number, org.name structure_name 
                            FROM structure_application_log log 
                                left join application app on app.id = log.application_id 
                                left join org_structure org on org.id = log.structure_id
                                left join employee_in_structure eis on eis.structure_id = log.structure_id
                                left join employee e on e.id = eis.employee_id
                                left join structure_post post on post.id = eis.post_id
                            WHERE e.user_id = @user_id and post.code = 'clerk' and log.status_code = 'pending'";
                var models = await _dbConnection.QueryAsync<structure_application_log>(sql, new { user_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_application_log", ex);
            }
        }
        public async Task<List<structure_application_log>> GetBystructure_id(int structure_id)
        {
            try
            {
                var sql = @"SELECT log.*, app.number app_number, org.name structure_name 
                            FROM structure_application_log log 
                                left join application app on app.id = log.application_id 
                                left join org_structure org on org.id = log.structure_id
                            WHERE structure_id = @structure_id";
                var models = await _dbConnection.QueryAsync<structure_application_log>(sql, new { structure_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_application_log", ex);
            }
        }
        public async Task<List<structure_application_log>> GetByOrgAndApp(int structure_id, int application_id)
        {
            try
            {
                var sql = @"SELECT log.*, app.number app_number, org.name structure_name 
                            FROM structure_application_log log 
                                left join application app on app.id = log.application_id 
                                left join org_structure org on org.id = log.structure_id
                            WHERE structure_id = @structure_id and application_id = @application_id";
                var models = await _dbConnection.QueryAsync<structure_application_log>(sql, new { structure_id, application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_application_log", ex);
            }
        }
        public async Task<int> Add(structure_application_log domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new structure_application_logModel
                {
                    id = domain.id,
                    structure_id = domain.structure_id,
                    status_code = domain.status_code,
                    application_id = domain.application_id,
                    status = domain.status,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO ""structure_application_log""(""created_by"", ""updated_by"", ""updated_at"", ""created_at"", ""structure_id"", ""application_id"", ""status"", ""status_code"") 
                VALUES (@created_by, @updated_by, @updated_at, @created_at, @structure_id, @application_id, @status, @status_code) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add structure_application_log", ex);
            }
        }

        public async Task Update(structure_application_log domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new structure_application_logModel
                {
                    
                    id = domain.id,
                    status_code = domain.status_code,
                    structure_id = domain.structure_id,
                    application_id = domain.application_id,
                    status = domain.status,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE ""structure_application_log"" SET ""id"" = @id, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""updated_at"" = @updated_at, ""created_at"" = @created_at, ""structure_id"" = @structure_id, ""application_id"" = @application_id, ""status"" = @status, ""status_code"" = @status_code WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update structure_application_log", ex);
            }
        }

        public async Task<PaginatedList<structure_application_log>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""structure_application_log"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<structure_application_log>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""structure_application_log""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<structure_application_log>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_application_logs", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""structure_application_log"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update structure_application_log", ex);
            }
        }
        public async Task<structure_application_log> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""structure_application_log"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<structure_application_log>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_application_log", ex);
            }
        }

        
    }
}
