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
    public class ArchObjectRepository : IArchObjectRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ArchObjectRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ArchObject>> GetAll()
        {
            try
            {
                var sql = "SELECT arch_object.id, address, arch_object.name, identifier, district_id, dis.name as district_name, arch_object.description, xcoordinate, ycoordinate FROM arch_object LEFT JOIN district dis on arch_object.district_id = dis.id";

                var models = await _dbConnection.QueryAsync<ArchObject>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchObject", ex);
            }
        }
        
        public async Task<List<ArchObject>> GetBySearch(string text)
        {
            try
            {
                var sql = @$"SELECT id, address, name, identifier, district_id, description, xcoordinate, ycoordinate FROM arch_object";
                if(text != null)
                {
                    sql += @$" where LOWER(name) like LOWER('%{text}%') or LOWER(address) like LOWER('%{text}%') or LOWER(description) like LOWER('%{text}%')";
                }

                sql += $@" limit 50;";
                var models = await _dbConnection.QueryAsync<ArchObject>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchObject", ex);
            }
        }
        public async Task<List<ArchObject>> GetByAppIdApplication(int application_id)
        {
            try
            {
                var sql = @$"
SELECT obj.*, dis.name district_name, COALESCE(array_agg(tag.id) FILTER (WHERE tag.id IS NOT NULL), '{{}}') tags, string_agg(tag.name, ', ') tag_names FROM application_object ao
LEFT JOIN arch_object obj on obj.id = ao.arch_object_id
LEFT JOIN district dis on obj.district_id = dis.id
LEFT JOIN arch_object_tag aot on aot.id_object = obj.id
LEFT JOIN tag on tag.id = aot.id_tag
WHERE ao.application_id = @application_id
GROUP BY obj.id, dis.name
";

                var models = await _dbConnection.QueryAsync<ArchObject>(sql, new { application_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchObject", ex);
            }
        }

        public async Task<ArchObject> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT arch_object.id, address, arch_object.name, identifier, district_id, arch_object.description, xcoordinate, ycoordinate, 
                                    dis.name as district_name FROM arch_object 
                            LEFT JOIN district dis on arch_object.district_id = dis.id
                            WHERE arch_object.id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ArchObject>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ArchObject with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchObject", ex);
            }
        }

        public async Task<int> Add(ArchObject domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchObject
                {
                    address = domain.address,
                    name = domain.name,
                    identifier = domain.identifier,
                    district_id = domain.district_id,
                    description = domain.description,
                    xcoordinate = domain.xcoordinate,
                    ycoordinate = domain.ycoordinate,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO arch_object(address, name, identifier, district_id, created_at, description, xcoordinate, ycoordinate, updated_at, created_by, updated_by) 
                                VALUES (@address, @name, @identifier, @district_id, @created_at, @description, @xcoordinate, @ycoordinate, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ArchObject", ex);
            }
        }

        public async Task Update(ArchObject domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchObject
                {
                    id = domain.id,
                    address = domain.address,
                    name = domain.name,
                    identifier = domain.identifier,
                    district_id = domain.district_id,
                    updated_at = DateTime.Now,
                    description = domain.description,
                    xcoordinate = domain.xcoordinate,
                    ycoordinate = domain.ycoordinate,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE arch_object SET address = @address, name = @name, identifier = @identifier, 
                                district_id = @district_id, updated_at = @updated_at, description = @description, xcoordinate = @xcoordinate, ycoordinate = @ycoordinate, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ArchObject", ex);
            }
        }

        public async Task<PaginatedList<ArchObject>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM arch_object OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ArchObject>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM arch_object";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ArchObject>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchObject", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM arch_object WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ArchObject not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ArchObject", ex);
            }
        }
        
        public async Task<int> GetLastNumber()
        {
            try
            {
                const string sql = @"
            SELECT COALESCE(MAX(id), 0)
            FROM arch_object";

                var lastNumber = await _dbConnection.ExecuteScalarAsync<int>(sql, transaction: _dbTransaction);
                return lastNumber;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get last number", ex);
            }
        }
    }
}
