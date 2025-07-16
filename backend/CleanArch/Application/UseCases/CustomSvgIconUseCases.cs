using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class CustomSvgIconUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public CustomSvgIconUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<CustomSvgIcon>> GetAll()
        {
            return unitOfWork.CustomSvgIconRepository.GetAll();
        }

        public async Task<CustomSvgIcon> Create(CustomSvgIcon domain)
        {
            var result = await unitOfWork.CustomSvgIconRepository.Add(domain);
            unitOfWork.Commit();
            domain.id = result;
            return domain;
        }

        public async Task<CustomSvgIcon> Update(CustomSvgIcon domain)
        {
            await unitOfWork.CustomSvgIconRepository.Update(domain);
            return domain;
        }

        public Task<PaginatedList<CustomSvgIcon>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.CustomSvgIconRepository.GetPaginated(pageSize, pageNumber);
        }
    }
}
