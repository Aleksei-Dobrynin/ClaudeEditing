using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class UnitForFieldConfigUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public UnitForFieldConfigUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<UnitForFieldConfig>> GetAll()
        {
            return unitOfWork.UnitForFieldConfigRepository.GetAll();
        }

        public Task<List<UnitForFieldConfig>> GetByidFieldConfig(int idFieldConfig)
        {
            return unitOfWork.UnitForFieldConfigRepository.GetByidFieldConfig(idFieldConfig);
        }
        
        public Task<UnitForFieldConfig> GetOne(int id)
        {
            return unitOfWork.UnitForFieldConfigRepository.GetOne(id);
        }
        public async Task<UnitForFieldConfig> Create(UnitForFieldConfig domain)
        {
            var result = await unitOfWork.UnitForFieldConfigRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<UnitForFieldConfig> Update(UnitForFieldConfig domain)
        {
            await unitOfWork.UnitForFieldConfigRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<UnitForFieldConfig>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.UnitForFieldConfigRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.UnitForFieldConfigRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
