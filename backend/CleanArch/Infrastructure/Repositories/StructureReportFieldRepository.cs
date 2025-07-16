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
    public class StructureReportFieldRepository : IStructureReportFieldRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public StructureReportFieldRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<StructureReportField>> GetAll()
        {
            try
            {
                var sql = @"SELECT 
                                s.*,
                                u.name as unitName,
                                cfg.field_name as field_name,
                                cfg.report_item as report_item
                            FROM structure_report_field s 
                            LEFT JOIN unit_type u ON  s.unit_id = u.id
                            LEFT JOIN structure_report_field_config cfg ON s.field_id = cfg.id";

                var models = await _dbConnection.QueryAsync<StructureReportField>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportField", ex);
            }
        }

        public async Task<int> Add(StructureReportField domain)
        {
            try
            {
                var model = new StructureReportFieldModel
                {
                    id = domain.id,
                    updatedBy = domain.updatedBy,
                    updatedAt = domain.updatedAt,
                    createdBy = domain.createdBy,
                    createdAt = domain.createdAt,
                    fieldId = domain.fieldId,
                    reportId = domain.reportId,
                    unitId = domain.unitId,
                    value = domain.value
                };
                var sql = "INSERT INTO \"structure_report_field\"(\"updated_by\", \"updated_at\", \"created_by\", \"created_at\", \"field_id\", \"report_id\", \"unit_id\", \"value\") " +
                          "VALUES (@updatedBy, @updatedAt, @createdBy, @createdAt, @fieldId, @reportId, @unitId, @value) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add StructureReportField", ex);
            }
        }

        public async Task Update(StructureReportField domain)
        {
            try
            {
                var model = new StructureReportFieldModel
                {
                    id = domain.id,
                    updatedBy = domain.updatedBy,
                    updatedAt = domain.updatedAt,
                    //createdBy = domain.createdBy,
                    //createdAt = domain.createdAt,
                    fieldId = domain.fieldId,
                    reportId = domain.reportId,
                    unitId = domain.unitId,
                    value = domain.value
                };
                var sql = "UPDATE \"structure_report_field\" SET " +
                          "\"updated_by\" = @updatedBy, \"updated_at\" = @updatedAt, " +
                          "\"field_id\" = @fieldId, \"report_id\" = @reportId, " +
                          "\"unit_id\" = @unitId, \"value\" = @value WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update StructureReportField", ex);
            }
        }

        public async Task<PaginatedList<StructureReportField>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT 
                                s.*,
                                u.name as unitName,
                                cfg.field_name as field_name,
                                cfg.report_item as report_item
                            FROM structure_report_field s 
                            LEFT JOIN unit_type u ON  s.unit_id = u.id
                            LEFT JOIN structure_report_field_config cfg ON s.field_id = cfg.id
                            OFFSET @pageSize * (@pageNumber - 1) LIMIT @pageSize";
                var models = await _dbConnection.QueryAsync<StructureReportField>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM \"structure_report_field\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<StructureReportField>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportFields", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"structure_report_field\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete StructureReportField", ex);
            }
        }

        public async Task<StructureReportField> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT 
                                s.*,
                                u.name as unitName ,
                                cfg.field_name as field_name,
                                cfg.report_item as report_item
                            FROM structure_report_field s 
                            LEFT JOIN unit_type u ON  s.unit_id = u.id
                            LEFT JOIN structure_report_field_config cfg ON s.field_id = cfg.id
                            WHERE s.id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<StructureReportField>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportField", ex);
            }
        }

        public async Task<StructureReportField> GetOneByCode(string code)
        {//TODO wrong gen
            try
            {
                var sql = "SELECT * FROM \"structure_report_field\" WHERE code = @code LIMIT 1";
                var models = await _dbConnection.QueryAsync<StructureReportField>(sql, new { code }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportField", ex);
            }
        }

        public async Task<List<StructureReportField>> GetByidFieldConfig(int idFieldConfig)
        {
            try
            {
                var sql = @"SELECT 
                                s.*,
                                u.name as unitName,
                                cfg.field_name as field_name,
                                cfg.report_item as report_item
                            FROM structure_report_field s 
                            LEFT JOIN unit_type u ON  s.unit_id = u.id
                            LEFT JOIN structure_report_field_config cfg ON s.field_id = cfg.id
                            WHERE field_id = @idFieldConfig";
                var models = await _dbConnection.QueryAsync<StructureReportField>(sql, new { idFieldConfig }, transaction: _dbTransaction);
                //return models.FirstOrDefault();
                return models.ToList();

            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportField", ex);
            }
        }

        public async Task<List<StructureReportField>> GetByidReport(int idReport)
        {
            try
            {
                var sql = @"SELECT 
                                s.*,
                                u.name as unitName ,
                                cfg.field_name as field_name,
                                cfg.report_item as report_item
                            FROM structure_report_field s 
                            LEFT JOIN unit_type u ON  s.unit_id = u.id
                            LEFT JOIN structure_report_field_config cfg ON s.field_id = cfg.id
                            WHERE report_id = @idReport";
                var models = await _dbConnection.QueryAsync<StructureReportField>(sql, new { idReport }, transaction: _dbTransaction);
                //return models.FirstOrDefault();
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportField", ex);
            }
        }
    }
}