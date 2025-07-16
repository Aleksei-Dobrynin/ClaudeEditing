using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class SmProjectTagsUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public SmProjectTagsUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<SmProjectTags>> GetAll()
        {
            return unitOfWork.SmProjectTagsRepository.GetAll();
        }

        public async Task<SmProjectTags> Create(SmProjectTags domain)
        {
            var result = await unitOfWork.SmProjectTagsRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<SmProjectTags> Update(SmProjectTags domain)
        {
            await unitOfWork.SmProjectTagsRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<SmProjectTags>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.SmProjectTagsRepository.GetPaginated(pageSize, pageNumber);
        }
    }
}
