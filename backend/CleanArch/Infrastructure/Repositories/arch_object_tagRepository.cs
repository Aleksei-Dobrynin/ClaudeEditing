using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using System.Collections.Generic;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class arch_object_tagRepository : Iarch_object_tagRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public arch_object_tagRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<arch_object_tag>> GetAll()
        {
            try
            {
                var sql = @"
                SELECT 
                    aot.id,
                    aot.id_object,
                    aot.id_tag,
                    t.name AS id_tag_name,
                    ao.name AS id_object_name
                FROM arch_object_tag aot
                JOIN tag t ON aot.id_tag = t.id
                JOIN arch_object ao ON aot.id_object = ao.id";

                var models = await _dbConnection.QueryAsync<arch_object_tag>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get arch_object_tag", ex);
            }
        }

        public async Task<int> Add(arch_object_tag domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new arch_object_tagModel
                {
                    id_tag = domain.id_tag,
                    id_object = domain.id_object
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"
                INSERT INTO arch_object_tag (id_tag, id_object, created_at, updated_at, created_by, updated_by) 
                VALUES (@id_tag, @id_object,  @created_at, @updated_at, @created_by, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add arch_object_tag", ex);
            }
        }

        public async Task Update(arch_object_tag domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new arch_object_tagModel
                {
                    id = domain.id,
                    id_tag = domain.id_tag,
                    id_object = domain.id_object
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"
                UPDATE arch_object_tag 
                SET id_tag = @id_tag, id_object = @id_object,
                updated_at = @updated_at, updated_by = @updated_by
                WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update arch_object_tag", ex);
            }
        }

        public async Task<PaginatedList<arch_object_tag>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"
                SELECT 
                    aot.id,
                    aot.id_object,
                    aot.id_tag,
                    t.name AS id_tag_name,
                    ao.name AS id_object_name
                FROM arch_object_tag aot
                JOIN tag t ON aot.id_tag = t.id
                JOIN arch_object ao ON aot.id_object = ao.id
                OFFSET @pageSize *(@pageNumber - 1) LIMIT @pageSize";

                var models = await _dbConnection.QueryAsync<arch_object_tag>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM arch_object_tag";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<arch_object_tag>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get arch_object_tags", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM arch_object_tag WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { id }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete arch_object_tag", ex);
            }
        }

        public async Task<arch_object_tag> GetOne(int id)
        {
            try
            {
                var sql = @"
                SELECT 
                    aot.id,
                    aot.id_object,
                    aot.id_tag,
                    t.name AS id_tag_name,
                    ao.name AS id_object_name
                FROM arch_object_tag aot
                JOIN tag t ON aot.id_tag = t.id
                JOIN arch_object ao ON aot.id_object = ao.id
                WHERE aot.id = @id
                LIMIT 1";

                var model = await _dbConnection.QueryFirstOrDefaultAsync<arch_object_tag>(sql, new { id }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get arch_object_tag", ex);
            }
        }

        public async Task<List<arch_object_tag>> GetByIdObject(int idObject)
        {
            try
            {
                var sql = "SELECT * FROM \"arch_object_tag\" WHERE \"id_object\" = @idObject";
                var models = await _dbConnection.QueryAsync<arch_object_tag>(sql, new { idObject }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_task", ex);
            }
        }
    }
}