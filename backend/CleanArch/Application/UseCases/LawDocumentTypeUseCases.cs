using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class LawDocumentTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public LawDocumentTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<LawDocumentType>> GetAll()
        {
            return unitOfWork.LawDocumentTypeRepository.GetAll();
        }
        
        public Task<LawDocumentType> GetOneByID(int id)
        {
            return unitOfWork.LawDocumentTypeRepository.GetOneByID(id);
        }

        public async Task<LawDocumentType> Create(LawDocumentType domain)
        {
            var result = await unitOfWork.LawDocumentTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<LawDocumentType> Update(LawDocumentType domain)
        {
            await unitOfWork.LawDocumentTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<LawDocumentType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.LawDocumentTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.LawDocumentTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
