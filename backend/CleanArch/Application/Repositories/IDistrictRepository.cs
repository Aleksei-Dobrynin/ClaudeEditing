using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IDistrictRepository : BaseRepository
    {
        Task<List<District>> GetAll();
        Task<District> GetOneByID(int id);
        Task<PaginatedList<District>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(District domain);
        Task Update(District domain);
        Task Delete(int id);
    }
}
