using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ILanguageRepository : BaseRepository
    {
        Task<List<Language>> GetAll();
        Task<PaginatedList<Language>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(Language domain);
        Task Update(Language domain);
        Task<Language> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
