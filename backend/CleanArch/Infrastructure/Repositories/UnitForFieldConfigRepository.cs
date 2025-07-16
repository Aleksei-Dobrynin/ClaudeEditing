using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class UnitForFieldConfigRepository : IUnitForFieldConfigRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public UnitForFieldConfigRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<UnitForFieldConfig>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"unit_for_field_config\"";
                var models = await _dbConnection.QueryAsync<UnitForFieldConfig>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UnitForFieldConfig", ex);
            }
        }

        public async Task<int> Add(UnitForFieldConfig domain)
        {
            try
            {
                var model = new UnitForFieldConfigModel
                {
                    updatedBy = domain.updatedBy,
                    updatedAt = domain.updatedAt,
                    createdAt = domain.createdAt,
                    createdBy = domain.createdBy,
                    fieldId = domain.fieldId,
                    unitId = domain.unitId
                };

                var sql = @"INSERT INTO ""unit_for_field_config"" 
                            (""updated_by"", ""updated_at"", ""created_at"", ""created_by"", ""field_id"", ""unit_id"") 
                            VALUES (@updatedBy, @updatedAt, @createdAt, @createdBy, @fieldId, @unitId) 
                            RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add UnitForFieldConfig", ex);
            }
        }

        public async Task Update(UnitForFieldConfig domain)
        {
            try
            {
                var model = new UnitForFieldConfigModel
                {
                    id = domain.id,
                    updatedBy = domain.updatedBy,
                    updatedAt = domain.updatedAt,
                    //createdAt = domain.createdAt,
                    //createdBy = domain.createdBy,
                    fieldId = domain.fieldId,
                    unitId = domain.unitId
                };

                var sql = @"UPDATE ""unit_for_field_config"" 
                            SET ""updated_by"" = @updatedBy, 
                                ""updated_at"" = @updatedAt, 
                                ""field_id"" = @fieldId, 
                                ""unit_id"" = @unitId 
                            WHERE ""id"" = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update UnitForFieldConfig", ex);
            }
        }

        public async Task<PaginatedList<UnitForFieldConfig>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""unit_for_field_config"" 
                            ORDER BY id 
                            OFFSET @offset LIMIT @limit";

                var models = await _dbConnection.QueryAsync<UnitForFieldConfig>(
                    sql,
                    new { offset = (pageNumber - 1) * pageSize, limit = pageSize },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM \"unit_for_field_config\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();
                return new PaginatedList<UnitForFieldConfig>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UnitForFieldConfigs", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"unit_for_field_config\" WHERE \"id\" = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete UnitForFieldConfig", ex);
            }
        }

        public async Task<UnitForFieldConfig> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"unit_for_field_config\" WHERE \"id\" = @id";
                var models = await _dbConnection.QueryAsync<UnitForFieldConfig>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UnitForFieldConfig", ex);
            }
        }

        public async Task<UnitForFieldConfig> GetOneByCode(string code)
        {
            try
            {
                var sql = "SELECT * FROM \"unit_for_field_config\" WHERE \"code\" = @code";
                var models = await _dbConnection.QueryAsync<UnitForFieldConfig>(sql, new { code }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UnitForFieldConfig", ex);
            }
        }

        public async Task<List<UnitForFieldConfig>> GetByidFieldConfig(int idFieldConfig)
        {
            try
            {
                var sql = "SELECT * FROM \"unit_for_field_config\" WHERE field_id = @idFieldConfig ";
                var models = await _dbConnection.QueryAsync<UnitForFieldConfig>(sql,new { idFieldConfig }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get UnitForFieldConfig", ex);
            }
        }
    }
}