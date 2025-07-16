using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IFileTypeForApplicationDocumentRepository : BaseRepository
    {
        Task<List<FileTypeForApplicationDocument>> GetAll();
        Task<FileTypeForApplicationDocument> GetOneByID(int id);
        Task<PaginatedList<FileTypeForApplicationDocument>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(FileTypeForApplicationDocument domain);
        Task Update(FileTypeForApplicationDocument domain);
        Task Delete(int id);
    }
}
