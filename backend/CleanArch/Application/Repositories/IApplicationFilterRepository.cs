using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationFilterRepository : BaseRepository
    {
        Task<List<ApplicationFilter>> GetAll();
        Task<List<ApplicationFilter>> GetByFilter(ApplicationFilterGetRequest filter);
        Task<ApplicationFilter> GetOneByID(int id);
        Task<PaginatedList<ApplicationFilter>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ApplicationFilter domain);
        Task Update(ApplicationFilter domain);
        Task Delete(int id);
    }
}
