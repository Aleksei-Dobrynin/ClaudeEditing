using Application.Exceptions;
using Application.Repositories;
using Dapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class FileDownloadLogRepository : IFileDownloadLogRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public FileDownloadLogRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task Add(int userId, string username, int fileId, string fileName)
        {
            try
            {
                const string sql = @"
            INSERT INTO file_download_log (user_id, username, file_id, file_name, download_time)
            VALUES (@UserId, @Username, @FileId, @FileName, @DownloadTime);";

                await _dbConnection.ExecuteAsync(sql, new
                {
                    UserId = userId,
                    Username = username,
                    FileId = fileId,
                    FileName = fileName,
                    DownloadTime = DateTime.Now,
                }, transaction: _dbTransaction);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get FileDownloadLog", ex);
            }
        }
        
        public async Task<List<FileDownloadLog>> GetAll()
        {
            try
            {
                var sql = @"
            SELECT id, user_id, username, file_id, file_name, download_time
            FROM file_download_log
            ORDER BY download_time DESC;";

                var models = await _dbConnection.QueryAsync<FileDownloadLog>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get FileDownloadLog list", ex);
            }
        }
    }
}
