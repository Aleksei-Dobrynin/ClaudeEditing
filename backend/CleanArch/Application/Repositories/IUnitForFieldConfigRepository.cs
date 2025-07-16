using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IUnitForFieldConfigRepository : BaseRepository
    {
        Task<List<UnitForFieldConfig>> GetAll();
        Task<List<UnitForFieldConfig>> GetByidFieldConfig(int idFieldConfig);
        Task<PaginatedList<UnitForFieldConfig>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(UnitForFieldConfig domain);
        Task Update(UnitForFieldConfig domain);
        Task<UnitForFieldConfig> GetOne(int id);
        Task<UnitForFieldConfig> GetOneByCode(string code);
        Task Delete(int id);
        

    }
}
