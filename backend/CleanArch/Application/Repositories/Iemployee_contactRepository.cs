using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iemployee_contactRepository : BaseRepository
    {
        Task<List<employee_contact>> GetAll();
        Task<List<employee_contact>> GetContactsByEmployeeId(int employee_id);
        Task<PaginatedList<employee_contact>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(employee_contact domain);
        Task Update(employee_contact domain);
        //Task<int> SetTelegramContact(SetTelegramContact domain);
        Task<employee_contact> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
