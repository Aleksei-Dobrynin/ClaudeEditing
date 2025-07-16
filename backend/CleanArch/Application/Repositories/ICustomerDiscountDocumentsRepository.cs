using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ICustomerDiscountDocumentsRepository : BaseRepository
    {
        Task<List<CustomerDiscountDocuments>> GetAll();
        Task<List<CustomerDiscountDocuments>> GetByIdCustomer(int idCustomer);
        Task<CustomerDiscountDocuments> GetOneByID(int id);
        Task<PaginatedList<CustomerDiscountDocuments>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(CustomerDiscountDocuments domain);
        Task Update(CustomerDiscountDocuments domain);
        Task Delete(int id);
    }
}