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
    public class faq_questionRepository : Ifaq_questionRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public faq_questionRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<faq_question>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""faq_question""";
                var models = await _dbConnection.QueryAsync<faq_question>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get faq_question", ex);
            }
        }

        public async Task<int> Add(faq_question domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new faq_questionModel
                {
                    
                    id = domain.id,
                    title = domain.title,
                    answer = domain.answer,
                    video = domain.video,
                    is_visible = domain.is_visible,
                    settings = domain.settings,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO ""faq_question""(""title"", ""answer"", ""video"", ""is_visible"", ""settings"", created_at, updated_at, created_by, updated_by) 
                VALUES (@title, @answer, @video, @is_visible, @settings, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add faq_question", ex);
            }
        }

        public async Task Update(faq_question domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new faq_questionModel
                {
                    
                    id = domain.id,
                    title = domain.title,
                    answer = domain.answer,
                    video = domain.video,
                    is_visible = domain.is_visible,
                    settings = domain.settings,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE ""faq_question"" SET ""id"" = @id, ""title"" = @title, ""answer"" = @answer, ""video"" = @video, ""is_visible"" = @is_visible, ""settings"" = @settings, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update faq_question", ex);
            }
        }

        public async Task<PaginatedList<faq_question>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""faq_question"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<faq_question>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""faq_question""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<faq_question>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get faq_questions", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""faq_question"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update faq_question", ex);
            }
        }
        public async Task<faq_question> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""faq_question"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<faq_question>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get faq_question", ex);
            }
        }

        
    }
}
