using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ICustomerDiscountRepository : BaseRepository
    {
        Task<List<CustomerDiscount>> GetAll();
        Task<CustomerDiscount> GetOneByID(int id);
        Task<CustomerDiscount> GetOneByPin(string pin);
        Task<PaginatedList<CustomerDiscount>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(CustomerDiscount domain);
        Task Update(CustomerDiscount domain);
        Task Delete(int id);
    }
}