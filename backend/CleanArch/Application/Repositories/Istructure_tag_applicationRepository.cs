using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Istructure_tag_applicationRepository : BaseRepository
    {
        Task<List<structure_tag_application>> GetAll();
        Task<PaginatedList<structure_tag_application>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(structure_tag_application domain);
        Task Update(structure_tag_application domain);
        Task<structure_tag_application> GetOne(int id);
        Task<structure_tag_application> GetForApplication(int structure_id, int application_id);
        Task Delete(int id);
        
        
        Task<List<structure_tag_application>> GetBystructure_tag_id(int structure_tag_id);
        Task<List<structure_tag_application>> GetBystructure_id(int structure_id);
        Task<List<structure_tag_application>> GetByapplication_id(int application_id);
    }
}
