using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Ilegal_act_objectRepository : BaseRepository
    {
        Task<List<legal_act_object>> GetAll();
        Task<PaginatedList<legal_act_object>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(legal_act_object domain);
        Task Update(legal_act_object domain);
        Task<legal_act_object> GetOne(int id);
        Task Delete(int id);
        Task<List<legal_act_object>> GetByid_act(int id_act);
        Task<List<legal_act_object>> GetByid_object(int id_object);
    }
}
