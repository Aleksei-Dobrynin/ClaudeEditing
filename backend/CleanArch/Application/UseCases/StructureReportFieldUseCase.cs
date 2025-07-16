using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class StructureReportFieldUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public StructureReportFieldUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<StructureReportField>> GetAll()
        {
            return unitOfWork.StructureReportFieldRepository.GetAll();
        }

        public Task<List<StructureReportField>>  GetByidFieldConfig(int idFieldConfig)
        {
            return unitOfWork.StructureReportFieldRepository.GetByidFieldConfig(idFieldConfig);
        }

        public Task<List<StructureReportField>> GetByidReport(int idReport)
        {
            return unitOfWork.StructureReportFieldRepository.GetByidReport(idReport);
        }

        public Task<StructureReportField> GetOne(int id)
        {
            return unitOfWork.StructureReportFieldRepository.GetOne(id);
        }
        public async Task<StructureReportField> Create(StructureReportField domain)
        {
            var result = await unitOfWork.StructureReportFieldRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<StructureReportField> Update(StructureReportField domain)
        {
            await unitOfWork.StructureReportFieldRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<StructureReportField>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.StructureReportFieldRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.StructureReportFieldRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
