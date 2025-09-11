using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IEmployeeRepository : BaseRepository
    {
        Task<List<Employee>> GetAll();
        Task<List<Employee>> GetAllRegister();
        Task<Employee> GetOneByID(int id);
        Task<int> GetUserIdByEmployeeId(int id);
        Task<Employee> GetOneByGuid(string guid);
        Task<Employee> GetByUserId(string userId);
        Task<Employee> GetByUserId(int userId);
        Task<int?> GetUserIdByEmployeeID(int id);
        Task<PaginatedList<Employee>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(Employee domain);
        Task Update(Employee domain);
        Task Delete(int id);
        Task<Employee> GetUser();
        Task<EmployeeInStructure> GetEmployeeInStructureByUserEmail(string email);
        Task<EmployeeInStructure> GetEmployeeInStructure(); 
        Task<Employee> GetEmployeeByToken(); 
        Task<Employee> UpdateInitials(EmployeeInitials domain);
        Task<List<Employee>> GetEmployeesByEmail(string email);

        Task<List<Employee>> GetEmployeesByApplicationStep(int applicationStepId);

    }
    
}