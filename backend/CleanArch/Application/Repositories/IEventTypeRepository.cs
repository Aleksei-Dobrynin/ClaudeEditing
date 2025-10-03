using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IEventTypeRepository : BaseRepository
    {
        Task<List<EventType>> GetAll();
        Task<EventType> GetOneByID(int id);
        Task<PaginatedList<EventType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(EventType domain);
        Task Update(EventType domain);
        Task Delete(int id);
    }
}