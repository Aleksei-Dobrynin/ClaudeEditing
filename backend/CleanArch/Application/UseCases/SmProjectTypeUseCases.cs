using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class SmProjectTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public SmProjectTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<SmProjectType>> GetAll()
        {
            return unitOfWork.SmProjectTypeRepository.GetAll();
        }

        public async Task<SmProjectType> Create(SmProjectType domain)
        {
            var result = await unitOfWork.SmProjectTypeRepository.Add(domain);
            domain.id = result;
            return domain;
        }

        public async Task<SmProjectType> Update(SmProjectType domain)
        {
            await unitOfWork.SmProjectTypeRepository.Update(domain);
            return domain;
        }

        public Task<PaginatedList<SmProjectType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.SmProjectTypeRepository.GetPaginated(pageSize, pageNumber);
        }
    }
}
