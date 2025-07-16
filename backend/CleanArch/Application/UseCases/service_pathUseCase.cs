using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class service_pathUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public service_pathUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<service_path>> GetAll()
        {
            return unitOfWork.service_pathRepository.GetAll();
        }
        public Task<service_path> GetOne(int id)
        {
            return unitOfWork.service_pathRepository.GetOne(id);
        }
        public async Task<service_path> Create(service_path domain)
        {
            var result = await unitOfWork.service_pathRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<service_path> Update(service_path domain)
        {
            await unitOfWork.service_pathRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<service_path>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.service_pathRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.service_pathRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<service_path>>  GetByservice_id(int service_id)
        {
            return unitOfWork.service_pathRepository.GetByservice_id(service_id);
        }
        
    }
}
