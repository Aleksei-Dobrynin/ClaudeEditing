using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Application.Exceptions;
using Application.Models;
using Application.Repositories;
using Dapper;
using Domain.Entities;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class SecurityEventRepository : ISecurityEventRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private readonly IUserRepository _userRepository;

        public SecurityEventRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<int> Add(SecurityEvent securityEvent)
        {
            try
            {
                //var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                //securityEvent.created_by = userId;
                securityEvent.created_at = DateTime.Now;
                //securityEvent.updated_by = userId;
                securityEvent.updated_at = DateTime.Now;

                var sql = @"INSERT INTO security_event (event_type, event_description, user_id, ip_address, 
                            user_agent, event_time, severity_level, is_resolved, resolution_time, resolution_notes,
                            created_at, created_by, updated_at, updated_by)
                            VALUES (@event_type, @event_description, @user_id, @ip_address, @user_agent, 
                            @event_time, @severity_level, @is_resolved, @resolution_time, @resolution_notes,
                            @created_at, @created_by, @updated_at, @updated_by)
                            RETURNING id";

                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, securityEvent, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add security event", ex);
            }
        }

        public async Task<SecurityEvent> GetById(int id)
        {
            try
            {
                var sql = "SELECT * FROM security_event WHERE id = @id";
                var result = await _dbConnection.QuerySingleOrDefaultAsync<SecurityEvent>(sql, new { id }, transaction: _dbTransaction);

                if (result == null)
                {
                    throw new RepositoryException($"Security Event with ID {id} not found.", null);
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get security event", ex);
            }
        }

        public async Task<List<SecurityEvent>> GetByUserId(string userId)
        {
            try
            {
                var sql = "SELECT * FROM security_event WHERE user_id = @userId ORDER BY event_time DESC";
                var result = await _dbConnection.QueryAsync<SecurityEvent>(sql, new { userId }, transaction: _dbTransaction);
                return result.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get security events by user ID", ex);
            }
        }

        public async Task<List<SecurityEvent>> GetByEventType(string eventType)
        {
            try
            {
                var sql = "SELECT * FROM security_event WHERE event_type = @eventType ORDER BY event_time DESC";
                var result = await _dbConnection.QueryAsync<SecurityEvent>(sql, new { eventType }, transaction: _dbTransaction);
                return result.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get security events by event type", ex);
            }
        }

        public async Task<List<SecurityEvent>> GetByDateRange(DateTime startDate, DateTime endDate)
        {
            try
            {
                var sql = "SELECT * FROM security_event WHERE event_time BETWEEN @startDate AND @endDate ORDER BY event_time DESC";
                var result = await _dbConnection.QueryAsync<SecurityEvent>(sql, new { startDate, endDate }, transaction: _dbTransaction);
                return result.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get security events by date range", ex);
            }
        }

        public async Task<PaginatedList<SecurityEvent>> GetPaginated(int pageSize, int pageNumber, string orderBy = "event_time", string orderType = "desc")
        {
            try
            {
                var sql = $"SELECT * FROM security_event ORDER BY {orderBy} {orderType} OFFSET @offset LIMIT @limit";
                var offset = (pageNumber - 1) * pageSize;

                var result = await _dbConnection.QueryAsync<SecurityEvent>(
                    sql,
                    new { offset, limit = pageSize },
                    transaction: _dbTransaction);

                var countSql = "SELECT COUNT(*) FROM security_event";
                var totalCount = await _dbConnection.ExecuteScalarAsync<int>(countSql, transaction: _dbTransaction);

                return new PaginatedList<SecurityEvent>(result.ToList(), totalCount, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get paginated security events", ex);
            }
        }

        public async Task<List<SecurityEvent>> GetUnresolvedEvents()
        {
            try
            {
                var sql = "SELECT * FROM security_event WHERE is_resolved = false ORDER BY event_time DESC";
                var result = await _dbConnection.QueryAsync<SecurityEvent>(sql, transaction: _dbTransaction);
                return result.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get unresolved security events", ex);
            }
        }

        public async Task UpdateResolution(int id, string resolutionNotes)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var sql = @"UPDATE security_event 
                           SET is_resolved = true, 
                               resolution_time = @resolutionTime, 
                               resolution_notes = @resolutionNotes,
                               updated_at = @updatedAt,
                               updated_by = @updatedBy
                           WHERE id = @id";

                var parameters = new
                {
                    id,
                    resolutionTime = DateTime.Now,
                    resolutionNotes,
                    updatedAt = DateTime.Now,
                    updatedBy = userId
                };

                var affected = await _dbConnection.ExecuteAsync(sql, parameters, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException($"Security Event with ID {id} not found.", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update security event resolution", ex);
            }
        }
    }
}