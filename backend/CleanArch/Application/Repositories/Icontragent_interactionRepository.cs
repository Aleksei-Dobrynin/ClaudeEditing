using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Icontragent_interactionRepository : BaseRepository
    {
        Task<List<contragent_interaction>> GetAll();
        Task<PaginatedList<contragent_interaction>> GetPaginated(int pageSize, int pageNumber);
        Task<List<contragent_interaction>> GetFilter(string pin, string address, string number, DateTime? date_start, DateTime? date_end);
        Task<int> Add(contragent_interaction domain);
        Task Update(contragent_interaction domain);
        Task<contragent_interaction> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<contragent_interaction>> GetByapplication_id(int application_id);
        Task<List<contragent_interaction>> GetBytask_id(int task_id);
        Task<List<contragent_interaction>> GetBycontragent_id(int contragent_id);
    }
}
