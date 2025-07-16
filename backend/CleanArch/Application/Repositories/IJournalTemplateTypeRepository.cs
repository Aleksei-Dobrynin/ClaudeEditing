using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IJournalTemplateTypeRepository : BaseRepository
    {
        Task<List<JournalTemplateType>> GetAll();
        Task<JournalTemplateType> GetOneByID(int id);
        Task<PaginatedList<JournalTemplateType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(JournalTemplateType domain);
        Task Update(JournalTemplateType domain);
        Task Delete(int id);
    }
}