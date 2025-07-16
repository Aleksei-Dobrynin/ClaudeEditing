using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Ilegal_record_registryRepository : BaseRepository
    {
        Task<List<legal_record_registry>> GetAll();
        Task<List<legal_record_registry>> GetByFilter(LegalFilter filter);
        Task<PaginatedList<legal_record_registry>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(legal_record_registry domain);
        Task Update(legal_record_registry domain);
        Task<legal_record_registry> GetOne(int id);
        Task Delete(int id);

        Task<List<legal_record_registry>> GetByAddress(string address);



        Task<List<legal_record_registry>> GetByid_status(int id_status);
    }
}
