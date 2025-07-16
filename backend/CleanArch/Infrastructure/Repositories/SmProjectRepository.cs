using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;

namespace Infrastructure.Repositories
{
    public class SmProjectRepository : ISmProjectRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public SmProjectRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<SmProject>> GetAll()
        {
            try
            {
                string sql = @"
            SELECT 
                p.id,
                p.name,
                p.projecttype_id,
                p.test,
                p.status_id,
                p.min_responses,
                p.date_end,
                p.access_link,
                p.updated_at,
                p.created_at,
                p.updated_by,
                p.created_by,
                p.entity_id,
                p.frequency_id,
                p.is_triggers_required,
                p.date_attribute_milestone_id,

                t.id as SmProjectTypeId,
                t.name as SmProjectTypeName,
                t.code as SmProjectTypeCode,
                t.description as SmProjectTypeDescription,
                t.updated_at as SmProjectTypeUpdatedAt,
                t.created_at as SmProjectTypeCreatedAt,
                t.updated_by as SmProjectTypeUpdatedBy,
                t.created_by as SmProjectTypeCreatedBy
            FROM sm_project p
            LEFT JOIN sm_project_type t ON p.projecttype_id = t.id";

                var models = await _dbConnection.QueryAsync<SmProject, SmProjectType, SmProject>(
                    sql,
                    (project, projectType) =>
                    {
                        project.SmProjectType = projectType;
                        return project;
                    },
                    splitOn: "SmProjectTypeId"
                );

                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SmProjects", ex);
            }
        }

        public async Task<int> Add(SmProject domain)
        {
            try
            {
                var model = new SmProjectModel
                {
                    id = domain.id,
                    name = domain.name,
                    projecttype_id = domain.projecttype_id,
                    test = domain.test,
                    min_responses = domain.min_responses,
                    access_link = domain.access_link,
                    created_at = domain.created_at,
                    created_by = domain.created_by,
                    updated_at = domain.updated_at,
                    updated_by = domain.updated_by,
                };
                var sql = "INSERT INTO sm_project(name, projecttype_id, test, min_responses, access_link) VALUES (@name, @projecttype_id, @test, @min_responses, @access_link) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add SmProject", ex);
            }
        }

        public async Task Update(SmProject domain)
        {
            try
            {
                var model = new SmProjectModel
                {
                    id = domain.id,
                    name = domain.name,
                    projecttype_id = domain.projecttype_id,
                    test = domain.test,
                    min_responses = domain.min_responses,
                    access_link = domain.access_link,
                    created_at = domain.created_at,
                    created_by = domain.created_by,
                    updated_at = domain.updated_at,
                    updated_by = domain.updated_by,
                };
                var sql = "UPDATE sm_project SET name = @name, projecttype_id = @projecttype_id, test = @test, min_responses = @min_responses, access_link = @access_link WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update SmProject", ex);
            }
        }

        public async Task<PaginatedList<SmProject>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {

                string sql = @"
            SELECT 
                p.id,
                p.name,
                p.projecttype_id,
                p.test,
                p.status_id,
                p.min_responses,
                p.date_end,
                p.access_link,
                p.updated_at,
                p.created_at,
                p.updated_by,
                p.created_by,
                p.entity_id,
                p.frequency_id,
                p.is_triggers_required,
                p.date_attribute_milestone_id,

                t.id as SmProjectTypeId,
                t.name as SmProjectTypeName,
                t.code as SmProjectTypeCode,
                t.description as SmProjectTypeDescription,
                t.updated_at as SmProjectTypeUpdatedAt,
                t.created_at as SmProjectTypeCreatedAt,
                t.updated_by as SmProjectTypeUpdatedBy,
                t.created_by as SmProjectTypeCreatedBy
            FROM sm_project p
            LEFT JOIN sm_project_type t ON p.projecttype_id = t.id
            OFFSET @pageSize * (@pageNumber - 1) 
            Limit @pageSize;";

                var models = await _dbConnection.QueryAsync<SmProject, SmProjectType, SmProject>(
          sql,
          (project, projectType) =>
          {
              project.SmProjectType = projectType;
              return project;
          },
          new { pageSize, pageNumber },
          splitOn: "SmProjectTypeId"
      );

                var sqlCount = "SELECT Count(*) FROM sm_project";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<SmProject>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SmProjects", ex);
            }
        }
    }
}
