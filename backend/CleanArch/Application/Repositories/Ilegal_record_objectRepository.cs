using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Ilegal_record_objectRepository : BaseRepository
    {
        Task<List<legal_record_object>> GetAll();
        Task<PaginatedList<legal_record_object>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(legal_record_object domain);
        Task Update(legal_record_object domain);
        Task<legal_record_object> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<legal_record_object>> GetByid_record(int id_record);
        Task<List<legal_record_object>> GetByid_object(int id_object);
    }
}
