using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iorg_structure_templatesRepository : BaseRepository
    {
        Task<List<org_structure_templates>> GetAll();
        Task<PaginatedList<org_structure_templates>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(org_structure_templates domain);
        Task Update(org_structure_templates domain);
        Task<org_structure_templates> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<org_structure_templates>> GetBystructure_id(int structure_id);
        Task<List<org_structure_templates>> GetBytemplate_id(int template_id);
        Task<List<S_DocumentTemplateWithLanguage>> GetMyTemplates(int user_id);
    }
}
