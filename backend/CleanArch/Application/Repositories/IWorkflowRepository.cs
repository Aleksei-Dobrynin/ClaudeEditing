using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IWorkflowRepository : BaseRepository
    {
        Task<List<Workflow>> GetAll();
        Task<Workflow> GetOneByID(int id);
        Task<PaginatedList<Workflow>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(Workflow domain);
        Task Update(Workflow domain);
        Task Delete(int id);
    }
}
