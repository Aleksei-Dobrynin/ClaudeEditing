using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Idocument_approval_sync_logRepository : BaseRepository
    {
        Task<List<document_approval_sync_log>> GetAll();
        Task<PaginatedList<document_approval_sync_log>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(document_approval_sync_log domain);
        Task Update(document_approval_sync_log domain);
        Task<document_approval_sync_log> GetOne(int id);
        Task Delete(int id);

        Task<List<document_approval_sync_log>> GetBydocument_approval_id(int document_approval_id);
        Task<List<document_approval_sync_log>> GetBysynced_by(int synced_by);
        Task<List<document_approval_sync_log>> GetBysync_reason(string sync_reason);
        Task<List<document_approval_sync_log>> GetByoperation_type(string operation_type);
        Task<List<document_approval_sync_log>> GetByDateRange(DateTime startDate, DateTime endDate);
    }
}