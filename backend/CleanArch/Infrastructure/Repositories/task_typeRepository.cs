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
    public class task_typeRepository : Itask_typeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;


        public task_typeRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<task_type>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""task_type""";
                var models = await _dbConnection.QueryAsync<task_type>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get task_type", ex);
            }
        }

        public async Task<int> Add(task_type domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new task_typeModel
                {
                    
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                    is_for_task = domain.is_for_task,
                    is_for_subtask = domain.is_for_subtask,
                    icon_color = domain.icon_color,
                    svg_icon_id = domain.svg_icon_id,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO ""task_type""(""name"", ""code"", ""description"", ""is_for_task"", ""is_for_subtask"", ""icon_color"", ""svg_icon_id"", created_at, created_by, updated_at, updated_by) 
                VALUES (@name, @code, @description, @is_for_task, @is_for_subtask, @icon_color, @svg_icon_id, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add task_type", ex);
            }
        }

        public async Task Update(task_type domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new task_typeModel
                {
                    
                    id = domain.id,
                    name = domain.name,
                    code = domain.code,
                    description = domain.description,
                    is_for_task = domain.is_for_task,
                    is_for_subtask = domain.is_for_subtask,
                    icon_color = domain.icon_color,
                    svg_icon_id = domain.svg_icon_id,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE ""task_type"" SET ""id"" = @id, ""name"" = @name, ""code"" = @code, ""description"" = @description, ""is_for_task"" = @is_for_task, ""is_for_subtask"" = @is_for_subtask, ""icon_color"" = @icon_color, ""svg_icon_id"" = @svg_icon_id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update task_type", ex);
            }
        }

        public async Task<PaginatedList<task_type>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""task_type"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<task_type>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""task_type""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<task_type>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get task_types", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""task_type"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update task_type", ex);
            }
        }
        public async Task<task_type> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""task_type"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<task_type>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get task_type", ex);
            }
        }

        
    }
}
