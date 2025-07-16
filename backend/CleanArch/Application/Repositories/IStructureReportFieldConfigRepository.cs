using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IStructureReportFieldConfigRepository : BaseRepository
    {
        Task<List<StructureReportFieldConfig>> GetAll();
        Task<List<StructureReportFieldConfig>> GetByidReportConfig(int idReportConfig);
        Task<PaginatedList<StructureReportFieldConfig>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(StructureReportFieldConfig domain);
        Task Update(StructureReportFieldConfig domain);
        Task<StructureReportFieldConfig> GetOne(int id);
        Task<StructureReportFieldConfig> GetOneByCode(string code);
        Task Delete(int id);
        

    }
}
