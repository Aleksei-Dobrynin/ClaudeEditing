using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IArchiveLogRepository : BaseRepository
    {
        Task<List<ArchiveLog>> GetAll();
        Task<ArchiveLog> GetOneByID(int id);
        Task<List<ArchiveLog>> GetGroupByParentID(int id);
        Task<List<ArchiveLog>> GetByFilter(ArchiveLogFilter filter);
        Task<PaginatedList<ArchiveLog>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ArchiveLog domain);
        Task<int> ChangeStatus(int archive_log_id, int status_id);
        Task Update(ArchiveLog domain);
        Task Delete(int id);
    }
}
