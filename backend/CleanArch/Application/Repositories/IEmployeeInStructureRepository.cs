using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IEmployeeInStructureRepository : BaseRepository
    {
        Task<List<EmployeeInStructure>> GetAll();
        Task<List<EmployeeInStructure>> GetInMyStructure(int userId);
        Task<EmployeeInStructure> GetOneByID(int id);
        Task<List<EmployeeInStructure>> GetByidStructure(int idStructure);
        Task<List<EmployeeInStructure>> GetByStructureAndPost(int? idStructure, string codePost);
        Task<List<EmployeeInStructure>> GetByidEmployee(int idEmployee);
        Task<List<EmployeeInStructure>> GetByEmployeeStructureId(int idStructure, int? idEmployee);
        Task<List<EmployeeInStructure>> GetByEmployeeStructureIdHistory(int idStructure, int? idEmployee);
        Task<List<OrgStructure>> HeadOfStructures(int employee_id);
        Task<List<EmployeeInStructureHeadofStructures>> DashboardHeadOfStructures(int employee_id);
        Task<List<DashboardServices>> DashboardServices(int employee_id);
        Task<PaginatedList<EmployeeInStructure>> GetPaginated(int pageSize, int pageNumber);
        Task<List<EmployeeInStructure>> GetEmployeesHeadStructures(int idEmployee);
        Task<List<DashboardStructures>> DashboardStructures(int idEmployee);
        Task<int> Add(EmployeeInStructure domain); 
        Task Update(EmployeeInStructure domain);

        /// <summary>
        /// Получает информацию о сотрудниках по списку ID из employee_in_structure
        /// </summary>
        /// <param name="ids">Список ID записей employee_in_structure</param>
        /// <returns>Список сотрудников с информацией о структуре</returns>
        Task<List<EmployeeInStructure>> GetByIdsAsync(List<int> ids);

        /// <summary>
        /// Получает активных сотрудников по отделу и должности на указанную дату
        /// </summary>
        /// <param name="structureId">ID структуры (отдела)</param>
        /// <param name="postId">ID должности</param>
        /// <param name="asOfDate">Дата проверки (по умолчанию - текущая)</param>
        /// <returns>Список активных сотрудников</returns>
        Task<List<EmployeeInStructure>> GetActiveByStructureAndPostAsync(
            int structureId,
            int postId,
            DateTime? asOfDate = null
        );
        Task Delete(int id);
    }
}
