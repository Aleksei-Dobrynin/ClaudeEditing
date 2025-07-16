using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IEmployeeEventRepository : BaseRepository
    {
        Task<List<EmployeeEvent>> GetAll();
        Task<List<EmployeeEvent>> GetByIDEmployee(int idEmployee);
        Task<EmployeeEvent> GetOneByID(int id);
        Task<PaginatedList<EmployeeEvent>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(EmployeeEvent domain);
        Task Update(EmployeeEvent domain);
        Task Delete(int id);
    }
}
