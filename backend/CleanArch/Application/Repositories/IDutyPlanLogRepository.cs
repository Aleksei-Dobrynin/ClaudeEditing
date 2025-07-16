using System.Data;
using Domain.Entities;
using Application.Models;

namespace Application.Repositories
{
    public interface IDutyPlanLogRepository : BaseRepository
    {
        Task<List<DutyPlanLog>> GetAll();

        Task<DutyPlanLog> GetOneByID(int id);

        Task<int> Add(DutyPlanLog domain);

        Task Update(DutyPlanLog domain);

        Task Delete(int id);

        Task<PaginatedList<DutyPlanLog>> GetPaginated(int pageSize, int pageNumber);
        
        Task<List<DutyPlanLog>> GetByFilter(ArchiveLogFilter filter);
    }
}