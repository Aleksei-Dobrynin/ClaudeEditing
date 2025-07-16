using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class DiscountDocumentTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public DiscountDocumentTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<DiscountDocumentType>> GetAll()
        {
            return unitOfWork.DiscountDocumentTypeRepository.GetAll();
        }
        
        public Task<DiscountDocumentType> GetOneByID(int id)
        {
            return unitOfWork.DiscountDocumentTypeRepository.GetOneByID(id);
        }

        public async Task<DiscountDocumentType> Create(DiscountDocumentType domain)
        {
            var result = await unitOfWork.DiscountDocumentTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<DiscountDocumentType> Update(DiscountDocumentType domain)
        {
            await unitOfWork.DiscountDocumentTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<DiscountDocumentType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.DiscountDocumentTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.DiscountDocumentTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
