using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Ilegal_act_registryRepository : BaseRepository
    {
        Task<List<legal_act_registry>> GetAll();
        Task<List<legal_act_registry>> GetByFilter(LegalFilter filter);
        Task<PaginatedList<legal_act_registry>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(legal_act_registry domain);
        Task Update(legal_act_registry domain);
        Task<legal_act_registry> GetOne(int id);
        Task Delete(int id);

        Task<List<legal_act_registry>> GetByAddress(string address);
        Task<List<legal_act_registry>> GetByid_status(int id_status);
    }
}
