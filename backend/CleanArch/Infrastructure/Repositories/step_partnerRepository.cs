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
    public class step_partnerRepository : Istep_partnerRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public step_partnerRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<step_partner>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""step_partner""";
                var models = await _dbConnection.QueryAsync<step_partner>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_partner", ex);
            }
        }

        public async Task<int> Add(step_partner domain)
        {
            try
            {
                var model = new step_partnerModel
                {
                    
                    id = domain.id,
                    step_id = domain.step_id,
                    partner_id = domain.partner_id,
                    role = domain.role,
                    is_required = domain.is_required,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"INSERT INTO ""step_partner""(""step_id"", ""partner_id"", ""role"", ""is_required"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@step_id, @partner_id, @role, @is_required, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add step_partner", ex);
            }
        }

        public async Task Update(step_partner domain)
        {
            try
            {
                var model = new step_partnerModel
                {
                    
                    id = domain.id,
                    step_id = domain.step_id,
                    partner_id = domain.partner_id,
                    role = domain.role,
                    is_required = domain.is_required,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"UPDATE ""step_partner"" SET ""id"" = @id, ""step_id"" = @step_id, ""partner_id"" = @partner_id, ""role"" = @role, ""is_required"" = @is_required, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update step_partner", ex);
            }
        }

        public async Task<PaginatedList<step_partner>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""step_partner"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<step_partner>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""step_partner""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<step_partner>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_partners", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""step_partner"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update step_partner", ex);
            }
        }
        public async Task<step_partner> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""step_partner"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<step_partner>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_partner", ex);
            }
        }

        
        public async Task<List<step_partner>> GetBystep_id(int step_id)
        {
            try
            {
                var sql = "SELECT * FROM \"step_partner\" WHERE \"step_id\" = @step_id";
                var models = await _dbConnection.QueryAsync<step_partner>(sql, new { step_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_partner", ex);
            }
        }
        
        public async Task<List<step_partner>> GetBypartner_id(int partner_id)
        {
            try
            {
                var sql = "SELECT * FROM \"step_partner\" WHERE \"partner_id\" = @partner_id";
                var models = await _dbConnection.QueryAsync<step_partner>(sql, new { partner_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get step_partner", ex);
            }
        }
        
    }
}
