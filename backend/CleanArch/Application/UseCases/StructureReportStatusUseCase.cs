using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class StructureReportStatusUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public StructureReportStatusUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<StructureReportStatus>> GetAll()
        {
            return unitOfWork.StructureReportStatusRepository.GetAll();
        }
        public Task<StructureReportStatus> GetOne(int id)
        {
            return unitOfWork.StructureReportStatusRepository.GetOne(id);
        }
        public async Task<StructureReportStatus> Create(StructureReportStatus domain)
        {
            var result = await unitOfWork.StructureReportStatusRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<StructureReportStatus> Update(StructureReportStatus domain)
        {
            await unitOfWork.StructureReportStatusRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<StructureReportStatus>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.StructureReportStatusRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.StructureReportStatusRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
