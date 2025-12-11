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
    public class path_stepRepository : Ipath_stepRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public path_stepRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<path_step>> GetAll()
        {
            try
            {
                var sql = @"SELECT ps.*, os.name as structure_name 
                           FROM ""path_step"" ps
                           LEFT JOIN ""org_structure"" os ON ps.responsible_org_id = os.id";
                var models = await _dbConnection.QueryAsync<path_step>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get path_step", ex);
            }
        }

        public async Task<int> Add(path_step domain)
        {
            try
            {
                var model = new path_stepModel
                {

                    id = domain.id,
                    step_type = domain.step_type,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    path_id = domain.path_id,
                    responsible_org_id = domain.responsible_org_id,
                    name = domain.name,
                    description = domain.description,
                    order_number = domain.order_number,
                    is_required = domain.is_required,
                    estimated_days = domain.estimated_days,
                    wait_for_previous_steps = domain.wait_for_previous_steps,
                };
                var sql = @"INSERT INTO ""path_step""(""step_type"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"", ""path_id"", ""responsible_org_id"", ""name"", ""description"", ""order_number"", ""is_required"", ""estimated_days"", ""wait_for_previous_steps"") 
                VALUES (@step_type, @created_at, @updated_at, @created_by, @updated_by, @path_id, @responsible_org_id, @name, @description, @order_number, @is_required, @estimated_days, @wait_for_previous_steps) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add path_step", ex);
            }
        }

        public async Task Update(path_step domain)
        {
            try
            {
                var model = new path_stepModel
                {

                    id = domain.id,
                    step_type = domain.step_type,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    path_id = domain.path_id,
                    responsible_org_id = domain.responsible_org_id,
                    name = domain.name,
                    description = domain.description,
                    order_number = domain.order_number,
                    is_required = domain.is_required,
                    estimated_days = domain.estimated_days,
                    wait_for_previous_steps = domain.wait_for_previous_steps,
                };
                var sql = @"UPDATE ""path_step"" SET ""id"" = @id, ""step_type"" = @step_type, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""path_id"" = @path_id, ""responsible_org_id"" = @responsible_org_id, ""name"" = @name, ""description"" = @description, ""order_number"" = @order_number, ""is_required"" = @is_required, ""estimated_days"" = @estimated_days, ""wait_for_previous_steps"" = @wait_for_previous_steps WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update path_step", ex);
            }
        }

        public async Task<PaginatedList<path_step>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT ps.*, os.name as structure_name 
                           FROM ""path_step"" ps
                           LEFT JOIN ""org_structure"" os ON ps.responsible_org_id = os.id
                           OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<path_step>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""path_step""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<path_step>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get path_steps", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""path_step"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update path_step", ex);
            }
        }
        public async Task<path_step> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT ps.*, os.name as structure_name 
                           FROM ""path_step"" ps
                           LEFT JOIN ""org_structure"" os ON ps.responsible_org_id = os.id
                           WHERE ps.id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<path_step>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get path_step", ex);
            }
        }


        public async Task<List<path_step>> GetBypath_id(int path_id)
        {
            try
            {
                var sql = @"SELECT ps.*, os.name as structure_name 
                           FROM ""path_step"" ps
                           LEFT JOIN ""org_structure"" os ON ps.responsible_org_id = os.id
                           WHERE ps.path_id = @path_id";
                var models = await _dbConnection.QueryAsync<path_step>(sql, new { path_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get path_step", ex);
            }
        }

        public async Task<List<path_step>> GetByServicePathId(int servicePathId)
        {
            try
            {
                var sql = @"
            SELECT ps.*, os.name as structure_name 
            FROM ""path_step"" ps
            LEFT JOIN ""org_structure"" os ON ps.responsible_org_id = os.id
            WHERE ps.path_id = @servicePathId
            ORDER BY ps.order_number";

                var result = await _dbConnection.QueryAsync<path_step>(
                    sql,
                    new { servicePathId },
                    transaction: _dbTransaction
                );

                return result.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get path steps by service path", ex);
            }
        }

    }
}