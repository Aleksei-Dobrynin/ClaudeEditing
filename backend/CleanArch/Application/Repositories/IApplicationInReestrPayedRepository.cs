using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationInReestrPayedRepository : BaseRepository
    {
        Task<List<ApplicationInReestrPayed>> GetAll();
        Task<ApplicationInReestrPayed> GetOneByID(int id);
        Task<PaginatedList<ApplicationInReestrPayed>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ApplicationInReestrPayed domain);
        Task Update(ApplicationInReestrPayed domain);
        Task Delete(int id);
        Task DeleteByAppReestrId(int id);
    }
}