using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IStructureReportStatusRepository : BaseRepository
    {
        Task<List<StructureReportStatus>> GetAll();
        Task<PaginatedList<StructureReportStatus>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(StructureReportStatus domain);
        Task Update(StructureReportStatus domain);
        Task<StructureReportStatus> GetOne(int id);
        Task<StructureReportStatus> GetOneByCode(string code);
        Task Delete(int id);
        

    }
}
