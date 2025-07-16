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
    public class SmProjectTagsRepository : ISmProjectTagsRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public SmProjectTagsRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<SmProjectTags>> GetAll()
        {
            try
            {
                string sql = @"
            SELECT 
                p.id,
                p.project_id,
                p.tag_id,
                p.updated_at,
                p.created_at,
                p.updated_by,
                p.created_by,

                s.id as SurveyTagsId,
                s.name as SurveyTagsName,
                s.code as SurveyTagsCode,
                s.description as SurveyTagsDescription,
                s.updated_at as SurveyTagsUpdatedAt,
                s.created_at as SurveyTagsCreatedAt,
                s.updated_by as SurveyTagsUpdatedBy,
                s.created_by as SurveyTagsCreatedBy,
                s.queueNumber as SurveyTagsQueueNumber,
                s.iconColor as SurveyTagsIconColor,
                s.idCustomSvgIcon,

                c.id as CustomSvgIconId,
                c.name as CustomSvgIconName,
                c.code as CustomSvgIconCode,
                c.description as CustomSvgIconDescription,
                c.updated_at as CustomSvgIconUpdatedAt,
                c.created_at as CustomSvgIconCreatedAt,
                c.updated_by as CustomSvgIconUpdatedBy,
                c.created_by as CustomSvgIconCreatedBy
            FROM sm_project_tags p
            LEFT JOIN survey_tags s ON p.tag_id = s.id
            LEFT JOIN custom_svg_icons c ON s.idCustomSvgIcon = c.id";

                var models = await _dbConnection.QueryAsync<SmProjectTags, SurveyTags, CustomSvgIcon, SmProjectTags>(
                    sql, (projectTag, surveyTag, customSvgIcon) =>
                    {
                        if (surveyTag != null)
                        {
                            surveyTag.customSvgIcon = customSvgIcon;
                            projectTag.surveyTags = surveyTag;
                        }
                        return projectTag;
                    },
                    splitOn: "SurveyTagsId,CustomSvgIconId"
                    );

                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SmProjectTagss", ex);
            }
        }

        public async Task<int> Add(SmProjectTags domain)
        {
            try
            {
                var model = new SmProjectTagsModel
                {
                    id = domain.id,
                    project_id = domain.project_id,
                    tag_id = domain.tag_id,
                    created_at = domain.created_at,
                    created_by = domain.created_by,
                    updated_at = domain.updated_at,
                    updated_by = domain.updated_by,
                };
                var sql = "INSERT INTO sm_project_tags(project_id, tag_id) VALUES (@project_id, @tag_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add SmProjectTags", ex);
            }
        }

        public async Task Update(SmProjectTags domain)
        {
            try
            {
                var model = new SmProjectTagsModel
                {
                    id = domain.id,
                    project_id = domain.project_id,
                    tag_id = domain.tag_id,
                    created_at = domain.created_at,
                    created_by = domain.created_by,
                    updated_at = domain.updated_at,
                    updated_by = domain.updated_by,
                };
                var sql = "UPDATE sm_project_tags SET project_id = @project_id, tag_id = @tag_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update SmProjectTags", ex);
            }
        }

        public async Task<PaginatedList<SmProjectTags>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {

                string sql = @"
            SELECT 
                p.id,
                p.project_id,
                p.tag_id,
                p.updated_at,
                p.created_at,
                p.updated_by,
                p.created_by,

                s.id as SurveyTagsId,
                s.name as SurveyTagsName,
                s.code as SurveyTagsCode,
                s.description as SurveyTagsDescription,
                s.updated_at as SurveyTagsUpdatedAt,
                s.created_at as SurveyTagsCreatedAt,
                s.updated_by as SurveyTagsUpdatedBy,
                s.created_by as SurveyTagsCreatedBy,
                s.queueNumber as SurveyTagsQueueNumber,
                s.iconColor as SurveyTagsIconColor,
                s.idCustomSvgIcon,

                c.id as CustomSvgIconId,
                c.name as CustomSvgIconName,
                c.code as CustomSvgIconCode,
                c.description as CustomSvgIconDescription,
                c.updated_at as CustomSvgIconUpdatedAt,
                c.created_at as CustomSvgIconCreatedAt,
                c.updated_by as CustomSvgIconUpdatedBy,
                c.created_by as CustomSvgIconCreatedBy
            FROM sm_project_tags p
            LEFT JOIN survey_tags s ON p.tag_id = s.id
            LEFT JOIN custom_svg_icons c ON s.idCustomSvgIcon = c.id
            OFFSET @pageSize * (@pageNumber - 1) 
            Limit @pageSize;";

                var models = await _dbConnection.QueryAsync<SmProjectTags, SurveyTags, CustomSvgIcon, SmProjectTags>(
                    sql, (projectTag, surveyTag, customSvgIcon) =>
                    {
                        if (surveyTag != null)
                        {
                            surveyTag.customSvgIcon = customSvgIcon;
                            projectTag.surveyTags = surveyTag;
                        }
                        return projectTag;
                    },
                    new { pageSize, pageNumber },
                    splitOn: "SurveyTagsId,CustomSvgIconId"
                    );

                var sqlCount = "SELECT Count(*) FROM sm_project_tags";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<SmProjectTags>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SmProjectTagss", ex);
            }
        }
    }
}
