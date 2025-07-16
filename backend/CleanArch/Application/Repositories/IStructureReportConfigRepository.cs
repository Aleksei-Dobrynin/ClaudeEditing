using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IStructureReportConfigRepository : BaseRepository
    {
        Task<List<StructureReportConfig>> GetAll();
        Task<List<StructureReportConfig>> GetbyidStructure(int idStructure);
        Task<PaginatedList<StructureReportConfig>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(StructureReportConfig domain);
        Task Update(StructureReportConfig domain);
        Task<StructureReportConfig> GetOne(int id);
        Task<StructureReportConfig> GetOneByCode(string code);
        Task Delete(int id);
        

    }
}
