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
    public class telegram_questions_chatsRepository : Itelegram_questions_chatsRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public telegram_questions_chatsRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<telegram_questions_chats>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"telegram_questions_chats\"";
                var models = await _dbConnection.QueryAsync<telegram_questions_chats>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get telegram_questions_chats", ex);
            }
        }
        public async Task<telegram_questions_chats> GetById(int id)
        {
            try
            {
                var sql = "SELECT * FROM telegram_questions_chats WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<telegram_questions_chats>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"telegram_questions_chats with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocumentType", ex);
            }
        }

        public async Task<telegram_questions_chats> GetByChatId(string chatId)
        {
            try
            {
                var sql = "SELECT * FROM \"telegram_questions_chats\" WHERE \"chatId\"=@chatId";
                var model = await _dbConnection.QueryFirstOrDefaultAsync<telegram_questions_chats>(sql, new { chatId = chatId }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"telegram_questions_chats with ID {chatId} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocumentType", ex);
            }
        }
        public async Task<int> Create(telegram_questions_chats domain)
        {
            try
            {
                var model = new telegram_questions_chatsModel
                {
                    chatId = domain.chatId,
                    created_at = domain.created_at
  
                };
                var sql = "INSERT INTO telegram_questions_chats(\"chatId\", \"created_at\") VALUES (@chatId, @created_at) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add telegram_questions_chats", ex);
            }
        }
        public async Task Update(telegram_questions_chats domain)
        {
            try
            {
                var model = new telegram_questions_chatsModel
                {

                    id = domain.id,
                    chatId = domain.chatId,
                    created_at = domain.created_at

                };
                var sql = "UPDATE \"telegram_questions_chats\" SET \"id\" = @id, \"chatId\" = @chatId, \"created_at\" = @created_at WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update telegram_questions_chats", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM telegram_questions_chats WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("telegram_questions_chats not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete telegram_questions_chats", ex);
            }
        }

        public async Task<List<ServiceCountTelegram>> GetNumberOfChats()
        {
            try
            {
                var sql = @"select * from (
SELECT TO_CHAR(created_at, 'DD.MM') AS name, COUNT(""chatId"") AS count 
FROM telegram_questions_chats 
GROUP BY TO_CHAR(created_at, 'DD.MM') 
) a
ORDER BY 
   substring(name, 4, 2)::int,
   substring(name, 1, 2)::int;";
                var models = await _dbConnection.QueryAsync<ServiceCountTelegram>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get telegram_questions_chats", ex);
            }
        }

        public async Task<List<ServiceCountTelegram>> GetNumberOfChatsByDate(DateTime startDate, DateTime? endDate)
        {
            try
            {
                var sql = @"select * from (
SELECT TO_CHAR(created_at, 'DD.MM') AS name, COUNT(""chatId"") AS count 
FROM telegram_questions_chats 
WHERE created_at >= @strDate AND (created_at <= @endDate OR @endDate IS NULL)
GROUP BY TO_CHAR(created_at, 'DD.MM') 
) a
ORDER BY 
   substring(name, 4, 2)::int,
   substring(name, 1, 2)::int;";
                var models = await _dbConnection.QueryAsync<ServiceCountTelegram>(sql, new { strDate = startDate, endDate = endDate }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get telegram_questions_chats", ex);
            }
        }

        
    }
}
