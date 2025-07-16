using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class architecture_statusUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public architecture_statusUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<architecture_status>> GetAll()
        {
            return unitOfWork.architecture_statusRepository.GetAll();
        }
        public Task<architecture_status> GetOne(int id)
        {
            return unitOfWork.architecture_statusRepository.GetOne(id);
        }
        public async Task<architecture_status> Create(architecture_status domain)
        {
            var result = await unitOfWork.architecture_statusRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<architecture_status> Update(architecture_status domain)
        {
            await unitOfWork.architecture_statusRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<architecture_status>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.architecture_statusRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.architecture_statusRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
