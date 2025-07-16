using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IJournalPlaceholderRepository : BaseRepository
    {
        Task<List<JournalPlaceholder>> GetAll();
        Task<JournalPlaceholder> GetOneByID(int id);
        Task<List<JournalPlaceholder>> GetByDocumentJournalId(int id);
        Task<PaginatedList<JournalPlaceholder>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(JournalPlaceholder domain);
        Task Update(JournalPlaceholder domain);
        Task Delete(int id);
        Task DeleteByDocumentJournalId(int id);
    }
}