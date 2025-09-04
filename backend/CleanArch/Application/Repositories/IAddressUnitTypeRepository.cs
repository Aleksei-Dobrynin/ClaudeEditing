using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IAddressUnitTypeRepository : BaseRepository
    {
        Task<List<AddressUnitType>> GetAll();
        Task<AddressUnitType> GetOneByID(int id);
        Task<PaginatedList<AddressUnitType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(AddressUnitType domain);
        Task Update(AddressUnitType domain);
        Task Delete(int id);
    }
}