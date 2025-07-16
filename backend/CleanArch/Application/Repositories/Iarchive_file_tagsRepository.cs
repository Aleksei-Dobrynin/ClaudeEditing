using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iarchive_file_tagsRepository : BaseRepository
    {
        Task<List<archive_file_tags>> GetAll();
        Task<PaginatedList<archive_file_tags>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(archive_file_tags domain);
        Task Update(archive_file_tags domain);
        Task<archive_file_tags> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<archive_file_tags>> GetByfile_id(int file_id);
        Task<List<archive_file_tags>> GetBytag_id(int tag_id);
    }
}
