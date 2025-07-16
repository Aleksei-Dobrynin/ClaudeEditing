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
    public class FeedbackFilesRepository : IFeedbackFilesRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public FeedbackFilesRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<int> Add(FeedbackFiles domain)
        {
            try
            {
                var model = new FeedbackFiles
                {
                    file_id = domain.file_id,
                    feedback_id = domain.feedback_id,
                    created_at = DateTime.Now,
                    created_by = await _userRepository.GetUserID(),
                };
                var sql = @"INSERT INTO feedback_files(file_id, feedback_id, created_at, created_by) VALUES 
                    (@file_id, @feedback_id, @created_at, @created_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add FeedbackFiles", ex);
            }
        }
    }
}
