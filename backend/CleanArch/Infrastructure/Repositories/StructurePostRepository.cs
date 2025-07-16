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
    public class StructurePostRepository : IStructurePostRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;


        public StructurePostRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<StructurePost>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, description, code FROM structure_post";
                var models = await _dbConnection.QueryAsync<StructurePost>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructurePost", ex);
            }
        }

        public async Task<StructurePost> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, description, code FROM structure_post WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<StructurePost>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"StructurePost with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructurePost", ex);
            }
        }

        public async Task<int> Add(StructurePost domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new StructurePost
                {
                    name = domain.name,
                    code = domain.code,
                    description = domain.description
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO structure_post(name, code, description, created_at, created_by, updated_at, updated_by) VALUES (@name, @code, @description, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add StructurePost", ex);
            }
        }

        public async Task Update(StructurePost domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new StructurePost
                {
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "UPDATE structure_post SET name = @name, code = @code, description = @description, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update StructurePost", ex);
            }
        }

        public async Task<PaginatedList<StructurePost>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM structure_post OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<StructurePost>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM structure_post";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<StructurePost>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructurePost", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM structure_post WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("StructurePost not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete StructurePost", ex);
            }
        }
    }
}
