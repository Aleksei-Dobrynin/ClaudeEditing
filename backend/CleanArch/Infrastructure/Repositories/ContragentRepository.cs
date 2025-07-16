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
    public class contragentRepository : IcontragentRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;
        
        public contragentRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<contragent>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""contragent""";
                var models = await _dbConnection.QueryAsync<contragent>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent", ex);
            }
        }

        public async Task<int> Add(contragent domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new contragentModel
                {
                    id = domain.id,
                    name = domain.name,
                    address = domain.address,
                    contacts = domain.contacts,
                    user_id = domain.user_id,
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO ""contragent""(""name"", ""address"", ""contacts"", ""user_id"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"") 
                VALUES (@name, @address, @contacts, @user_id, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add contragent", ex);
            }
        }

        public async Task Update(contragent domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new contragentModel
                {

                    id = domain.id,
                    name = domain.name,
                    address = domain.address,
                    contacts = domain.contacts,
                    user_id = domain.user_id,
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE ""contragent"" SET ""id"" = @id, ""name"" = @name, ""address"" = @address, ""contacts"" = @contacts, ""user_id"" = @user_id, ""updated_at"" = @updated_at, ""updated_by"" = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update contragent", ex);
            }
        }

        public async Task<PaginatedList<contragent>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""contragent"" OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<contragent>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT Count(*) FROM ""contragent""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<contragent>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragents", ex);
            }
        }
        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id };
                var sql = @"DELETE FROM ""contragent"" WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update contragent", ex);
            }
        }
        public async Task<contragent> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""contragent"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<contragent>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get contragent", ex);
            }
        }


    }
}
