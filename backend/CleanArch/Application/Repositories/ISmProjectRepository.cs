using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ISmProjectRepository: BaseRepository
    {
        Task<List<SmProject>> GetAll();
        Task<PaginatedList<SmProject>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(SmProject domain);
        Task Update(SmProject domain);
    }
}
