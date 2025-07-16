using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class TagUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public TagUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<Tag>> GetAll()
        {
            return unitOfWork.TagRepository.GetAll();
        }
        public Task<Tag> GetOne(int id)
        {
            return unitOfWork.TagRepository.GetOne(id);
        }
        public async Task<Tag> Create(Tag domain)
        {
            var result = await unitOfWork.TagRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<Tag> Update(Tag domain)
        {
            await unitOfWork.TagRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<Tag>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.TagRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.TagRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
