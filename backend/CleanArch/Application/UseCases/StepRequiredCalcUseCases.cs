using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class StepRequiredCalcUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public StepRequiredCalcUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<StepRequiredCalc>> GetAll()
        {
            return unitOfWork.StepRequiredCalcRepository.GetAll();
        }
        
        public Task<StepRequiredCalc> GetOneByID(int id)
        {
            return unitOfWork.StepRequiredCalcRepository.GetOneByID(id);
        }

        public async Task<StepRequiredCalc> Create(StepRequiredCalc domain)
        {
            var result = await unitOfWork.StepRequiredCalcRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<StepRequiredCalc> Update(StepRequiredCalc domain)
        {
            await unitOfWork.StepRequiredCalcRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<StepRequiredCalc>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.StepRequiredCalcRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.StepRequiredCalcRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
