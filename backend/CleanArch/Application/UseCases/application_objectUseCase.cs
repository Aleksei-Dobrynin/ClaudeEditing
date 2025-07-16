using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class application_objectUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public application_objectUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<application_object>> GetAll()
        {
            return unitOfWork.application_objectRepository.GetAll();
        }
        public Task<application_object> GetOne(int id)
        {
            return unitOfWork.application_objectRepository.GetOne(id);
        }
        public async Task<application_object> Create(application_object domain)
        {
            var result = await unitOfWork.application_objectRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<application_object> Update(application_object domain)
        {
            await unitOfWork.application_objectRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<application_object>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.application_objectRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.application_objectRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<application_object>>  GetByapplication_id(int application_id)
        {
            return unitOfWork.application_objectRepository.GetByapplication_id(application_id);
        }
        
        public Task<List<application_object>>  GetByarch_object_id(int arch_object_id)
        {
            return unitOfWork.application_objectRepository.GetByarch_object_id(arch_object_id);
        }
        
    }
}
