using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class StructurePostUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public StructurePostUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<StructurePost>> GetAll()
        {
            return unitOfWork.StructurePostRepository.GetAll();
        }
        
        public Task<StructurePost> GetOneByID(int id)
        {
            return unitOfWork.StructurePostRepository.GetOneByID(id);
        }

        public async Task<StructurePost> Create(StructurePost domain)
        {
            var result = await unitOfWork.StructurePostRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<StructurePost> Update(StructurePost domain)
        {
            await unitOfWork.StructurePostRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<StructurePost>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.StructurePostRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.StructurePostRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
