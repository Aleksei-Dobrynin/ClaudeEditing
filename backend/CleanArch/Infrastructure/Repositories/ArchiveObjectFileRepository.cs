using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Infrastructure.FillLogData;

namespace Infrastructure.Repositories
{
    public class ArchiveObjectFileRepository : IArchiveObjectFileRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ArchiveObjectFileRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ArchiveObjectFile>> GetAll()
        {
            try
            {
                var sql = @"select aof.id,
                                   archive_object_id,
                                   file_id,
                                   aof.name,
                                   file.name as file_name
                            from archive_object_file aof
                                     left join file on aof.file_id = file.id";
                var models = await _dbConnection.QueryAsync<ArchiveObjectFile>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObjectFile", ex);
            }
        }

        public async Task<List<ArchiveObjectFile>> GetNotInFolder()
        {
            try
            {
                var sql = @"select aof.id,
                                   archive_object_id,
                                   file_id,
                                   aof.name,
                                   file.name as file_name,
                                   dpo.doc_number as object_number,
                                   dpo.address as object_address
                            from archive_object_file aof
                                     left join file on aof.file_id = file.id
                                     left join dutyplan_object dpo on dpo.id = aof.archive_object_id
                            where aof.archive_folder_id is NULL";

                var models = await _dbConnection.QueryAsync<ArchiveObjectFile>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObjectFile", ex);
            }
        }

        public async Task<List<ArchiveObjectFile>> GetByidArchiveObject(int idArchiveObject)
        {
            try
            {
                var sql = @"select aof.id,
                                   archive_object_id,
                                   file_id,
archive_folder_id,
 fold.archive_folder_name archive_folder_name,
                                   aof.name,
                                   file.name as file_name
                            from archive_object_file aof
                                     left join file on aof.file_id = file.id 
left join archive_folder fold on fold.id = aof.archive_folder_id
                            where archive_object_id=@IDArchiveObject order by aof.id desc";
                var models = await _dbConnection.QueryAsync<ArchiveObjectFile>(sql,
                    new { IDArchiveObject = idArchiveObject }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObjectFile", ex);
            }
        }

        public async Task<List<ArchiveObjectFile>> GetByidArchiveFolder(int idArchiveFolder)
        {
            try
            {
                var sql = @"select aof.id,
                                   archive_object_id,
                                   file_id,
                                   aof.name,
                                   file.name as file_name
                            from archive_object_file aof
                                     left join file on aof.file_id = file.id 
                            where archive_folder_id=@IDArchiveFolder";
                var models = await _dbConnection.QueryAsync<ArchiveObjectFile>(sql,
                    new { idArchiveFolder = idArchiveFolder }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObjectFile", ex);
            }
        }

        public async Task<ArchiveObjectFile> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, archive_object_id, file_id, name FROM archive_object_file WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ArchiveObjectFile>(sql, new { Id = id },
                    transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ArchiveObjectFile with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObjectFile", ex);
            }
        }

        public async Task<int> Add(ArchiveObjectFile domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchiveObjectFile
                {
                    archive_object_id = domain.archive_object_id,
                    file_id = domain.file_id,
                    name = domain.name,
                    archive_folder_id = domain.archive_folder_id
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql =
                    "INSERT INTO archive_object_file(archive_object_id, file_id, name, created_at, updated_at, created_by, updated_by, archive_folder_id) VALUES (@archive_object_id, @file_id, @name, @created_at, @updated_at, @created_by, @updated_by, @archive_folder_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ArchiveObjectFile", ex);
            }
        }

        public async Task Update(ArchiveObjectFile domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchiveObjectFile
                {
                    id = domain.id,
                    archive_object_id = domain.archive_object_id,
                    file_id = domain.file_id,
                    archive_folder_id = domain.archive_folder_id,
                    name = domain.name,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql =
                    "UPDATE archive_object_file SET archive_object_id = @archive_object_id, file_id = @file_id, name = @name, updated_at = @updated_at, updated_by = @updated_by, archive_folder_id = @archive_folder_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ArchiveObjectFile", ex);
            }
        }

        public async Task<PaginatedList<ArchiveObjectFile>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM archive_object_file OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ArchiveObjectFile>(sql, new { pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM archive_object_file";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ArchiveObjectFile>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObjectFile", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var sql = "DELETE FROM archive_object_file WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ArchiveObjectFile not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ArchiveObjectFile", ex);
            }
        }


    }
}