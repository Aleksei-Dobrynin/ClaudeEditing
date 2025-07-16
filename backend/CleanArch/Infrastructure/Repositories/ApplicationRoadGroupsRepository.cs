using System.Data;
using Dapper;
using Domain.Entities;
using Application.Exceptions;

namespace Application.Repositories
{
    public class ApplicationRoadGroupsRepository : IApplicationRoadGroupsRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public ApplicationRoadGroupsRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationRoadGroups>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, roles FROM application_road_groups";
                var models = await _dbConnection.QueryAsync<ApplicationRoadGroups>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationRoadGroups", ex);
            }
        }

        public async Task<ApplicationRoadGroups> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, name, roles FROM application_road_groups WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationRoadGroups>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationRoadGroups with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationRoadGroups", ex);
            }
        }

        public async Task<int> Add(ApplicationRoadGroups domain)
        {
            try
            {
                var model = new ApplicationRoadGroups
                {
                    name = domain.name,
                    roles = domain.roles,
                };
                var sql = "INSERT INTO application_road_groups(name, roles) VALUES (@name, @roles::jsonb) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationRoadGroups", ex);
            }
        }

        public async Task Update(ApplicationRoadGroups domain)
        {
            try
            {
                var model = new ApplicationRoadGroups
                {
                    id = domain.id,
                    name = domain.name,
                    roles = domain.roles,
                };
                var sql = "UPDATE application_road_groups SET name = @name, roles = @roles::jsonb WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationRoadGroups", ex);
            }
        }
    }
}
