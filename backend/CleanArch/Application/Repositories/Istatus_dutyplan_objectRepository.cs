using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Istatus_dutyplan_objectRepository : BaseRepository
    {
        Task<List<status_dutyplan_object>> GetAll();
        Task<List<status_dutyplan_object>> GetByIdApplicaiton(int app_id);
        Task<PaginatedList<status_dutyplan_object>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(status_dutyplan_object domain);
        Task Update(status_dutyplan_object domain);
        Task<status_dutyplan_object> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
