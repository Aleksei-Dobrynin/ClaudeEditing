using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class WorkDocumentTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public WorkDocumentTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<WorkDocumentType>> GetAll()
        {
            return unitOfWork.WorkDocumentTypeRepository.GetAll();
        }
        
        public Task<WorkDocumentType> GetOneByID(int id)
        {
            return unitOfWork.WorkDocumentTypeRepository.GetOneByID(id);
        }

        public async Task<WorkDocumentType> Create(WorkDocumentType domain)
        {
            var result = await unitOfWork.WorkDocumentTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<WorkDocumentType> Update(WorkDocumentType domain)
        {
            await unitOfWork.WorkDocumentTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<WorkDocumentType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.WorkDocumentTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.WorkDocumentTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
