using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iorganization_typeRepository : BaseRepository
    {
        Task<List<organization_type>> GetAll();
        Task<PaginatedList<organization_type>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(organization_type domain);
        Task Update(organization_type domain);
        Task<organization_type> GetOne(int id);
        Task Delete(int id);
        Task<organization_type> GetOneByName(string name);
        
    }
}
