using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iuploaded_application_documentRepository : BaseRepository
    {
        Task<List<uploaded_application_document>> GetAll();
        Task<PaginatedList<uploaded_application_document>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(uploaded_application_document domain);
        Task Update(uploaded_application_document domain);
        Task<uploaded_application_document> GetOne(int id);
        Task<int> RejectDocument(int id);
        Task<int> SetDocumentStatus(int id, string status_code);
        Task<UpdatedDocument> GetUpdatedDocumentById(int id);
        Task Delete(int id);
        Task<int> CreateWithoutUser(uploaded_application_document domain);

        Task<List<uploaded_application_document>> GetByfile_id(int file_id);
        Task<List<uploaded_application_document>> GetByapplication_document_id(int application_document_id);
        Task<List<uploaded_application_document>> GetByservice_document_id(int service_document_id);
        Task<List<CustomUploadedDocument>> GetCustomByApplicationId(int application_document_id);
        Task<List<uploaded_application_document>> ByApplicationIdAndStepId(int application_document_id, int app_step_id);
        Task DeleteSoft(uploaded_application_document domain);
    }
}
