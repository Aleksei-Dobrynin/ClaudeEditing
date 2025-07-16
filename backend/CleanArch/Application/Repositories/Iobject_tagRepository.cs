using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iobject_tagRepository : BaseRepository
    {
        Task<List<object_tag>> GetAll();
        Task<PaginatedList<object_tag>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(object_tag domain);
        Task Update(object_tag domain);
        Task<object_tag> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
