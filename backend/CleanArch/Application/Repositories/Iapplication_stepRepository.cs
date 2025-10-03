using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_stepRepository : BaseRepository
    {
        Task<List<application_step>> GetAll();
        Task<List<UnsignedDocumentsModel>> GetUnsignedDocuments(List<int> post_ids, List<int> structure_ids, string search, bool isDeadline, string user_id);
        Task<PaginatedList<application_step>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(application_step domain);
        Task Update(application_step domain);
        Task<application_step> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<application_step>> GetByapplication_id(int application_id);
        Task<List<application_step>> GetBystep_id(int step_id);
        Task DeleteByApplicationId(int application_id);
    }
}
