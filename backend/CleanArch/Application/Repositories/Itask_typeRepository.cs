using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Itask_typeRepository : BaseRepository
    {
        Task<List<task_type>> GetAll();
        Task<PaginatedList<task_type>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(task_type domain);
        Task Update(task_type domain);
        Task<task_type> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
