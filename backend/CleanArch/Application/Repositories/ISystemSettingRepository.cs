using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ISystemSettingRepository : BaseRepository
    {
        Task<List<SystemSetting>> GetAll();
        Task<SystemSetting> GetOneByID(int id);
        Task<List<SystemSetting>> GetByCodes(List<string> codes);
        Task<PaginatedList<SystemSetting>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(SystemSetting domain);
        Task Update(SystemSetting domain);
        Task Delete(int id);
    }
}