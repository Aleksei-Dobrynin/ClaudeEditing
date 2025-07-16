using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IS_TemplateDocumentPlaceholderRepository : BaseRepository
    {
        Task<List<S_TemplateDocumentPlaceholder>> GetAll();
        Task<PaginatedList<S_TemplateDocumentPlaceholder>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(S_TemplateDocumentPlaceholder domain);
        Task Update(S_TemplateDocumentPlaceholder domain);
        Task<S_TemplateDocumentPlaceholder> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<S_TemplateDocumentPlaceholder>> GetByidTemplateDocument(int idTemplateDocument);
        Task<List<S_TemplateDocumentPlaceholder>> GetByidPlaceholder(int idPlaceholder);
    }
}
