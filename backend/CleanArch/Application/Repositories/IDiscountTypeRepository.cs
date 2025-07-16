using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IDiscountTypeRepository : BaseRepository
    {
        Task<List<DiscountType>> GetAll();
        Task<DiscountType> GetOneByID(int id);
        Task<PaginatedList<DiscountType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(DiscountType domain);
        Task Update(DiscountType domain);
        Task Delete(int id);
    }
}