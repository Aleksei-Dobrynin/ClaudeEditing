using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IStructureReportFieldRepository : BaseRepository
    {
        Task<List<StructureReportField>> GetAll();
        Task<PaginatedList<StructureReportField>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(StructureReportField domain);
        Task Update(StructureReportField domain);
        Task<StructureReportField> GetOne(int id);
        Task<StructureReportField> GetOneByCode(string code);
        Task Delete(int id);
        Task<List<StructureReportField>> GetByidFieldConfig(int idFieldConfig);
        Task<List<StructureReportField>> GetByidReport(int idReport);

    }
}
