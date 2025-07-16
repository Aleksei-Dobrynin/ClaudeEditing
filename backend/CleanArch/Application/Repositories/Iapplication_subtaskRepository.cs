using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_subtaskRepository : BaseRepository
    {
        Task<List<application_subtask>> GetAll();
        Task<PaginatedList<application_subtask>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(application_subtask domain);
        Task Update(application_subtask domain);
        Task<application_subtask> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<application_subtask>> GetBysubtask_template_id(int subtask_template_id);
        Task<List<application_subtask>> GetBystatus_id(int status_id);
        Task<List<application_subtask>> GetByapplication_task_id(int application_task_id);
        Task<List<application_subtask>> GetSubtasksByUserId(int userId);
        Task<List<application_subtask>> GetMyStructureSubtasks(int userId);
        Task<int> ChangeStatus(int subtask_id, int status_id);
    }
}
