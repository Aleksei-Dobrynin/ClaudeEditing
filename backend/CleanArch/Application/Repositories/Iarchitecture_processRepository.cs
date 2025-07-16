using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iarchitecture_processRepository : BaseRepository
    {
        Task<List<architecture_process>> GetAll();
        Task<List<architecture_process>> GetAllToArchive();
        Task<PaginatedList<architecture_process>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(architecture_process domain);
        Task Update(architecture_process domain);
        Task<architecture_process> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<architecture_process>> GetBystatus_id(int status_id);
    }
}
