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
    public class ArchiveLogRepository : IArchiveLogRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public ArchiveLogRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ArchiveLog>> GetAll()
        {
            try
            {
                var sql = @"SELECT DISTINCT ON (al.id) al.id,
                               al.created_at,
                               al.updated_at,
                               al.created_by,
                               concat(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) created_by_name,
                               al.updated_by,
                               concat(emp_u.last_name, ' ', emp_u.first_name, ' ', emp_u.second_name) updated_by_name,
                               doc_number,
                               address,
                               status_id,
                               date_take,
                               als.name                                                      status_name,
                               date_return,
                               take_structure_id,
                               ost.name                                                      take_structure_name,
                               take_employee_id,
                               concat(et.last_name, ' ', et.first_name, ' ', et.second_name) take_employee_name,
                               return_structure_id,
                               osr.name                                                      return_structure_name,
                               return_employee_id,
                               concat(er.last_name, ' ', er.first_name, ' ', er.second_name) return_employee_name,
                               deadline
                        FROM archive_log al
                                 left join archive_log_status als on als.id = al.status_id
                                 left join org_structure ost on ost.id = al.take_structure_id
                                 left join org_structure osr on ost.id = al.return_structure_id
                                 left join employee et on et.id = al.take_employee_id
                                 left join employee er on er.id = al.return_employee_id
                                 left join ""User"" uc on uc.id = al.created_by
                                 left join employee emp_c on emp_c.user_id = uc.""userId""
                                 left join ""User"" uu on uu.id = al.updated_by
                                 left join employee emp_u on emp_u.user_id = uu.""userId"" 
                                 ORDER BY al.id, al.created_at DESC
                                 ";
                var models = await _dbConnection.QueryAsync<ArchiveLog>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveLog", ex);
            }
        }

        public async Task<ArchiveLog> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT id, created_at, updated_at, created_by, updated_by, doc_number, address, status_id, 
                            date_return, take_structure_id, take_employee_id, return_structure_id, return_employee_id, archive_folder_id,
                            date_take, name_take, deadline, is_group, parent_id FROM archive_log WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ArchiveLog>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ArchiveLog with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveLog", ex);
            }
        }
        
        public async Task<List<ArchiveLog>> GetGroupByParentID(int id)
        {
            var result = new List<ArchiveLog>();
            try
            {
                var sql = @"SELECT id, created_at, updated_at, created_by, updated_by, doc_number, address, status_id, 
                            date_return, take_structure_id, take_employee_id, return_structure_id, return_employee_id,
                            date_take, name_take, deadline, is_group, parent_id, archive_object_id FROM archive_log WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ArchiveLog>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ArchiveLog with ID {id} not found.", null);
                }
                result.Add(model);
                var sqlChildren = @"SELECT id, created_at, updated_at, created_by, updated_by, doc_number, address, status_id, 
                            date_return, take_structure_id, take_employee_id, return_structure_id, return_employee_id,
                            date_take, name_take, deadline, is_group, parent_id, archive_object_id FROM archive_log WHERE parent_id=@ParentId";
                var modelChildren = await _dbConnection.QueryAsync<ArchiveLog>(sqlChildren, new { ParentId = id }, transaction: _dbTransaction);
                result.AddRange(modelChildren);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveLog", ex);
            }
        }

        public async Task<List<ArchiveLog>> GetByFilter(ArchiveLogFilter filter)
        {
            try
            {
                var sql = @"SELECT DISTINCT ON (al.id) al.id,
                               al.created_at,
                               al.updated_at,
                               al.created_by,
                               concat(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) created_by_name,
                               al.updated_by,
                               concat(emp_u.last_name, ' ', emp_u.first_name, ' ', emp_u.second_name) updated_by_name,
                               doc_number,
                               address,
                               status_id,
                               date_take,
                               als.name                                                      status_name,
                               date_return,
                               take_structure_id,
                               ost.name                                                      take_structure_name,
                               take_employee_id,
                               concat(et.last_name, ' ', et.first_name, ' ', et.second_name) take_employee_name,
                               return_structure_id,
                               osr.name                                                      return_structure_name,
                               return_employee_id,
                               concat(er.last_name, ' ', er.first_name, ' ', er.second_name) return_employee_name,
                               deadline
                        FROM archive_log al
                                 left join archive_log_status als on als.id = al.status_id
                                 left join org_structure ost on ost.id = al.take_structure_id
                                 left join org_structure osr on ost.id = al.return_structure_id
                                 left join employee et on et.id = al.take_employee_id
                                 left join employee er on er.id = al.return_employee_id
                                 left join ""User"" uc on uc.id = al.created_by
                                 left join employee emp_c on emp_c.user_id = uc.""userId""
                                 left join ""User"" uu on uu.id = al.updated_by
                                 left join employee emp_u on emp_u.user_id = uu.""userId""
                              WHERE 1=1";
                
                var parameters = new DynamicParameters();
                
                if (!string.IsNullOrWhiteSpace(filter.doc_number))
                {
                    sql += " AND al.doc_number ILIKE @DocNumber";
                    parameters.Add("DocNumber", $"%{filter.doc_number}%");
                }
                if (filter.employee_id > 0)
                {
                    sql += " AND (et.id = @EmployeeID OR er.id = @EmployeeID)";
                    parameters.Add("EmployeeID", filter.employee_id);
                }
                sql += " ORDER BY al.id, al.created_at";
                
                var models = await _dbConnection.QueryAsync<ArchiveLog>(sql, parameters, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveLog", ex);
            }
        }

        public async Task<int> Add(ArchiveLog domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchiveLog
                {
                    doc_number = domain.doc_number,
                    address = domain.address,
                    status_id = domain.status_id,
                    date_return = domain.date_return,
                    take_structure_id = domain.take_structure_id,
                    take_employee_id = domain.take_employee_id,
                    return_structure_id = domain.return_structure_id,
                    return_employee_id = domain.return_employee_id,
                    date_take = domain.date_take,
                    name_take = domain.name_take,
                    deadline = domain.deadline,
                    archive_object_id = domain.archive_object_id,
                    is_group = domain.is_group,
                    parent_id = domain.parent_id,
                    archive_folder_id = domain.archive_folder_id,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO archive_log(created_at, created_by, updated_at, updated_by, doc_number, address, 
                        status_id, date_return, take_structure_id, take_employee_id, return_structure_id, return_employee_id, date_take, name_take, archive_object_id, is_group, deadline, parent_id, archive_folder_id) VALUES 
                    (@created_at, @created_by, @updated_at, @updated_by, @doc_number, @address, 
                        @status_id, @date_return, @take_structure_id, @take_employee_id, @return_structure_id, @return_employee_id, @date_take, @name_take, @archive_object_id, @is_group, @deadline, @parent_id, @archive_folder_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ArchiveLog", ex);
            }
        }

        public async Task<int> ChangeStatus(int archive_log_id, int status_id)
        {
            var sql = @"UPDATE archive_log SET status_id = @StatusId WHERE id = @ArchiveLogId";

            await _dbConnection.ExecuteAsync(sql, new { ArchiveLogId = archive_log_id, StatusId = status_id }, transaction: _dbTransaction);

            return archive_log_id;
        }

        public async Task Update(ArchiveLog domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchiveLog
                {
                    id = domain.id,
                    doc_number = domain.doc_number,
                    address = domain.address,
                    status_id = domain.status_id,
                    date_return = domain.date_return,
                    take_structure_id = domain.take_structure_id,
                    take_employee_id = domain.take_employee_id,
                    return_structure_id = domain.return_structure_id,
                    return_employee_id = domain.return_employee_id,
                    date_take = domain.date_take,
                    name_take = domain.name_take,
                    deadline = domain.deadline,
                    archive_folder_id = domain.archive_folder_id,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE archive_log SET updated_at = @updated_at, updated_by = @updated_by, 
                       doc_number = @doc_number, address = @address, status_id = @status_id, date_return = @date_return, 
                       take_structure_id = @take_structure_id, take_employee_id = @take_employee_id, 
                       return_structure_id = @return_structure_id, return_employee_id = @return_employee_id,
                       date_take = @date_take, name_take = @name_take, deadline = @deadline, archive_folder_id = @archive_folder_id
                   WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ArchiveLog", ex);
            }
        }

        public async Task<PaginatedList<ArchiveLog>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM archive_log OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ArchiveLog>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM archive_log";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ArchiveLog>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveLog", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM archive_log WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ArchiveLog not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ArchiveLog", ex);
            }
        }
    }
}
