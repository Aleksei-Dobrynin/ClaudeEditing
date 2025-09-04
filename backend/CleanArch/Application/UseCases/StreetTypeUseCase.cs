using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class StreetTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public StreetTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<StreetType>> GetAll()
        {
            return unitOfWork.StreetTypeRepository.GetAll();
        }
        
        public Task<StreetType> GetOneByID(int id)
        {
            return unitOfWork.StreetTypeRepository.GetOneByID(id);
        }

        public async Task<StreetType> Create(StreetType domain)
        {
            var result = await unitOfWork.StreetTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<StreetType> Update(StreetType domain)
        {
            await unitOfWork.StreetTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<StreetType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.StreetTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.StreetTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}