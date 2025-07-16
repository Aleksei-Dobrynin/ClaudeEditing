using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IQueryFiltersRepository : BaseRepository
    {
        Task<List<QueryFilters>> GetAll();
        Task<List<QueryFilters>> GetByTargetTable(string targetTable);
        Task<QueryFilters> GetOneByID(int id);
        Task<string> GetSqlByCode(string target_table, string code);
        Task<PaginatedList<QueryFilters>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(QueryFilters domain);
        Task Update(QueryFilters domain);
        Task Delete(int id);
    }
}