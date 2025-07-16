using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IWorkflowTaskDependencyRepository : BaseRepository
    {
        Task<List<WorkflowTaskDependency>> GetAll();
        Task<WorkflowTaskDependency> GetOneByID(int id);
        Task<PaginatedList<WorkflowTaskDependency>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(WorkflowTaskDependency domain);
        Task Update(WorkflowTaskDependency domain);
        Task Delete(int id);
    }
}
