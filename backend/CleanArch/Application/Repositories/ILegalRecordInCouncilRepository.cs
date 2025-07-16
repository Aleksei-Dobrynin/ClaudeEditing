using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ILegalRecordInCouncilRepository : BaseRepository
    {
        Task<List<LegalRecordInCouncil>> GetAll();
        Task<LegalRecordInCouncil> GetOneByID(int id);
        Task<PaginatedList<LegalRecordInCouncil>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(LegalRecordInCouncil domain);
        Task Update(LegalRecordInCouncil domain);
        Task Delete(int id);
        Task DeleteByTechCouncilId(int tech_council_id);
    }
}