using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class AddressUnitUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public AddressUnitUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<AddressUnit>> GetAll()
        {
            return unitOfWork.AddressUnitRepository.GetAll();
        }
        
        public Task<AddressUnit> GetOneByID(int id)
        {
            return unitOfWork.AddressUnitRepository.GetOneByID(id);
        }

        public async Task<AddressUnit> Create(AddressUnit domain)
        {
            var result = await unitOfWork.AddressUnitRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<AddressUnit> Update(AddressUnit domain)
        {
            await unitOfWork.AddressUnitRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<AddressUnit>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.AddressUnitRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.AddressUnitRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}