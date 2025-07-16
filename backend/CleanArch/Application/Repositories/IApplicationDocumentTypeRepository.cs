using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationDocumentTypeRepository : BaseRepository
    {
        Task<List<ApplicationDocumentType>> GetAll();
        Task<ApplicationDocumentType> GetOneByID(int id);
        Task<PaginatedList<ApplicationDocumentType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ApplicationDocumentType domain);
        Task Update(ApplicationDocumentType domain);
        Task Delete(int id);
    }
}
