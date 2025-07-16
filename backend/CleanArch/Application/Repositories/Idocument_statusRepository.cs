using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Idocument_statusRepository : BaseRepository
    {
        Task<List<document_status>> GetAll();
        Task<PaginatedList<document_status>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(document_status domain);
        Task Update(document_status domain);
        Task<document_status> GetOne(int id);
        Task<document_status> GetOneByCode(string code);
        Task Delete(int id);
        

    }
}
