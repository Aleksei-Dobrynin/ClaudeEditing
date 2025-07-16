using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IStepStatusLogRepository : BaseRepository
    {
        Task<List<StepStatusLog>> GetAll();
        Task<StepStatusLog> GetOneByID(int id);
        Task<List<StepStatusLog>> GetByAplicationStep(int idAplication);
        Task<PaginatedList<StepStatusLog>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(StepStatusLog domain);
        Task Update(StepStatusLog domain);
        Task Delete(int id);
    }
}