using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Ipath_stepRepository : BaseRepository
    {
        Task<List<path_step>> GetAll();
        Task<PaginatedList<path_step>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(path_step domain);
        Task Update(path_step domain);
        Task<path_step> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<path_step>> GetBypath_id(int path_id);
    }
}
