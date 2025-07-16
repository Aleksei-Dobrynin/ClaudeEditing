using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class TechCouncilFilesUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public TechCouncilFilesUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<TechCouncilFiles>> GetAll()
        {
            return unitOfWork.TechCouncilFilesRepository.GetAll();
        }
        
        public Task<TechCouncilFiles> GetOneByID(int id)
        {
            return unitOfWork.TechCouncilFilesRepository.GetOneByID(id);
        }

        public async Task<TechCouncilFiles> Create(TechCouncilFiles domain)
        {
            var result = await unitOfWork.TechCouncilFilesRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<TechCouncilFiles> Update(TechCouncilFiles domain)
        {
            await unitOfWork.TechCouncilFilesRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<TechCouncilFiles>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.TechCouncilFilesRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.TechCouncilFilesRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
