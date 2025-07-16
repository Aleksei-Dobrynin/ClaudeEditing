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
    public class reestrRepository : IreestrRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public reestrRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<reestr>> GetAll()
        {
            try
            {
                var sql = $"""SELECT reestr.*, st.name status_name, st.code status_code FROM reestr left join reestr_status st on st.id = reestr.status_id order by reestr.id desc""";
                var models = await _dbConnection.QueryAsync<reestr>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get reestr", ex);
            }
        }
        public async Task<List<reestr>> GetAllMy(int userId)
        {
            try
            {
                var sql = $"""
SELECT reestr.*, st.name status_name, st.code status_code FROM reestr left join reestr_status st on st.id = reestr.status_id 
where reestr.created_by = @userId
order by reestr.id desc
""";
                var models = await _dbConnection.QueryAsync<reestr>(sql, new { userId }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get reestr", ex);
            }
        }

        public async Task<int> Add(reestr domain)
        {
            try
            {
                var model = new reestrModel
                {
                    
                    id = domain.id,
                    name = domain.name,
                    month = domain.month,
                    year = domain.year,
                    status_id = domain.status_id,
                    created_at = domain.created_at,
                    created_by = domain.created_by,
                };
                var sql = @"INSERT INTO ""reestr""(""name"", ""month"", ""year"", ""status_id"", ""created_at"",  ""created_by"") 
                VALUES (@name, @month, @year, @status_id, @created_at, @created_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add reestr", ex);
            }
        }

        public async Task Update(reestr domain)
        {
            try
            {
                var model = new reestrModel
                {
                    
                    id = domain.id,
                    name = domain.name,
                    month = domain.month,
                    year = domain.year,
                    status_id = domain.status_id,
                    updated_at = domain.updated_at,
                    updated_by = domain.updated_by,
                };
                var sql = @"UPDATE ""reestr"" SET ""id"" = @id, ""name"" = @name, ""month"" = @month, ""year"" = @year, ""status_id"" = @status_id, ""updated_at"" = @updated_at, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update reestr", ex);
            }
        }

        public async Task<PaginatedList<reestr>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""reestr"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<reestr>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""reestr""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<reestr>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get reestrs", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""reestr"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update reestr", ex);
            }
        }
        public async Task<reestr> GetOne(int id)
        {
            try
            {
                var sql = $"""SELECT reestr.*, st.name status_name, st.code status_code FROM reestr left join reestr_status st on st.id = reestr.status_id  WHERE reestr.id = @id order by reestr.created_at desc LIMIT 1 """;
                var models = await _dbConnection.QueryAsync<reestr>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get reestr", ex);
            }
        }

        
        public async Task<List<reestr>> GetBystatus_id(int status_id)
        {
            try
            {
                var sql = "SELECT * FROM \"reestr\" WHERE \"status_id\" = @status_id";
                var models = await _dbConnection.QueryAsync<reestr>(sql, new { status_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get reestr", ex);
            }
        }
        
    }
}
