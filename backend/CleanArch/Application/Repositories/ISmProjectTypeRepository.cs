using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ISmProjectTypeRepository: BaseRepository
    {
        Task<List<SmProjectType>> GetAll();
        Task<PaginatedList<SmProjectType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(SmProjectType domain);
        Task Update(SmProjectType domain);
    }
}
