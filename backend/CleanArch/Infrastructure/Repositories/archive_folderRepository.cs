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
    public class archive_folderRepository : Iarchive_folderRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public archive_folderRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<archive_folder>> GetAll()
        {
            try
            {
                var sql = @"SELECT 
    af.id,
    af.archive_folder_name,
    af.dutyplan_object_id,
    af.folder_location,
    af.created_at,
    af.updated_at,
    af.created_by,
    af.updated_by,
    dpo.doc_number as object_number,
    dpo.address as object_address
FROM 
    archive_folder af
JOIN 
    dutyplan_object dpo ON af.dutyplan_object_id = dpo.id;";
                var models = await _dbConnection.QueryAsync<archive_folder>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_folder", ex);
            }
        }

        public async Task<int> Add(archive_folder domain)
        {
            try
            {
                var model = new archive_folderModel
                {

                    id = domain.id,
                    archive_folder_name = domain.archive_folder_name,
                    dutyplan_object_id = domain.dutyplan_object_id,
                    folder_location = domain.folder_location,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"INSERT INTO ""archive_folder""(""archive_folder_name"", ""dutyplan_object_id"", ""folder_location"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@archive_folder_name, @dutyplan_object_id, @folder_location, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add archive_folder", ex);
            }
        }

        public async Task Update(archive_folder domain)
        {
            try
            {
                var model = new archive_folderModel
                {

                    id = domain.id,
                    archive_folder_name = domain.archive_folder_name,
                    dutyplan_object_id = domain.dutyplan_object_id,
                    folder_location = domain.folder_location,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"UPDATE ""archive_folder"" SET ""id"" = @id, ""archive_folder_name"" = @archive_folder_name, ""dutyplan_object_id"" = @dutyplan_object_id, ""folder_location"" = @folder_location, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update archive_folder", ex);
            }
        }

        public async Task<PaginatedList<archive_folder>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""archive_folder"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<archive_folder>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""archive_folder""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<archive_folder>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_folders", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""archive_folder"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update archive_folder", ex);
            }
        }
        public async Task<archive_folder> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT 
    af.id,
    af.archive_folder_name,
    af.dutyplan_object_id,
    af.folder_location,
    af.created_at,
    af.updated_at,
    af.created_by,
    af.updated_by,
    dpo.doc_number as object_number,
    dpo.address as object_address
FROM 
    archive_folder af
JOIN 
    dutyplan_object dpo ON af.dutyplan_object_id = dpo.id
WHERE af.id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<archive_folder>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_folder", ex);
            }
        }


        public async Task<List<archive_folder>> GetBydutyplan_object_id(int dutyplan_object_id)
        {
            try
            {
                var sql = "SELECT \r\n    af.id,\r\n    af.archive_folder_name,\r\n    af.dutyplan_object_id,\r\n    af.folder_location,\r\n    af.created_at,\r\n    af.updated_at,\r\n    af.created_by,\r\n    af.updated_by,\r\n    dpo.doc_number as object_number,\r\n    dpo.address as object_address\r\nFROM \r\n    archive_folder af\r\nJOIN \r\n    dutyplan_object dpo ON af.dutyplan_object_id = dpo.id WHERE \"dutyplan_object_id\" = @dutyplan_object_id";
                var models = await _dbConnection.QueryAsync<archive_folder>(sql, new { dutyplan_object_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get archive_folder", ex);
            }
        }

    }
}
