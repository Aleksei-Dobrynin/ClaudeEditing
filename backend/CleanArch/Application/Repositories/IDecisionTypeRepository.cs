using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IDecisionTypeRepository : BaseRepository
    {
        Task<List<DecisionType>> GetAll();
        Task<DecisionType> GetOneByID(int id);
        Task<PaginatedList<DecisionType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(DecisionType domain);
        Task Update(DecisionType domain);
        Task Delete(int id);
    }
}