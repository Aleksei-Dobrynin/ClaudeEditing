using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationLegalRecordRepository : BaseRepository
    {
        Task<List<ApplicationLegalRecord>> GetAll();
        Task<ApplicationLegalRecord> GetOneByID(int id);
        Task<PaginatedList<ApplicationLegalRecord>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ApplicationLegalRecord domain);
        Task Update(ApplicationLegalRecord domain);
        Task Delete(int id);
    }
}