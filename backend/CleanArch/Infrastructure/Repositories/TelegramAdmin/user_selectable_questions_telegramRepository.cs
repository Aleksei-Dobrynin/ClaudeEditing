using Application.Exceptions;
using Application.Repositories;
using Dapper;
using Domain.Entities;
using Infrastructure.Data.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Infrastructure.Repositories.ServiceRepository;

namespace Infrastructure.Repositories
{
    public class user_selectable_questions_telegramRepository : Iuser_selectable_questions_telegramRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public user_selectable_questions_telegramRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<user_selectable_questions_telegram>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"user_selectable_questions_telegram\"";
                var models = await _dbConnection.QueryAsync<user_selectable_questions_telegram>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get user_selectable_questions_telegram", ex);
            }
        }
        public async Task<user_selectable_questions_telegram> GetById(int id)
        {
            try
            {
                var sql = "SELECT * FROM user_selectable_questions_telegram WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<user_selectable_questions_telegram>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"user_selectable_questions_telegram with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocumentType", ex);
            }
        }

        public async Task<user_selectable_questions_telegram> GetByChatId(string chatId)
        {
            try
            {
                var sql = "SELECT * FROM \"user_selectable_questions_telegram\" WHERE \"chatId\"=@chatId";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<user_selectable_questions_telegram>(sql, new { chatId = chatId }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"user_selectable_questions_telegram with ID {chatId} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocumentType", ex);
            }
        }
        public async Task<int> Create(user_selectable_questions_telegram domain)
        {
            try
            {
                var model = new user_selectable_questions_telegramModel
                {
                    chatId = domain.chatId,
                    questionId = domain.questionId,
                    created_at = domain.created_at

                };
                var sql = "INSERT INTO user_selectable_questions_telegram(\"chatId\", \"created_at\", \"questionId\") VALUES (@chatId, @created_at,@questionId) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add user_selectable_questions_telegram", ex);
            }
        }
        public async Task Update(user_selectable_questions_telegram domain)
        {
            try
            {
                var model = new user_selectable_questions_telegramModel
                {

                    id = domain.id,
                    chatId = domain.chatId,
                    questionId = domain.questionId,
                    created_at = domain.created_at

                };
                var sql = "UPDATE \"user_selectable_questions_telegram\" SET \"id\" = @id, \"chatId\" = @chatId, \"created_at\" = @created_at, \"questionId\" = @questionId WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update user_selectable_questions_telegram", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM user_selectable_questions_telegram WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("user_selectable_questions_telegram not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete user_selectable_questions_telegram", ex);
            }
        }

        public async Task<List<ServiceCountTelegramByQuestions>> GetClicked(DateTime startDate, DateTime? endDate)
        {
            try
            {
                //var sql = "SELECT \"questionId\" AS questionid, COUNT(\"chatId\") AS count FROM \"user_selectable_questions_telegram\" WHERE \"created_at\" >= @strDate AND(\"created_at\" <= @endDate OR @endDate IS NULL) GROUP BY \"questionId\" ORDER BY questionid";
                var sql = "SELECT tq.name, count(uq.id) AS count FROM \"telegram_questions\" AS tq left join \"user_selectable_questions_telegram\" uq ON tq.id = uq.\"questionId\" AND uq.\"created_at\" >= @strDate AND(uq.\"created_at\" <= @endDate OR @endDate IS NULL) group by tq.name;";
                var models = await _dbConnection.QueryAsync<ServiceCountTelegramByQuestions>(sql, new { strDate = startDate, endDate = endDate }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get user_selectable_questions_telegram", ex);
            }
        }

        
    }
}
