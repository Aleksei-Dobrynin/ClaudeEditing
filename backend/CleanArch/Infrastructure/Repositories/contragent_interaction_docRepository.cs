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
    public class contragent_interaction_docRepository : Icontragent_interaction_docRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public contragent_interaction_docRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<contragent_interaction_doc>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""contragent_interaction_doc""";
                var models = await _dbConnection.QueryAsync<contragent_interaction_doc>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent_interaction_doc", ex);
            }
        }

        public async Task<int> Add(contragent_interaction_doc domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new contragent_interaction_docModel
                {
                    id = domain.id,
                    file_id = domain.file_id,
                    interaction_id = domain.interaction_id,
                    user_id = userId,
                    type_org = domain.type_org,
                    message = domain.message,
                    for_customer = domain.for_customer,
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);

                var sql = @"INSERT INTO ""contragent_interaction_doc""(""file_id"", ""interaction_id"", ""user_id"", ""type_org"", ""message"", for_customer, created_at, updated_at, created_by, updated_by) 
                VALUES (@file_id, @interaction_id, @user_id, @type_org, @message, @for_customer, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add contragent_interaction_doc", ex);
            }
        }

        public async Task Update(contragent_interaction_doc domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new contragent_interaction_docModel
                {
                    
                    id = domain.id,
                    file_id = domain.file_id,
                    interaction_id = domain.interaction_id,
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE ""contragent_interaction_doc"" SET ""id"" = @id, ""file_id"" = @file_id, ""interaction_id"" = @interaction_id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update contragent_interaction_doc", ex);
            }
        }

        public async Task<PaginatedList<contragent_interaction_doc>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""contragent_interaction_doc"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<contragent_interaction_doc>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""contragent_interaction_doc""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<contragent_interaction_doc>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent_interaction_docs", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""contragent_interaction_doc"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update contragent_interaction_doc", ex);
            }
        }
        public async Task<contragent_interaction_doc> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""contragent_interaction_doc"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<contragent_interaction_doc>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent_interaction_doc", ex);
            }
        }

        
        public async Task<List<contragent_interaction_doc>> GetByfile_id(int file_id)
        {
            try
            {
                var sql = "SELECT * FROM \"contragent_interaction_doc\" WHERE \"file_id\" = @file_id";
                var models = await _dbConnection.QueryAsync<contragent_interaction_doc>(sql, new { file_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent_interaction_doc", ex);
            }
        }
        
        public async Task<List<contragent_interaction_doc>> GetByinteraction_id(int interaction_id)
        {
            try
            {
                var sql = @"SELECT doc.*, CONCAT(emp_c.last_name, ' ', emp_c.first_name, ' ', emp_c.second_name) AS user_name,
                                    file.name file_name FROM contragent_interaction_doc doc 
                                    left join file on file.id = doc.file_id
                                    left join ""User"" uc on uc.id = doc.user_id
                                    left join employee emp_c on emp_c.user_id = uc.""userId""                                  
                                  WHERE interaction_id = @interaction_id ORDER BY doc.id";
                var models = await _dbConnection.QueryAsync<contragent_interaction_doc>(sql, new { interaction_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent_interaction_doc", ex);
            }
        }
        
    }
}
