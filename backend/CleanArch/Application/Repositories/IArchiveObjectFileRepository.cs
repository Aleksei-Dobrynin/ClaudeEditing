using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IArchiveObjectFileRepository : BaseRepository
    {
        Task<List<ArchiveObjectFile>> GetAll();
        Task<List<ArchiveObjectFile>> GetNotInFolder();
        Task<List<ArchiveObjectFile>> GetByidArchiveObject(int idArchiveObject);
        Task<List<ArchiveObjectFile>> GetByidArchiveFolder(int idArchiveFolder);
        Task<ArchiveObjectFile> GetOneByID(int id);
        Task<PaginatedList<ArchiveObjectFile>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ArchiveObjectFile domain);
        Task Update(ArchiveObjectFile domain);
        Task Delete(int id);
    }
}
