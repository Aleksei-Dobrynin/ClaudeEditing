using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IFileForApplicationDocumentRepository : BaseRepository
    {
        Task<List<FileForApplicationDocument>> GetAll();
        Task<List<FileForApplicationDocument>> GetByidDocument(int idDocument);
        Task<FileForApplicationDocument> GetOneByID(int id);
        Task<PaginatedList<FileForApplicationDocument>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(FileForApplicationDocument domain);
        Task Update(FileForApplicationDocument domain);
        Task Delete(int id);
    }
}
