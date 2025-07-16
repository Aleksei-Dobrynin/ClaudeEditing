using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Inotification_templateRepository : BaseRepository
    {
        Task<List<notification_template>> GetAll();
        Task<PaginatedList<notification_template>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(notification_template domain);
        Task Update(notification_template domain);
        Task<notification_template> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<notification_template>> GetBycontact_type_id(int contact_type_id);
        Task<List<notification_template>> GetByCode(string code);
    }
}
