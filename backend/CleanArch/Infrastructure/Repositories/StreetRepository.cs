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
    public class StreetRepository : IStreetRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public StreetRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<Street>> GetAll()
        {
            try
            {
                var sql = @"
            SELECT 
                s.*,
                au.name as address_unit_name,
                st.name as type_name 
            FROM street s
            LEFT JOIN address_unit au ON au.id = s.address_unit_id
            LEFT JOIN street_type st ON st.id = s.street_type_id
            ORDER BY s.id";

                var models = await _dbConnection.QueryAsync<Street>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Street", ex);
            }
        }

        public async Task<List<Street>> Search(string text, int ateId)
        {
            try
            {
                var sql = @"
WITH RECURSIVE address_hierarchy AS (
    -- Базовый случай: начальная address_unit
    SELECT id, parent_id, name
    FROM address_unit
    WHERE id = @ateId
    
    UNION ALL
    
    -- Рекурсивная часть: все дочерние элементы
    SELECT au.id, au.parent_id, au.name
    FROM address_unit au
    INNER JOIN address_hierarchy ah ON au.parent_id = ah.id
)
SELECT s.*, au.name as address_unit_name 
FROM street s
INNER JOIN address_hierarchy ah ON s.address_unit_id = ah.id
LEFT JOIN address_unit au ON au.id = s.address_unit_id
WHERE s.name ILIKE '%' || @text || '%'
ORDER BY s.id
limit 50;
";
                var models = await _dbConnection.QueryAsync<Street>(sql, new { ateId = ateId, text }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Street", ex);
            }
        }

        public async Task<List<Street>> GetAteStreets(int ateId)
        {
            try
            {
                var sql = @"
SELECT s.*, au.name as address_unit_name FROM street s
LEFT JOIN address_unit au on au.id = s.address_unit_id
where address_unit_id = @ateId
";
                var models = await _dbConnection.QueryAsync<Street>(sql, new { ateId = ateId }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Street", ex);
            }
        }

        public async Task<Street> GetOneByID(int id)
        {
            try
            {
                var sql = @"
SELECT s.*, au.name as address_unit_name FROM street s
LEFT JOIN address_unit au on au.id = s.address_unit_id
WHERE s.id = @Id LIMIT 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Street>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Street with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Street", ex);
            }
        }

        public async Task<int> Add(Street domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Street
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
                    expired = domain.expired,
                    street_type_id = domain.street_type_id,
                    address_unit_id = domain.address_unit_id,
                    remote_id = domain.remote_id,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO street(name,description,code,created_at,updated_at,created_by,updated_by,name_kg,description_kg,expired,street_type_id,address_unit_id,remote_id) 
                           VALUES (@name,@description,@code,@created_at,@updated_at,@created_by,@updated_by,@name_kg,@description_kg,@expired,@street_type_id,@address_unit_id,@remote_id) 
                           RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add Street", ex);
            }
        }

        public async Task Update(Street domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Street
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
                    expired = domain.expired,
                    street_type_id = domain.street_type_id,
                    address_unit_id = domain.address_unit_id,
                    remote_id = domain.remote_id,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE street SET name = @name,description = @description,code = @code,created_at = @created_at,updated_at = @updated_at,created_by = @created_by,updated_by = @updated_by,name_kg = @name_kg,description_kg = @description_kg,expired = @expired,street_type_id = @street_type_id,address_unit_id = @address_unit_id,remote_id = @remote_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Street", ex);
            }
        }

        public async Task<PaginatedList<Street>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM street OFFSET @pageSize * (@pageNumber - 1) LIMIT @pageSize";
                var models = await _dbConnection.QueryAsync<Street>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM street";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<Street>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Street", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM street WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("Street not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete Street", ex);
            }
        }
    }
}