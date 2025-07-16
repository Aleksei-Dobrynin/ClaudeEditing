using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Ireestr_statusRepository : BaseRepository
    {
        Task<List<reestr_status>> GetAll();
        Task<PaginatedList<reestr_status>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(reestr_status domain);
        Task Update(reestr_status domain);
        Task<reestr_status> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
