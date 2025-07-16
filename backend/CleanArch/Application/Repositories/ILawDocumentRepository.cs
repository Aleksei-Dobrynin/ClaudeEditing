using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ILawDocumentRepository : BaseRepository
    {
        Task<List<LawDocument>> GetAll();
        Task<LawDocument> GetOneByID(int id);
        Task<PaginatedList<LawDocument>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(LawDocument domain);
        Task Update(LawDocument domain);
        Task Delete(int id);
    }
}