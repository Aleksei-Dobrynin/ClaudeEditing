using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class WorkDayUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public WorkDayUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<WorkDay>> GetAll()
        {
            return unitOfWork.WorkDayRepository.GetAll();
        }
        public Task<WorkDay> GetOne(int id)
        {
            return unitOfWork.WorkDayRepository.GetOne(id);
        }
        public Task<List<WorkDay>> GetByschedule_id(int schedule_id)
        {
            return unitOfWork.WorkDayRepository.GetByschedule_id(schedule_id);
        }
        public async Task<WorkDay> Create(WorkDay domain)
        {
            var result = await unitOfWork.WorkDayRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<WorkDay> Update(WorkDay domain)
        {
            await unitOfWork.WorkDayRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<WorkDay>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.WorkDayRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.WorkDayRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }
    }
}
