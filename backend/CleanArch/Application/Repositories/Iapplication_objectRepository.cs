using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_objectRepository : BaseRepository
    {
        Task<List<application_object>> GetAll();
        Task<PaginatedList<application_object>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(application_object domain);
        Task Update(application_object domain);
        Task<application_object> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<application_object>> GetByapplication_id(int application_id);
        Task<List<application_object>> GetByarch_object_id(int arch_object_id);
    }
}
