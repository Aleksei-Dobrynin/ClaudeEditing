using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ICustomerRepository : BaseRepository
    {
        Task<List<Customer>> GetAll();
        Task<List<Customer>> GetAllBySearch(string text);
        Task<Customer> GetOneByID(int id);
        Task<PaginatedList<Customer>> GetPaginated(int pageSize, int pageNumber, string orderBy, string orderType);
        Task<int> Add(Customer domain);
        Task Update(Customer domain);
        Task Delete(int id);
        Task<Customer> GetOneByPin(string pin, int customer_id);
    }
}