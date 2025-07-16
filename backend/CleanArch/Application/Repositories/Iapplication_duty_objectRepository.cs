using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_duty_objectRepository : BaseRepository
    {
        Task<List<application_duty_object>> GetAll();
        Task<PaginatedList<application_duty_object>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(application_duty_object domain);
        Task Update(application_duty_object domain);
        Task<application_duty_object> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<application_duty_object>> GetBydutyplan_object_id(int dutyplan_object_id);
        Task<List<application_duty_object>> GetByapplication_id(int application_id);
    }
}
