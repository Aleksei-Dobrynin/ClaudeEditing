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
    public class AddressUnitTypeRepository : IAddressUnitTypeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public AddressUnitTypeRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<AddressUnitType>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM address_unit_type";
                var models = await _dbConnection.QueryAsync<AddressUnitType>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get AddressUnitType", ex);
            }
        }

        public async Task<AddressUnitType> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT * FROM address_unit_type WHERE id = @Id LIMIT 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<AddressUnitType>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"AddressUnitType with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get AddressUnitType", ex);
            }
        }

        public async Task<int> Add(AddressUnitType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new AddressUnitType
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
                    name_short = domain.name_short,
                    name_kg_short = domain.name_kg_short,
                    level = domain.level,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO address_unit_type(name,description,code,created_at,updated_at,created_by,updated_by,name_kg,description_kg,name_short,name_kg_short,level) 
                           VALUES (@name,@description,@code,@created_at,@updated_at,@created_by,@updated_by,@name_kg,@description_kg,@name_short,@name_kg_short,@level) 
                           RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add AddressUnitType", ex);
            }
        }

        public async Task Update(AddressUnitType domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new AddressUnitType
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
                    name_short = domain.name_short,
                    name_kg_short = domain.name_kg_short,
                    level = domain.level,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE address_unit_type SETname = @name,description = @description,code = @code,created_at = @created_at,updated_at = @updated_at,created_by = @created_by,updated_by = @updated_by,name_kg = @name_kg,description_kg = @description_kg,name_short = @name_short,name_kg_short = @name_kg_short,level = @level WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update AddressUnitType", ex);
            }
        }

        public async Task<PaginatedList<AddressUnitType>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM address_unit_type OFFSET @pageSize * (@pageNumber - 1) LIMIT @pageSize";
                var models = await _dbConnection.QueryAsync<AddressUnitType>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM address_unit_type";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<AddressUnitType>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get AddressUnitType", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM address_unit_type WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("AddressUnitType not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete AddressUnitType", ex);
            }
        }
    }
}