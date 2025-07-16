using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IArchiveLogStatusRepository : BaseRepository
    {
        Task<List<ArchiveLogStatus>> GetAll();
        Task<ArchiveLogStatus> GetOneByID(int id);
        Task<ArchiveLogStatus> GetOneByCode(string code);
        Task<PaginatedList<ArchiveLogStatus>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ArchiveLogStatus domain);
        Task Update(ArchiveLogStatus domain);
        Task Delete(int id);
    }
}
