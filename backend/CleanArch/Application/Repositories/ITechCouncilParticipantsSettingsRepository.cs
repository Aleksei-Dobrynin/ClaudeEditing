using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ITechCouncilParticipantsSettingsRepository : BaseRepository
    {
        Task<List<TechCouncilParticipantsSettings>> GetAll();
        Task<List<TechCouncilParticipantsSettings>> GetByServiceId(int service_id);
        Task<List<TechCouncilParticipantsSettings>> GetActiveParticipantsByServiceId(int service_id);
        Task<TechCouncilParticipantsSettings> GetOneByID(int id);
        Task<PaginatedList<TechCouncilParticipantsSettings>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(TechCouncilParticipantsSettings domain);
        Task Update(TechCouncilParticipantsSettings domain);
        Task Delete(int id);
    }
}