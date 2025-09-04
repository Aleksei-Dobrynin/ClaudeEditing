using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class StreetUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public StreetUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<Street>> GetAll()
        {
            return unitOfWork.StreetRepository.GetAll();
        }
        
        public Task<Street> GetOneByID(int id)
        {
            return unitOfWork.StreetRepository.GetOneByID(id);
        }

        public async Task<Street> Create(Street domain)
        {
            var result = await unitOfWork.StreetRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<Street> Update(Street domain)
        {
            await unitOfWork.StreetRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<Street>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.StreetRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.StreetRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}