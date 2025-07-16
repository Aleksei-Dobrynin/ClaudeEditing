using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IUnitTypeRepository : BaseRepository
    {
        Task<List<UnitType>> GetAll();
        Task<PaginatedList<UnitType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(UnitType domain);
        Task Update(UnitType domain);
        Task<UnitType> GetOne(int id);
        Task<UnitType> GetOneByCode(string code);
        Task Delete(int id);
        

    }
}
