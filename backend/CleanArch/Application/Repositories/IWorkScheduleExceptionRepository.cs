using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IWorkScheduleExceptionRepository : BaseRepository
    {
        Task<List<WorkScheduleException>> GetAll();
        Task<PaginatedList<WorkScheduleException>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(WorkScheduleException domain);
        Task Update(WorkScheduleException domain);
        Task Delete(int id);
        Task<WorkScheduleException> GetOne(int id);
        Task<List<WorkScheduleException>> GetByschedule_id(int id);
        

    }
}
