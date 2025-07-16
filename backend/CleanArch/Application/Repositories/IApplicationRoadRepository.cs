using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationRoadRepository : BaseRepository
    {
        Task<List<ApplicationRoad>> GetAll();
        Task<ApplicationRoad> GetByStatuses(int from_id, int to_id);
        Task<ApplicationRoad> GetOneByID(int id);
        Task<int> Add(ApplicationRoad domain);
        Task Update(ApplicationRoad domain);
        Task Delete(int id);
    }
}
