using Application.Exceptions;
using Application.Models;
using Application.Repositories;
using Dapper;
using Domain.Entities;
using Infrastructure.Data.Models;
using Infrastructure.FillLogData;
using System;
using System.Data;

namespace Infrastructure.Repositories
{
    public class structure_tagRepository : Istructure_tagRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;


        public structure_tagRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<structure_tag>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""structure_tag""";
                var models = await _dbConnection.QueryAsync<structure_tag>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_tag", ex);
            }
        }

        public async Task<int> Add(structure_tag domain)
        {
            try
            {
                var model = new structure_tagModel
                {
                    
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    structure_id = domain.structure_id,
                };
                var sql = @"INSERT INTO ""structure_tag""(""name"", ""description"", ""code"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"", ""structure_id"") 
                VALUES (@name, @description, @code, @created_at, @updated_at, @created_by, @updated_by, @structure_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add structure_tag", ex);
            }
        }

        public async Task Update(structure_tag domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new structure_tagModel
                {

                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    structure_id = domain.structure_id,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE ""structure_tag"" SET ""id"" = @id, ""name"" = @name, ""description"" = @description, ""code"" = @code, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""structure_id"" = @structure_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update structure_tag", ex);
            }
        }

        public async Task<PaginatedList<structure_tag>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""structure_tag"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<structure_tag>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""structure_tag""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<structure_tag>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_tags", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""structure_tag"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update structure_tag", ex);
            }
        }
        public async Task<structure_tag> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""structure_tag"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<structure_tag>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_tag", ex);
            }
        }

        
        public async Task<List<structure_tag>> GetBystructure_id(int structure_id)
        {
            try
            {
                var sql = "SELECT * FROM \"structure_tag\" WHERE \"structure_id\" = @structure_id";
                var models = await _dbConnection.QueryAsync<structure_tag>(sql, new { structure_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get structure_tag", ex);
            }
        }
        
    }
}
