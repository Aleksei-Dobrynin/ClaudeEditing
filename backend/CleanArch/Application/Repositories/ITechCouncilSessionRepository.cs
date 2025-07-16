using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ITechCouncilSessionRepository : BaseRepository
    {
        Task<List<TechCouncilSession>> GetAll();
        Task<List<TechCouncilSession>> GetArchiveAll();
        Task<TechCouncilSession> GetOneByID(int id);
        Task<PaginatedList<TechCouncilSession>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(TechCouncilSession domain);
        Task Update(TechCouncilSession domain);
        Task toArchive(TechCouncilSession domain, string? document);
        Task Delete(int id);
    }
}