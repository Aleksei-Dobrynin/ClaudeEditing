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
    public class StructureReportFieldConfigRepository : IStructureReportFieldConfigRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public StructureReportFieldConfigRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<StructureReportFieldConfig>> GetAll()
        {
            try
            {
                var sql = @"
            SELECT 
                s.*, 
                ARRAY_AGG(DISTINCT u.unit_id) AS unit_types
            FROM 
                ""structure_report_field_config"" s
            LEFT JOIN 
                ""unit_for_field_config"" u
            ON 
                s.id = u.field_id
            GROUP BY 
                s.id";

                var result = await _dbConnection.QueryAsync(sql, transaction: _dbTransaction);

                var models = result.Select(row => new StructureReportFieldConfig
                {
                    id = row.id,
                    structureReportId = row.structure_report_id,
                    fieldName = row.field_name,
                    reportItem = row.report_item,
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    createdBy = row.created_by,
                    updatedBy = row.updated_by,
                    unitTypes = row.unit_types != null ? ((int[])row.unit_types).ToList() : new List<int>()
                }).ToList();

                return models;

            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportFieldConfig", ex);
            }
        }

        public async Task<int> Add(StructureReportFieldConfig domain)
        {
            try
            {
                var model = new StructureReportFieldConfigModel
                {
                    id = domain.id,
                    createdAt = domain.createdAt,
                    createdBy = domain.createdBy,
                    fieldName = domain.fieldName,
                    reportItem = domain.reportItem,
                    structureReportId = domain.structureReportId,
                    updatedAt = domain.updatedAt,
                    updatedBy = domain.updatedBy
                };
                var sql = @"
                    INSERT INTO ""structure_report_field_config""
                    (""field_name"", ""report_item"", ""structure_report_id"", ""created_at"", ""created_by"", ""updated_at"", ""updated_by"")
                    VALUES (@fieldName, @reportItem, @structureReportId, @createdAt, @createdBy, @updatedAt, @updatedBy)
                    RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add StructureReportFieldConfig", ex);
            }
        }

        public async Task Update(StructureReportFieldConfig domain)
        {
            try
            {
                var model = new StructureReportFieldConfigModel
                {
                    id = domain.id,
                    //createdAt = domain.createdAt,
                    //createdBy = domain.createdBy,
                    fieldName = domain.fieldName,
                    reportItem = domain.reportItem,
                    structureReportId = domain.structureReportId,
                    updatedAt = domain.updatedAt,
                    updatedBy = domain.updatedBy
                };
                var sql = @"
                    UPDATE ""structure_report_field_config""
                    SET ""field_name"" = @fieldName,
                        ""report_item"" = @reportItem,
                        ""structure_report_id"" = @structureReportId,
                        ""updated_at"" = @updatedAt,
                        ""updated_by"" = @updatedBy
                    WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update StructureReportFieldConfig", ex);
            }
        }

        public async Task<PaginatedList<StructureReportFieldConfig>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"
            SELECT 
                s.*, 
                ARRAY_AGG(DISTINCT u.unit_id) AS unit_types
            FROM 
                ""structure_report_field_config"" s
            LEFT JOIN 
                ""unit_for_field_config"" u
            ON 
                s.id = u.field_id
            GROUP BY 
                s.id
            OFFSET @pageSize * (@pageNumber - 1)
            LIMIT @pageSize";


                var result = await _dbConnection.QueryAsync(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var models = result.Select(row => new StructureReportFieldConfig
                {
                    id = row.id,
                    structureReportId = row.structure_report_id,
                    fieldName = row.field_name,
                    reportItem = row.report_item,
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    createdBy = row.created_by,
                    updatedBy = row.updated_by,
                    unitTypes = row.unit_types != null ? ((int[])row.unit_types).ToList() : new List<int>()
                }).ToList();


                var sqlCount = "SELECT COUNT(*) FROM structure_report_field_config";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();
                return new PaginatedList<StructureReportFieldConfig>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportFieldConfigs", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"structure_report_field_config\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete StructureReportFieldConfig", ex);
            }
        }

        public async Task<StructureReportFieldConfig> GetOne(int id)
        {
            try
            {
                var sql = @"
            SELECT 
                s.*, 
                ARRAY_AGG(DISTINCT u.unit_id) AS unit_types
            FROM 
                ""structure_report_field_config"" s
            LEFT JOIN 
                ""unit_for_field_config"" u
            ON 
                s.id = u.field_id
            WHERE 
                s.id = @id
            GROUP BY 
                s.id
            LIMIT 1";

                //var models = await _dbConnection.QueryAsync<StructureReportFieldConfig>(sql, new { id }, transaction: _dbTransaction);


                var result = await _dbConnection.QueryAsync(sql,new {id}, transaction: _dbTransaction);

                var models = result.Select(row => new StructureReportFieldConfig
                {
                    id = row.id,
                    structureReportId = row.structure_report_id,
                    fieldName = row.field_name,
                    reportItem = row.report_item,
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    createdBy = row.created_by,
                    updatedBy = row.updated_by,
                    unitTypes = row.unit_types != null ? ((int[])row.unit_types).ToList() : new List<int>()
                }).ToList();

                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportFieldConfig", ex);
            }
        }

        public async Task<StructureReportFieldConfig> GetOneByCode(string code)
        {
            //TODO delete this for no usage
            try
            {
                var sql = "SELECT * FROM \"structure_report_field_config\" WHERE \"code\" = @code LIMIT 1";
                var models = await _dbConnection.QueryAsync<StructureReportFieldConfig>(sql, new { code }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportFieldConfig by code", ex);
            }
        }

        public async Task<List<StructureReportFieldConfig>> GetByidReportConfig(int idReportConfig)
        {
            try
            {
                var sql = @"
            SELECT 
                s.*, 
                ARRAY_AGG(DISTINCT u.unit_id) AS unit_types
            FROM 
                ""structure_report_field_config"" s
            LEFT JOIN 
                ""unit_for_field_config"" u
            ON 
                s.id = u.field_id
            WHERE 
                s.structure_report_id = @idReportConfig
            GROUP BY 
                s.id";

                var result = await _dbConnection.QueryAsync(sql, new { idReportConfig }, transaction: _dbTransaction);

                var models = result.Select(row => new StructureReportFieldConfig
                {
                    id = row.id,
                    structureReportId = row.structure_report_id,
                    fieldName = row.field_name,
                    reportItem = row.report_item,
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    createdBy = row.created_by,
                    updatedBy = row.updated_by,
                    unitTypes = row.unit_types != null ? ((int[])row.unit_types).ToList() : new List<int>()
            }).ToList();

                return models;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportField", ex);
            }
        }
    }
}

