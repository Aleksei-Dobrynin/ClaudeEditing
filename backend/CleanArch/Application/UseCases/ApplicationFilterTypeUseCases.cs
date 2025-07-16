using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ApplicationFilterTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ApplicationFilterTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ApplicationFilterType>> GetAll()
        {
            return unitOfWork.ApplicationFilterTypeRepository.GetAll();
        }
        
        public Task<ApplicationFilterType> GetOneByID(int id)
        {
            return unitOfWork.ApplicationFilterTypeRepository.GetOneByID(id);
        }

        public async Task<ApplicationFilterType> Create(ApplicationFilterType domain)
        {
            var result = await unitOfWork.ApplicationFilterTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ApplicationFilterType> Update(ApplicationFilterType domain)
        {
            await unitOfWork.ApplicationFilterTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ApplicationFilterType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ApplicationFilterTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ApplicationFilterTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
