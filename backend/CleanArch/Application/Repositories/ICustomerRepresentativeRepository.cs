using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ICustomerRepresentativeRepository : BaseRepository
    {
        Task<List<CustomerRepresentative>> GetAll();
        Task<CustomerRepresentative> GetOneByID(int id);
        Task<List<CustomerRepresentative>> GetByidCustomer(int idCustomer);
        Task<PaginatedList<CustomerRepresentative>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(CustomerRepresentative domain);
        Task Update(CustomerRepresentative domain);
        Task Delete(int id);
    }
}
