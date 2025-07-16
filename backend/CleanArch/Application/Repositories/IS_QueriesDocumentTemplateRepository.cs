using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IS_QueriesDocumentTemplateRepository : BaseRepository
    {
        Task<List<S_QueriesDocumentTemplate>> GetAll();
        Task<PaginatedList<S_QueriesDocumentTemplate>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(S_QueriesDocumentTemplate domain);
        Task Update(S_QueriesDocumentTemplate domain);
        Task<S_QueriesDocumentTemplate> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<S_QueriesDocumentTemplate>> GetByidDocumentTemplate(int idDocumentTemplate);
        Task<List<S_QueriesDocumentTemplate>> GetByidQuery(int idQuery);
    }
}
