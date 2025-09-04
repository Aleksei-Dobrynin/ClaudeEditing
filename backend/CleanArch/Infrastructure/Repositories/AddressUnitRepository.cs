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
    public class AddressUnitRepository : IAddressUnitRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public AddressUnitRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<AddressUnit>> GetAll()
        {
            try
            {
                var sql = @"
            SELECT 
                au.*,
                aut.name as type_name,
                parent.name as parent_name
            FROM address_unit au
            LEFT JOIN address_unit_type aut ON au.type_id = aut.id
            LEFT JOIN address_unit parent ON au.parent_id = parent.id
            ORDER BY au.id";

                var models = await _dbConnection.QueryAsync<AddressUnit>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get AddressUnit", ex);
            }
        }
        
        public async Task<List<AddressUnit>> GetAteChildren(int parent_id)
        {
            try
            {
                var sql = "SELECT * FROM address_unit WHERE parent_id = @ParentId";
                var models = await _dbConnection.QueryAsync<AddressUnit>(sql, new { ParentId = parent_id }, transaction: _dbTransaction);

                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get AddressUnit", ex);
            }
        }

        public async Task<AddressUnit> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT * FROM address_unit WHERE id = @Id LIMIT 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<AddressUnit>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"AddressUnit with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get AddressUnit", ex);
            }
        }

        public async Task<int> Add(AddressUnit domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new AddressUnit
                {
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    name_kg = domain.name_kg,
                    description_kg = domain.description_kg,
                    type_id = domain.type_id,
                    expired = domain.expired,
                    remote_id = domain.remote_id,
                    parent_id = domain.parent_id
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO address_unit(name,description,code,created_at,updated_at,created_by,updated_by,name_kg,description_kg,type_id,expired,remote_id,parent_id) 
                           VALUES (@name,@description,@code,@created_at,@updated_at,@created_by,@updated_by,@name_kg,@description_kg,@type_id,@expired,@remote_id,@parent_id) 
                           RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add AddressUnit", ex);
            }
        }

        public async Task Update(AddressUnit domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new AddressUnit
                {
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    code = domain.code,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    name_kg = domain.name_kg,
                    description_kg = domain.description_kg,
                    type_id = domain.type_id,
                    expired = domain.expired,
                    remote_id = domain.remote_id,
                    parent_id = domain.parent_id
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE address_unit SET name = @name,description = @description,code = @code,created_at = @created_at,updated_at = @updated_at,created_by = @created_by,updated_by = @updated_by,name_kg = @name_kg,description_kg = @description_kg,type_id = @type_id,expired = @expired,remote_id = @remote_id,parent_id = @parent_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update AddressUnit", ex);
            }
        }

        public async Task<PaginatedList<AddressUnit>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM address_unit OFFSET @pageSize * (@pageNumber - 1) LIMIT @pageSize";
                var models = await _dbConnection.QueryAsync<AddressUnit>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM address_unit";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<AddressUnit>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get AddressUnit", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM address_unit WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("AddressUnit not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete AddressUnit", ex);
            }
        }
    }
}