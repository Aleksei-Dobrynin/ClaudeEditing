using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ApplicationRequiredCalcUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ApplicationRequiredCalcUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ApplicationRequiredCalc>> GetAll()
        {
            return unitOfWork.ApplicationRequiredCalcRepository.GetAll();
        }
        
        public Task<ApplicationRequiredCalc> GetOneByID(int id)
        {
            return unitOfWork.ApplicationRequiredCalcRepository.GetOneByID(id);
        }

        public async Task<ApplicationRequiredCalc> Create(ApplicationRequiredCalc domain)
        {
            var result = await unitOfWork.ApplicationRequiredCalcRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ApplicationRequiredCalc> Update(ApplicationRequiredCalc domain)
        {
            await unitOfWork.ApplicationRequiredCalcRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ApplicationRequiredCalc>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ApplicationRequiredCalcRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ApplicationRequiredCalcRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
