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
    public class releaseRepository : IreleaseRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public releaseRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<release>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""release"" order by date_start desc";
                var models = await _dbConnection.QueryAsync<release>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release", ex);
            }
        }
        public async Task<List<release>> GetReleaseds()
        {
            try
            {
                var sql = """
SELECT release.* FROM release
where release.date_start is not null and release.date_start < @now
order by release.date_start desc
""";
                var models = await _dbConnection.QueryAsync<release>(sql, new { now = DateTime.Now }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release", ex);
            }
        }
        public async Task<release> GetLastRelease()
        {
            try
            {
                var sql = """
SELECT release.* FROM release
where release.date_start is not null and release.date_start < @now
order by release.date_start desc
limit 1
""";
                var models = await _dbConnection.QueryAsync<release>(sql, new { now = DateTime.Now }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release", ex);
            }
        }

        public async Task<int> Add(release domain)
        {
            try
            {
                var model = new releaseModel
                {
                    
                    id = domain.id,
                    number = domain.number,
                    description = domain.description,
                    description_kg = domain.description_kg,
                    code = domain.code,
                    date_start = domain.date_start,
                    created_at = domain.created_at,
                    created_by = domain.created_by,
                };
                var sql = @"INSERT INTO ""release""(""number"", ""description"", ""description_kg"", ""code"", ""date_start"", ""created_at"", ""created_by"") 
                VALUES (@number, @description, @description_kg, @code, @date_start, @created_at, @created_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add release", ex);
            }
        }

        public async Task Update(release domain)
        {
            try
            {
                var model = new releaseModel
                {
                    
                    id = domain.id,
                    number = domain.number,
                    description = domain.description,
                    description_kg = domain.description_kg,
                    code = domain.code,
                    date_start = domain.date_start,
                    updated_by = domain.updated_by,
                    updated_at = domain.updated_at,
                };
                var sql = @"UPDATE ""release"" SET ""id"" = @id, ""updated_by"" = @updated_by, ""number"" = @number, ""description"" = @description, ""description_kg"" = @description_kg, ""code"" = @code, ""date_start"" = @date_start, ""updated_at"" = @updated_at WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update release", ex);
            }
        }

        public async Task<PaginatedList<release>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""release"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<release>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""release""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<release>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get releases", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""release"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update release", ex);
            }
        }
        public async Task<release> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""release"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<release>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get release", ex);
            }
        }

        
    }
}
