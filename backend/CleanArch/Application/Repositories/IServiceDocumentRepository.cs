using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IServiceDocumentRepository : BaseRepository
    {
        Task<List<ServiceDocument>> GetAll();
        Task<List<ServiceDocument>> GetByidService(int idService);
        Task<List<ServiceDocument>> GetByidServiceCabinet(int idService);
        Task<ServiceDocument> GetOneByID(int id);
        Task<PaginatedList<ServiceDocument>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ServiceDocument domain);
        Task Update(ServiceDocument domain);
        Task Delete(int id);
    }
}
