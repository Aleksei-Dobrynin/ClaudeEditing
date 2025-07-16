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

namespace Infrastructure.Repositories
{
    public class telegram_questionsRepository : Itelegram_questionsRepository
    {

        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public telegram_questionsRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<telegram_questions>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"telegram_questions\"";
                var models = await _dbConnection.QueryAsync<telegram_questions>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get telegram_questions", ex);
            }
        }

        public async Task<telegram_questions> GetById(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"telegram_questions\" WHERE id = @Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<telegram_questions>(sql, new { Id = id }, transaction: _dbTransaction);

                model.document = new List<Domain.Entities.File>();
                var sqlQuestionFile = "SELECT * FROM \"telegram_questions_file\" WHERE \"idQuestion\" = @Id";
                var modelQuestionFile = await _dbConnection.QueryAsync<Domain.Entities.telegram_questions_file>(sqlQuestionFile, new { Id = model.id }, transaction: _dbTransaction);

                modelQuestionFile.ToList();

                
                foreach (var item in modelQuestionFile)
                {
                    var sqlFile = "SELECT * FROM \"file\" WHERE id = @Id";
                    var modelFile = await _dbConnection.QuerySingleOrDefaultAsync<Domain.Entities.File>(sqlFile, new { Id = item.idFile }, transaction: _dbTransaction);
                    model.document.Add(modelFile);
                }
               
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get telegram_questions", ex);
            }
        }

        public async Task<List<telegram_questions_file>> FindQuestionFiles( int questionId)
        {
            try { 
              
                    var sqlAllFiles = "SELECT * FROM \"telegram_questions_file\" WHERE \"idQuestion\" = @Id";
                    var modelQuestionFile = await _dbConnection.QueryAsync<Domain.Entities.telegram_questions_file>(sqlAllFiles, new { Id = questionId }, transaction: _dbTransaction);
                     return modelQuestionFile.ToList();
            }

            catch(Exception ex)
            {
                throw new RepositoryException("Failed to get telegram_questions", ex);
            }
        }

        public async Task DeleteQuestionFile(int id)
        {
            try
            {

                var sqlAllFiles = "DELETE FROM \"telegram_questions_file\" WHERE \"idFile\" = @Id";
                await _dbConnection.ExecuteAsync(sqlAllFiles, new { Id = id }, transaction: _dbTransaction);

            }

            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get telegram_questions", ex);
            }
        }

        public async Task<List<telegram_questions>> GetByIdSubject(int id)
        {
            try
            {
                var sql = "SELECT * FROM \"telegram_questions\" WHERE \"idSubject\" = @Id";
                var model = await _dbConnection.QueryAsync<telegram_questions>(sql, new { Id = id }, transaction: _dbTransaction);
                return model.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get telegram_questions", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {

                var model = new { id = id };
                var sql = "DELETE FROM \"telegram_questions\" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
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

        public async Task Update(telegram_questions domain)
        {
            try
            {
                var model = new telegram_questionsModel
                {
                    id = domain.id,
                    name = domain.name,
                    idSubject = domain.idSubject,
                    answer = domain.answer,
                    name_kg = domain.name_kg,
                    answer_kg = domain.answer_kg,
                };
                var sql = "UPDATE \"telegram_questions\" SET \"id\" = @id, \"name\" = @name, \"idSubject\" = @\"idSubject\", \"answer\" = @answer, \"name_kg\" = @name_kg, \"answer_kg\" = @answer_kg WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
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

        public async Task<int> Add(telegram_questions domain)
        {
            try
            {

                var model = new telegram_questionsModel
                {
                    name = domain.name,
                    idSubject = domain.idSubject,
                    answer = domain.answer,
                    name_kg = domain.name_kg,
                    answer_kg = domain.answer_kg,
                };
                var sql = "INSERT INTO \"telegram_questions\"(name, \"idSubject\", answer, name_kg, answer_kg) VALUES (@name, @idSubject, @answer, @name_kg, @answer_kg) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add telegram_questions", ex);
            }
        }

        public async Task<int> CreateQuestionFiles(telegram_questions_file domain)
        {
            try
            {

                var model = new telegram_questions_file
                {
                    idQuestion = domain.idQuestion,
                    idFile = domain.idFile
                };
                var sql = "INSERT INTO \"telegram_questions_file\"(\"idFile\", \"idQuestion\" ) VALUES ( @idFile, @idQuestion) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add telegram_questions", ex);
            }
        }
    }
}
