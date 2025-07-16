using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ApplicationDocumentUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ApplicationDocumentUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ApplicationDocument>> GetAll()
        {
            return unitOfWork.ApplicationDocumentRepository.GetAll();
        }
        public Task<List<CustomAttachedDocument>> GetAttachedOldDocuments(int application_document_id, int application_id)
        {
            return unitOfWork.ApplicationDocumentRepository.GetAttachedOldDocuments(application_document_id, application_id);
        }
        public Task<List<ApplicationDocument>> GetByServiceId(int service_id)
        {
            return unitOfWork.ApplicationDocumentRepository.GetByServiceId(service_id);
        }
        public Task<List<CustomAttachedOldDocument>> GetOldUploads(int application_id)
        {
            return unitOfWork.ApplicationDocumentRepository.GetOldUploads(application_id);
        }

        public Task<ApplicationDocument> GetOneByID(int id)
        {
            return unitOfWork.ApplicationDocumentRepository.GetOneByID(id);
        }

        public async Task<ApplicationDocument> Create(ApplicationDocument domain)
        {
            var result = await unitOfWork.ApplicationDocumentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ApplicationDocument> Update(ApplicationDocument domain)
        {
            await unitOfWork.ApplicationDocumentRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ApplicationDocument>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ApplicationDocumentRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ApplicationDocumentRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
