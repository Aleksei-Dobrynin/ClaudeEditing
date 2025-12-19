using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class document_approval_sync_logUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public document_approval_sync_logUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<document_approval_sync_log>> GetAll()
        {
            return unitOfWork.document_approval_sync_logRepository.GetAll();
        }

        public Task<document_approval_sync_log> GetOne(int id)
        {
            return unitOfWork.document_approval_sync_logRepository.GetOne(id);
        }

        public async Task<document_approval_sync_log> Create(document_approval_sync_log domain)
        {
            // Set synced_at to current time if not provided
            if (domain.synced_at == default(DateTime))
            {
                domain.synced_at = DateTime.UtcNow;
            }

            var result = await unitOfWork.document_approval_sync_logRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<document_approval_sync_log> Update(document_approval_sync_log domain)
        {
            await unitOfWork.document_approval_sync_logRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<document_approval_sync_log>> GetPaginated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.document_approval_sync_logRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.document_approval_sync_logRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }

        public Task<List<document_approval_sync_log>> GetBydocument_approval_id(int document_approval_id)
        {
            return unitOfWork.document_approval_sync_logRepository.GetBydocument_approval_id(document_approval_id);
        }

        public Task<List<document_approval_sync_log>> GetBysynced_by(int synced_by)
        {
            return unitOfWork.document_approval_sync_logRepository.GetBysynced_by(synced_by);
        }

        public Task<List<document_approval_sync_log>> GetBysync_reason(string sync_reason)
        {
            return unitOfWork.document_approval_sync_logRepository.GetBysync_reason(sync_reason);
        }

        public Task<List<document_approval_sync_log>> GetByoperation_type(string operation_type)
        {
            return unitOfWork.document_approval_sync_logRepository.GetByoperation_type(operation_type);
        }

        public Task<List<document_approval_sync_log>> GetByDateRange(DateTime startDate, DateTime endDate)
        {
            return unitOfWork.document_approval_sync_logRepository.GetByDateRange(startDate, endDate);
        }
    }
}