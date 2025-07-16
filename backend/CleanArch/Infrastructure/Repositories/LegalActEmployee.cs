using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class LegalActEmployeeRepository : ILegalActEmployeeRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;

        public LegalActEmployeeRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<LegalActEmployee>> GetAll()
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_act_employee""";
                var models = await _dbConnection.QueryAsync<LegalActEmployee>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_employee", ex);
            }
        }

        public async Task<int> Add(LegalActEmployee domain)
        {
            try
            {
                var model = new LegalActEmployeeModel
                {
                    isActive = domain.isActive,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    id_act = domain.id_act,
                    id_structure_employee = domain.id_structure_employee
                };
                var sql = @"INSERT INTO ""legal_act_employee""(""is_active"", ""created_at"", ""updated_at"", ""created_by"", ""updated_by"", ""id_act"", ""id_structure_employee"") 
                            VALUES (@isActive, @created_at, @updated_at, @created_by, @updated_by, @id_act, @id_structure_employee) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add legal_act_employee", ex);
            }
        }

        public async Task Update(LegalActEmployee domain)
        {
            try
            {
                var model = new LegalActEmployeeModel
                {
                    id = domain.id,
                    isActive = domain.isActive,
                    created_at = domain.created_at,
                    updated_at = domain.updated_at,
                    created_by = domain.created_by,
                    updated_by = domain.updated_by,
                    id_act = domain.id_act,
                    id_structure_employee = domain.id_structure_employee
                };
                var sql = @"UPDATE ""legal_act_employee"" SET ""is_active"" = @isActive, ""created_at"" = @created_at, ""updated_at"" = @updated_at, ""created_by"" = @created_by, ""updated_by"" = @updated_by, ""id_act"" = @id_act, ""id_structure_employee"" = @id_structure_employee WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update legal_act_employee", ex);
            }
        }

        public async Task<PaginatedList<LegalActEmployee>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_act_employee"" OFFSET @pageSize * (@pageNumber - 1) LIMIT @pageSize;";
                var models = await _dbConnection.QueryAsync<LegalActEmployee>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = @"SELECT COUNT(*) FROM ""legal_act_employee""";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<LegalActEmployee>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_employees", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var model = new { id = id, date = DateTime.Now };
                var sql = @"UPDATE  ""legal_act_employee"" SET ""is_active"" = FALSE, ""updated_at"" = @date WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete legal_act_employee", ex);
            }
        }

        public async Task<LegalActEmployee> GetOne(int id)
        {
            try
            {
                var sql = @"SELECT * FROM ""legal_act_employee"" WHERE id = @id LIMIT 1";
                var models = await _dbConnection.QueryAsync<LegalActEmployee>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_employee", ex);
            }
        }

        public async Task<List<LegalActEmployee>> GetByIdAct(int id_act)
        {
            try
            {
                var sql = "SELECT * FROM \"legal_act_employee\" WHERE \"id_act\" = @id_act AND \"is_active\" IS NOT FALSE";
                var models = await _dbConnection.QueryAsync<LegalActEmployee>(sql, new { id_act }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_employee", ex);
            }
        }

        public async Task<List<LegalActEmployee>> GetByIdStructureEmployee(int id_structure_employee)
        {
            try
            {
                var sql = "SELECT * FROM \"legal_act_employee\" WHERE \"id_structure_employee\" = @id_structure_employee AND \"is_active\" IS NOT FALSE";
                var models = await _dbConnection.QueryAsync<LegalActEmployee>(sql, new { id_structure_employee }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get legal_act_employee", ex);
            }
        }
    }
}