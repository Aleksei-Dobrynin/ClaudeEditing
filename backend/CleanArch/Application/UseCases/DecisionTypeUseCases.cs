using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class DecisionTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public DecisionTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<DecisionType>> GetAll()
        {
            return unitOfWork.DecisionTypeRepository.GetAll();
        }
        
        public Task<DecisionType> GetOneByID(int id)
        {
            return unitOfWork.DecisionTypeRepository.GetOneByID(id);
        }

        public async Task<DecisionType> Create(DecisionType domain)
        {
            var result = await unitOfWork.DecisionTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<DecisionType> Update(DecisionType domain)
        {
            await unitOfWork.DecisionTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<DecisionType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.DecisionTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.DecisionTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
