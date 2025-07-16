using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IRoleRepository : BaseRepository
    {
        Task<List<Role>> GetAll();
        Task<Role> GetOneByID(int id);
        Task<PaginatedList<Role>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(Role domain);
        Task Update(Role domain);
        Task Delete(int id);
    }
}
