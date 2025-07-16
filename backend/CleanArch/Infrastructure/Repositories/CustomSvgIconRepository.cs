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
    public class CustomSvgIconRepository : ICustomSvgIconRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public CustomSvgIconRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<CustomSvgIcon>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"CustomSvgIcon\"";
                var models = await _dbConnection.QueryAsync<CustomSvgIcon>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get \"CustomSvgIcon\"", ex);
            }
        }

        public async Task<int> Add(CustomSvgIcon domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new CustomSvgIconModel
                {
                    id = domain.id,
                    name = domain.name,
                    svgPath = domain.svgPath,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO \"CustomSvgIcon\"(name, \"svgPath\", created_at, created_by, updated_at, updated_by) VALUES (@name, @svgPath, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add \"CustomSvgIcon\"", ex);
            }
        }

        public async Task Update(CustomSvgIcon domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new CustomSvgIconModel
                {
                    id = domain.id,
                    name = domain.name,
                    svgPath = domain.svgPath,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE \"CustomSvgIcon\" SET name = @name, \"svgPath\" = @svgPath, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update \"CustomSvgIcon\"", ex);
            }
        }

        public async Task<PaginatedList<CustomSvgIcon>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM \"CustomSvgIcon\" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<CustomSvgIcon>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM \"CustomSvgIcon\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<CustomSvgIcon>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get \"CustomSvgIcon\"", ex);
            }
        }
    }
}
