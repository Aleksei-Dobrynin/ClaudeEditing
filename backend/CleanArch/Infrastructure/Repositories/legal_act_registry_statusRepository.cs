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
    public class legal_act_registry_statusRepository : Ilegal_act_registry_statusRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public legal_act_registry_statusRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<legal_act_registry_status>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_act_registry_status""";
                var models = await _dbConnection.QueryAsync<legal_act_registry_status>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_registry_status", ex);
            }
        }

        public async Task<int> Add(legal_act_registry_status domain)
        {
            try
            {
                var model = new legal_act_registry_statusModel
                {
                    
                    id = domain.id,
                    description_kg = domain.description_kg,
                    text_color = domain.text_color,
                    background_color = domain.background_color,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    name_kg = domain.name_kg,
                };
                var sql = @"INSERT INTO ""legal_act_registry_status""(""description_kg"", ""text_color"", ""background_color"", ""name"", ""description"", ""code"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"", ""name_kg"") 
                VALUES (@description_kg, @text_color, @background_color, @name, @description, @code, @created_at, @updated_at, @created_by, @updated_by, @name_kg) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add legal_act_registry_status", ex);
            }
        }

        public async Task Update(legal_act_registry_status domain)
        {
            try
            {
                var model = new legal_act_registry_statusModel
                {
                    
                    id = domain.id,
                    description_kg = domain.description_kg,
                    text_color = domain.text_color,
                    background_color = domain.background_color,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    name_kg = domain.name_kg,
                };
                var sql = @"UPDATE ""legal_act_registry_status"" SET ""id"" = @id, ""description_kg"" = @description_kg, ""text_color"" = @text_color, ""background_color"" = @background_color, ""name"" = @name, ""description"" = @description, ""code"" = @code, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""name_kg"" = @name_kg WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_act_registry_status", ex);
            }
        }

        public async Task<PaginatedList<legal_act_registry_status>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_act_registry_status"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<legal_act_registry_status>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""legal_act_registry_status""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<legal_act_registry_status>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_registry_statuss", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""legal_act_registry_status"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_act_registry_status", ex);
            }
        }
        public async Task<legal_act_registry_status> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_act_registry_status"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<legal_act_registry_status>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_registry_status", ex);
            }
        }

        
    }
}
