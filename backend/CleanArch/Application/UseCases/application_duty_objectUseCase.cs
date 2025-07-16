using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class application_duty_objectUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public application_duty_objectUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<application_duty_object>> GetAll()
        {
            return unitOfWork.application_duty_objectRepository.GetAll();
        }
        public Task<application_duty_object> GetOne(int id)
        {
            return unitOfWork.application_duty_objectRepository.GetOne(id);
        }
        public async Task<application_duty_object> Create(application_duty_object domain)
        {
            var result = await unitOfWork.application_duty_objectRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<application_duty_object> Update(application_duty_object domain)
        {
            await unitOfWork.application_duty_objectRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<application_duty_object>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.application_duty_objectRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.application_duty_objectRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<application_duty_object>>  GetBydutyplan_object_id(int dutyplan_object_id)
        {
            return unitOfWork.application_duty_objectRepository.GetBydutyplan_object_id(dutyplan_object_id);
        }
        
        public Task<List<application_duty_object>>  GetByapplication_id(int application_id)
        {
            return unitOfWork.application_duty_objectRepository.GetByapplication_id(application_id);
        }
        
    }
}
