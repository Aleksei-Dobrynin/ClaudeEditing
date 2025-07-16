using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class archirecture_roadUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public archirecture_roadUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<archirecture_road>> GetAll()
        {
            return unitOfWork.archirecture_roadRepository.GetAll();
        }
        public Task<archirecture_road> GetOne(int id)
        {
            return unitOfWork.archirecture_roadRepository.GetOne(id);
        }
        public async Task<archirecture_road> Create(archirecture_road domain)
        {
            var result = await unitOfWork.archirecture_roadRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<archirecture_road> Update(archirecture_road domain)
        {
            await unitOfWork.archirecture_roadRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<archirecture_road>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.archirecture_roadRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.archirecture_roadRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<archirecture_road>>  GetByfrom_status_id(int from_status_id)
        {
            return unitOfWork.archirecture_roadRepository.GetByfrom_status_id(from_status_id);
        }
        
        public Task<List<archirecture_road>>  GetByto_status_id(int to_status_id)
        {
            return unitOfWork.archirecture_roadRepository.GetByto_status_id(to_status_id);
        }
        
    }
}
