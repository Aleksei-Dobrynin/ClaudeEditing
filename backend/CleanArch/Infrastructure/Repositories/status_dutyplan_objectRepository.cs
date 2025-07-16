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
    public class status_dutyplan_objectRepository : Istatus_dutyplan_objectRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public status_dutyplan_objectRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<status_dutyplan_object>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""status_dutyplan_object""";
                var models = await _dbConnection.QueryAsync<status_dutyplan_object>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get status_dutyplan_object", ex);
            }
        }
        public async Task<List<status_dutyplan_object>> GetByIdApplicaiton(int application_id)
        {
            try
            {
                var sql = @"SELECT * FROM ""status_dutyplan_object""";
                var models = await _dbConnection.QueryAsync<status_dutyplan_object>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get status_dutyplan_object", ex);
            }
        }

        public async Task<int> Add(status_dutyplan_object domain)
        {
            try
            {
                var model = new status_dutyplan_objectModel
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
                var sql = @"INSERT INTO ""status_dutyplan_object""(""updated_at"", ""created_by"", ""updated_by"", ""name"", ""description"", ""code"", ""name_kg"", ""description_kg"", ""text_color"", ""background_color"", ""created_at"") 
                VALUES (@updated_at, @created_by, @updated_by, @name, @description, @code, @name_kg, @description_kg, @text_color, @background_color, @created_at) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add status_dutyplan_object", ex);
            }
        }

        public async Task Update(status_dutyplan_object domain)
        {
            try
            {
                var model = new status_dutyplan_objectModel
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
                var sql = @"UPDATE ""status_dutyplan_object"" SET ""id"" = @id, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""name"" = @name, ""description"" = @description, ""code"" = @code, ""name_kg"" = @name_kg, ""description_kg"" = @description_kg, ""text_color"" = @text_color, ""background_color"" = @background_color, ""created_at"" = @created_at WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update status_dutyplan_object", ex);
            }
        }

        public async Task<PaginatedList<status_dutyplan_object>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""status_dutyplan_object"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<status_dutyplan_object>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""status_dutyplan_object""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<status_dutyplan_object>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get status_dutyplan_objects", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""status_dutyplan_object"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update status_dutyplan_object", ex);
            }
        }
        public async Task<status_dutyplan_object> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""status_dutyplan_object"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<status_dutyplan_object>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get status_dutyplan_object", ex);
            }
        }

        
    }
}
