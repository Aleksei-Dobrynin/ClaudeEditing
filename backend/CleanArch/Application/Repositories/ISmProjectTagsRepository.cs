using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ISmProjectTagsRepository: BaseRepository
    {
        Task<List<SmProjectTags>> GetAll();
        Task<PaginatedList<SmProjectTags>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(SmProjectTags domain);
        Task Update(SmProjectTags domain);
    }
}
