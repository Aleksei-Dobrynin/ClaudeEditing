using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IStepRequiredCalcRepository : BaseRepository
    {
        Task<List<StepRequiredCalc>> GetAll();
        Task<StepRequiredCalc> GetOneByID(int id);
        Task<PaginatedList<StepRequiredCalc>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(StepRequiredCalc domain);
        Task Update(StepRequiredCalc domain);
        Task Delete(int id);
        Task<StepRequiredCalc> GetOneByStepIdAndStructureId(int step_id, int structure_id);
    }
}