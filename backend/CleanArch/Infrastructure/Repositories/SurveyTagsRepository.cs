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
    public class SurveyTagsRepository : ISurveyTagsRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public SurveyTagsRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<SurveyTags>> GetAll()
        {
            try
            {
                string sql = @"
            SELECT 
    s.id,
    s.name,
    s.code,
    s.description,
    s.updated_at,
    s.created_at,
    s.updated_by,
    s.created_by,
    s.""queueNumber"",
    s.""iconColor"",
    s.""idCustomSvgIcon"",

    c.id as CustomSvgIconId,
    c.name as CustomSvgIconName,
    c.code as CustomSvgIconCode,
    c.description as CustomSvgIconDescription,
    c.updated_at as CustomSvgIconUpdatedAt,
    c.created_at as CustomSvgIconCreatedAt,
    c.updated_by as CustomSvgIconUpdatedBy,
    c.created_by as CustomSvgIconCreatedBy

FROM survey_tags s
LEFT JOIN custom_svg_icons c ON s.idCustomSvgIcon = c.id";

                var models = await _dbConnection.QueryAsync<SurveyTags, CustomSvgIcon, SurveyTags>(
                sql,
                (surveyTag, customSvgIcon) =>
                {
                    if (customSvgIcon != null)
                    {
                        surveyTag.customSvgIcon = customSvgIcon;
                    }
                    return surveyTag;
                },
                splitOn: "CustomSvgIconId"
                );

                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SurveyTagss", ex);
            }
        }

        public async Task<int> Add(SurveyTags domain)
        {
            try
            {
                var model = new SurveyTagsModel
                {
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    idCustomSvgIcon = domain.idCustomSvgIcon,
                    iconColor = domain.iconColor,
                    created_at = domain.created_at,
                    created_by = domain.created_by,
                    updated_at = domain.updated_at,
                    updated_by = domain.updated_by,
                };
                var sql = "INSERT INTO survey_tags(name, description, idCustomSvgIcon, iconColor) VALUES (@name, @description, @idCustomSvgIcon, @iconColor) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add SurveyTags", ex);
            }
        }

        public async Task Update(SurveyTags domain)
        {
            try
            {
                var model = new SurveyTagsModel
                {
                    id = domain.id,
                    name = domain.name,
                    description = domain.description,
                    idCustomSvgIcon = domain.idCustomSvgIcon,
                    iconColor = domain.iconColor,
                    created_at = domain.created_at,
                    created_by = domain.created_by,
                    updated_at = domain.updated_at,
                    updated_by = domain.updated_by,
                };
                var sql = "UPDATE survey_tags SET name = @name, description = @description, idCustomSvgIcon = @idCustomSvgIcon, iconColor = @iconColor WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update SurveyTags", ex);
            }
        }

        public async Task<PaginatedList<SurveyTags>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {

                string sql = @"
           SELECT 
    s.id,
    s.name,
    s.code,
    s.description,
    s.updated_at,
    s.created_at,
    s.updated_by,
    s.created_by,
    s.""queueNumber"",
    s.""iconColor"",
    s.""idCustomSvgIcon"",

    c.id as CustomSvgIconId,
    c.name as CustomSvgIconName,
    c.code as CustomSvgIconCode,
    c.description as CustomSvgIconDescription,
    c.updated_at as CustomSvgIconUpdatedAt,
    c.created_at as CustomSvgIconCreatedAt,
    c.updated_by as CustomSvgIconUpdatedBy,
    c.created_by as CustomSvgIconCreatedBy

FROM survey_tags s
LEFT JOIN custom_svg_icons c ON s.idCustomSvgIcon = c.id
            OFFSET @pageSize * (@pageNumber - 1) 
            Limit @pageSize;";

                var models = await _dbConnection.QueryAsync<SurveyTags, CustomSvgIcon, SurveyTags>(
                sql,
                (surveyTag, customSvgIcon) =>
                {
                    if (customSvgIcon != null)
                    {
                        surveyTag.customSvgIcon = customSvgIcon;
                    }
                    return surveyTag;
                },
                splitOn: "CustomSvgIconId"
                );

                var sqlCount = "SELECT Count(*) FROM survey_tags";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<SurveyTags>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get SurveyTagss", ex);
            }
        }
    }
}
