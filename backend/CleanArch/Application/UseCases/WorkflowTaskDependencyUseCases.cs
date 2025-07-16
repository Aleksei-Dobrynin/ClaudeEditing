using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class WorkflowTaskDependencyUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public WorkflowTaskDependencyUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<WorkflowTaskDependency>> GetAll()
        {
            return unitOfWork.WorkflowTaskDependencyRepository.GetAll();
        }
        
        public Task<WorkflowTaskDependency> GetOneByID(int id)
        {
            return unitOfWork.WorkflowTaskDependencyRepository.GetOneByID(id);
        }

        public async Task<WorkflowTaskDependency> Create(WorkflowTaskDependency domain)
        {
            var result = await unitOfWork.WorkflowTaskDependencyRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<WorkflowTaskDependency> Update(WorkflowTaskDependency domain)
        {
            await unitOfWork.WorkflowTaskDependencyRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<WorkflowTaskDependency>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.WorkflowTaskDependencyRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.WorkflowTaskDependencyRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
