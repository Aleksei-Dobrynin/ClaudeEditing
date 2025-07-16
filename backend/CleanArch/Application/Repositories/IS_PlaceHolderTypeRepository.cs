using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IS_PlaceHolderTypeRepository : BaseRepository
    {
        Task<List<S_PlaceHolderType>> GetAll();
        Task<PaginatedList<S_PlaceHolderType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(S_PlaceHolderType domain);
        Task Update(S_PlaceHolderType domain);
        Task<S_PlaceHolderType> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
