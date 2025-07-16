using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class WorkflowTaskTemplateUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public WorkflowTaskTemplateUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<WorkflowTaskTemplate>> GetAll()
        {
            return unitOfWork.WorkflowTaskTemplateRepository.GetAll();
        }
        
        public Task<WorkflowTaskTemplate> GetOneByID(int id)
        {
            return unitOfWork.WorkflowTaskTemplateRepository.GetOneByID(id);
        }
        
        public Task<List<WorkflowTaskTemplate>> GetByidWorkflow(int idWorkflow)
        {
            return unitOfWork.WorkflowTaskTemplateRepository.GetByidWorkflow(idWorkflow);
        }

        public async Task<WorkflowTaskTemplate> Create(WorkflowTaskTemplate domain)
        {
            var result = await unitOfWork.WorkflowTaskTemplateRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<WorkflowTaskTemplate> Update(WorkflowTaskTemplate domain)
        {
            await unitOfWork.WorkflowTaskTemplateRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<WorkflowTaskTemplate>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.WorkflowTaskTemplateRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.WorkflowTaskTemplateRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
