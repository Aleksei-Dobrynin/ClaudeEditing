using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Icontact_typeRepository : BaseRepository
    {
        Task<List<contact_type>> GetAll();
        Task<PaginatedList<contact_type>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(contact_type domain);
        Task Update(contact_type domain);
        Task<contact_type> GetOne(int id);
        Task<contact_type> GetOneByCode(string id);
        Task Delete(int id);
    }
}
