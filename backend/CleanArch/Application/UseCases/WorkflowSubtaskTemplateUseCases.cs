using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class WorkflowSubtaskTemplateUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public WorkflowSubtaskTemplateUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<WorkflowSubtaskTemplate>> GetAll()
        {
            return unitOfWork.WorkflowSubtaskTemplateRepository.GetAll();
        }
        
        public Task<WorkflowSubtaskTemplate> GetOneByID(int id)
        {
            return unitOfWork.WorkflowSubtaskTemplateRepository.GetOneByID(id);
        }
        
        public Task<List<WorkflowSubtaskTemplate>> GetByidWorkflowTaskTemplate(int idWorkflowTaskTemplate)
        {
            return unitOfWork.WorkflowSubtaskTemplateRepository.GetByidWorkflowTaskTemplate(idWorkflowTaskTemplate);
        }

        public async Task<WorkflowSubtaskTemplate> Create(WorkflowSubtaskTemplate domain)
        {
            var result = await unitOfWork.WorkflowSubtaskTemplateRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<WorkflowSubtaskTemplate> Update(WorkflowSubtaskTemplate domain)
        {
            await unitOfWork.WorkflowSubtaskTemplateRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<WorkflowSubtaskTemplate>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.WorkflowSubtaskTemplateRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.WorkflowSubtaskTemplateRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
