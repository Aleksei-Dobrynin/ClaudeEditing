using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IDiscountDocumentTypeRepository : BaseRepository
    {
        Task<List<DiscountDocumentType>> GetAll();
        Task<DiscountDocumentType> GetOneByID(int id);
        Task<PaginatedList<DiscountDocumentType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(DiscountDocumentType domain);
        Task Update(DiscountDocumentType domain);
        Task Delete(int id);
    }
}