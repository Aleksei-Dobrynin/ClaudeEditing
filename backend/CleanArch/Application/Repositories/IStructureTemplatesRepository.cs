using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IStructureTemplatesRepository : BaseRepository
    {
        Task<List<StructureTemplates>> GetAllForStructure(int structure_id);
        Task<StructureTemplates> GetOneByID(int id);
        Task<PaginatedList<StructureTemplates>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(StructureTemplates domain);
        Task Update(StructureTemplates domain);
        Task Delete(int id);
    }
}