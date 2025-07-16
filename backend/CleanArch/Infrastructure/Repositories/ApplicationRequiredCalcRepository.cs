using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class ApplicationRequiredCalcRepository : IApplicationRequiredCalcRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public ApplicationRequiredCalcRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<ApplicationRequiredCalc>> GetAll()
        {
            try
            {
                var sql = @"SELECT arc.id,
       arc.application_id,
       arc.application_step_id,
       arc.structure_id,
       a.number AS application_number,
       ps.name  AS path_step_name,
       os.name  AS structure_name
FROM application_required_calc arc
         LEFT JOIN application a ON arc.application_id = a.id
         LEFT JOIN application_step ""as"" ON arc.application_step_id = ""as"".id
         LEFT JOIN path_step ps ON ""as"".step_id = ps.id
         LEFT JOIN org_structure os ON arc.structure_id = os.id";
                var models = await _dbConnection.QueryAsync<ApplicationRequiredCalc>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationRequiredCalc", ex);
            }
        }

        public async Task<ApplicationRequiredCalc> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, application_id, application_step_id, structure_id FROM application_required_calc WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<ApplicationRequiredCalc>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"ApplicationRequiredCalc with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationRequiredCalc", ex);
            }
        }

        public async Task<int> Add(ApplicationRequiredCalc domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO application_required_calc (application_id, application_step_id, structure_id) 
                            VALUES (@application_id, @application_step_id, @structure_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add ApplicationRequiredCalc", ex);
            }
        }

        public async Task Update(ApplicationRequiredCalc domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE application_required_calc SET application_id = @application_id, application_step_id = @application_step_id, structure_id = @structure_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update ApplicationRequiredCalc", ex);
            }
        }

        public async Task<PaginatedList<ApplicationRequiredCalc>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM application_required_calc OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<ApplicationRequiredCalc>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM application_required_calc";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<ApplicationRequiredCalc>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get ApplicationRequiredCalc", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM application_required_calc WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("ApplicationRequiredCalc not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete ApplicationRequiredCalc", ex);
            }
        }

        public async Task<List<ApplicationRequiredCalc>> GetByApplicationId(int id)
        {
            try
            {
                var sql = @"SELECT arc.id,
       arc.application_id,
       arc.application_step_id,
       arc.structure_id,
       a.number AS application_number,
       ps.name  AS path_step_name,
       os.name  AS structure_name
FROM application_required_calc arc
         LEFT JOIN application a ON arc.application_id = a.id
         LEFT JOIN application_step ""as"" ON arc.application_step_id = ""as"".id
         LEFT JOIN path_step ps ON ""as"".step_id = ps.id
         LEFT JOIN org_structure os ON arc.structure_id = os.id 
WHERE arc.application_id=@Id";
                var models = await _dbConnection.QueryAsync<ApplicationRequiredCalc>(sql, new { Id = id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to GetByApplicationId ApplicationRequiredCalc", ex);
            }
        }
    }
}
