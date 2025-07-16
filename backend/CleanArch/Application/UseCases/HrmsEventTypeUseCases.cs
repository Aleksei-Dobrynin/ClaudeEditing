using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class HrmsEventTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public HrmsEventTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<HrmsEventType>> GetAll()
        {
            return unitOfWork.HrmsEventTypeRepository.GetAll();
        }
        
        public Task<HrmsEventType> GetOneByID(int id)
        {
            return unitOfWork.HrmsEventTypeRepository.GetOneByID(id);
        }

        public async Task<HrmsEventType> Create(HrmsEventType domain)
        {
            var result = await unitOfWork.HrmsEventTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<HrmsEventType> Update(HrmsEventType domain)
        {
            await unitOfWork.HrmsEventTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<HrmsEventType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.HrmsEventTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.HrmsEventTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
