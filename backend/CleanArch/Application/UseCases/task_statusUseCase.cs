using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class task_statusUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public task_statusUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<task_status>> GetAll()
        {
            return unitOfWork.task_statusRepository.GetAll();
        }
        public Task<task_status> GetOne(int id)
        {
            return unitOfWork.task_statusRepository.GetOne(id);
        }
        public async Task<task_status> Create(task_status domain)
        {
            var result = await unitOfWork.task_statusRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<task_status> Update(task_status domain)
        {
            await unitOfWork.task_statusRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<task_status>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.task_statusRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.task_statusRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
