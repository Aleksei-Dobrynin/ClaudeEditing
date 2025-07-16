using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ITechCouncilFilesRepository : BaseRepository
    {
        Task<List<TechCouncilFiles>> GetAll();
        Task<TechCouncilFiles> GetOneByID(int id);
        Task<PaginatedList<TechCouncilFiles>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(TechCouncilFiles domain);
        Task Update(TechCouncilFiles domain);
        Task Delete(int id);
    }
}