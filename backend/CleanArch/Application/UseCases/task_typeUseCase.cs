using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class task_typeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public task_typeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<task_type>> GetAll()
        {
            return unitOfWork.task_typeRepository.GetAll();
        }
        public Task<task_type> GetOne(int id)
        {
            return unitOfWork.task_typeRepository.GetOne(id);
        }
        public async Task<task_type> Create(task_type domain)
        {
            var result = await unitOfWork.task_typeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<task_type> Update(task_type domain)
        {
            await unitOfWork.task_typeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<task_type>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.task_typeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.task_typeRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
