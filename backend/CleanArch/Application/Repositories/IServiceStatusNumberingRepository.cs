using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IServiceStatusNumberingRepository : BaseRepository
    {
        Task<List<ServiceStatusNumbering>> GetAll();
        Task<List<ServiceStatusNumbering>> GetByServiceId(int id);
        Task<List<ServiceStatusNumbering>> GetByJournalId(int id);
        Task<ServiceStatusNumbering> GetOneByID(int id);
        Task<PaginatedList<ServiceStatusNumbering>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ServiceStatusNumbering domain);
        Task Update(ServiceStatusNumbering domain);
        Task Delete(int id);
    }
}