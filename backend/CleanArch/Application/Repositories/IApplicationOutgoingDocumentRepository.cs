using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationOutgoingDocumentRepository : BaseRepository
    {
        Task<List<ApplicationOutgoingDocument>> GetAll();
        Task<ApplicationOutgoingDocument> GetOneByID(int id);
        Task<PaginatedList<ApplicationOutgoingDocument>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ApplicationOutgoingDocument domain);
        Task Update(ApplicationOutgoingDocument domain);
        Task Delete(int id);
    }
}