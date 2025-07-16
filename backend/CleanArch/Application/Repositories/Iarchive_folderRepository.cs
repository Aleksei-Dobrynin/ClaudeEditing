using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iarchive_folderRepository : BaseRepository
    {
        Task<List<archive_folder>> GetAll();
        Task<PaginatedList<archive_folder>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(archive_folder domain);
        Task Update(archive_folder domain);
        Task<archive_folder> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<archive_folder>> GetBydutyplan_object_id(int dutyplan_object_id);
    }
}
