using Application.Models;
using Domain.Entities;
using System.Data;

namespace Application.Repositories
{
    public interface IS_QueryRepository : BaseRepository
    {
        Task<List<S_Query>> GetAll();
        Task<PaginatedList<S_Query>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(S_Query domain);
        Task Update(S_Query domain);
        Task<S_Query> GetOne(int id);
        Task Delete(int id);
        Task<List<object>> CallQuery(int idQuery, Dictionary<string, object> parameters);



    }
}
