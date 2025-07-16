using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Istep_required_work_documentRepository : BaseRepository
    {
        Task<List<step_required_work_document>> GetAll();
        Task<PaginatedList<step_required_work_document>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(step_required_work_document domain);
        Task Update(step_required_work_document domain);
        Task<step_required_work_document> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<step_required_work_document>> GetBystep_id(int step_id);
        Task<List<step_required_work_document>> GetBywork_document_type_id(int work_document_type_id);
    }
}
