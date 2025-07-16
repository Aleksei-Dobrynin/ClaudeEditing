using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IWorkDocumentTypeRepository : BaseRepository
    {
        Task<List<WorkDocumentType>> GetAll();
        Task<WorkDocumentType> GetOneByID(int id);
        Task<WorkDocumentType> GetOneByCode(string code);
        Task<PaginatedList<WorkDocumentType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(WorkDocumentType domain);
        Task Update(WorkDocumentType domain);
        Task Delete(int id);
    }
}
