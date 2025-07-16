using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface InotificationRepository : BaseRepository
    {
        Task<List<notification>> GetAll();
        Task<List<notification>> GetMyNotifications(int userId);
        Task<PaginatedList<notification>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(notification domain);
        Task Update(notification domain);
        Task ReadAll(List<int> ids);
        Task<notification> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
