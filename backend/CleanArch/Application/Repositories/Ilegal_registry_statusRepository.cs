using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Ilegal_registry_statusRepository : BaseRepository
    {
        Task<List<legal_registry_status>> GetAll();
        Task<PaginatedList<legal_registry_status>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(legal_registry_status domain);
        Task Update(legal_registry_status domain);
        Task<legal_registry_status> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
