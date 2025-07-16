using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IArchObjectRepository : BaseRepository
    {
        Task<List<ArchObject>> GetAll();
        Task<List<ArchObject>> GetBySearch(string text);
        Task<List<ArchObject>> GetByAppIdApplication(int application_id);
        Task<ArchObject> GetOneByID(int id);
        Task<PaginatedList<ArchObject>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ArchObject domain);
        Task Update(ArchObject domain);
        Task Delete(int id);
        Task<int> GetLastNumber();
    }
}
