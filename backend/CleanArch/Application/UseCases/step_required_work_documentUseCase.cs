using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class step_required_work_documentUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public step_required_work_documentUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<step_required_work_document>> GetAll()
        {
            return unitOfWork.step_required_work_documentRepository.GetAll();
        }
        public Task<step_required_work_document> GetOne(int id)
        {
            return unitOfWork.step_required_work_documentRepository.GetOne(id);
        }
        public async Task<step_required_work_document> Create(step_required_work_document domain)
        {
            var result = await unitOfWork.step_required_work_documentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<step_required_work_document> Update(step_required_work_document domain)
        {
            await unitOfWork.step_required_work_documentRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<step_required_work_document>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.step_required_work_documentRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.step_required_work_documentRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<step_required_work_document>>  GetBystep_id(int step_id)
        {
            return unitOfWork.step_required_work_documentRepository.GetBystep_id(step_id);
        }
        
        public Task<List<step_required_work_document>>  GetBywork_document_type_id(int work_document_type_id)
        {
            return unitOfWork.step_required_work_documentRepository.GetBywork_document_type_id(work_document_type_id);
        }
        
    }
}
