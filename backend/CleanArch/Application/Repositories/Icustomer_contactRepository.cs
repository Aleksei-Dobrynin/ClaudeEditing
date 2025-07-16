using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Icustomer_contactRepository : BaseRepository
    {
        Task<List<customer_contact>> GetAll();
        Task<PaginatedList<customer_contact>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(customer_contact domain);
        Task Update(customer_contact domain);
        Task<customer_contact> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<customer_contact>> GetBytype_id(int type_id);
        Task<List<customer_contact>> GetBycustomer_id(int customer_id);
        Task<List<customer_contact>> GetByNumber(string value);

        Task<int> AddTelegram(telegram domain);
        Task<telegram> GetOneTelegram(string chat_id, string number);
        Task<List<telegram>> GetTelegramByNumber(string number);
    }
}
