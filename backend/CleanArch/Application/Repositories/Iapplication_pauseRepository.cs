using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_pauseRepository : BaseRepository
    {
        Task<List<application_pause>> GetAll();
        Task<PaginatedList<application_pause>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(application_pause domain);
        Task Update(application_pause domain);
        Task<application_pause> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<application_pause>> GetByapplication_id(int application_id);
        Task<List<application_pause>> GetByapp_step_id(int app_step_id);
        Task<application_pause> GetByapp_step_idAndCurrent(int app_step_id);
    }
}
