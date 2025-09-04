using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IStreetTypeRepository : BaseRepository
    {
        Task<List<StreetType>> GetAll();
        Task<StreetType> GetOneByID(int id);
        Task<PaginatedList<StreetType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(StreetType domain);
        Task Update(StreetType domain);
        Task Delete(int id);
    }
}