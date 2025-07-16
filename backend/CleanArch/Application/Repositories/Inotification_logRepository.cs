using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Inotification_logRepository : BaseRepository
    {
        Task<List<notification_log>> GetAll();
        Task<PaginatedList<notification_log>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(notification_log domain);
        Task CreateRange(List<notification_log> domain);
        Task Update(notification_log domain);
        Task UpdateStatus(int id_status, int id);
        Task<notification_log> GetOne(int id);
        Task Delete(int id);
        Task<List<notification_log>> GetUnsended();
        Task<List<notification_log>> GetByApplicationId(int id);
        Task<PaginatedList<notification_log>> GetAppLogBySearch(string? search, bool? showOnlyFailed, int? pageNumber, int? pageSize);
    }
}