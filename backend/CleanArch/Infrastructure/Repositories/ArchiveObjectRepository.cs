
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
    public class ArchiveObjectRepository : IArchiveObjectRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public ArchiveObjectRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ArchiveObject>> GetAll()
        {
            try
            {
                var sql = "SELECT id, doc_number, address, customer, latitude, longitude, description FROM dutyplan_object";
                var models = await _dbConnection.QueryAsync<ArchiveObject>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObject", ex);
            }
        }

        public async Task<List<ArchiveObject>> Search(string? number, double? latitude, double? longitude, double? radius)
        {
            try
            {
                string sql = @"WITH exploded AS (SELECT dpo.id,
                                     dpo.doc_number,
                                     dpo.address,
                                     dpo.latitude,
                                     dpo.longitude,
                                     dpo.layer,
                                     dpo.description,
                                     af.archive_folder_name,
                                     aof.name,
                                     jsonb_array_elements(dpo.layer) AS feature
                              FROM dutyplan_object dpo
                                       LEFT JOIN archive_folder af ON dpo.id = af.dutyplan_object_id
                                       LEFT JOIN archive_object_file aof ON af.id = aof.archive_folder_id)
                            SELECT exploded.id,
                                   exploded.doc_number,
                                   exploded.address,
                                   exploded.latitude,
                                   exploded.longitude,
                                   exploded.layer,
                                   exploded.description,
                                   jsonb_agg(
                                           jsonb_build_object(
                                                   'folder_name', archive_folder_name,
                                                   'file_name', name
                                           )
                                   ) AS archive_folders
                            FROM exploded
                            WHERE
                                ((feature->'geometry'->>'type') = 'Point' AND
                                (
                                    6371000 * acos(
                                        cos(radians(@latitude)) * cos(radians((feature->'geometry'->'coordinates'->>1)::float)) *
                                        cos(radians((feature->'geometry'->'coordinates'->>0)::float) - radians(@longitude)) +
                                        sin(radians(@latitude)) * sin(radians((feature->'geometry'->'coordinates'->>1)::float))
                                    )
                                ) <= @radius
                                AND (@number IS NULL OR doc_number ILIKE @number))
                                OR (@latitude = 0 AND @longitude = 0 AND doc_number ILIKE @number)
                            GROUP BY exploded.id,
                                     exploded.doc_number,
                                     exploded.address,
                                     exploded.latitude,
                                     exploded.longitude,
                                     exploded.layer,
                                     exploded.description";

                var parameters = new
                {
                    number = string.IsNullOrEmpty(number) ? null : $"%{number}%",
                    latitude,
                    longitude,
                    radius
                };

                var models =
                    await _dbConnection.QueryAsync<ArchiveObject>(sql, parameters, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObject", ex);
            }
        }

        public async Task<List<ArchiveObject>> SearchByNumber(string number)
        {
            try
            {
                var sql = @"
SELECT obj.*, proc.id archirecture_process_id, st.id archirecture_process_status_id, st.name archirecture_process_status_name, st.code archirecture_process_status_code FROM dutyplan_object obj
    left join application_duty_object adp on adp.dutyplan_object_id = obj.id
    left join architecture_process proc on proc.id = adp.application_id
    left join architecture_status st on st.id = proc.status_id
    where lower(obj.doc_number) like '%' || @number || '%'
";
                var models = await _dbConnection.QueryAsync<ArchiveObject>(sql, new { number = number?.ToLower() }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObject", ex);
            }
        }
        public async Task<List<ArchiveObject>> GetArchiveObjectsFromApplication()
        {
            try
            {
                var sql = @"
SELECT obj.*, proc.id archirecture_process_id, st.id archirecture_process_status_id, st.name archirecture_process_status_name, st.code archirecture_process_status_code FROM dutyplan_object obj
    left join application_duty_object adp on adp.dutyplan_object_id = obj.id
    left join architecture_process proc on proc.id = adp.application_id
    left join architecture_status st on st.id = proc.status_id
    where st.id is not null and st.code != 'archived'
";
                var models = await _dbConnection.QueryAsync<ArchiveObject>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObject", ex);
            }
        }

        public async Task<ArchiveObject> GetOneByID(int id)
        {
            try
            {
                var sql = @"
SELECT obj.*, proc.id archirecture_process_id, st.id archirecture_process_status_id, st.name archirecture_process_status_name, st.code archirecture_process_status_code FROM dutyplan_object obj
    left join application_duty_object adp on adp.dutyplan_object_id = obj.id
    left join architecture_process proc on proc.id = adp.application_id
    left join architecture_status st on st.id = proc.status_id
    where obj.id=@Id
    limit 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ArchiveObject>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ArchiveObject with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObject", ex);
            }
        }


        public async Task<ArchiveObject> GetOneByProcessId(int process_id)
        {
            try
            {
                var sql = @"
SELECT obj.*, proc.id archirecture_process_id, st.id archirecture_process_status_id, st.name archirecture_process_status_name, st.code archirecture_process_status_code FROM dutyplan_object obj
    left join application_duty_object adp on adp.dutyplan_object_id = obj.id
    left join architecture_process proc on proc.id = adp.application_id
    left join architecture_status st on st.id = proc.status_id
    where proc.id = @process_id
    limit 1";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ArchiveObject>(sql, new { process_id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ArchiveObject with ID {process_id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObject", ex);
            }
        }
        public async Task<List<ArchiveObject>> GetListByIDs(List<int?> ids)
        {
            try
            {
                var sql = "SELECT id, doc_number, address, customer, latitude, longitude, layer, description FROM dutyplan_object WHERE id = ANY(@Ids)";
                var models = await _dbConnection.QueryAsync<ArchiveObject>(sql, new { Ids = ids.ToArray() }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObject", ex);
            }
        }
        public async Task<List<ArchiveObject>> GetChildObjects(int id)
        {
            try
            {
                var sql = @"
SELECT obj.*, proc.id archirecture_process_id, st.id archirecture_process_status_id, st.name archirecture_process_status_name, st.code archirecture_process_status_code FROM dutyplan_object obj
    left join application_duty_object adp on adp.dutyplan_object_id = obj.id
    left join architecture_process proc on proc.id = adp.application_id
    left join architecture_status st on st.id = proc.status_id
    where obj.parent_id = @id
";
                var models = await _dbConnection.QueryAsync<ArchiveObject>(sql, new { id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObject", ex);
            }
        }

        public async Task<int> Add(ArchiveObject domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchiveObject
                {
                    doc_number = domain.doc_number,
                    address = domain.address,
                    parent_id = domain.parent_id,
                    customer = domain.customer,
                    latitude = domain.latitude,
                    longitude = domain.longitude,
                    layer = domain.layer,
                    description = domain.description,
                    date_setplan = domain.date_setplan,
                    status_dutyplan_object_id = domain.status_dutyplan_object_id,
                    quantity_folder = domain.quantity_folder
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var isPostgres = _dbConnection.GetType().Name.Contains("NpgsqlConnection", StringComparison.OrdinalIgnoreCase);
                var layer = isPostgres ? "@layer::jsonb" : "@layer";

                var sql = $"INSERT INTO dutyplan_object(doc_number, address, customer, latitude, longitude, layer, created_at, updated_at, created_by, updated_by, description, date_setplan, status_dutyplan_object_id, quantity_folder, parent_id) VALUES (@doc_number, @address, @customer, @latitude, @longitude, {layer}, @created_at, @updated_at, @created_by, @updated_by, @description, @date_setplan, @status_dutyplan_object_id, @quantity_folder, @parent_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ArchiveObject", ex);
            }
        }

        public async Task Update(ArchiveObject domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new ArchiveObject
                {
                    id = domain.id,
                    doc_number = domain.doc_number,
                    description = domain.description,
                    address = domain.address,
                    customer = domain.customer,
                    latitude = domain.latitude,
                    longitude = domain.longitude,
                    layer = domain.layer,
                    date_setplan = domain.date_setplan,
                    status_dutyplan_object_id = domain.status_dutyplan_object_id,
                    quantity_folder = domain.quantity_folder,
                    parent_id = domain.parent_id,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var isPostgres = _dbConnection.GetType().Name.Contains("NpgsqlConnection", StringComparison.OrdinalIgnoreCase);
                var layer = isPostgres ? "@layer::jsonb" : "@layer";

                var sql = $"UPDATE dutyplan_object SET doc_number = @doc_number, address = @address, customer = @customer, latitude = @latitude, longitude = @longitude, layer = {layer}, updated_at = @updated_at, updated_by = @updated_by, description = @description, date_setplan = @date_setplan, status_dutyplan_object_id = @status_dutyplan_object_id, quantity_folder = @quantity_folder, parent_id = @parent_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ArchiveObject", ex);
            }
        }

        public async Task<PaginatedList<ArchiveObject>> GetPaginated(ArchiveObjectFilter filter)
        {
            try
            {
                var sql = @"
      SELECT ao.*,
                   proc.id AS archirecture_process_id,
                   st.id AS archirecture_process_status_id,
                   st.name AS archirecture_process_status_name,
                   st.code AS archirecture_process_status_code,
                   (SELECT STRING_AGG(c.full_name, ', ') 
                    FROM archive_object_customer aoc 
                    JOIN customers_for_archive_object c ON aoc.customer_id = c.id 
                    WHERE aoc.archive_object_id = ao.id) AS customer_name,
                   (SELECT STRING_AGG(c.pin, ', ') 
                    FROM archive_object_customer aoc 
                    JOIN customers_for_archive_object c ON aoc.customer_id = c.id 
                    WHERE aoc.archive_object_id = ao.id) AS customer_pin,
					(SELECT STRING_AGG(c.dp_outgoing_number, ', ') 
                    FROM archive_object_customer aoc 
                    JOIN customers_for_archive_object c ON aoc.customer_id = c.id 
                    WHERE aoc.archive_object_id = ao.id) AS customer_number,
					ot.description as tag_description,
					ot.name as tag_name
            FROM dutyplan_object ao
            LEFT JOIN application_duty_object adp ON adp.dutyplan_object_id = ao.id
            LEFT JOIN architecture_process proc ON proc.id = adp.application_id
            LEFT JOIN architecture_status st ON st.id = proc.status_id
	left join application a on a.id = proc.id
			left join object_tag ot on ot.id = a.object_tag_id
        ";

                var parameters = new DynamicParameters();
                var whereClauses = new List<string>();
                var whereDates = new List<string>();

                if (!string.IsNullOrWhiteSpace(filter.search))
                {
                    whereClauses.Add("ao.doc_number ILIKE @Search");
                    whereClauses.Add("ao.address ILIKE @Search");
                    whereClauses.Add("ao.customer ILIKE @Search");
                    whereClauses.Add("ao.description ILIKE @Search");
                    whereClauses.Add("EXISTS (SELECT 1 FROM archive_object_customer aoc JOIN customers_for_archive_object c ON aoc.customer_id = c.id WHERE aoc.archive_object_id = ao.id AND c.full_name ILIKE @Search)");
                    whereClauses.Add("EXISTS (SELECT 1 FROM archive_object_customer aoc JOIN customers_for_archive_object c ON aoc.customer_id = c.id WHERE aoc.archive_object_id = ao.id AND c.pin ILIKE @Search)");

                    parameters.Add("Search", $"%{filter.search}%");
                }
                
                if (filter.created_at_from.HasValue)
                {
                    whereDates.Add("ao.created_at >= @CreatedAtFrom");
                    parameters.Add("CreatedAtFrom", filter.created_at_from.Value.Date);
                }
                if (filter.created_at_to.HasValue)
                {
                    whereDates.Add("ao.created_at <= @CreatedAtTo");
                    parameters.Add("CreatedAtTo", filter.created_at_to.Value.Date);
                }
                if (filter.updated_at_from.HasValue)
                {
                    whereDates.Add("ao.updated_at >= @UpdatedAtFrom");
                    parameters.Add("UpdatedAtFrom", filter.updated_at_from.Value.Date);
                }
                if (filter.updated_at_to.HasValue)
                {
                    whereDates.Add("ao.updated_at <= @UpdatedAtTo");
                    parameters.Add("UpdatedAtTo", filter.updated_at_to.Value.Date);
                }
                
                if (whereDates.Any())
                {
                    whereClauses.Add(string.Join(" AND ", whereDates));
                }

                if (whereClauses.Any())
                {
                    sql += " WHERE " + string.Join(" OR ", whereClauses);
                }

                sql += " ORDER BY ao.id DESC OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";
                parameters.Add("Offset", filter.pageSize * (filter.pageNumber - 1));
                parameters.Add("PageSize", filter.pageSize);

                var models = await _dbConnection.QueryAsync<ArchiveObject>(sql, parameters, transaction: _dbTransaction);

                var countSql = @"
            SELECT COUNT(*)
            FROM archive_object ao
        ";

                if (!string.IsNullOrWhiteSpace(filter.search))
                {
                    countSql += " WHERE " + string.Join(" OR ", whereClauses);
                }

                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(countSql, parameters, transaction: _dbTransaction);

                return new PaginatedList<ArchiveObject>(models.ToList(), totalItems, filter.pageNumber, filter.pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ArchiveObject", ex);
            }
        }


        public async Task Delete(int id)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var sql = "DELETE FROM dutyplan_object WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ArchiveObject not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ArchiveObject", ex);
            }
        }
    }
}
