using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IHrmsEventTypeRepository : BaseRepository
    {
        Task<List<HrmsEventType>> GetAll();
        Task<HrmsEventType> GetOneByID(int id);
        Task<PaginatedList<HrmsEventType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(HrmsEventType domain);
        Task Update(HrmsEventType domain);
        Task Delete(int id);
    }
}
