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
    public class architecture_processRepository : Iarchitecture_processRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;

        public architecture_processRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<architecture_process>> GetAll()
        {
            try
            {
                var sql = @"
SELECT 
    proc.*, st.id archirecture_process_status_id,
    st.name archirecture_process_status_name, st.code archirecture_process_status_code, st.text_color archirecture_process_status_text_color, st.background_color archirecture_process_status_back_color, 
    app.number app_number,
    duty.id arch_object_id, duty.doc_number arch_object_number, duty.address arch_object_address
FROM architecture_process proc
    left join architecture_status st on st.id = proc.status_id
    left join application app on app.id = proc.id
    left join application_duty_object ado on ado.application_id = proc.id
    left join dutyplan_object duty on duty.id = ado.dutyplan_object_id
    where st.code != 'archived'
    order by proc.created_at desc
";
                var models = await _dbConnection.QueryAsync<architecture_process>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get architecture_process", ex);
            }
        }
        public async Task<List<architecture_process>> GetAllToArchive()
        {
            try
            {
                var sql = @"
SELECT 
    proc.*, st.id archirecture_process_status_id,
    st.name archirecture_process_status_name, st.code archirecture_process_status_code, st.text_color archirecture_process_status_text_color, st.background_color archirecture_process_status_back_color, 
    app.number app_number,
    duty.id arch_object_id, duty.doc_number arch_object_number, duty.address arch_object_address
FROM architecture_process proc
    left join architecture_status st on st.id = proc.status_id
    left join application app on app.id = proc.id
    left join application_duty_object ado on ado.application_id = proc.id
    left join dutyplan_object duty on duty.id = ado.dutyplan_object_id
    where st.code = 'archived' or st.code = 'to_archive'
    order by proc.created_at desc
";
                var models = await _dbConnection.QueryAsync<architecture_process>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get architecture_process", ex);
            }
        }

        public async Task<int> Add(architecture_process domain)
        {
            try
            {
                await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new architecture_processModel
                {

                    id = domain.id,
                    status_id = domain.status_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"INSERT INTO ""architecture_process""(""id"", ""status_id"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@id, @status_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add architecture_process", ex);
            }
        }

        public async Task Update(architecture_process domain)
        {
            try
            {
                await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new architecture_processModel
                {

                    id = domain.id,
                    status_id = domain.status_id,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                };
                var sql = @"UPDATE ""architecture_process"" SET ""id"" = @id, ""status_id"" = @status_id, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update architecture_process", ex);
            }
        }

        public async Task<PaginatedList<architecture_process>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""architecture_process"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<architecture_process>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""architecture_process""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<architecture_process>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get architecture_processs", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new { id = id };
                var sql = @"DELETE FROM ""architecture_process"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update architecture_process", ex);
            }
        }
        public async Task<architecture_process> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""architecture_process"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<architecture_process>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get architecture_process", ex);
            }
        }


        public async Task<List<architecture_process>> GetBystatus_id(int status_id)
        {
            try
            {
                var sql = "SELECT * FROM \"architecture_process\" WHERE \"status_id\" = @status_id";
                var models = await _dbConnection.QueryAsync<architecture_process>(sql, new { status_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get architecture_process", ex);
            }
        }

    }
}
