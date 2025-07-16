using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Idocument_approverRepository : BaseRepository
    {
        Task<List<document_approver>> GetAll();
        Task<PaginatedList<document_approver>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(document_approver domain);
        Task Update(document_approver domain);
        Task<document_approver> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<document_approver>> GetBystep_doc_id(int step_doc_id);
        Task<List<document_approver>> GetBystep_doc_ids(int[] step_docs_ids);
        Task<List<document_approver>> GetBydepartment_id(int department_id);
        Task<List<document_approver>> GetByposition_id(int position_id);
        Task<List<document_approver>> GetByPathId(int pathId);
    }
}
