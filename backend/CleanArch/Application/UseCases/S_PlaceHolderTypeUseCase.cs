using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class S_PlaceHolderTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public S_PlaceHolderTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<S_PlaceHolderType>> GetAll()
        {
            return unitOfWork.S_PlaceHolderTypeRepository.GetAll();
        }
        public Task<S_PlaceHolderType> GetOne(int id)
        {
            return unitOfWork.S_PlaceHolderTypeRepository.GetOne(id);
        }
        public async Task<S_PlaceHolderType> Create(S_PlaceHolderType domain)
        {
            var result = await unitOfWork.S_PlaceHolderTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<S_PlaceHolderType> Update(S_PlaceHolderType domain)
        {
            await unitOfWork.S_PlaceHolderTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<S_PlaceHolderType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.S_PlaceHolderTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.S_PlaceHolderTypeRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
