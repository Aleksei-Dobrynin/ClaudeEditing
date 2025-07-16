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
    public class telegram_subjectsRepository : Itelegram_subjectsRepository
    {

        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public telegram_subjectsRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<telegram_subjects>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM \"telegram_subjects\"";
                var models = await _dbConnection.QueryAsync<telegram_subjects>(sql, transaction: _dbTransaction);

                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get telegram_subjects", ex);
            }
        }

        public async Task<telegram_subjects> GetById( int id)
        {
            try
            {
                var sql = "SELECT * FROM \"telegram_subjects\" WHERE id = @Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<telegram_subjects>(sql, new { Id = id }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get telegram_subjects", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var deleteFilesSql = "DELETE FROM telegram_questions_file WHERE \"idQuestion\" IN (SELECT id FROM telegram_questions WHERE \"idSubject\" = @Id)";
                await _dbConnection.ExecuteAsync(deleteFilesSql, new {Id = id}, transaction: _dbTransaction);

                var deleteQuestionsSql = "DELETE FROM telegram_questions WHERE \"idSubject\" = @id";
                await _dbConnection.ExecuteAsync(deleteQuestionsSql, new { id }, transaction: _dbTransaction);

                var deleteSubjectSql = "DELETE FROM telegram_subjects WHERE id = @id";
                var affected =  await _dbConnection.ExecuteAsync(deleteSubjectSql, new { id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update telegram_subjects", ex);
            }
        }

        //public async Task Delete(int id)
        //{
        //    try
        //    {
        //        using (var transaction = _dbConnection.BeginTransaction())
        //        {
        //            var deleteAnswersSql = "DELETE FROM answer WHERE \"idQuestions\" IN (SELECT id FROM telegram_questions WHERE \"idSubject\" = @id);";
        //            await _dbConnection.ExecuteAsync(deleteAnswersSql, new { id }, transaction: _dbTransaction);

        //            var deleteQuestionsSql = "DELETE FROM telegram_questions WHERE \"idSubject\" = @id;";
        //            await _dbConnection.ExecuteAsync(deleteQuestionsSql, new { id }, transaction: _dbTransaction);

        //            var deleteSubjectSql = "DELETE FROM telegram_subjects WHERE id = @id";
        //            var affected = await _dbConnection.ExecuteAsync(deleteSubjectSql, new { id }, transaction: _dbTransaction);

        //            if (affected == 0)
        //            {
        //                throw new RepositoryException("Not found", null);
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new RepositoryException("Failed to delete telegram_subjects", ex);
        //    }
        //}


        public async Task Update(telegram_subjects domain)
        {
            try
            {
                var model = new telegram_subjectsModel
                {

                    id = domain.id,
                    name = domain.name,
                    name_kg = domain.name_kg,

                };
                var sql = "UPDATE \"telegram_subjects\" SET \"id\" = @id, \"name\" = @name, \"name_kg\" = @name_kg WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update telegram_subjects", ex);
            }
        }

        public async Task<int> Add(telegram_subjects domain)
        {
            try
            {

                var model = new telegram_subjectsModel
                {
                    name = domain.name,
                    name_kg = domain.name_kg
                };
                var sql = "INSERT INTO \"telegram_subjects\"(\"name\", \"name_kg\") " +
                    "VALUES (@name, @name_kg) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add telegram_subjects", ex);
            }
        }
    }
}
