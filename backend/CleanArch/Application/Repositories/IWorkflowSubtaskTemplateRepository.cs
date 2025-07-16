using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IWorkflowSubtaskTemplateRepository : BaseRepository
    {
        Task<List<WorkflowSubtaskTemplate>> GetAll();
        Task<WorkflowSubtaskTemplate> GetOneByID(int id);
        Task<List<WorkflowSubtaskTemplate>> GetByidWorkflowTaskTemplate(int idWorkflowTaskTemplate);
        Task<PaginatedList<WorkflowSubtaskTemplate>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(WorkflowSubtaskTemplate domain);
        Task Update(WorkflowSubtaskTemplate domain);
        Task Delete(int id);
    }
}
