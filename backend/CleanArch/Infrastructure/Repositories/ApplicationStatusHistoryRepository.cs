using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using static System.Net.Mime.MediaTypeNames;
using System.Net.NetworkInformation;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class ApplicationStatusHistoryRepository : IApplicationStatusHistoryRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ApplicationStatusHistoryRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<Domain.Entities.ApplicationStatusHistory> GetById(int id)
        {
            try
            {
                var sql = @"
            SELECT ash.*, 
                   s1.name AS status_navName,
                   s2.name AS old_status_navName
            FROM application_status_history AS ash
            LEFT JOIN application_status AS s1 ON ash.status_id = s1.id
            LEFT JOIN application_status AS s2 ON ash.old_status_id = s2.id
            WHERE ash.id = @id
            LIMIT 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationStatusHistory>(sql, new { id }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationStatusHistory", ex);
            }
        }



        public async Task<List<Domain.Entities.ApplicationStatusHistory>> GetAll()
        {
            try
            {
                var sql = @"
            SELECT ash.*, 
                   s1.name AS status_navName,
                   s2.name AS old_status_navName
            FROM application_status_history AS ash
            LEFT JOIN application_status AS s1 ON ash.status_id = s1.id
            LEFT JOIN application_status AS s2 ON ash.old_status_id = s2.id";
                var models = await _dbConnection.QueryAsync<Domain.Entities.ApplicationStatusHistory>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationStatusHistory", ex);
            }
        }
        public async Task<int> Add(ApplicationStatusHistory domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationStatusHistory
                {
                    application_id = domain.application_id,
                    date_change = domain.date_change,
                    status_id = domain.status_id,
                    user_id = domain.user_id,
                    old_status_id = domain.old_status_id
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql =
                    "INSERT INTO application_status_history(application_id, date_change, status_id, user_id, old_status_id, created_at, updated_at, created_by, updated_by) VALUES (@application_id, @date_change, @status_id, @user_id, @old_status_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationWorkDocument", ex);
            }
        }

        public async Task Update(ApplicationStatusHistory domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationStatusHistory
                {
                    id = domain.id,
                    application_id = domain.application_id,
                    date_change = domain.date_change,
                    status_id = domain.status_id,
                    user_id = domain.user_id,
                    old_status_id = domain.old_status_id
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql =
                    "UPDATE application_status_history SET application_id = @application_id, date_change = @date_change, status_id = @status_id, old_status_id = @old_status_id, user_id = @user_id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationWorkDocument", ex);
            }
        }

        public async Task<List<ApplicationStatusHistory>> GetByStatusId(int idStatus)
        {
            try
            {
                var sql = @"SELECT *
                            FROM application_status_history
                            WHERE status_id=@idStatus";
                var models = await _dbConnection.QueryAsync<ApplicationStatusHistory>(sql,new { idStatus = idStatus },transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        }

        public async Task<List<ApplicationStatusHistory>> GetByUserID(int idUser)
        {
            try
            {
                var sql = @"SELECT *
                            FROM application_status_history
                            WHERE user_id=@idUser";
                var models = await _dbConnection.QueryAsync<ApplicationStatusHistory>(sql, new { idUser = idUser }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        }

        public async Task<List<ApplicationStatusHistory>> GetByApplicationID(int idApplication)
        {
            try
            {
                var sql = @"
            SELECT ash.*, 
                   s1.name AS status_navName,
                   s2.name AS old_status_navName,
                    concat(e.last_name, ' ', e.first_name) as full_name
            FROM application_status_history AS ash
            LEFT JOIN application_status AS s1 ON ash.status_id = s1.id
            LEFT JOIN application_status AS s2 ON ash.old_status_id = s2.id
            LEFT JOIN ""User"" u on u.id = ash.user_id
            LEFT JOIN employee e on e.user_id = u.""userId""
            WHERE ash.application_id = @idApplication
            order by ash.id desc";
                var models = await _dbConnection.QueryAsync<ApplicationStatusHistory>(sql, new { idApplication }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationWorkDocument", ex);
            }
        }
    }
}
