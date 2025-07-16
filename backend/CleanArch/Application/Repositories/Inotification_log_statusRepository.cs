using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Inotification_log_statusRepository : BaseRepository
    {
        Task<List<notification_log_status>> GetAll();
        Task<PaginatedList<notification_log_status>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(notification_log_status domain);
        Task Update(notification_log_status domain);
        Task<notification_log_status> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
