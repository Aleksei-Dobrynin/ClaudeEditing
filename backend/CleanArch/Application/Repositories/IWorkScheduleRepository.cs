using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IWorkScheduleRepository : BaseRepository
    {
        Task<List<WorkSchedule>> GetAll();
        Task<PaginatedList<WorkSchedule>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(WorkSchedule domain);
        Task Update(WorkSchedule domain);
        Task Delete(int id);
        Task<WorkSchedule> GetOne(int id);

    }
}
