using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class S_QueryUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public S_QueryUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<S_Query>> GetAll()
        {
            return unitOfWork.S_QueryRepository.GetAll();
        }
        public Task<S_Query> GetOne(int id)
        {
            return unitOfWork.S_QueryRepository.GetOne(id);
        }
        public async Task<S_Query> Create(S_Query domain)
        {
            var result = await unitOfWork.S_QueryRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<S_Query> Update(S_Query domain)
        {
            await unitOfWork.S_QueryRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<S_Query>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.S_QueryRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.S_QueryRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
