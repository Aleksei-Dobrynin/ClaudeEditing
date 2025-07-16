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
    public class application_legal_recordRepository : Iapplication_legal_recordRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public application_legal_recordRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<application_legal_record>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""application_legal_record""";
                var models = await _dbConnection.QueryAsync<application_legal_record>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_legal_record", ex);
            }
        }

        public async Task<int> Add(application_legal_record domain)
        {
            try
            {
                var model = new application_legal_recordModel
                {
                    
                    id = domain.id,
                    id_application = domain.id_application,
                    id_legalrecord = domain.id_legalrecord,
                    id_legalact = domain.id_legalact,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"INSERT INTO ""application_legal_record""(""id_application"", ""id_legalrecord"", ""id_legalact"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@id_application, @id_legalrecord, @id_legalact, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add application_legal_record", ex);
            }
        }

        public async Task Update(application_legal_record domain)
        {
            try
            {
                var model = new application_legal_recordModel
                {
                    
                    id = domain.id,
                    id_application = domain.id_application,
                    id_legalrecord = domain.id_legalrecord,
                    id_legalact = domain.id_legalact,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"UPDATE ""application_legal_record"" SET ""id"" = @id, ""id_application"" = @id_application, ""id_legalrecord"" = @id_legalrecord, ""id_legalact"" = @id_legalact, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_legal_record", ex);
            }
        }

        public async Task<PaginatedList<application_legal_record>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_legal_record"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<application_legal_record>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""application_legal_record""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<application_legal_record>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_legal_records", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""application_legal_record"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update application_legal_record", ex);
            }
        }
        public async Task<application_legal_record> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""application_legal_record"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<application_legal_record>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_legal_record", ex);
            }
        }

        
        public async Task<List<application_legal_record>> GetByid_application(int id_application)
        {
            try
            {
                var sql = "SELECT * FROM \"application_legal_record\" WHERE \"id_application\" = @id_application";
                var models = await _dbConnection.QueryAsync<application_legal_record>(sql, new { id_application }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_legal_record", ex);
            }
        }
        
        public async Task<List<application_legal_record>> GetByid_legalrecord(int id_legalrecord)
        {
            try
            {
                var sql = "SELECT * FROM \"application_legal_record\" WHERE \"id_legalrecord\" = @id_legalrecord";
                var models = await _dbConnection.QueryAsync<application_legal_record>(sql, new { id_legalrecord }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_legal_record", ex);
            }
        }
        
        public async Task<List<application_legal_record>> GetByid_legalact(int id_legalact)
        {
            try
            {
                var sql = "SELECT * FROM \"application_legal_record\" WHERE \"id_legalact\" = @id_legalact";
                var models = await _dbConnection.QueryAsync<application_legal_record>(sql, new { id_legalact }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get application_legal_record", ex);
            }
        }
        
    }
}
