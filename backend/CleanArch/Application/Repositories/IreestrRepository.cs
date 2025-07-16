using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IreestrRepository : BaseRepository
    {
        Task<List<reestr>> GetAll();
        Task<List<reestr>> GetAllMy(int userId);
        Task<PaginatedList<reestr>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(reestr domain);
        Task Update(reestr domain);
        Task<reestr> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<reestr>> GetBystatus_id(int status_id);
    }
}
