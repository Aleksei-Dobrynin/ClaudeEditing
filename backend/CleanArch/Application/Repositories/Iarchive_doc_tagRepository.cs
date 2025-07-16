using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iarchive_doc_tagRepository : BaseRepository
    {
        Task<List<archive_doc_tag>> GetAll();
        Task<List<archive_doc_tag>> GetByFileId(int fileId);
        Task<PaginatedList<archive_doc_tag>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(archive_doc_tag domain);
        Task Update(archive_doc_tag domain);
        Task<archive_doc_tag> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
