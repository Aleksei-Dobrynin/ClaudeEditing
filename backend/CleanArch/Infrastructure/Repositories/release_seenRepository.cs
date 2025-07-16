using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;

namespace Infrastructure.Repositories
{
    public class release_seenRepository : Irelease_seenRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public release_seenRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<release_seen>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""release_seen""";
                var models = await _dbConnection.QueryAsync<release_seen>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release_seen", ex);
            }
        }

        public async Task<int> Add(release_seen domain)
        {
            try
            {
                var model = new release_seenModel
                {
                    
                    id = domain.id,
                    release_id = domain.release_id,
                    user_id = domain.user_id,
                    date_issued = domain.date_issued,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"INSERT INTO ""release_seen""(""release_id"", ""user_id"", ""date_issued"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@release_id, @user_id, @date_issued, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add release_seen", ex);
            }
        }

        public async Task Update(release_seen domain)
        {
            try
            {
                var model = new release_seenModel
                {
                    
                    id = domain.id,
                    release_id = domain.release_id,
                    user_id = domain.user_id,
                    date_issued = domain.date_issued,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"UPDATE ""release_seen"" SET ""id"" = @id, ""release_id"" = @release_id, ""user_id"" = @user_id, ""date_issued"" = @date_issued, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update release_seen", ex);
            }
        }

        public async Task<PaginatedList<release_seen>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""release_seen"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<release_seen>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""release_seen""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<release_seen>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release_seens", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""release_seen"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update release_seen", ex);
            }
        }
        public async Task<release_seen> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""release_seen"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<release_seen>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release_seen", ex);
            }
        }
        public async Task<bool> LastReleaseRead(int user_id)
        {
            try
            {
                var sql = """
                    select * from release_seen seen
                        inner join (
                            SELECT release.* FROM release
                            where release.date_start is not null and release.date_start < @now
                            order by release.date_start desc
                            limit 1
                        ) release on release.id = seen.release_id
                    where seen.user_id = @user_id
                    """;
                var models = await _dbConnection.QueryAsync<release_seen>(sql, new { user_id, now = DateTime.Now }, transaction: _dbTransaction);
                return models.Count() > 0;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release_seen", ex);
            }
        }

        
        public async Task<List<release_seen>> GetByrelease_id(int release_id)
        {
            try
            {
                var sql = "SELECT * FROM \"release_seen\" WHERE \"release_id\" = @release_id";
                var models = await _dbConnection.QueryAsync<release_seen>(sql, new { release_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release_seen", ex);
            }
        }
        
    }
}
