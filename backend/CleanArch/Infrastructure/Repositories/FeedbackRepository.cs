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
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public FeedbackRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<int> Add(Feedback domain)
        {
            try
            {
                var model = new Feedback
                {
                    record_date = domain.record_date,
                    employee_id = domain.employee_id,
                    description = domain.description,
                    created_at = DateTime.Now,
                    created_by = await _userRepository.GetUserID(),
                };
                var sql = @"INSERT INTO feedback(record_date, employee_id, description, created_at, created_by) VALUES 
                    (@record_date, @employee_id, @description, @created_at, @created_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add Feedback", ex);
            }
        }
    }
}
