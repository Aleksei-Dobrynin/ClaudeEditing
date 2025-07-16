using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iarchitecture_statusRepository : BaseRepository
    {
        Task<List<architecture_status>> GetAll();
        Task<PaginatedList<architecture_status>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(architecture_status domain);
        Task Update(architecture_status domain);
        Task<architecture_status> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
