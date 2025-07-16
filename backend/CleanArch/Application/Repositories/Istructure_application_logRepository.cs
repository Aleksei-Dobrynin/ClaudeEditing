using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Istructure_application_logRepository : BaseRepository
    {
        Task<List<structure_application_log>> GetAll();
        Task<List<structure_application_log>> GetAllMyStructure(string user_id);
        Task<List<structure_application_log>> GetByapplication_id(int application_id);
        Task<List<structure_application_log>> GetBystructure_id(int structure_id);
        Task<List<structure_application_log>> GetByOrgAndApp(int structure_id, int application_id);
        Task<PaginatedList<structure_application_log>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(structure_application_log domain);
        Task Update(structure_application_log domain);
        Task<structure_application_log> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
