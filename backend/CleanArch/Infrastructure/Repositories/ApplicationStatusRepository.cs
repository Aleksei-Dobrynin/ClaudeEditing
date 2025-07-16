using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Infrastructure.FillLogData;

namespace Application.Repositories
{
    public class ApplicationStatusRepository : IApplicationStatusRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ApplicationStatusRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<Domain.Entities.ApplicationStatus> GetById(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"application_status\" WHERE \"id\" = @id LIMIT 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationStatus>(sql, new { id }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_subtask", ex);
            }
        }

        public async Task<int> Add(ApplicationStatus domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationStatus
                {
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                    status_color = domain.status_color
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO application_status(name, code, description, created_at, updated_at, created_by, updated_by, status_color) VALUES (@name, @code, @description, @created_at, @updated_at, @created_by, @updated_by, @status_color) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationDocumentType", ex);
            }
        }
        
        public async Task Update(ApplicationStatus domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationStatus
                {
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                    status_color = domain.status_color
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE application_status SET name = @name, code = @code, description = @description, updated_at = @updated_at, updated_by = @updated_by, status_color = @status_color WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationDocumentType", ex);
            }
        }

        public async Task<List<Domain.Entities.ApplicationStatus>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM application_status";
                var models = await _dbConnection.QueryAsync<Domain.Entities.ApplicationStatus>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationStatus", ex);
            }
        }
        
        public async Task<ApplicationStatus> GetByCode(string code)
        {
            try
            {
                var sql = @"SELECT * FROM application_status WHERE code=@Code";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationStatus>(sql,
                    new { Code = code }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Application with Code not found.", null);
                }
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Application", ex);
            }
        }
    }
}
