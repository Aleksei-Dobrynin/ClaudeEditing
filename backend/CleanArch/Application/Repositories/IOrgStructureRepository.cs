using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IOrgStructureRepository : BaseRepository
    {
        Task<List<OrgStructure>> GetAll();
        Task<List<OrgStructure>> GetByUserId(string userId);
        Task<PaginatedList<OrgStructure>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(OrgStructure domain);
        Task Update(OrgStructure domain);
        Task Delete(int id);
        Task<OrgStructure> GetOne(int id);

    }
}
