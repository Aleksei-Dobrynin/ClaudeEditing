using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class ApplicationInReestrCalcRepository : IApplicationInReestrCalcRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public ApplicationInReestrCalcRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationInReestrCalc>> GetAll()
        {
            try
            {
                var sql = "SELECT id, app_reestr_id, structure_id, sum, total_sum, total_payed, created_at, created_by, updated_at, updated_by FROM application_in_reestr_calc";
                var models = await _dbConnection.QueryAsync<ApplicationInReestrCalc>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationInReestrCalc", ex);
            }
        }

        public async Task<ApplicationInReestrCalc> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, app_reestr_id, structure_id, sum, total_sum, total_payed, created_at, created_by, updated_at, updated_by FROM application_in_reestr_calc WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationInReestrCalc>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationInReestrCalc with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationInReestrCalc", ex);
            }
        }

        public async Task<int> Add(ApplicationInReestrCalc domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO application_in_reestr_calc (app_reestr_id, structure_id, sum, total_sum, total_payed, created_at, created_by, updated_at, updated_by) 
                            VALUES (@app_reestr_id, @structure_id, @sum, @total_sum, @total_payed, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationInReestrCalc", ex);
            }
        }

        public async Task Update(ApplicationInReestrCalc domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE application_in_reestr_calc SET app_reestr_id = @app_reestr_id, structure_id = @structure_id, sum = @sum, total_sum = @total_sum, total_payed = @total_payed, created_at = @created_at, created_by = @created_by, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationInReestrCalc", ex);
            }
        }

        public async Task<PaginatedList<ApplicationInReestrCalc>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM application_in_reestr_calc OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ApplicationInReestrCalc>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM application_in_reestr_calc";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ApplicationInReestrCalc>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationInReestrCalc", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM application_in_reestr_calc WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationInReestrCalc not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationInReestrCalc", ex);
            }
        }
        
        public async Task DeleteByAppReestrId(int id)
        {
            try
            {
                var sql = "DELETE FROM application_in_reestr_calc WHERE app_reestr_id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationInReestrCalc not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationInReestrCalc", ex);
            }
        }
    }
}
