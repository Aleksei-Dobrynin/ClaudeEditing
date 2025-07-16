using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class TechCouncilParticipantsSettingsRepository : ITechCouncilParticipantsSettingsRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public TechCouncilParticipantsSettingsRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<TechCouncilParticipantsSettings>> GetAll()
        {
            try
            {
                var sql = @"SELECT tcps.id, 
                                   tcps.structure_id, 
                                   tcps.service_id, 
                                   tcps.is_active, 
                                   tcps.created_at, 
                                   tcps.updated_at, 
                                   tcps.created_by, 
                                   tcps.updated_by,
                                   os.name AS structure_name
                            FROM tech_council_participants_settings tcps 
                            LEFT JOIN org_structure os on tcps.structure_id = os.id";
                var models = await _dbConnection.QueryAsync<TechCouncilParticipantsSettings>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncilParticipantsSettings", ex);
            }
        }
        
        public async Task<List<TechCouncilParticipantsSettings>> GetByServiceId(int service_id)
        {
            try
            {
                var sql = @"SELECT tcps.id, 
                                   tcps.structure_id, 
                                   tcps.service_id, 
                                   tcps.is_active,
                                   os.name AS structure_name
                            FROM tech_council_participants_settings tcps
                            LEFT JOIN org_structure os on tcps.structure_id = os.id
                            WHERE tcps.service_id = @ServiceId";
                var models = await _dbConnection.QueryAsync<TechCouncilParticipantsSettings>(sql, new { ServiceId = service_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncilParticipantsSettings", ex);
            }
        }
        
        public async Task<List<TechCouncilParticipantsSettings>> GetActiveParticipantsByServiceId(int service_id)
        {
            try
            {
                var sql = @"SELECT tcps.id, 
                                   tcps.structure_id, 
                                   tcps.service_id, 
                                   tcps.is_active,
                                   os.name AS structure_name
                            FROM tech_council_participants_settings tcps
                            LEFT JOIN org_structure os on tcps.structure_id = os.id
                            WHERE tcps.service_id = @ServiceId and tcps.is_active = true";
                var models = await _dbConnection.QueryAsync<TechCouncilParticipantsSettings>(sql, new { ServiceId = service_id }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncilParticipantsSettings", ex);
            }
        }

        public async Task<TechCouncilParticipantsSettings> GetOneByID(int id)
        {
            try
            {
                var sql = "SELECT id, structure_id, service_id, is_active, created_at, updated_at, created_by, updated_by FROM tech_council_participants_settings WHERE id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<TechCouncilParticipantsSettings>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"TechCouncilParticipantsSettings with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncilParticipantsSettings", ex);
            }
        }

        public async Task<int> Add(TechCouncilParticipantsSettings domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO tech_council_participants_settings (structure_id, service_id, is_active, created_at, updated_at, created_by, updated_by) 
                            VALUES (@structure_id, @service_id, @is_active, @created_at, @updated_at, @created_by, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add TechCouncilParticipantsSettings", ex);
            }
        }

        public async Task Update(TechCouncilParticipantsSettings domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE tech_council_participants_settings SET structure_id = @structure_id, service_id = @service_id, is_active = @is_active, created_at = @created_at, updated_at = @updated_at, created_by = @created_by, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update TechCouncilParticipantsSettings", ex);
            }
        }

        public async Task<PaginatedList<TechCouncilParticipantsSettings>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM tech_council_participants_settings OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<TechCouncilParticipantsSettings>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM tech_council_participants_settings";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<TechCouncilParticipantsSettings>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get TechCouncilParticipantsSettings", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM tech_council_participants_settings WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("TechCouncilParticipantsSettings not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete TechCouncilParticipantsSettings", ex);
            }
        }
    }
}
