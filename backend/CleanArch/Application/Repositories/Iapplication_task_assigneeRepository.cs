using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_task_assigneeRepository : BaseRepository
    {
        Task<List<application_task_assignee>> GetAll();
        Task<PaginatedList<application_task_assignee>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(application_task_assignee domain);
        Task Update(application_task_assignee domain);
        Task<application_task_assignee> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<application_task_assignee>> GetByapplication_task_id(int application_task_id);
        Task<List<application_task_assignee>> GetByapplication_id(int application_id);
    }
}
