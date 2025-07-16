using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iarch_object_tagRepository : BaseRepository
    {
        Task<List<arch_object_tag>> GetAll();
        Task<List<arch_object_tag>> GetByIdObject(int idObject);
        Task<PaginatedList<arch_object_tag>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(arch_object_tag domain);
        Task Update(arch_object_tag domain);
        Task<arch_object_tag> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
