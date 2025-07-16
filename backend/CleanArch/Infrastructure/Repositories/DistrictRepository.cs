using Application.Exceptions;
using Application.Models;
using Application.Repositories;
using Dapper;
using Domain.Entities;
using Infrastructure.FillLogData;
using System.Data;

namespace Infrastructure.Repositories
{
    public class DistrictRepository : IDistrictRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public DistrictRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<District>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, description, code FROM district";
                var models = await _dbConnection.QueryAsync<District>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get District", ex);
            }
        }

        public async Task<District> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, description, code FROM district WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<District>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"District with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get District", ex);
            }
        }

        public async Task<int> Add(District domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new District
                {
                    name = domain.name,
                    code = domain.code,
                    description = domain.description
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO district (name, code, description, created_at, updated_at, created_by, updated_by) VALUES (@name, @code, @description, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add District", ex);
            }
        }

        public async Task Update(District domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new District
                {
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = "UPDATE district SET name = @name, code = @code, description = @description, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update District", ex);
            }
        }

        public async Task<PaginatedList<District>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM district OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<District>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM district";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<District>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get District", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM district WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("District not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete District", ex);
            }
        }
    }
}
