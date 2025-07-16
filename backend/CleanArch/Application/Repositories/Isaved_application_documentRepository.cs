using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Isaved_application_documentRepository : BaseRepository
    {
        Task<List<saved_application_document>> GetAll();
        Task<PaginatedList<saved_application_document>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(saved_application_document domain);
        Task Update(saved_application_document domain);
        Task<saved_application_document> GetOne(int id);
        Task<saved_application_document> GetByApplication(int application_id, int template_id, int language_id);

        Task Delete(int id);
        
        
        Task<List<saved_application_document>> GetByapplication_id(int application_id);
        Task<List<saved_application_document>> GetBytemplate_id(int template_id);
        Task<List<saved_application_document>> GetBylanguage_id(int language_id);
    }
}
