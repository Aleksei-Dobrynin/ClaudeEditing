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
    public class legal_act_registryRepository : Ilegal_act_registryRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public legal_act_registryRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<legal_act_registry>> GetAll()
        {
            try
            {
                var sql = @"SELECT lar.*, las.name as statusName
                FROM legal_act_registry lar
                LEFT JOIN 
                legal_act_registry_status las ON las.id = lar.id_status
                order by lar.id desc";
                var models = await _dbConnection.QueryAsync<legal_act_registry>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_registry", ex);
            }
        }

        public async Task<int> Add(legal_act_registry domain)
        {
            try
            {
                var model = new legal_act_registryModel
                {
                    
                    id = domain.id,
                    is_active = domain.is_active,
                    act_type = domain.act_type,
                    date_issue = domain.date_issue,
                    id_status = domain.id_status,
                    subject = domain.subject,
                    act_number = domain.act_number,
                    decision = domain.decision,
                    addition = domain.addition,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"INSERT INTO ""legal_act_registry""(""is_active"", ""act_type"", ""date_issue"", ""id_status"", ""subject"", ""act_number"", ""decision"", ""addition"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@is_active, @act_type, @date_issue, @id_status, @subject, @act_number, @decision, @addition, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add legal_act_registry", ex);
            }
        }

        public async Task Update(legal_act_registry domain)
        {
            try
            {
                var model = new legal_act_registryModel
                {
                    
                    id = domain.id,
                    is_active = domain.is_active,
                    act_type = domain.act_type,
                    date_issue = domain.date_issue,
                    id_status = domain.id_status,
                    subject = domain.subject,
                    act_number = domain.act_number,
                    decision = domain.decision,
                    addition = domain.addition,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"UPDATE ""legal_act_registry"" SET ""id"" = @id, ""is_active"" = @is_active, ""act_type"" = @act_type, ""date_issue"" = @date_issue, ""id_status"" = @id_status, ""subject"" = @subject, ""act_number"" = @act_number, ""decision"" = @decision, ""addition"" = @addition, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_act_registry", ex);
            }
        }

        public async Task<PaginatedList<legal_act_registry>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_act_registry"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<legal_act_registry>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""legal_act_registry""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<legal_act_registry>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_registrys", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                //var sql = @"DELETE FROM ""legal_act_registry"" WHERE id = @id"; // TODO full delete
                var sql = @"UPDATE ""legal_act_registry"" SET ""is_active"" = FALSE WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_act_registry", ex);
            }
        }
        public async Task<legal_act_registry> GetOne(int id)
        {
            try
            {
                var sql = @"
    SELECT lar.*, 
        las.name AS statusName,
        COALESCE(ARRAY_AGG(DISTINCT lag.id_object) FILTER (WHERE lag.id_object IS NOT NULL), '{}') AS legal_objects,
        COALESCE(ARRAY_AGG(DISTINCT lae.id_structure_employee) FILTER (WHERE lae.id_structure_employee IS NOT NULL), '{}') AS assignees
    FROM legal_act_registry lar
    LEFT JOIN legal_act_registry_status las ON las.id = lar.id_status
    LEFT JOIN legal_act_object lag ON lag.id_act = lar.id
    LEFT JOIN legal_act_employee lae ON lar.id = lae.id_act
    WHERE lar.id = @id 
    GROUP BY lar.id, las.name
    LIMIT 1";

                var result = await _dbConnection.QueryAsync(sql, new { id }, transaction: _dbTransaction);


                var models = result.Select(row => new legal_act_registry
                {
                    id = row.id,
                    act_number = row.act_number,
                    act_type = row.act_type,
                    addition = row.addition,
                    date_issue = row.date_issue,
                    decision = row.decision,
                    id_status = row.id_status,
                    is_active = row.is_active,
                    statusName = row.status_name,
                    subject = row.subject,
                    created_at = row.created_at,
                    created_by = row.created_by,
                    updated_at = row.updated_at,
                    updated_by = row.updated_by,
                    legalObjects = row.legal_objects != null ? ((int[])row.legal_objects).ToList() : new List<int>(),
                    assignees = row.assignees != null ? ((int[])row.assignees).ToList() : new List<int>(),

                }).ToList();


                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_registry", ex);
            }
        }

        
        public async Task<List<legal_act_registry>> GetByid_status(int id_status)
        {
            try
            {
                var sql = "SELECT lar.*, las.name  as statusName " +
                    "FROM legal_act_registry lar " +
                    "LEFT JOIN " +
                    "legal_act_registry_status las ON las.id = lar.id_status " +
                    "WHERE lar.id_status = @id_status";
                var models = await _dbConnection.QueryAsync<legal_act_registry>(sql, new { id_status }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_registry", ex);
            }
        }


        public async Task<List<legal_act_registry>> GetByAddress(string address)
        {
            try
            {
                var sql = @"
            SELECT lar.*, las.name as statusName
            FROM legal_act_registry lar
                    JOIN legal_act_object lao ON lar.id = lao.id_act
                    JOIN legal_act_registry_status las ON las.id = lar.id_status
                    JOIN legal_object lo ON lao.id_object = lo.id
                    WHERE lo.address = @address";

                // ���������� ������� � ���������� address
                var models = await _dbConnection.QueryAsync<legal_act_registry>(sql, new { address }, transaction: _dbTransaction);

                return models.ToList();
            }
            catch (Exception ex)
            {
                // ���������� � ������ ������ ���������� �������
                throw new RepositoryException("Failed to get legal_record_registry by address", ex);
            }
        }

        public async Task<List<legal_act_registry>> GetByFilter(LegalFilter filter)
        {
            try
            {
                var sql = @"
            SELECT lar.*, las.name as statusName
            FROM legal_act_registry lar
            LEFT JOIN legal_act_registry_status las ON las.id = lar.id_status
            WHERE 
                CAST(lar.act_type AS TEXT) ILIKE @pattern OR
                CAST(lar.subject AS TEXT) ILIKE @pattern OR
                CAST(lar.act_number AS TEXT) ILIKE @pattern OR
                CAST(lar.decision AS TEXT) ILIKE @pattern OR
                CAST(lar.addition AS TEXT) ILIKE @pattern
        ";

                var pattern = "%" + filter.commonFilter + "%";
                var models = await _dbConnection.QueryAsync<legal_act_registry>(sql, new { pattern }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to filter legal_act_registry", ex);
            }
        }
    }
}
