using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class path_stepUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public path_stepUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<path_step>> GetAll()
        {
            return unitOfWork.path_stepRepository.GetAll();
        }
        public Task<path_step> GetOne(int id)
        {
            return unitOfWork.path_stepRepository.GetOne(id);
        }
        public async Task<path_step> Create(path_step domain)
        {
            var result = await unitOfWork.path_stepRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<path_step> Update(path_step domain)
        {
            await unitOfWork.path_stepRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<path_step>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.path_stepRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.path_stepRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<path_step>>  GetBypath_id(int path_id)
        {
            return unitOfWork.path_stepRepository.GetBypath_id(path_id);
        }
        
    }
}
