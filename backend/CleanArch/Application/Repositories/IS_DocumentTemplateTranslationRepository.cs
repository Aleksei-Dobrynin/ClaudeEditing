using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IS_DocumentTemplateTranslationRepository : BaseRepository
    {
        Task<List<S_DocumentTemplateTranslation>> GetAll();
        Task<PaginatedList<S_DocumentTemplateTranslation>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(S_DocumentTemplateTranslation domain);
        Task Update(S_DocumentTemplateTranslation domain);
        Task<S_DocumentTemplateTranslation> GetOne(int id);
        Task Delete(int id);
        Task DeleteByTemplate(int idDocumentTemplate);
        
        
        Task<List<S_DocumentTemplateTranslation>> GetByidDocumentTemplate(int idDocumentTemplate);
        Task<List<S_DocumentTemplateTranslation>> GetByidLanguage(int idLanguage);
    }
}
