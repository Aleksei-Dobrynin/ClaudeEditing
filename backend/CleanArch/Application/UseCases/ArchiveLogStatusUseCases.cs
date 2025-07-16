using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ArchiveLogStatusUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ArchiveLogStatusUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ArchiveLogStatus>> GetAll()
        {
            return unitOfWork.ArchiveLogStatusRepository.GetAll();
        }
        
        public Task<ArchiveLogStatus> GetOneByID(int id)
        {
            return unitOfWork.ArchiveLogStatusRepository.GetOneByID(id);
        }

        public async Task<ArchiveLogStatus> Create(ArchiveLogStatus domain)
        {
            var result = await unitOfWork.ArchiveLogStatusRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ArchiveLogStatus> Update(ArchiveLogStatus domain)
        {
            await unitOfWork.ArchiveLogStatusRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ArchiveLogStatus>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ArchiveLogStatusRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ArchiveLogStatusRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
