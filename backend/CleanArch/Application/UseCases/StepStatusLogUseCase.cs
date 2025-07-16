using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class StepStatusLogUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public StepStatusLogUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<StepStatusLog>> GetAll()
        {
            return unitOfWork.StepStatusLogRepository.GetAll();
        }
        
        public Task<StepStatusLog> GetOneByID(int id)
        {
            return unitOfWork.StepStatusLogRepository.GetOneByID(id);
        }

        public async Task<StepStatusLog> Create(StepStatusLog domain)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.created_by = user_id;
            domain.updated_by = user_id;
            domain.created_at = DateTime.Now;
            domain.updated_at = DateTime.Now;

            var result = await unitOfWork.StepStatusLogRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        //public async Task<StepStatusLog> ReturnStep(StepStatusLog domain)
        //{

        //    var step = unitOfWork.application_stepRepository.GetOne(domain.app_step_id); 
        //    var result = await unitOfWork.StepStatusLogRepository.Add(domain);
        //    domain.id = result;
        //    unitOfWork.Commit();
        //    return domain;
        //}

        

        public async Task<StepStatusLog> Update(StepStatusLog domain)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.updated_by = user_id;
            domain.updated_at = DateTime.Now;
            await unitOfWork.StepStatusLogRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<StepStatusLog>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.StepStatusLogRepository.GetPaginated(pageSize, pageNumber);
        }

        public Task<List<StepStatusLog>> GetByAplicationStep(int id)
        {
            return unitOfWork.StepStatusLogRepository.GetByAplicationStep(id);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.StepStatusLogRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}