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
    public class StructureReportStatusRepository : IStructureReportStatusRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public StructureReportStatusRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<StructureReportStatus>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"structure_report_status\"";
                var models = await _dbConnection.QueryAsync<StructureReportStatus>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportStatus", ex);
            }
        }

        public async Task<int> Add(StructureReportStatus domain)
        {
            try
            {
                var model = new StructureReportStatusModel
                {
                    code = domain.code,
                    createdBy = domain.createdBy,
                    createdAt = domain.createdAt,
                    updatedBy = domain.updatedBy,
                    updatedAt = domain.updatedAt,
                    description = domain.description,
                    name = domain.name
                };

                var sql = @"INSERT INTO ""structure_report_status"" 
                            (""code"", ""created_by"", ""created_at"", ""updated_by"", ""updated_at"", ""description"", ""name"") 
                            VALUES (@code, @createdBy, @createdAt, @updatedBy, @updatedAt, @description, @name) 
                            RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add StructureReportStatus", ex);
            }
        }

        public async Task Update(StructureReportStatus domain)
        {
            try
            {
                var model = new StructureReportStatusModel
                {
                    id = domain.id,
                    code = domain.code,
                    //createdBy = domain.createdBy,
                    //createdAt = domain.createdAt,
                    updatedBy = domain.updatedBy,
                    updatedAt = domain.updatedAt,
                    description = domain.description,
                    name = domain.name
                };

                var sql = @"UPDATE ""structure_report_status"" 
                            SET ""code"" = @code,  
                                ""updated_by"" = @updatedBy, 
                                ""updated_at"" = @updatedAt, 
                                ""description"" = @description, 
                                ""name"" = @name 
                            WHERE ""id"" = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update StructureReportStatus", ex);
            }
        }

        public async Task<PaginatedList<StructureReportStatus>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""structure_report_status"" 
                            ORDER BY id 
                            OFFSET @offset LIMIT @limit";

                var models = await _dbConnection.QueryAsync<StructureReportStatus>(
                    sql,
                    new { offset = (pageNumber - 1) * pageSize, limit = pageSize },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM \"structure_report_status\"";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();
                return new PaginatedList<StructureReportStatus>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportStatuses", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM \"structure_report_status\" WHERE \"id\" = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete StructureReportStatus", ex);
            }
        }

        public async Task<StructureReportStatus> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"structure_report_status\" WHERE \"id\" = @id";
                var models = await _dbConnection.QueryAsync<StructureReportStatus>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportStatus", ex);
            }
        }

        public async Task<StructureReportStatus> GetOneByCode(string code)
        {
            try
            {
                var sql = "SELECT * FROM \"structure_report_status\" WHERE \"code\" = @code";
                var models = await _dbConnection.QueryAsync<StructureReportStatus>(sql, new { code }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureReportStatus", ex);
            }
        }
    }
}