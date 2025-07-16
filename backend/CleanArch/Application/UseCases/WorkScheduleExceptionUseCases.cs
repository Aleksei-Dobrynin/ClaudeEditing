using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class WorkScheduleExceptionUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public WorkScheduleExceptionUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<WorkScheduleException>> GetAll()
        {
            return unitOfWork.WorkScheduleExceptionRepository.GetAll();
        }
        public Task<WorkScheduleException> GetOne(int id)
        {
            return unitOfWork.WorkScheduleExceptionRepository.GetOne(id);
        }
        public Task<List<WorkScheduleException>> GetByschedule_id(int id)
        {
            return unitOfWork.WorkScheduleExceptionRepository.GetByschedule_id(id);
        }
        
        public async Task<WorkScheduleException> Create(WorkScheduleException domain)
        {
            var result = await unitOfWork.WorkScheduleExceptionRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<WorkScheduleException> Update(WorkScheduleException domain)
        {
            await unitOfWork.WorkScheduleExceptionRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<WorkScheduleException>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.WorkScheduleExceptionRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.WorkScheduleExceptionRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }
    }
}
