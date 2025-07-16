using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iidentity_document_typeRepository : BaseRepository
    {
        Task<List<identity_document_type>> GetAll();
        Task<PaginatedList<identity_document_type>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(identity_document_type domain);
        Task Update(identity_document_type domain);
        Task<identity_document_type> GetOne(int id);
        Task<identity_document_type> GetOneByCode(string id);
        Task Delete(int id);
        
        
    }
}
