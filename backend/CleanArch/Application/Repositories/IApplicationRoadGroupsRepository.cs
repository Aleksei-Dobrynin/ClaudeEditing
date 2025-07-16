using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationRoadGroupsRepository : BaseRepository
    {
        Task<int> Add(ApplicationRoadGroups domain);
        Task Update(ApplicationRoadGroups domain);
        Task<ApplicationRoadGroups> GetOneByID(int id);
    }
}
