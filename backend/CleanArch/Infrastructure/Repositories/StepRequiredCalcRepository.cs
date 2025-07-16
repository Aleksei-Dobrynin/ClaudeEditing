using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class StepRequiredCalcRepository : IStepRequiredCalcRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public StepRequiredCalcRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<StepRequiredCalc>> GetAll()
        {
            try
            {
                var sql = @"SELECT src.id, src.step_id, src.structure_id, ps.name AS step_name, os.name AS structure_name
FROM step_required_calc src
LEFT JOIN path_step ps on src.step_id = ps.id
LEFT JOIN org_structure os ON src.structure_id = os.id";
                var models = await _dbConnection.QueryAsync<StepRequiredCalc>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StepRequiredCalc", ex);
            }
        }

        public async Task<StepRequiredCalc> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, step_id, structure_id FROM step_required_calc WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<StepRequiredCalc>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"StepRequiredCalc with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StepRequiredCalc", ex);
            }
        }

        public async Task<int> Add(StepRequiredCalc domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO step_required_calc (step_id, structure_id) 
                            VALUES (@step_id, @structure_id) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add StepRequiredCalc", ex);
            }
        }

        public async Task Update(StepRequiredCalc domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE step_required_calc SET step_id = @step_id, structure_id = @structure_id WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update StepRequiredCalc", ex);
            }
        }

        public async Task<PaginatedList<StepRequiredCalc>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM step_required_calc OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<StepRequiredCalc>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM step_required_calc";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<StepRequiredCalc>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StepRequiredCalc", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM step_required_calc WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("StepRequiredCalc not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete StepRequiredCalc", ex);
            }
        }

        public async Task<StepRequiredCalc> GetOneByStepIdAndStructureId(int step_id, int structure_id)
        {
            try
            {
                var sql = "SELECT id, step_id, structure_id FROM step_required_calc WHERE step_id=@StepId AND structure_id=@StructureId";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<StepRequiredCalc>(sql, new { StepId = step_id, StructureId = structure_id }, transaction: _dbTransaction);
                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StepRequiredCalc", ex);
            }
        }
    }
}
