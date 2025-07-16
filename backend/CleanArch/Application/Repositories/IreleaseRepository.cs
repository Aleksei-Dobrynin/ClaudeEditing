using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IreleaseRepository : BaseRepository
    {
        Task<List<release>> GetAll();
        Task<List<release>> GetReleaseds();
        Task<release> GetLastRelease();
        Task<PaginatedList<release>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(release domain);
        Task Update(release domain);
        Task<release> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
