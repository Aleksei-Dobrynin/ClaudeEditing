using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class DutyPlanLogUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public DutyPlanLogUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<DutyPlanLog>> GetAll()
        {
            return unitOfWork.DutyPlanLogRepository.GetAll();
        }

        public Task<DutyPlanLog> GetOneByID(int id)
        {
            return unitOfWork.DutyPlanLogRepository.GetOneByID(id);
        }

        public async Task<DutyPlanLog> Create(DutyPlanLog domain)
        {
            domain.created_at = DateTime.UtcNow;
            domain.updated_at = DateTime.UtcNow;
            var result = await unitOfWork.DutyPlanLogRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<DutyPlanLog> Update(DutyPlanLog domain)
        {
            domain.updated_at = DateTime.UtcNow;
            await unitOfWork.DutyPlanLogRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<DutyPlanLog>> GetPaginated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.DutyPlanLogRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.DutyPlanLogRepository.Delete(id);
            unitOfWork.Commit();
        }
        
        public Task<List<DutyPlanLog>> GetByFilter(ArchiveLogFilter filter)
        {
            return unitOfWork.DutyPlanLogRepository.GetByFilter(filter);
        }
    }
}