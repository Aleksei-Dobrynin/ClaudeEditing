using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class structure_tag_applicationRepository : Istructure_tag_applicationRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public structure_tag_applicationRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<structure_tag_application>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""structure_tag_application""";
                var models = await _dbConnection.QueryAsync<structure_tag_application>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_tag_application", ex);
            }
        }

        public async Task<int> Add(structure_tag_application domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new structure_tag_applicationModel
                {
                    
                    id = domain.id,
                    structure_tag_id = domain.structure_tag_id,
                    application_id = domain.application_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    structure_id = domain.structure_id,
                };
                var sql = @"INSERT INTO ""structure_tag_application""(""structure_tag_id"", ""application_id"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"", ""structure_id"") 
                VALUES (@structure_tag_id, @application_id, @created_at, @updated_at, @created_by, @updated_by, @structure_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add structure_tag_application", ex);
            }
        }

        public async Task Update(structure_tag_application domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new structure_tag_applicationModel
                {
                    
                    id = domain.id,
                    structure_tag_id = domain.structure_tag_id,
                    application_id = domain.application_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    structure_id = domain.structure_id,
                };
                var sql = @"UPDATE ""structure_tag_application"" SET ""id"" = @id, ""structure_tag_id"" = @structure_tag_id, ""application_id"" = @application_id, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""structure_id"" = @structure_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update structure_tag_application", ex);
            }
        }

        public async Task<PaginatedList<structure_tag_application>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""structure_tag_application"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<structure_tag_application>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""structure_tag_application""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<structure_tag_application>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_tag_applications", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new { id = id };
                var sql = @"DELETE FROM ""structure_tag_application"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update structure_tag_application", ex);
            }
        }
        public async Task<structure_tag_application> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""structure_tag_application"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<structure_tag_application>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_tag_application", ex);
            }
        }

        public async Task<structure_tag_application> GetForApplication(int structure_id, int application_id)
        {
            try
            {
                var sql = $@"
SELECT sta.*, tag.name structure_tag_name, tag.code structure_tag_code FROM structure_tag_application sta 
left join structure_tag tag on tag.id = sta.structure_tag_id
WHERE sta.structure_id = @structure_id and sta.application_id = @application_id
";
                var models = await _dbConnection.QueryAsync<structure_tag_application>(sql, new { structure_id, application_id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_tag_application", ex);
            }
        }

        
        public async Task<List<structure_tag_application>> GetBystructure_tag_id(int structure_tag_id)
        {
            try
            {
                var sql = "SELECT * FROM \"structure_tag_application\" WHERE \"structure_tag_id\" = @structure_tag_id";
                var models = await _dbConnection.QueryAsync<structure_tag_application>(sql, new { structure_tag_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_tag_application", ex);
            }
        }
        
        public async Task<List<structure_tag_application>> GetBystructure_id(int structure_id)
        {
            try
            {
                var sql = "SELECT * FROM \"structure_tag_application\" WHERE \"structure_id\" = @structure_id";
                var models = await _dbConnection.QueryAsync<structure_tag_application>(sql, new { structure_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_tag_application", ex);
            }
        }
        public async Task<List<structure_tag_application>> GetByapplication_id(int application_id)
        {
            try
            {
                var sql = "SELECT * FROM \"structure_tag_application\" WHERE \"application_id\" = @application_id";
                var models = await _dbConnection.QueryAsync<structure_tag_application>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_tag_application", ex);
            }
        }
        
    }
}
