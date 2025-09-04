using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IAddressUnitRepository : BaseRepository
    {
        Task<List<AddressUnit>> GetAll();
        Task<AddressUnit> GetOneByID(int id);
        Task<PaginatedList<AddressUnit>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(AddressUnit domain);
        Task Update(AddressUnit domain);
        Task Delete(int id);
        Task<List<AddressUnit>> GetAteChildren(int parent_id);
    }
}