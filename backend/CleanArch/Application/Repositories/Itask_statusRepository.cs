using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Itask_statusRepository : BaseRepository
    {
        Task<List<task_status>> GetAll();
        Task<PaginatedList<task_status>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(task_status domain);
        Task Update(task_status domain);
        Task<task_status> GetOne(int id);
        Task<task_status> GetOneByCode(string code);
        Task Delete(int id);
        

    }
}
