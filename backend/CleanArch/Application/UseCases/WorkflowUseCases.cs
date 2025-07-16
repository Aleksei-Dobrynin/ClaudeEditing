using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class WorkflowUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public WorkflowUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<Workflow>> GetAll()
        {
            return unitOfWork.WorkflowRepository.GetAll();
        }
        
        public Task<Workflow> GetOneByID(int id)
        {
            return unitOfWork.WorkflowRepository.GetOneByID(id);
        }

        public async Task<Workflow> Create(Workflow domain)
        {
            var result = await unitOfWork.WorkflowRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<Workflow> Update(Workflow domain)
        {
            await unitOfWork.WorkflowRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<Workflow>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.WorkflowRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.WorkflowRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
