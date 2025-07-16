using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IWorkflowTaskTemplateRepository : BaseRepository
    {
        Task<List<WorkflowTaskTemplate>> GetAll();
        Task<WorkflowTaskTemplate> GetOneByID(int id);
        Task<List<WorkflowTaskTemplate>> GetByidWorkflow(int idWorkflow);
        Task<List<WorkflowTaskTemplate>> GetByServiceId(int service_id);
        Task<PaginatedList<WorkflowTaskTemplate>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(WorkflowTaskTemplate domain);
        Task Update(WorkflowTaskTemplate domain);
        Task Delete(int id);
        
    }
}
