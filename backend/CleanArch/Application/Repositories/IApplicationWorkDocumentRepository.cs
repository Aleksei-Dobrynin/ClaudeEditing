using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationWorkDocumentRepository : BaseRepository
    {
        Task<List<ApplicationWorkDocument>> GetAll();
        Task<ApplicationWorkDocument> GetOneByID(int id);
        Task<List<uploaded_application_document>> GetByStepID(int app_step_id);
        Task<ApplicationWorkDocument> GetOneByFileID(int fileId);
        Task DeactivateDocument (ApplicationWorkDocument domain);
        Task<List<ApplicationWorkDocument>> GetByIDTask(int idTask);
        Task<List<ApplicationWorkDocument>> GetByIDApplication(int idApplication);
        Task<List<ApplicationWorkDocument>> GetByAppStepIds(int[] app_step_ids);
        Task<List<ApplicationWorkDocument>> GetByGuid(string guid);
        Task<ApplicationWorkDocument> GetOneByPath(string guid);
        Task<PaginatedList<ApplicationWorkDocument>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ApplicationWorkDocument domain);
        Task Update(ApplicationWorkDocument domain);
        Task Delete(int id);
    }
}
