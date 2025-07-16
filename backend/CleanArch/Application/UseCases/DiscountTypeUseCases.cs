using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class DiscountTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public DiscountTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<DiscountType>> GetAll()
        {
            return unitOfWork.DiscountTypeRepository.GetAll();
        }
        
        public Task<DiscountType> GetOneByID(int id)
        {
            return unitOfWork.DiscountTypeRepository.GetOneByID(id);
        }

        public async Task<DiscountType> Create(DiscountType domain)
        {
            var result = await unitOfWork.DiscountTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<DiscountType> Update(DiscountType domain)
        {
            await unitOfWork.DiscountTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<DiscountType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.DiscountTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.DiscountTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
