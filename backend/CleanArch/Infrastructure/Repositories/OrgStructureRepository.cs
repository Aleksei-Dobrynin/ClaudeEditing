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
    public class OrgStructureRepository : IOrgStructureRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public OrgStructureRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<OrgStructure>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM org_structure";
                var models = await _dbConnection.QueryAsync<OrgStructure>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get OrgStructure", ex);
            }
        }
        public async Task<List<OrgStructure>> GetByUserId(string userId)
        {
            try
            {
                var sql = @"
select org.* from org_structure org
    left join employee_in_structure eis on eis.structure_id = org.id
    left join employee emp on emp.id = eis.employee_id
    where emp.user_id = @userId
	and eis.date_start < now() and (eis.date_end is null or eis.date_end > now())
    group by org.id
";
                var models = await _dbConnection.QueryAsync<OrgStructure>(sql, new { userId }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get OrgStructure", ex);
            }
        }

        public async Task<int> Add(OrgStructure domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new OrgStructureModel
                {
                    id = domain.id,
                    parent_id = domain.parent_id,
                    unique_id = domain.unique_id,
                    name = domain.name,
                    version = domain.version,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    remote_id = domain.remote_id,
                    short_name = domain.short_name
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO org_structure(parent_id, unique_id, name, version, date_start, date_end, remote_id, created_at, updated_at, created_by, updated_by, short_name) " +
                    "VALUES (@parent_id, @unique_id, @name, @version, @date_start, @date_end, @remote_id, @created_at, @updated_at, @created_by, @updated_by, @short_name) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add OrgStructure", ex);
            }
        }

        public async Task Update(OrgStructure domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new OrgStructureModel
                {
                    id = domain.id,
                    parent_id = domain.parent_id,
                    unique_id = domain.unique_id,
                    name = domain.name,
                    version = domain.version,
                    date_start = domain.date_start,
                    date_end = domain.date_end,
                    remote_id = domain.remote_id,
                    short_name = domain.short_name
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE org_structure SET parent_id = @parent_id, unique_id = @unique_id, name = @name, version = @version, date_start = @date_start, date_end = @date_end, remote_id = @remote_id, created_at = @created_at, " +
                    "updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by, short_name = @short_name WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update OrgStructure", ex);
            }
        }

        public async Task<PaginatedList<OrgStructure>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM org_structure OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<OrgStructure>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM org_structure";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<OrgStructure>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get OrgStructures", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = "DELETE FROM org_structure WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update OrgStructure", ex);
            }
        }
        public async Task<OrgStructure> GetOne(int id)
        {
            try
            {
                var sql = "SELECT * FROM org_structure WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<OrgStructure>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get OrgStructure", ex);
            }
        }
    }
}
