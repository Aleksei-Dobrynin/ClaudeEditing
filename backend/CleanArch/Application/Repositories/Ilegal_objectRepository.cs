using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Ilegal_objectRepository : BaseRepository
    {
        Task<List<legal_object>> GetAll();
        Task<PaginatedList<legal_object>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(legal_object domain);
        Task Update(legal_object domain);
        Task<legal_object> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
