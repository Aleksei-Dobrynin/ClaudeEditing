using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Istructure_tagRepository : BaseRepository
    {
        Task<List<structure_tag>> GetAll();
        Task<PaginatedList<structure_tag>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(structure_tag domain);
        Task Update(structure_tag domain);
        Task<structure_tag> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<structure_tag>> GetBystructure_id(int structure_id);
    }
}
