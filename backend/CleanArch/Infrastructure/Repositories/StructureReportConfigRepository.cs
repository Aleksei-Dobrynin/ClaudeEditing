using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Xml.Linq;

namespace Infrastructure.Repositories
{
    public class StructureReportConfigRepository : IStructureReportConfigRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public StructureReportConfigRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<StructureReportConfig>> GetAll()
        {
            try
            {
                var sql = @"
            SELECT 
                src.*, 
                os.name AS structure_name
            FROM 
                structure_report_config src
            LEFT JOIN 
                org_structure os ON src.structure_id = os.id";

                var models = await _dbConnection.QueryAsync<StructureReportConfig>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportConfig", ex);
            }
        }

        public async Task<int> Add(StructureReportConfig domain)
        {
            try
            {
                var sql = @"INSERT INTO structure_report_config (
                            name, created_at, created_by, updated_at, updated_by, is_active, structure_id)
                        VALUES(
                            @name, @createdAt, @createdBy, @updatedAt, @updatedBy, @isActive, @structureId)
                        RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add StructureReportConfig", ex);
            }
        }

        public async Task Update(StructureReportConfig domain)
        {
            try
            {
                var sql = @"UPDATE structure_report_config SET name = @name, updated_at = @updatedAt, updated_by = @updatedBy, is_active = @isActive, structure_id = @structureId
                        WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update StructureReportConfig", ex);
            }
        }

        public async Task<PaginatedList<StructureReportConfig>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"
            SELECT 
                src.*, 
                os.name AS structure_name
            FROM 
                structure_report_config src
            LEFT JOIN 
                org_structure os ON src.structure_id = os.id
            OFFSET @offset LIMIT @pageSize";

                var models = await _dbConnection.QueryAsync<StructureReportConfig>(sql, new { offset = pageSize * (pageNumber - 1), pageSize }, transaction: _dbTransaction);
                var sqlCount = "SELECT COUNT(*) FROM structure_report_config";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);
                var domainItems = models.ToList();
                return new PaginatedList<StructureReportConfig>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportConfigs", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM \"structure_report_config\" WHERE \"id\" = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { id }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete StructureReportConfig", ex);
            }
        }

        public async Task<StructureReportConfig> GetOne(int id)
        {
            try
            {
                var sql = @"
            SELECT 
                src.*, 
                os.name AS structure_name
            FROM 
                structure_report_config src
            LEFT JOIN 
                org_structure os ON src.structure_id = os.id
            WHERE 
                src.id = @id
            LIMIT 1";

                var model = await _dbConnection.QuerySingleOrDefaultAsync<StructureReportConfig>(sql, new { id }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportConfig", ex);
            }
        }

        public async Task<StructureReportConfig> GetOneByCode(string code)
        {
            try
            {
                var sql = "SELECT * FROM \"structure_report_config\" WHERE \"code\" = @code LIMIT 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<StructureReportConfig>(sql, new { code }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportConfig", ex);
            }
        }

        public async Task<List<StructureReportConfig>> GetbyidStructure(int idStructure)
        {
            try
            {
                var sql = @"
            SELECT 
                src.*, 
                os.name AS structure_name
            FROM 
                structure_report_config src
            LEFT JOIN 
                org_structure os ON src.structure_id = os.id
            WHERE 
                src.structure_id = @idStructure";

                var models = await _dbConnection.QueryAsync<StructureReportConfig>(sql, new { idStructure }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportConfig", ex);
            }
        }
    }
}
