using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ApplicationLegalRecordUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ApplicationLegalRecordUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ApplicationLegalRecord>> GetAll()
        {
            return unitOfWork.ApplicationLegalRecordRepository.GetAll();
        }
        
        public Task<ApplicationLegalRecord> GetOneByID(int id)
        {
            return unitOfWork.ApplicationLegalRecordRepository.GetOneByID(id);
        }

        public async Task<ApplicationLegalRecord> Create(ApplicationLegalRecord domain)
        {
            var result = await unitOfWork.ApplicationLegalRecordRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ApplicationLegalRecord> Update(ApplicationLegalRecord domain)
        {
            await unitOfWork.ApplicationLegalRecordRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ApplicationLegalRecord>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ApplicationLegalRecordRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ApplicationLegalRecordRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
