using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Itech_decisionRepository : BaseRepository
    {
        Task<List<tech_decision>> GetAll();
        Task<PaginatedList<tech_decision>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(tech_decision domain);
        Task Update(tech_decision domain);
        Task<tech_decision> GetOne(int id);
        Task Delete(int id);
        
        
        //Task<List<tech_decision>> GetBydutyplan_object_id(int dutyplan_object_id);
        //Task<List<tech_decision>> GetByapplication_id(int application_id);
    }
}
