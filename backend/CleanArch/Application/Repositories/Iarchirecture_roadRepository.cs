using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iarchirecture_roadRepository : BaseRepository
    {
        Task<List<archirecture_road>> GetAll();
        Task<PaginatedList<archirecture_road>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(archirecture_road domain);
        Task Update(archirecture_road domain);
        Task<archirecture_road> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<archirecture_road>> GetByfrom_status_id(int from_status_id);
        Task<List<archirecture_road>> GetByto_status_id(int to_status_id);
    }
}
