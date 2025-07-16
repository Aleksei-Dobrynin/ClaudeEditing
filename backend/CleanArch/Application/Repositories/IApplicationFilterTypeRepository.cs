using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationFilterTypeRepository : BaseRepository
    {
        Task<List<ApplicationFilterType>> GetAll();
        Task<ApplicationFilterType> GetOneByID(int id);
        Task<PaginatedList<ApplicationFilterType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ApplicationFilterType domain);
        Task Update(ApplicationFilterType domain);
        Task Delete(int id);
    }
}
