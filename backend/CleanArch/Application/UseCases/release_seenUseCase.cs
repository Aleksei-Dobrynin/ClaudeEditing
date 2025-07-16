using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class release_seenUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public release_seenUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<release_seen>> GetAll()
        {
            return unitOfWork.release_seenRepository.GetAll();
        }
        public Task<release_seen> GetOne(int id)
        {
            return unitOfWork.release_seenRepository.GetOne(id);
        }
        public async Task<release_seen> Create(release_seen domain)
        {
            var result = await unitOfWork.release_seenRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<release_seen> Update(release_seen domain)
        {
            await unitOfWork.release_seenRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<release_seen>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.release_seenRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.release_seenRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<release_seen>>  GetByrelease_id(int release_id)
        {
            return unitOfWork.release_seenRepository.GetByrelease_id(release_id);
        }
        
    }
}
