using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Istep_partnerRepository : BaseRepository
    {
        Task<List<step_partner>> GetAll();
        Task<PaginatedList<step_partner>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(step_partner domain);
        Task Update(step_partner domain);
        Task<step_partner> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<step_partner>> GetBystep_id(int step_id);
        Task<List<step_partner>> GetBypartner_id(int partner_id);

    }
}
