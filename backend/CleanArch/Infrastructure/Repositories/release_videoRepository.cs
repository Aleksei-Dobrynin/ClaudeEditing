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
    public class release_videoRepository : Irelease_videoRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public release_videoRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<release_video>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""release_video""";
                var models = await _dbConnection.QueryAsync<release_video>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release_video", ex);
            }
        }

        public async Task<int> Add(release_video domain)
        {
            try
            {
                var model = new release_videoModel
                {
                    
                    id = domain.id,
                    release_id = domain.release_id,
                    file_id = domain.file_id,
                    name = domain.name,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"INSERT INTO ""release_video""(""release_id"", ""file_id"", ""name"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@release_id, @file_id, @name, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add release_video", ex);
            }
        }

        public async Task Update(release_video domain)
        {
            try
            {
                var model = new release_videoModel
                {
                    
                    id = domain.id,
                    release_id = domain.release_id,
                    file_id = domain.file_id,
                    name = domain.name,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"UPDATE ""release_video"" SET ""id"" = @id, ""release_id"" = @release_id, ""file_id"" = @file_id, ""name"" = @name, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update release_video", ex);
            }
        }

        public async Task<PaginatedList<release_video>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""release_video"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<release_video>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""release_video""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<release_video>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release_videos", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""release_video"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update release_video", ex);
            }
        }
        public async Task<release_video> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""release_video"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<release_video>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release_video", ex);
            }
        }

        
        public async Task<List<release_video>> GetByrelease_id(int release_id)
        {
            try
            {
                var sql = @"
SELECT release_video.*, file.name file_name
FROM release_video 
LEFT JOIN file on file.id = release_video.file_id
WHERE release_video.release_id = @release_id
";

                var models = await _dbConnection.QueryAsync<release_video>(sql, new { release_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release_video", ex);
            }
        }
        
        public async Task<List<release_video>> GetByfile_id(int file_id)
        {
            try
            {
                var sql = "SELECT * FROM \"release_video\" WHERE \"file_id\" = @file_id";
                var models = await _dbConnection.QueryAsync<release_video>(sql, new { file_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release_video", ex);
            }
        }
        
    }
}
