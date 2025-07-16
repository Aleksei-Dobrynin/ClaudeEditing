using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Istep_dependencyRepository : BaseRepository
    {
        Task<List<step_dependency>> GetAll();
        Task<PaginatedList<step_dependency>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(step_dependency domain);
        Task Update(step_dependency domain);
        Task<step_dependency> GetOne(int id);
        Task Delete(int id);


        Task<List<step_dependency>> GetBydependent_step_id(int dependent_step_id);
        Task<List<step_dependency>> GetByprerequisite_step_id(int prerequisite_step_id);
        Task<List<step_dependency>> GetByServicePathId(int service_path_id);
    }
}