using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ITagRepository : BaseRepository
    {
        Task<List<Tag>> GetAll();
        Task<PaginatedList<Tag>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(Tag domain);
        Task Update(Tag domain);
        Task<Tag> GetOne(int id);
        Task<Tag> GetOneByCode(string code);
        Task Delete(int id);
        

    }
}
