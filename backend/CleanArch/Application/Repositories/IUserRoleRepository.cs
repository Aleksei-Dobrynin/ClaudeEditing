using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IUserRoleRepository : BaseRepository
    {
        Task<List<UserRole>> GetAll();
        Task<UserRole> GetOneByID(int id);
        Task<PaginatedList<UserRole>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(UserRole domain);
        Task Update(UserRole domain);
        Task Delete(int id);
    }
}
