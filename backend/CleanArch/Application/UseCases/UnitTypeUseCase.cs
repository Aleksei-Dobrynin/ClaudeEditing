using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class UnitTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public UnitTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<UnitType>> GetAll()
        {
            return unitOfWork.UnitTypeRepository.GetAll();
        }
        public async Task<List<UnitType>> GetAllSquare()
        {
            var res = await unitOfWork.UnitTypeRepository.GetAll();
            return res.Where(x => x.type == "square").ToList();
        }
        public Task<UnitType> GetOne(int id)
        {
            return unitOfWork.UnitTypeRepository.GetOne(id);
        }
        public async Task<UnitType> Create(UnitType domain)
        {
            var result = await unitOfWork.UnitTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<UnitType> Update(UnitType domain)
        {
            await unitOfWork.UnitTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<UnitType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.UnitTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.UnitTypeRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
