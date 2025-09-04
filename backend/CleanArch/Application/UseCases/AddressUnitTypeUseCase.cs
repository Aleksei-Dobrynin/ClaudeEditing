using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class AddressUnitTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public AddressUnitTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<AddressUnitType>> GetAll()
        {
            return unitOfWork.AddressUnitTypeRepository.GetAll();
        }
        
        public Task<AddressUnitType> GetOneByID(int id)
        {
            return unitOfWork.AddressUnitTypeRepository.GetOneByID(id);
        }

        public async Task<AddressUnitType> Create(AddressUnitType domain)
        {
            var result = await unitOfWork.AddressUnitTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<AddressUnitType> Update(AddressUnitType domain)
        {
            await unitOfWork.AddressUnitTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<AddressUnitType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.AddressUnitTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.AddressUnitTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}