using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Idocument_approvalRepository : BaseRepository
    {
        Task<List<document_approval>> GetAll();
        Task<PaginatedList<document_approval>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(document_approval domain);
        Task Update(document_approval domain);
        Task<document_approval> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<document_approval>> GetByapp_document_id(int app_document_id);
        Task<List<document_approval>> GetByfile_sign_id(int file_sign_id);
        Task<List<document_approval>> GetBydepartment_id(int department_id);
        Task<List<document_approval>> GetByUplIds(int[] uplIds);
        Task<List<document_approval>> GetByAppStepIds(int[] appStepIds);
        Task<List<document_approval>> GetByposition_id(int position_id);

        /// <summary>
        /// �������� ��� ������������ ��� ����������� application_step
        /// �����: ������������ ��� �������� ������������ �����
        /// </summary>
        Task<List<document_approval>> GetByapp_step_id(int app_step_id);
        Task ResetByUploadedDocumentId(int uplId);

        /// <summary>
        /// Получает согласования по ID заявки с сортировкой по order_number
        /// Включает информацию о department_name и position_name
        /// </summary>
        /// <param name="applicationId">ID заявки</param>
        /// <param name="stepId">ID этапа (опционально)</param>
        /// <returns>Список согласований, отсортированный по order_number (NULL в конец)</returns>
        Task<List<document_approval>> GetByApplicationId(int applicationId, int? stepId = null);

    }
}
