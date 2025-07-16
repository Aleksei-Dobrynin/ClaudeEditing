using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_subtask_assigneeRepository : BaseRepository
    {
        Task<List<application_subtask_assignee>> GetAll();
        Task<PaginatedList<application_subtask_assignee>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(application_subtask_assignee domain);
        Task Update(application_subtask_assignee domain);
        Task<application_subtask_assignee> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<application_subtask_assignee>> GetBystructure_employee_id(int structure_employee_id);
        Task<List<application_subtask_assignee>> GetByapplication_subtask_id(int application_subtask_id);
    }
}
