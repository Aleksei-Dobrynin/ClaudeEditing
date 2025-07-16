using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationRequiredCalcRepository : BaseRepository
    {
        Task<List<ApplicationRequiredCalc>> GetAll();
        Task<ApplicationRequiredCalc> GetOneByID(int id);
        Task<PaginatedList<ApplicationRequiredCalc>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ApplicationRequiredCalc domain);
        Task Update(ApplicationRequiredCalc domain);
        Task Delete(int id);
        Task<List<ApplicationRequiredCalc>> GetByApplicationId(int id);
    }
}