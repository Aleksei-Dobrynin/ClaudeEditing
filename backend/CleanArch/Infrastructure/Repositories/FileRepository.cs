using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using Microsoft.Extensions.Hosting;
using System;
using Infrastructure.Utils;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class FileRepository : IFileRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IHostEnvironment _appEnvironment;
        private IUserRepository? _userRepository;
        public string BaseDirectory => "/wwwroot/Files/";

        public FileRepository(IDbConnection dbConnection, IHostEnvironment appEnvironment, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _appEnvironment = appEnvironment;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<Domain.Entities.File>> GetAll()
        {
            try
            {
                var sql = "SELECT id, name, path FROM file";
                var models = await _dbConnection.QueryAsync<Domain.Entities.File>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get File", ex);
            }
        }
        public async Task<List<Domain.Entities.FileSign>> GetSignByFileIds(int[] ids)
        {
            try
            {
                var sql = @"
                SELECT 
                    fs.*,
                    ad.name AS file_type_name
                FROM file_sign fs
                LEFT JOIN application_document ad 
                    ON fs.file_type_id = ad.id AND fs.file_type_id > 0
                WHERE fs.file_id = ANY(@ids);";

                var models = await _dbConnection.QueryAsync<Domain.Entities.FileSign>(sql, new { ids }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get File", ex);
            }
        }


        public async Task<Domain.Entities.File> GetOne(int id)
        {
            try
            {
                var sql = "SELECT id, name, path FROM file WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Domain.Entities.File>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationDocumentType with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationDocumentType", ex);
            }
        }

        public async Task<byte[]> GetByPath(string path)
        {
            var fullPath = _appEnvironment.ContentRootPath + BaseDirectory + path;
            byte[] result = new byte[0];
            if (System.IO.File.Exists(fullPath))
            {
                var stream = System.IO.File.OpenRead(fullPath);
                result = new byte[stream.Length];
                stream.Read(result);
            }
            return result;
        }

        public string GetFullPath(string path)
        {
            var fullPath = _appEnvironment.ContentRootPath + BaseDirectory + path;
            return fullPath;
        }

        public Domain.Entities.File AddDocument(Domain.Entities.File dto)
        {
            var fileName = Guid.NewGuid().ToString();
            if (!Directory.Exists(_appEnvironment.ContentRootPath + BaseDirectory))
            {
                Directory.CreateDirectory(_appEnvironment.ContentRootPath + BaseDirectory);
            }
            string path = BaseDirectory + fileName;

            var appPath = _appEnvironment.ContentRootPath + path;

            System.IO.File.WriteAllBytes(path: appPath, dto.body);
            dto.path = fileName;

            return dto;
        }

        public Domain.Entities.File UpdateDocumentFilePath(Domain.Entities.File dto)
        {
            if (!Directory.Exists(_appEnvironment.ContentRootPath + BaseDirectory))
            {
                Directory.CreateDirectory(_appEnvironment.ContentRootPath + BaseDirectory);
            }
            string path = BaseDirectory + dto.path;

            var appPath = _appEnvironment.ContentRootPath + path;
            System.IO.File.WriteAllBytes(path: appPath, dto.body);
            return dto;
        }

        public async Task<int> AddSign(Domain.Entities.FileSign dto)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                dto.user_id = userId;

                var sql = "INSERT INTO file_sign(user_full_name, sign_hash, sign_timestamp, pin_user, file_id, user_id, timestamp, employee_id, structure_employee_id, employee_fullname, structure_fullname, file_type_id, cabinet_file_id) VALUES (@user_full_name, @sign_hash, @sign_timestamp, @pin_user, @file_id, @user_id, @timestamp, @employee_id, @structure_employee_id, @employee_fullname, @structure_fullname ,@file_type_id, @cabinet_file_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, dto, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationDocumentType", ex);
            }
        }


        public async Task<int> Add(Domain.Entities.File dto)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new FileModel
                {
                    name = dto.name,
                    path = dto.path,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = "INSERT INTO file(name, path, created_at, updated_at, created_by, updated_by) VALUES (@name, @path, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationDocumentType", ex);
            }
        }
        
        public async Task<int> AddHistoryLog(FileHistoryLog dto)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                await FillLogDataHelper.FillLogDataCreate(dto, userId);

                var sql = "INSERT INTO file_history_log (entity_name, entity_id, action, file_id, created_by, created_at) VALUES (@entity_name, @entity_id, @action, @file_id, @created_by, @created_at) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, dto, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationDocumentType", ex);
            }
        }
        

        public async Task<int> Update(Domain.Entities.File dto)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new FileModel
                {
                    name = dto.name,
                    path = dto.path,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"UPDATE file SET name = @name, path = @path, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationDocumentType", ex);
            }
        }

        public async Task<List<PaymentRecord>> ReadPaymentRecords(MemoryStream stream)
        {
            return ExcelHelper.ReadPaymentRecords(stream);
        }

        public async Task<List<PaymentRecordMbank>> ReadPaymentMbankRecords(MemoryStream stream)
        {
            return ExcelHelper.ReadPaymentMbankRecords(stream);
        }
    }
}
