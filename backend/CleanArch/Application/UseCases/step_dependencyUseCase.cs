using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class step_dependencyUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public step_dependencyUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<step_dependency>> GetAll()
        {
            return unitOfWork.step_dependencyRepository.GetAll();
        }

        public Task<List<step_dependency>> GetByFilter(int service_path_id)
        {
            if (service_path_id == 0)
            {
                return unitOfWork.step_dependencyRepository.GetAll();
            }
            return unitOfWork.step_dependencyRepository.GetByServicePathId(service_path_id);
        }

        public Task<step_dependency> GetOne(int id)
        {
            return unitOfWork.step_dependencyRepository.GetOne(id);
        }
        public async Task<step_dependency> Create(step_dependency domain)
        {
            var result = await unitOfWork.step_dependencyRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<step_dependency> Update(step_dependency domain)
        {
            await unitOfWork.step_dependencyRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<step_dependency>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.step_dependencyRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.step_dependencyRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



        public Task<List<step_dependency>> GetBydependent_step_id(int dependent_step_id)
        {
            return unitOfWork.step_dependencyRepository.GetBydependent_step_id(dependent_step_id);
        }

        public Task<List<step_dependency>> GetByprerequisite_step_id(int prerequisite_step_id)
        {
            return unitOfWork.step_dependencyRepository.GetByprerequisite_step_id(prerequisite_step_id);
        }

    }
}