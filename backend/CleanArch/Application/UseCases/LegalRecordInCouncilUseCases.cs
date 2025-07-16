using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class LegalRecordInCouncilUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public LegalRecordInCouncilUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<LegalRecordInCouncil>> GetAll()
        {
            return unitOfWork.LegalRecordInCouncilRepository.GetAll();
        }
        
        public Task<LegalRecordInCouncil> GetOneByID(int id)
        {
            return unitOfWork.LegalRecordInCouncilRepository.GetOneByID(id);
        }

        public async Task<LegalRecordInCouncil> Create(LegalRecordInCouncil domain)
        {
            var result = await unitOfWork.LegalRecordInCouncilRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<LegalRecordInCouncil> Update(LegalRecordInCouncil domain)
        {
            await unitOfWork.LegalRecordInCouncilRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<LegalRecordInCouncil>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.LegalRecordInCouncilRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.LegalRecordInCouncilRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
