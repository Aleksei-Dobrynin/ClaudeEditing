using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ApplicationOutgoingDocumentUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ApplicationOutgoingDocumentUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ApplicationOutgoingDocument>> GetAll()
        {
            return unitOfWork.ApplicationOutgoingDocumentRepository.GetAll();
        }
        
        public Task<ApplicationOutgoingDocument> GetOneByID(int id)
        {
            return unitOfWork.ApplicationOutgoingDocumentRepository.GetOneByID(id);
        }

        public async Task<ApplicationOutgoingDocument> Create(ApplicationOutgoingDocument domain)
        {
            var result = await unitOfWork.ApplicationOutgoingDocumentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ApplicationOutgoingDocument> Update(ApplicationOutgoingDocument domain)
        {
            await unitOfWork.ApplicationOutgoingDocumentRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ApplicationOutgoingDocument>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ApplicationOutgoingDocumentRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ApplicationOutgoingDocumentRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
