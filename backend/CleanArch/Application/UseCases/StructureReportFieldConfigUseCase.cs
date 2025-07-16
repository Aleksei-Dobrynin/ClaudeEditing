using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class StructureReportFieldConfigUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public StructureReportFieldConfigUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<StructureReportFieldConfig>> GetAll()
        {
            return unitOfWork.StructureReportFieldConfigRepository.GetAll();
        }

        public Task<List<StructureReportFieldConfig>> GetByidReportConfig(int idReportConfig)
        {
            return unitOfWork.StructureReportFieldConfigRepository.GetByidReportConfig(idReportConfig);
        }

        public Task<StructureReportFieldConfig> GetOne(int id)
        {
            return unitOfWork.StructureReportFieldConfigRepository.GetOne(id);
        }
        public async Task<StructureReportFieldConfig> Create(StructureReportFieldConfig domain)
        {
            var result = await unitOfWork.StructureReportFieldConfigRepository.Add(domain);
            domain.id = result;
            foreach (var item in domain.unitTypes)
            {
                UnitForFieldConfig unitForField = new UnitForFieldConfig
                {
                    createdAt = DateTime.Now,
                    updatedAt = DateTime.Now,
                    fieldId = result,
                    unitId = item
                };

                await unitOfWork.UnitForFieldConfigRepository.Add(unitForField);
            }
            unitOfWork.Commit();
            return domain;
        }

        public async Task<StructureReportFieldConfig> Update(StructureReportFieldConfig domain)
        {
            var existingUnits = await unitOfWork.UnitForFieldConfigRepository.GetByidFieldConfig(domain.id);

            var existingUnitIds = existingUnits.Select(u => u.unitId).ToList();

            await unitOfWork.StructureReportFieldConfigRepository.Update(domain);

            foreach (var item in domain.unitTypes)
            {
                if (!existingUnitIds.Contains(item))
                {
                    UnitForFieldConfig unitForField = new UnitForFieldConfig
                    {
                        createdAt = DateTime.Now,
                        updatedAt = DateTime.Now,
                        fieldId = domain.id,
                        unitId = item
                    };
                    await unitOfWork.UnitForFieldConfigRepository.Add(unitForField);
                }
                else
                {
                    existingUnitIds.Remove(item);
                }
            }

            foreach (var idToRemove in existingUnitIds)
            {
                var unitToRemove = existingUnits.FirstOrDefault(u => u.unitId == idToRemove);
                if (unitToRemove != null)
                {
                    await unitOfWork.UnitForFieldConfigRepository.Delete(unitToRemove.id);
                }
            }

            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<StructureReportFieldConfig>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.StructureReportFieldConfigRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.StructureReportFieldConfigRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
