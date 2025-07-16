using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IArchiveObjectRepository : BaseRepository
    {
        Task<List<ArchiveObject>> GetAll();
        Task<List<ArchiveObject>> Search(string? number, double? latitude, double? longitude, double? radius);
        Task<List<ArchiveObject>> SearchByNumber(string? number);
        Task<List<ArchiveObject>> GetArchiveObjectsFromApplication();
        Task<ArchiveObject> GetOneByID(int id);
        Task<ArchiveObject> GetOneByProcessId(int process_id);
        Task<List<ArchiveObject>> GetListByIDs(List<int?> ids);
        Task<List<ArchiveObject>> GetChildObjects(int parent_id);
        Task<PaginatedList<ArchiveObject>> GetPaginated(ArchiveObjectFilter filter);
        Task<int> Add(ArchiveObject domain);
        Task Update(ArchiveObject domain);
        Task Delete(int id);
    }
}
