using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ILawDocumentTypeRepository : BaseRepository
    {
        Task<List<LawDocumentType>> GetAll();
        Task<LawDocumentType> GetOneByID(int id);
        Task<PaginatedList<LawDocumentType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(LawDocumentType domain);
        Task Update(LawDocumentType domain);
        Task Delete(int id);
    }
}