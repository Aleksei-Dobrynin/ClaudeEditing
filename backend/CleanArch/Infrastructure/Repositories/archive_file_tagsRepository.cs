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
    public class archive_file_tagsRepository : Iarchive_file_tagsRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public archive_file_tagsRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<archive_file_tags>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""archive_file_tags""";
                var models = await _dbConnection.QueryAsync<archive_file_tags>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_file_tags", ex);
            }
        }

        public async Task<int> Add(archive_file_tags domain)
        {
            try
            {
                var model = new archive_file_tagsModel
                {
                    
                    id = domain.id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    file_id = domain.file_id,
                    tag_id = domain.tag_id,
                };
                var sql = @"INSERT INTO ""archive_file_tags""(""created_at"", ""updated_at"", ""created_by"", ""updated_by"", ""file_id"", ""tag_id"") 
                VALUES (@created_at, @updated_at, @created_by, @updated_by, @file_id, @tag_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add archive_file_tags", ex);
            }
        }

        public async Task Update(archive_file_tags domain)
        {
            try
            {
                var model = new archive_file_tagsModel
                {
                    
                    id = domain.id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    file_id = domain.file_id,
                    tag_id = domain.tag_id,
                };
                var sql = @"UPDATE ""archive_file_tags"" SET ""id"" = @id, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""file_id"" = @file_id, ""tag_id"" = @tag_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update archive_file_tags", ex);
            }
        }

        public async Task<PaginatedList<archive_file_tags>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""archive_file_tags"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<archive_file_tags>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""archive_file_tags""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<archive_file_tags>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_file_tagss", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM archive_file_tags WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update archive_file_tags", ex);
            }
        }
        public async Task<archive_file_tags> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""archive_file_tags"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<archive_file_tags>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_file_tags", ex);
            }
        }

        
        public async Task<List<archive_file_tags>> GetByfile_id(int file_id)
        {
            try
            {
                var sql = "SELECT * FROM \"archive_file_tags\" WHERE \"file_id\" = @file_id";
                var models = await _dbConnection.QueryAsync<archive_file_tags>(sql, new { file_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_file_tags", ex);
            }
        }
        
        public async Task<List<archive_file_tags>> GetBytag_id(int tag_id)
        {
            try
            {
                var sql = "SELECT * FROM \"archive_file_tags\" WHERE \"tag_id\" = @tag_id";
                var models = await _dbConnection.QueryAsync<archive_file_tags>(sql, new { tag_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_file_tags", ex);
            }
        }
        
    }
}
