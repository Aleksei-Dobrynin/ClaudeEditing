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
    public class ArchiveObjectsEventsRepository : IArchiveObjectsEventsRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public ArchiveObjectsEventsRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ArchiveObjectsEvents>> GetAll()
        {
            try
            {
                var sql = "SELECT * FROM archive_objects_events";
                var models = await _dbConnection.QueryAsync<ArchiveObjectsEvents>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObjectsEvents", ex);
            }
        }

        public async Task<ArchiveObjectsEvents> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT * FROM archive_objects_events WHERE id = @Id LIMIT 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ArchiveObjectsEvents>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ArchiveObjectsEvents with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObjectsEvents", ex);
            }
        }

        public async Task<List<ArchiveObjectsEvents>> GetByObjectId(int archiveObjectId)
        {
            try
            {
                var sql = @"SELECT aoe.*, concat(e.last_name, ' ', e.first_name) as employee_name, os.name as structure_name, et.name as event_type_name
                            FROM archive_objects_events aoe
                            left join employee_in_structure eis on eis.id = aoe.employee_id
                            left join employee e on e.id = eis.employee_id
                            left join org_structure os on os.id = aoe.structure_id
                            left join event_type et on et.id = aoe.event_type_id
                           WHERE archive_object_id = @ArchiveObjectId 
                           ORDER BY event_date DESC";
                var models = await _dbConnection.QueryAsync<ArchiveObjectsEvents>(
                    sql,
                    new { ArchiveObjectId = archiveObjectId },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to get ArchiveObjectsEvents by archive_object_id {archiveObjectId}", ex);
            }
        }

        public async Task<List<ArchiveObjectsEvents>> GetByEventTypeId(int eventTypeId)
        {
            try
            {
                var sql = @"SELECT * FROM archive_objects_events 
                           WHERE event_type_id = @EventTypeId 
                           ORDER BY event_date DESC";
                var models = await _dbConnection.QueryAsync<ArchiveObjectsEvents>(
                    sql,
                    new { EventTypeId = eventTypeId },
                    transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to get ArchiveObjectsEvents by event_type_id {eventTypeId}", ex);
            }
        }

        public async Task<PaginatedList<ArchiveObjectsEvents>> GetByObjectIdPaginated(int archiveObjectId, int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM archive_objects_events 
                           WHERE archive_object_id = @ArchiveObjectId 
                           ORDER BY event_date DESC
                           OFFSET @pageSize * (@pageNumber - 1) 
                           LIMIT @pageSize";
                var models = await _dbConnection.QueryAsync<ArchiveObjectsEvents>(
                    sql,
                    new { ArchiveObjectId = archiveObjectId, pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = @"SELECT COUNT(*) FROM archive_objects_events 
                                WHERE archive_object_id = @ArchiveObjectId";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(
                    sqlCount,
                    new { ArchiveObjectId = archiveObjectId },
                    transaction: _dbTransaction);

                var domainItems = models.ToList();
                return new PaginatedList<ArchiveObjectsEvents>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to get paginated ArchiveObjectsEvents by archive_object_id {archiveObjectId}", ex);
            }
        }

        public async Task<PaginatedList<ArchiveObjectsEvents>> GetByEventTypeIdPaginated(int eventTypeId, int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM archive_objects_events 
                           WHERE event_type_id = @EventTypeId 
                           ORDER BY event_date DESC
                           OFFSET @pageSize * (@pageNumber - 1) 
                           LIMIT @pageSize";
                var models = await _dbConnection.QueryAsync<ArchiveObjectsEvents>(
                    sql,
                    new { EventTypeId = eventTypeId, pageSize, pageNumber },
                    transaction: _dbTransaction);

                var sqlCount = @"SELECT COUNT(*) FROM archive_objects_events 
                                WHERE event_type_id = @EventTypeId";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(
                    sqlCount,
                    new { EventTypeId = eventTypeId },
                    transaction: _dbTransaction);

                var domainItems = models.ToList();
                return new PaginatedList<ArchiveObjectsEvents>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Failed to get paginated ArchiveObjectsEvents by event_type_id {eventTypeId}", ex);
            }
        }

        public async Task<int> Add(ArchiveObjectsEvents domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchiveObjectsEvents
                {
                    description = domain.description,
                    employee_id = domain.employee_id,
                    head_structure_id = domain.head_structure_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    archive_object_id = domain.archive_object_id,
                    event_type_id = domain.event_type_id,
                    event_date = domain.event_date,
                    structure_id = domain.structure_id,
                    application_id = domain.application_id,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO archive_objects_events(description,employee_id,head_structure_id,created_at,updated_at,created_by,updated_by,archive_object_id,event_type_id,event_date,structure_id,application_id) 
                           VALUES (@description,@employee_id,@head_structure_id,@created_at,@updated_at,@created_by,@updated_by,@archive_object_id,@event_type_id,@event_date,@structure_id,@application_id) 
                           RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ArchiveObjectsEvents", ex);
            }
        }

        public async Task Update(ArchiveObjectsEvents domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchiveObjectsEvents
                {
                    id = domain.id,
                    description = domain.description,
                    employee_id = domain.employee_id,
                    head_structure_id = domain.head_structure_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    archive_object_id = domain.archive_object_id,
                    event_type_id = domain.event_type_id,
                    event_date = domain.event_date,
                    structure_id = domain.structure_id,
                    application_id = domain.application_id,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);

                var sql = @"UPDATE archive_objects_events SET 
                           description = @description,
                           employee_id = @employee_id,
                           head_structure_id = @head_structure_id,
                           created_at = @created_at,
                           updated_at = @updated_at,
                           created_by = @created_by,
                           updated_by = @updated_by,
                           archive_object_id = @archive_object_id,
                           event_type_id = @event_type_id,
                           event_date = @event_date,
                           structure_id = @structure_id,
                           application_id = @application_id 
                           WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ArchiveObjectsEvents", ex);
            }
        }

        public async Task<PaginatedList<ArchiveObjectsEvents>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM archive_objects_events OFFSET @pageSize * (@pageNumber - 1) LIMIT @pageSize";
                var models = await _dbConnection.QueryAsync<ArchiveObjectsEvents>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT COUNT(*) FROM archive_objects_events";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ArchiveObjectsEvents>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObjectsEvents", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM archive_objects_events WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ArchiveObjectsEvents not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ArchiveObjectsEvents", ex);
            }
        }
    }
}