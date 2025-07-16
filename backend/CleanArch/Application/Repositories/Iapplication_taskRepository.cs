using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_taskRepository : BaseRepository
    {
        Task<List<application_task>> GetAll();
        Task<PaginatedList<application_task>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(application_task domain);
        Task Update(application_task domain);
        Task<application_task> GetOne(int id);
        Task<application_task> GetOneWithAppInfo(int id);
        Task Delete(int id);


        Task<List<application_task>> GetByapplication_id(int application_id);
        Task<List<application_task>> GetOtherTaskByTaskId(int task_id);
        Task<List<application_task>> GetBytask_template_id(int task_template_id);
        Task<List<ApplicationTaskPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end, bool out_of_date);
        Task<List<ApplicationTaskPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end, bool out_of_date, string user_id);
        Task<List<ApplicationTaskPivot>> GetForPivotHeadDashboard(DateTime date_start, DateTime date_end, bool out_of_date, int[] structure_ids);
        Task<List<application_task>> GetBystatus_id(int status_id);
        Task<List<application_task>> GetTasksByUserId(int userId, string search, DateTime? date_start, DateTime? date_end, bool? isExpiredTasks);
        Task<List<application_task>> GetMyStructuresTasks(int userId, string search, DateTime? date_start, DateTime? date_end, bool? isExpiredTasks);
        Task<PaginatedList<application_task>> GetAllTasks(string search, DateTime? date_start, DateTime? date_end, int page, int pageSize);
        Task<int> ChangeStatus(int task_id, int status_id);
        Task<List<ArchiveLogPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end);
        Task<List<ArchiveLogPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end, string user_id);
    }
}
