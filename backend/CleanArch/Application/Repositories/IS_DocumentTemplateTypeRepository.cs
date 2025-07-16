using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IS_DocumentTemplateTypeRepository : BaseRepository
    {
        Task<List<S_DocumentTemplateType>> GetAll();
        Task<PaginatedList<S_DocumentTemplateType>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(S_DocumentTemplateType domain);
        Task Update(S_DocumentTemplateType domain);
        Task<S_DocumentTemplateType> GetOne(int id);
        Task<S_DocumentTemplateType> GetOneByCode(string code);
        Task Delete(int id);
        


    }
}
