using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Irelease_seenRepository : BaseRepository
    {
        Task<List<release_seen>> GetAll();
        Task<PaginatedList<release_seen>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(release_seen domain);
        Task Update(release_seen domain);
        Task<bool> LastReleaseRead(int user_id);
        Task<release_seen> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<release_seen>> GetByrelease_id(int release_id);
    }
}
