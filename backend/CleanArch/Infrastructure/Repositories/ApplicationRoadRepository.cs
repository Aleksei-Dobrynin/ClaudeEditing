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
    public class ApplicationRoadRepository : IApplicationRoadRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ApplicationRoadRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationRoad>> GetAll()
        {
            try
            {
                var sql = @"SELECT application_road.id, 
                                   from_status_id,
                                   is_active,
                                   fas.name from_status_name, 
                                   to_status_id, 
                                   tas.name to_status_name, 
                                   rule_expression, 
                                   application_road.description,
                                   validation_url,
                                   post_function_url,
                                   g.name as group_name,
                                   g.roles
                                   FROM application_road
                            left join application_status fas on fas.id = from_status_id
                            left join application_status tas on tas.id = to_status_id
                            left join application_road_groups g on g.id = application_road.group_id
";
                var models = await _dbConnection.QueryAsync<ApplicationRoad>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationRoad", ex);
            }
        }
        
        public async Task<ApplicationRoad> GetByStatuses(int from_id, int to_id)
        {
            try
            {
                var sql =
                    @"SELECT id, from_status_id, to_status_id, rule_expression, 
                                description,
                                validation_url,
                                post_function_url 
                                FROM application_road WHERE from_status_id=@FId and to_status_id=@TId";
                var model = await _dbConnection.QueryFirstOrDefaultAsync<ApplicationRoad>(sql, new { FId = from_id, TId = to_id },
                    transaction: _dbTransaction);
   
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to get ApplicationRoad. From {from_id} to {to_id}", ex);
            }
        }

        public async Task<ApplicationRoad> GetOneByID(int id)
        {
            try
            {
                var sql =
                    @"SELECT id, from_status_id, to_status_id, rule_expression, 
                                description,
                                is_active,
                                validation_url,
                                post_function_url,
                                group_id
                                FROM application_road WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationRoad>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationRoad with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationRoad", ex);
            }
        }

        public async Task<int> Add(ApplicationRoad domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationRoad
                {
                    from_status_id = domain.from_status_id,
                    to_status_id = domain.to_status_id,
                    rule_expression = domain.rule_expression,
                    description = domain.description,
                    validation_url = domain.validation_url,
                    post_function_url = domain.post_function_url,
                    is_active = domain.is_active,
                    group_id = domain.group_id
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql =
                    "INSERT INTO application_road(from_status_id, to_status_id, rule_expression, description, group_id, validation_url, post_function_url, is_active, created_at, updated_at, created_by, updated_by) VALUES (@from_status_id, @to_status_id, @rule_expression, @description, @group_id, @validation_url, @post_function_url, @is_active, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationRoad", ex);
            }
        }

        public async Task Update(ApplicationRoad domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ApplicationRoad
                {
                    id = domain.id,
                    from_status_id = domain.from_status_id,
                    to_status_id = domain.to_status_id,
                    rule_expression = domain.rule_expression,
                    description = domain.description,
                    validation_url = domain.validation_url,
                    post_function_url = domain.post_function_url,
                    is_active = domain.is_active,
                    group_id = domain.group_id
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql =
                    @"UPDATE application_road SET from_status_id = @from_status_id, to_status_id = @to_status_id, 
                            rule_expression = @rule_expression, description = @description, group_id = @group_id,
                            validation_url = @validation_url, post_function_url = @post_function_url, is_active = @is_active, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationRoad", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM application_road WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationRoad not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationRoad", ex);
            }
        }
    }
}