using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IStructurePostRepository : BaseRepository
    {
        Task<List<StructurePost>> GetAll();
        Task<StructurePost> GetOneByID(int id);
        Task<PaginatedList<StructurePost>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(StructurePost domain);
        Task Update(StructurePost domain);
        Task Delete(int id);
    }
}
