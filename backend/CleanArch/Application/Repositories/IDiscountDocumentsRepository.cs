using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IDiscountDocumentsRepository : BaseRepository
    {
        Task<List<DiscountDocuments>> GetAll();
        Task<DiscountDocuments> GetOneByID(int id);
        Task<PaginatedList<DiscountDocuments>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(DiscountDocuments domain);
        Task Update(DiscountDocuments domain);
        Task Delete(int id);
    }
}