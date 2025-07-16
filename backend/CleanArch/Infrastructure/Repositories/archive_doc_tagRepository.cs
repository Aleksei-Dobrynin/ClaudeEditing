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
    public class archive_doc_tagRepository : Iarchive_doc_tagRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public archive_doc_tagRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<archive_doc_tag>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""archive_doc_tag""";
                var models = await _dbConnection.QueryAsync<archive_doc_tag>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_doc_tag", ex);
            }
        }
        
        public async Task<List<archive_doc_tag>> GetByFileId(int fileId)
        {
            try
            {
                var sql = @$"
SELECT adt.* FROM archive_doc_tag adt
    left join archive_file_tags aft on aft.tag_id = adt.id
    where aft.file_id = @fileId
    group by adt.id
";
                var models = await _dbConnection.QueryAsync<archive_doc_tag>(sql, new { fileId }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_doc_tag", ex);
            }
        }

        public async Task<int> Add(archive_doc_tag domain)
        {
            try
            {
                var model = new archive_doc_tagModel
                {
                    
                    id = domain.id,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    name_kg = domain.name_kg,
                    description_kg = domain.description_kg,
                    text_color = domain.text_color,
                    background_color = domain.background_color,
                    created_at = domain.created_at,
                };
                var sql = @"INSERT INTO ""archive_doc_tag""(""updated_at"", ""created_by"", ""updated_by"", ""name"", ""description"", ""code"", ""name_kg"", ""description_kg"", ""text_color"", ""background_color"", ""created_at"") 
                VALUES (@updated_at, @created_by, @updated_by, @name, @description, @code, @name_kg, @description_kg, @text_color, @background_color, @created_at) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add archive_doc_tag", ex);
            }
        }

        public async Task Update(archive_doc_tag domain)
        {
            try
            {
                var model = new archive_doc_tagModel
                {
                    
                    id = domain.id,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    name_kg = domain.name_kg,
                    description_kg = domain.description_kg,
                    text_color = domain.text_color,
                    background_color = domain.background_color,
                    created_at = domain.created_at,
                };
                var sql = @"UPDATE ""archive_doc_tag"" SET ""id"" = @id, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""name"" = @name, ""description"" = @description, ""code"" = @code, ""name_kg"" = @name_kg, ""description_kg"" = @description_kg, ""text_color"" = @text_color, ""background_color"" = @background_color, ""created_at"" = @created_at WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update archive_doc_tag", ex);
            }
        }

        public async Task<PaginatedList<archive_doc_tag>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""archive_doc_tag"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<archive_doc_tag>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""archive_doc_tag""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<archive_doc_tag>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_doc_tags", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""archive_doc_tag"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update archive_doc_tag", ex);
            }
        }
        public async Task<archive_doc_tag> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""archive_doc_tag"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<archive_doc_tag>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_doc_tag", ex);
            }
        }

        
    }
}
