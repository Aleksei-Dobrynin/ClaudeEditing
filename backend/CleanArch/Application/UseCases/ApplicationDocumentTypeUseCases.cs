using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ApplicationDocumentTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ApplicationDocumentTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ApplicationDocumentType>> GetAll()
        {
            return unitOfWork.ApplicationDocumentTypeRepository.GetAll();
        }
        
        public Task<ApplicationDocumentType> GetOneByID(int id)
        {
            return unitOfWork.ApplicationDocumentTypeRepository.GetOneByID(id);
        }

        public async Task<ApplicationDocumentType> Create(ApplicationDocumentType domain)
        {
            var result = await unitOfWork.ApplicationDocumentTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ApplicationDocumentType> Update(ApplicationDocumentType domain)
        {
            await unitOfWork.ApplicationDocumentTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ApplicationDocumentType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ApplicationDocumentTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ApplicationDocumentTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
