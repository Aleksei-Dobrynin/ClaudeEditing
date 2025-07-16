using Application.Exceptions;
using Application.Repositories;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class telegram_questions_fileRepository : Itelegram_questions_fileRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

            public telegram_questions_fileRepository(IDbConnection dbConnection)
            {
                _dbConnection = dbConnection;
            }

            public void SetTransaction(IDbTransaction dbTransaction)
            {
                _dbTransaction = dbTransaction;
            }

            public async Task DeleteByIdQuestion(int idQuestion)
            {
                try { 
                    var sql = "DELETE FROM \"telegram_questions_file\" WHERE \"idQuestion\" = @Id";
                    var affected = await _dbConnection.ExecuteAsync(sql, new { Id = idQuestion }, transaction: _dbTransaction);
                     
                 }
                catch (Exception ex)
                {
                    throw new RepositoryException("Failed to update telegram_questions", ex);
                }
            }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM \"telegram_questions_file\" WHERE \"id\" = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }

            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update telegram_questions", ex);
            }
        }
    }
    }

