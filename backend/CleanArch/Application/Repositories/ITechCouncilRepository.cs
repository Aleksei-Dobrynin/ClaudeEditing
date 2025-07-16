using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ITechCouncilRepository : BaseRepository
    {
        Task<List<TechCouncil>> GetAll();
        Task<List<TechCouncilTable>> GetTable();
        Task<List<TechCouncilTable>> GetTableBySession(int session_id);
        Task<List<TechCouncilTable>> GetTableWithOutSession();
        Task<List<TechCouncil>> GetByStructureId(int structure_id);
        Task<List<TechCouncil>> GetByApplicationId(int application_id);
        Task<List<TechCouncilTable>> GetTableByStructure(int structure_id);
        Task UpdateSession(int? application_id, int? session_id);
        Task<TechCouncil> GetOneByID(int id);
        Task<PaginatedList<TechCouncil>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(TechCouncil domain);
        Task Update(TechCouncil domain);
        Task Delete(int id);
    }
}