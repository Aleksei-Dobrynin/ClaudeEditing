using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Ifaq_questionRepository : BaseRepository
    {
        Task<List<faq_question>> GetAll();
        Task<PaginatedList<faq_question>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(faq_question domain);
        Task Update(faq_question domain);
        Task<faq_question> GetOne(int id);
        Task Delete(int id);
        
        
    }
}
