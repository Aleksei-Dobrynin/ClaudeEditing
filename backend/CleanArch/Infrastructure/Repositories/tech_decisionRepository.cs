using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class tech_decisionRepository : Itech_decisionRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public tech_decisionRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<tech_decision>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""tech_decision""";
                var models = await _dbConnection.QueryAsync<tech_decision>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get tech_decision", ex);
            }
        }

        public async Task<int> Add(tech_decision domain)
        {
            try
            {
                var model = new tech_decisionModel
                {
                    id = domain.id,
                    background_color = domain.background_color,
                    code = domain.code,
                    description = domain.description,
                    description_kg = domain.description_kg,
                    name = domain.name,
                    name_kg = domain.name_kg,
                    text_color = domain.text_color,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };

                var sql = @"
                    INSERT INTO ""tech_decision""(
                        ""name"", 
                        ""code"", 
                        ""description"", 
                        ""name_kg"", 
                        ""description_kg"", 
                        ""text_color"", 
                        ""background_color"", 
                        ""created_at"", 
                        ""updated_at"", 
                        ""created_by"", 
                        ""updated_by""
                    ) 
                    VALUES (
                        @name, 
                        @code, 
                        @description, 
                        @name_kg, 
                        @description_kg, 
                        @text_color, 
                        @background_color, 
                        @created_at, 
                        @updated_at, 
                        @created_by, 
                        @updated_by
                    ) RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add tech_decision", ex);
            }
        }

        public async Task Update(tech_decision domain)
        {
            try
            {
                var model = new tech_decisionModel
                {
                    id = domain.id,
                    background_color = domain.background_color,
                    code = domain.code,
                    description = domain.description,
                    description_kg = domain.description_kg,
                    name = domain.name,
                    name_kg = domain.name_kg,
                    text_color = domain.text_color,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };

                var sql = @"
                    UPDATE ""tech_decision"" 
                    SET 
                        ""name"" = @name, 
                        ""code"" = @code, 
                        ""description"" = @description, 
                        ""name_kg"" = @name_kg, 
                        ""description_kg"" = @description_kg, 
                        ""text_color"" = @text_color, 
                        ""background_color"" = @background_color, 
                        ""updated_at"" = @updated_at, 
                        ""updated_by"" = @updated_by 
                    WHERE id = @id";

                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update tech_decision", ex);
            }
        }

        public async Task<PaginatedList<tech_decision>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"
                    SELECT * 
                    FROM ""tech_decision"" 
                    OFFSET @pageSize * (@pageNumber - 1) 
                    LIMIT @pageSize";

                var models = await _dbConnection.QueryAsync<tech_decision>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT COUNT(*) FROM ""tech_decision""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();
                return new PaginatedList<tech_decision>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get tech_decisions", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""tech_decision"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete tech_decision", ex);
            }
        }

        public async Task<tech_decision> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""tech_decision"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<tech_decision>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get tech_decision", ex);
            }
        }
    }
}