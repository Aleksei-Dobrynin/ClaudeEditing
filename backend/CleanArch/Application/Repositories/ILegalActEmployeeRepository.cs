using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ILegalActEmployeeRepository : BaseRepository
    {
        Task<List<LegalActEmployee>> GetAll();
        Task<PaginatedList<LegalActEmployee>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(LegalActEmployee domain);
        Task Update(LegalActEmployee domain);
        Task<LegalActEmployee> GetOne(int id);
        Task Delete(int id);

        Task<List<LegalActEmployee>> GetByIdAct(int idAct);
        Task<List<LegalActEmployee>> GetByIdStructureEmployee(int idStructureEmployee);
    }
}