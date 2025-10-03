using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IEmployeeSavedFiltersRepository : BaseRepository
    {
        Task<List<EmployeeSavedFilters>> GetAll();
        Task<EmployeeSavedFilters> GetOneByID(int id);
        Task<List<EmployeeSavedFilters>> GetByEmployeeId(int employeeId);
        Task<PaginatedList<EmployeeSavedFilters>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(EmployeeSavedFilters domain);
        Task Update(EmployeeSavedFilters domain);
        Task Delete(int id);
    }
}