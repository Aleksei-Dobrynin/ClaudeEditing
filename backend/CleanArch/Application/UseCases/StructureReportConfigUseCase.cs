using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class StructureReportConfigUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public StructureReportConfigUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<StructureReportConfig>> GetAll()
        {
            return unitOfWork.StructureReportConfigRepository.GetAll();
        }

        public Task<List<StructureReportConfig>> GetbyidStructure(int idStructure)
        {
            return unitOfWork.StructureReportConfigRepository.GetbyidStructure(idStructure);
        }

        
        public Task<StructureReportConfig> GetOne(int id)
        {
            return unitOfWork.StructureReportConfigRepository.GetOne(id);
        }
        public async Task<StructureReportConfig> Create(StructureReportConfig domain)
        {
            var result = await unitOfWork.StructureReportConfigRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<StructureReportConfig> Update(StructureReportConfig domain)
        {
            await unitOfWork.StructureReportConfigRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<StructureReportConfig>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.StructureReportConfigRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.StructureReportConfigRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
