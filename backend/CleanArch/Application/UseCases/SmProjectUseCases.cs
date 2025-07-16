using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class SmProjectUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public SmProjectUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<SmProject>> GetAll()
        {
            return unitOfWork.SmProjectRepository.GetAll();
        }

        public async Task<SmProject> Create(SmProject domain)
        {
            var result = await unitOfWork.SmProjectRepository.Add(domain);
            unitOfWork.Commit();
            domain.id = result;
            return domain;
        }

        public async Task<SmProject> Update(SmProject domain)
        {
            await unitOfWork.SmProjectRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<SmProject>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.SmProjectRepository.GetPaginated(pageSize, pageNumber);
        }
    }
}
