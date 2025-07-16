using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IDocumentJournalsRepository : BaseRepository
    {
        Task<List<DocumentJournals>> GetAll();
        Task<DocumentJournals> GetOneByID(int id);
        Task<PaginatedList<DocumentJournals>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(DocumentJournals domain);
        Task<int> AddStatus(JournalAppStatus domain);
        Task DeleteStatuses(int id);
        Task Update(DocumentJournals domain);
        Task Delete(int id);
        Task<List<JournalPeriodType>> GetPeriodTypes();
    }
}