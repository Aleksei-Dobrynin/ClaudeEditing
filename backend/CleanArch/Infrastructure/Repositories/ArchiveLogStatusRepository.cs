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
    public class ArchiveLogStatusRepository : IArchiveLogStatusRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ArchiveLogStatusRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ArchiveLogStatus>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, description, code FROM archive_log_status";
                var models = await _dbConnection.QueryAsync<ArchiveLogStatus>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveLogStatus", ex);
            }
        }

        public async Task<ArchiveLogStatus> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, description, code FROM archive_log_status WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ArchiveLogStatus>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ArchiveLogStatus with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveLogStatus", ex);
            }
        }
        
        public async Task<ArchiveLogStatus> GetOneByCode(string code)
        {
            try
            {
                var sql = "SELECT id, name, description, code FROM archive_log_status WHERE code=@Code limit 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ArchiveLogStatus>(sql, new { Code = code }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ArchiveLogStatus with Code {code} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveLogStatus", ex);
            }
        }

        public async Task<int> Add(ArchiveLogStatus domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                
                var model = new ArchiveLogStatus
                {
                    name = domain.name,
                    code = domain.code,
                    description = domain.description
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO archive_log_status(name, code, description, created_at, updated_at, created_by, updated_by) VALUES (@name, @code, @description, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ArchiveLogStatus", ex);
            }
        }

        public async Task Update(ArchiveLogStatus domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchiveLogStatus
                {
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE archive_log_status SET name = @name, code = @code, description = @description, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ArchiveLogStatus", ex);
            }
        }

        public async Task<PaginatedList<ArchiveLogStatus>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM archive_log_status OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ArchiveLogStatus>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM archive_log_status";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ArchiveLogStatus>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveLogStatus", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM archive_log_status WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ArchiveLogStatus not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ArchiveLogStatus", ex);
            }
        }
    }
}
