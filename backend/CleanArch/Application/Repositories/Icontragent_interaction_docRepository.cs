using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Icontragent_interaction_docRepository : BaseRepository
    {
        Task<List<contragent_interaction_doc>> GetAll();
        Task<PaginatedList<contragent_interaction_doc>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(contragent_interaction_doc domain);
        Task Update(contragent_interaction_doc domain);
        Task<contragent_interaction_doc> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<contragent_interaction_doc>> GetByfile_id(int file_id);
        Task<List<contragent_interaction_doc>> GetByinteraction_id(int interaction_id);
    }
}
