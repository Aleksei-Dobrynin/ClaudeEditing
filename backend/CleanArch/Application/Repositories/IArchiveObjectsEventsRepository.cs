using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IArchiveObjectsEventsRepository : BaseRepository
    {
        Task<List<ArchiveObjectsEvents>> GetAll();
        Task<ArchiveObjectsEvents> GetOneByID(int id);
        Task<List<ArchiveObjectsEvents>> GetByObjectId(int archiveObjectId);
        Task<List<ArchiveObjectsEvents>> GetByEventTypeId(int eventTypeId);
        Task<PaginatedList<ArchiveObjectsEvents>> GetPaginated(int pageSize, int pageNumber);
        Task<PaginatedList<ArchiveObjectsEvents>> GetByObjectIdPaginated(int archiveObjectId, int pageSize, int pageNumber);
        Task<PaginatedList<ArchiveObjectsEvents>> GetByEventTypeIdPaginated(int eventTypeId, int pageSize, int pageNumber);
        Task<int> Add(ArchiveObjectsEvents domain);
        Task Update(ArchiveObjectsEvents domain);
        Task Delete(int id);
    }
}