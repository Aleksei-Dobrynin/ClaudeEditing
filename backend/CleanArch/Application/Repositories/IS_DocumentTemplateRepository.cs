using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IS_DocumentTemplateRepository : BaseRepository
    {
        Task<List<S_DocumentTemplate>> GetAll();
        Task<List<S_DocumentTemplate>> GetByType(string type);
        Task<List<S_DocumentTemplate>> GetStructureReports(List<int> structure_ids);
        Task<PaginatedList<S_DocumentTemplate>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(S_DocumentTemplate domain);
        Task Update(S_DocumentTemplate domain);
        Task<S_DocumentTemplate> GetOne(int id);
        Task<S_DocumentTemplate> GetOneByCode(string code);
        Task Delete(int id);
        Task<S_DocumentTemplate> GetOneByLanguage(int id, string language);


        Task<List<S_DocumentTemplate>> GetByidCustomSvgIcon(int idCustomSvgIcon);
        Task<List<S_DocumentTemplate>> GetByidDocumentType(int idDocumentType);
        Task<List<S_DocumentTemplate>> GetByApplicationTypeAndID(int idDocumentType, int idApplication);
        Task<ApplicationCustomerIsOrganization> GetByApplicationIsOrganization(int idApplication);
    }
}
