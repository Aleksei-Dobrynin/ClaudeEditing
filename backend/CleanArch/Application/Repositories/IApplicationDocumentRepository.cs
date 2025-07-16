using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationDocumentRepository : BaseRepository
    {
        Task<List<ApplicationDocument>> GetAll();
        Task<List<CustomAttachedDocument>> GetAttachedOldDocuments(int application_document_id, int application_id);
        Task<List<CustomAttachedOldDocument>> GetOldUploads(int application_id);
        Task<List<ApplicationDocument>> GetByServiceId(int service_id);
        Task<ApplicationDocument> GetOneByID(int id);
        Task<PaginatedList<ApplicationDocument>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ApplicationDocument domain);
        Task Update(ApplicationDocument domain);
        Task Delete(int id);
        Task<ApplicationDocument> GetOneByNameAndType(string name, string type_code);
        Task<ApplicationDocument> GetOneByType(string type_code);
    }
}
