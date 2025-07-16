using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IStructureReportRepository : BaseRepository
    {
        Task<List<StructureReport>> GetAll();
        Task<List<StructureReport>> GetbyidConfig(int idConfig);
        Task<List<StructureReport>> GetbyidStructure(int idStructure);
        Task<PaginatedList<StructureReport>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(StructureReport domain);
        Task Update(StructureReport domain);
        Task<StructureReport> GetOne(int id);
        Task<StructureReport> GetOneByCode(string code);
        Task Delete(int id);
        

    }
}
