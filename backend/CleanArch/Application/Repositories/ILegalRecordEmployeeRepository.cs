using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ILegalRecordEmployeeRepository : BaseRepository
    {
        Task<List<LegalRecordEmployee>> GetAll();
        Task<PaginatedList<LegalRecordEmployee>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(LegalRecordEmployee domain);
        Task Update(LegalRecordEmployee domain);
        Task<LegalRecordEmployee> GetOne(int id);
        Task Delete(int id);

        Task<List<LegalRecordEmployee>> GetByIdRecord(int idRecord);
        Task<List<LegalRecordEmployee>> GetByIdStructureEmployee(int idStructureEmployee);
    }
}