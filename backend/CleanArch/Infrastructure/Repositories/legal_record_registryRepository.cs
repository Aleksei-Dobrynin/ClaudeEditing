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
    public class legal_record_registryRepository : Ilegal_record_registryRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public legal_record_registryRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<legal_record_registry>> GetAll()
        {
            try
            {
                var sql = @"SELECT lrr.*, lrs.name as statusName
                FROM legal_record_registry lrr
                LEFT JOIN 
                legal_registry_status lrs ON lrs.id = lrr.id_status
                order by lrr.id desc";
                var models = await _dbConnection.QueryAsync<legal_record_registry>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_record_registry", ex);
            }
        }

        public async Task<int> Add(legal_record_registry domain)
        {
            try
            {
                var model = new legal_record_registryModel
                {
                    
                    id = domain.id,
                    is_active = domain.is_active,
                    defendant = domain.defendant,
                    id_status = domain.id_status,
                    subject = domain.subject,
                    complainant = domain.complainant,
                    decision = domain.decision,
                    addition = domain.addition,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"INSERT INTO ""legal_record_registry""(""is_active"", ""defendant"", ""id_status"", ""subject"", ""complainant"", ""decision"", ""addition"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@is_active, @defendant, @id_status, @subject, @complainant, @decision, @addition, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add legal_record_registry", ex);
            }
        }

        public async Task Update(legal_record_registry domain)
        {
            try
            {
                var model = new legal_record_registryModel
                {
                    
                    id = domain.id,
                    is_active = domain.is_active,
                    defendant = domain.defendant,
                    id_status = domain.id_status,
                    subject = domain.subject,
                    complainant = domain.complainant,
                    decision = domain.decision,
                    addition = domain.addition,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"UPDATE ""legal_record_registry"" SET ""id"" = @id, ""is_active"" = @is_active, ""defendant"" = @defendant, ""id_status"" = @id_status, ""subject"" = @subject, ""complainant"" = @complainant, ""decision"" = @decision, ""addition"" = @addition, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_record_registry", ex);
            }
        }

        public async Task<PaginatedList<legal_record_registry>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_record_registry"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<legal_record_registry>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""legal_record_registry""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<legal_record_registry>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_record_registrys", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                //var sql = @"DELETE FROM ""legal_record_registry"" WHERE id = @id"; //TODO full delete
                var sql = @"UPDATE ""legal_record_registry"" SET ""is_active"" = FALSE WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_record_registry", ex);
            }
        }
        public async Task<legal_record_registry> GetOne(int id)
        {
            try
            {
                
                var sql = @"SELECT lrr.*, 
                lrs.name as statusName,
                COALESCE(ARRAY_AGG(DISTINCT lro.id_object) FILTER (WHERE lro.id_object IS NOT NULL), '{}') AS legal_objects,
                COALESCE(ARRAY_AGG(DISTINCT lre.id_structure_employee) FILTER (WHERE lre.id_structure_employee IS NOT NULL), '{}') AS assignees
                FROM legal_record_registry lrr
                LEFT JOIN legal_registry_status lrs ON lrs.id = lrr.id_status
                LEFT JOIN legal_record_object lro ON lro.id_record = lrr.id
                LEFT JOIN legal_record_employee lre ON lrr.id = lre.id_record
                WHERE lrr.id = @id 
                GROUP BY lrr.id, lrs.name
                LIMIT 1";

                var result = await _dbConnection.QueryAsync(sql, new { id }, transaction: _dbTransaction);

                var models = result.Select(row => new legal_record_registry
                {
                    id = row.id,

                    created_at = row.created_at,
                    created_by = row.created_by,

                    updated_at = row.updated_at,
                    updated_by = row.updated_by,
                    subject = row.subject,
                    statusName = row.statusName,
                    is_active = row.is_active,
                    id_status = row.id_status,
                    decision = row.decision,
                    addition = row.addition,
                    complainant = row.complainant,
                    defendant = row.defendant,
                    legalObjects = row.legal_objects != null ? ((int[])row.legal_objects).ToList() : new List<int>(),
                    assignees = row.assignees != null ? ((int[])row.assignees).ToList() : new List<int>(),
                }).ToList();


                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_record_registry", ex);
            }
        }

        
        public async Task<List<legal_record_registry>> GetByid_status(int id_status)
        {
            try
            {
                var sql = "SELECT lrr.*, lrs.name as statusName \r\n                FROM legal_record_registry lrr\r\n                LEFT JOIN \r\n                legal_registry_status lrs ON lrs.id = lrr.id_status WHERE lrr.id_status = @id_status";
                var models = await _dbConnection.QueryAsync<legal_record_registry>(sql, new { id_status }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_record_registry", ex);
            }
        }


        public async Task<List<legal_record_registry>> GetByAddress(string address)
        {
            try
            {
                var sql = @"
            SELECT lrr.*, lrs.name as statusName
            FROM legal_record_registry lrr
                    JOIN legal_record_object lro ON lrr.id = lro.id_record
                    JOIN legal_registry_status lrs ON lrs.id = lrr.id_status
                    JOIN legal_object lo ON lro.id_object = lo.id
                    WHERE lo.address = @address";

                // Выполнение запроса с параметром address
                var models = await _dbConnection.QueryAsync<legal_record_registry>(sql, new { address }, transaction: _dbTransaction);

                return models.ToList();
            }
            catch (Exception ex)
            {
                // Исключение в случае ошибки выполнения запроса
                throw new RepositoryException("Failed to get legal_record_registry by address", ex);
            }
        }

        //public Task<List<legal_record_registry>> GetByFilter(LegalFilter filter)
        //{
        //    throw new NotImplementedException();
        //}

        public async Task<List<legal_record_registry>> GetByFilter(LegalFilter filter)
        {
            try
            {
                var sql = @"
            SELECT lar.*, las.name as statusName
            FROM legal_record_registry lar
            LEFT JOIN legal_registry_status las ON las.id = lar.id_status
            WHERE 
                CAST(lar.subject AS TEXT) ILIKE @pattern OR
                CAST(lar.defendant AS TEXT) ILIKE @pattern OR
                CAST(lar.complainant AS TEXT) ILIKE @pattern OR
                CAST(lar.decision AS TEXT) ILIKE @pattern OR
                CAST(lar.addition AS TEXT) ILIKE @pattern
        ";

                var pattern = "%" + filter.commonFilter + "%";
                var models = await _dbConnection.QueryAsync<legal_record_registry>(sql, new { pattern }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to filter legal_record_registry", ex);
            }
        }
    }
}
