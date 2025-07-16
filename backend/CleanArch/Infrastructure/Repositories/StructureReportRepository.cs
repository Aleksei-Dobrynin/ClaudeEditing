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
    public class StructureReportRepository : IStructureReportRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public StructureReportRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<StructureReport>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"structure_report\"";
                var models = await _dbConnection.QueryAsync<StructureReport>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReport", ex);
            }
        }

        public async Task<int> Add(StructureReport domain)
        {
            try
            {
                var model = new StructureReportModel
                {
                    structureId = domain.structureId,
                    updatedBy = domain.updatedBy,
                    updatedAt = domain.updatedAt,
                    createdBy = domain.createdBy,
                    createdAt = domain.createdAt,
                    month = domain.month,
                    quarter = domain.quarter,
                    reportConfigId = domain.reportConfigId,
                    statusId = domain.statusId,
                    year = domain.year,
                };

                var sql = @"INSERT INTO ""structure_report"" 
                            (""structure_id"", ""updated_by"", ""updated_at"", ""created_by"", ""created_at"", ""month"", ""quarter"", ""report_config_id"", ""status_id"", ""year"") 
                            VALUES (@structureId, @updatedBy, @updatedAt, @createdBy, @createdAt, @month, @quarter, @reportConfigId, @statusId, @year) 
                            RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add StructureReport", ex);
            }
        }

        public async Task Update(StructureReport domain)
        {
            try
            {
                var model = new StructureReportModel
                {
                    id = domain.id,
                    structureId = domain.structureId,
                    updatedBy = domain.updatedBy,
                    updatedAt = domain.updatedAt,
                    //createdBy = domain.createdBy,
                    //createdAt = domain.createdAt,
                    month = domain.month,
                    quarter = domain.quarter,
                    reportConfigId = domain.reportConfigId,
                    statusId = domain.statusId,
                    year = domain.year,
                };

                var sql = @"UPDATE ""structure_report"" 
                            SET ""structure_id"" = @structureId, 
                                ""updated_by"" = @updatedBy, 
                                ""updated_at"" = @updatedAt, 
                                ""month"" = @month, 
                                ""quarter"" = @quarter, 
                                ""report_config_id"" = @reportConfigId, 
                                ""status_id"" = @statusId, 
                                ""year"" = @year 
                            WHERE ""id"" = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update StructureReport", ex);
            }
        }

        public async Task<PaginatedList<StructureReport>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""structure_report"" 
                            ORDER BY id 
                            OFFSET @offset LIMIT @limit";

                var models = await _dbConnection.QueryAsync<StructureReport>(
                    sql,
                    new { offset = (pageNumber - 1) * pageSize, limit = pageSize },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM \"structure_report\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();
                return new PaginatedList<StructureReport>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReports", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"structure_report\" WHERE \"id\" = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete StructureReport", ex);
            }
        }

        public async Task<StructureReport> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"structure_report\" WHERE \"id\" = @id";
                var models = await _dbConnection.QueryAsync<StructureReport>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReport", ex);
            }
        }

        public async Task<StructureReport> GetOneByCode(string code)
        {
            try
            {
                var sql = "SELECT * FROM \"structure_report\" WHERE \"code\" = @code";
                var models = await _dbConnection.QueryAsync<StructureReport>(sql, new { code }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReport", ex);
            }
        }

        public async Task<List<StructureReport>> GetbyidConfig(int idConfig)
        {
            try
            {
                var sql = "SELECT * FROM \"structure_report\" WHERE report_config_id = @idConfig";
                var models = await _dbConnection.QueryAsync<StructureReport>(sql, new { idConfig }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReport", ex);
            }
        }
        public async Task<List<StructureReport>> GetbyidStructure(int idStructure)
        {
            try
            {
                var sql = "SELECT * FROM \"structure_report\" WHERE structure_id = @idStructure";
                var models = await _dbConnection.QueryAsync<StructureReport>(sql, new { idStructure }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReport", ex);
            }
        }

    }
}