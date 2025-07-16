using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IWorkDayRepository : BaseRepository
    {
        Task<List<WorkDay>> GetAll();
        Task<PaginatedList<WorkDay>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(WorkDay domain);
        Task Update(WorkDay domain);
        Task Delete(int id);
        Task<WorkDay> GetOne(int id);
        Task<List<WorkDay>> GetByschedule_id(int id);

    }
}
