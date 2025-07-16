using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationInReestrCalcRepository : BaseRepository
    {
        Task<List<ApplicationInReestrCalc>> GetAll();
        Task<ApplicationInReestrCalc> GetOneByID(int id);
        Task<PaginatedList<ApplicationInReestrCalc>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ApplicationInReestrCalc domain);
        Task Update(ApplicationInReestrCalc domain);
        Task Delete(int id);
        Task DeleteByAppReestrId(int id);
    }
}