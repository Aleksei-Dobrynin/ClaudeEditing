using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class SystemSettingRepository : ISystemSettingRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public SystemSettingRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<SystemSetting>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, description, value, code, created_at, created_by, updated_at, updated_by FROM system_setting";
                var models = await _dbConnection.QueryAsync<SystemSetting>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SystemSetting", ex);
            }
        }

        public async Task<SystemSetting> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, description, value, code, created_at, created_by, updated_at, updated_by FROM system_setting WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<SystemSetting>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"SystemSetting with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SystemSetting", ex);
            }
        }
        
        public async Task<List<SystemSetting>> GetByCodes(List<string> codes)
        {
            try
            {
                var sql = "SELECT id, name, description, value, code, created_at, created_by, updated_at, updated_by FROM system_setting WHERE code = ANY(@codes)";
                var models = await _dbConnection.QueryAsync<SystemSetting>(sql, new { codes }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SystemSetting", ex);
            }
        }

        public async Task<int> Add(SystemSetting domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO system_setting (name, description, code, value, created_at, created_by, updated_at, updated_by) 
                            VALUES (@name, @description, @code, @value, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add SystemSetting", ex);
            }
        }

        public async Task Update(SystemSetting domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE system_setting SET name = @name, description = @description, code = @code, value = @value, created_at = @created_at, created_by = @created_by, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update SystemSetting", ex);
            }
        }

        public async Task<PaginatedList<SystemSetting>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM system_setting OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<SystemSetting>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM system_setting";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<SystemSetting>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SystemSetting", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM system_setting WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("SystemSetting not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete SystemSetting", ex);
            }
        }
    }
}
