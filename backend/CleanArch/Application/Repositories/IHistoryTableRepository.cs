using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IHistoryTableRepository : BaseRepository
    {
        Task<List<HistoryTable>> GetAll();
        Task<List<HistoryTable>> GetByApplication(int application_id);
        Task<HistoryTable> GetOneByID(int id);
        Task<PaginatedList<HistoryTable>> GetPaginated(int pageSize, int pageNumber);
    }
}