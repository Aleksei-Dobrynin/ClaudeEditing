using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class DistrictUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public DistrictUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<District>> GetAll()
        {
            return unitOfWork.DistrictRepository.GetAll();
        }
        
        public Task<District> GetOneByID(int id)
        {
            return unitOfWork.DistrictRepository.GetOneByID(id);
        }

        public async Task<District> Create(District domain)
        {
            var result = await unitOfWork.DistrictRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<District> Update(District domain)
        {
            await unitOfWork.DistrictRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<District>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.DistrictRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.DistrictRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
