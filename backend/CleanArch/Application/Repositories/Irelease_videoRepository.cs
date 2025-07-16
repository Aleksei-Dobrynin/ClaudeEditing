using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Irelease_videoRepository : BaseRepository
    {
        Task<List<release_video>> GetAll();
        Task<PaginatedList<release_video>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(release_video domain);
        Task Update(release_video domain);
        Task<release_video> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<release_video>> GetByrelease_id(int release_id);
        Task<List<release_video>> GetByfile_id(int file_id);
    }
}
