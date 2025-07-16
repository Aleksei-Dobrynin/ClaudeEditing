using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Istep_required_documentRepository : BaseRepository
    {
        Task<List<step_required_document>> GetAll();
        Task<PaginatedList<step_required_document>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(step_required_document domain);
        Task Update(step_required_document domain);
        Task<step_required_document> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<step_required_document>> GetBystep_id(int step_id);
        Task<List<step_required_document>> GetBydocument_type_id(int document_type_id);
        Task<List<step_required_document>> GetByPathIds(int[] ids);
    }
}
